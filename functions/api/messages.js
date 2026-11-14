import { handleOptions, jsonResponse } from "../_utils.js";

const MAX_MESSAGES = 500;
const VISIBLE_MESSAGES = 100;
const MAX_MESSAGE_LENGTH = 500;
const MAX_NAME_LENGTH = 30;

export async function onRequestGet({ env }) {
  if (!env.BORDRO_CONTENT) return jsonResponse({ error: "Mesaj servisi yapılandırılmadı." }, 503);
  const messages = (await env.BORDRO_CONTENT.get("public-messages", "json")) || [];
  return jsonResponse({ messages: messages.slice(-VISIBLE_MESSAGES) });
}

export async function onRequestPost({ request, env }) {
  if (!env.BORDRO_CONTENT) return jsonResponse({ error: "Mesaj servisi yapılandırılmadı." }, 503);

  let input;
  try {
    input = await request.json();
  } catch (_) {
    return jsonResponse({ error: "Geçersiz istek." }, 400);
  }

  const text = typeof input?.text === "string" ? input.text.trim() : "";
  const name = typeof input?.name === "string" ? input.name.trim().slice(0, MAX_NAME_LENGTH) : "";
  if (!text || text.length > MAX_MESSAGE_LENGTH) {
    return jsonResponse({ error: `Mesaj 1-${MAX_MESSAGE_LENGTH} karakter olmalı.` }, 400);
  }

  const address = request.headers.get("CF-Connecting-IP") || "unknown";
  const digest = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(address));
  const ipHash = Array.from(new Uint8Array(digest), byte => byte.toString(16).padStart(2, "0")).join("").slice(0, 24);
  const rateKey = `public-message-rate:${ipHash}`;
  const rate = (await env.BORDRO_CONTENT.get(rateKey, "json")) || { count: 0 };
  if (rate.count >= 3) {
    return jsonResponse({ error: "Kısa sürede çok fazla mesaj gönderdiniz. Bir dakika sonra tekrar deneyin." }, 429);
  }
  await env.BORDRO_CONTENT.put(rateKey, JSON.stringify({ count: rate.count + 1 }), { expirationTtl: 60 });

  const messages = (await env.BORDRO_CONTENT.get("public-messages", "json")) || [];
  const message = {
    id: crypto.randomUUID(),
    name: name || "Ziyaretçi",
    text,
    createdAt: new Date().toISOString()
  };

  messages.push(message);
  await env.BORDRO_CONTENT.put("public-messages", JSON.stringify(messages.slice(-MAX_MESSAGES)));
  return jsonResponse({ success: true, message });
}

export function onRequestOptions() {
  return handleOptions();
}
