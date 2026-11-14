const DEFAULT_CONTENT = {
  version: 1,
  socialBenefits: [
    { name: "Servis Ücreti", year2025: "1.559,30", year2026: "2.500" },
    { name: "Ram. Bayramı", year2025: "7.507,76", year2026: "10.000" },
    { name: "Kur. Bayramı", year2025: "7.507,76", year2026: "13.000" },
    { name: "Yakacak Yard.", year2025: "11.550,40", year2026: "19.000" },
    { name: "Yıllık İzin", year2025: "3.248,55", year2026: "5.000" },
    { name: "Ana-İlkokul", year2025: "3.166,25", year2026: "5.000" },
    { name: "Ortaöğretim", year2025: "3.788,53", year2026: "6.000" },
    { name: "Lise", year2025: "6.385,93", year2026: "10.000" },
    { name: "Üniversite", year2025: "10.536,85", year2026: "16.000" },
    { name: "Evlenme", year2025: "4.200,00", year2026: "8.000" },
    { name: "Doğum", year2025: "4.200,00", year2026: "8.000" },
    { name: "Ölüm (Kendi)", year2025: "2.875,00", year2026: "10.000" },
    { name: "Ölüm (Yakın)", year2025: "2.875,00", year2026: "5.000" },
    { name: "Gece Zammı", year2025: "22,81", year2026: "30" }
  ],
  inflation: {
    year: 2026,
    monthly: [
      { month: "Ocak", rate: 4.84 }, { month: "Şubat", rate: 2.96 },
      { month: "Mart", rate: 1.94 }, { month: "Nisan", rate: 4.18 },
      { month: "Mayıs", rate: 1.71 }, { month: "Haziran", rate: 0.99 },
      { month: "Temmuz", rate: 1.78 }, { month: "Ağustos", rate: 1.84 },
      { month: "Eylül", rate: 1.84 }, { month: "Ekim", rate: 2.58 },
      { month: "Kasım", rate: 0 }, { month: "Aralık", rate: 0 }
    ],
    totalRate: 14.64
  }
};

export function corsHeaders() {
  return {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET, POST, PUT, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type, Authorization",
    "Access-Control-Max-Age": "86400",
    "Vary": "Origin"
  };
}

export function jsonResponse(data, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { "Content-Type": "application/json; charset=utf-8", ...corsHeaders() }
  });
}

export function handleOptions() {
  return new Response(null, { status: 204, headers: corsHeaders() });
}

export async function readContent(env) {
  const stored = await env.BORDRO_CONTENT.get("content", "json");
  return stored || DEFAULT_CONTENT;
}

export function validateContent(value) {
  if (!value || typeof value !== "object" || !Array.isArray(value.socialBenefits) ||
      !value.inflation || !Array.isArray(value.inflation.monthly)) return false;
  if (value.socialBenefits.length > 200 || value.inflation.monthly.length > 24) return false;
  if (!Number.isInteger(Number(value.inflation.year)) || !Number.isFinite(Number(value.inflation.totalRate))) return false;
  if (!value.socialBenefits.every(item => item && typeof item.name === "string" &&
      typeof item.year2025 === "string" && typeof item.year2026 === "string" &&
      item.name.length <= 100 && item.year2025.length <= 40 && item.year2026.length <= 40)) return false;
  return value.inflation.monthly.every(item => item && typeof item.month === "string" &&
      item.month.length <= 30 && Number.isFinite(Number(item.rate)) && Number(item.rate) >= 0 && Number(item.rate) <= 100);
}

function base64Url(bytes) {
  let binary = "";
  bytes.forEach(byte => binary += String.fromCharCode(byte));
  return btoa(binary).replace(/=/g, "").replace(/\+/g, "-").replace(/\//g, "_");
}

function fromBase64Url(value) {
  const base64 = value.replace(/-/g, "+").replace(/_/g, "/") + "===".slice((value.length + 3) % 4);
  return Uint8Array.from(atob(base64), char => char.charCodeAt(0));
}

async function hmac(secret, message) {
  const key = await crypto.subtle.importKey("raw", new TextEncoder().encode(secret), { name: "HMAC", hash: "SHA-256" }, false, ["sign"]);
  return new Uint8Array(await crypto.subtle.sign("HMAC", key, new TextEncoder().encode(message)));
}

export async function createSession(username, secret) {
  const payload = base64Url(new TextEncoder().encode(JSON.stringify({ sub: username, exp: Date.now() + 12 * 60 * 60 * 1000 })));
  return `${payload}.${base64Url(await hmac(secret, payload))}`;
}

export async function verifySession(request, env) {
  const token = (request.headers.get("Authorization") || "").replace(/^Bearer\s+/i, "");
  const parts = token.split(".");
  if (parts.length !== 2 || !env.BORDRO_SESSION_SECRET) return false;
  try {
    const expected = await hmac(env.BORDRO_SESSION_SECRET, parts[0]);
    const actual = fromBase64Url(parts[1]);
    if (expected.length !== actual.length) return false;
    let diff = 0;
    for (let i = 0; i < expected.length; i++) diff |= expected[i] ^ actual[i];
    if (diff !== 0) return false;
    const payload = JSON.parse(new TextDecoder().decode(fromBase64Url(parts[0])));
    return payload.sub === env.BORDRO_ADMIN_USERNAME && Number(payload.exp) > Date.now();
  } catch (_) {
    return false;
  }
}

export function constantTimeEqual(left, right) {
  const a = new TextEncoder().encode(String(left));
  const b = new TextEncoder().encode(String(right));
  let diff = a.length ^ b.length;
  const length = Math.max(a.length, b.length);
  for (let i = 0; i < length; i++) diff |= (a[i] || 0) ^ (b[i] || 0);
  return diff === 0;
}
