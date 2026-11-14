import { handleOptions, jsonResponse, validateContent, verifySession } from "../../_utils.js";

export async function onRequestPut({ request, env }) {
  if (!await verifySession(request, env)) return jsonResponse({ error: "Oturum geçersiz veya süresi dolmuş. Yeniden giriş yapın." }, 401);
  const raw = await request.text();
  if (raw.length > 65536) return jsonResponse({ error: "İçerik 64 KB sınırını aşıyor." }, 413);
  let data;
  try { data = JSON.parse(raw); } catch (_) { return jsonResponse({ error: "JSON biçimi geçersiz." }, 400); }
  if (!validateContent(data)) return jsonResponse({ error: "Sosyal yardım veya enflasyon verilerinin biçimi geçersiz." }, 400);
  await env.BORDRO_CONTENT.put("content", JSON.stringify(data));
  return jsonResponse({ success: true, data });
}

export function onRequestOptions() {
  return handleOptions();
}
