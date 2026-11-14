import { constantTimeEqual, createSession, handleOptions, jsonResponse } from "../../_utils.js";

export async function onRequestPost({ request, env }) {
  if (!env.BORDRO_ADMIN_USERNAME || !env.BORDRO_ADMIN_PASSWORD || !env.BORDRO_SESSION_SECRET || !env.BORDRO_CONTENT) {
    return jsonResponse({ error: "Yönetim servisi henüz yapılandırılmadı." }, 503);
  }
  let input;
  try { input = await request.json(); } catch (_) { return jsonResponse({ error: "Geçersiz istek." }, 400); }
  if (!constantTimeEqual(input?.username || "", env.BORDRO_ADMIN_USERNAME) ||
      !constantTimeEqual(input?.password || "", env.BORDRO_ADMIN_PASSWORD)) {
    return jsonResponse({ error: "Kullanıcı adı veya parola hatalı." }, 401);
  }
  return jsonResponse({ token: await createSession(env.BORDRO_ADMIN_USERNAME, env.BORDRO_SESSION_SECRET), expiresIn: 43200 });
}

export function onRequestOptions() {
  return handleOptions();
}
