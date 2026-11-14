import { handleOptions, jsonResponse, readContent } from "../_utils.js";

export async function onRequestGet({ env }) {
  return jsonResponse(await readContent(env));
}

export function onRequestOptions() {
  return handleOptions();
}
