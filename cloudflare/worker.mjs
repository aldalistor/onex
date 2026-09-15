const ORIGIN = "https://onexdash-oyedvqsk.manus.space";

export default {
  async fetch(request, env) {
    const incoming = new URL(request.url);
    if (incoming.pathname === "/__health") {
      const result = await env.ONEX_DB.prepare("SELECT name FROM sqlite_master WHERE type='table' AND name NOT LIKE 'sqlite_%' ORDER BY name").all();
      return Response.json({ ok: true, service: "onex-workbench", storage: "cloudflare-d1", database: "onex-production", tables: result.results?.map((row) => row.name) ?? [] }, { headers: { "cache-control": "no-store", "x-onex-deployment": "cloudflare-worker" } });
    }
    const origin = new URL(ORIGIN);
    origin.pathname = incoming.pathname;
    origin.search = incoming.search;
    const headers = new Headers(request.headers);
    headers.set("x-onex-cloudflare-preview", "onex-workbench");
    const proxied = new Request(origin, { method: request.method, headers, body: ["GET", "HEAD"].includes(request.method) ? undefined : request.body, redirect: "follow" });
    const response = await fetch(proxied);
    const output = new Response(response.body, response);
    output.headers.set("x-onex-deployment", "cloudflare-worker");
    output.headers.set("x-onex-d1-binding", "ONEX_DB");
    output.headers.set("x-content-type-options", "nosniff");
    output.headers.set("x-frame-options", "DENY");
    output.headers.set("referrer-policy", "strict-origin-when-cross-origin");
    return output;
  },
};
