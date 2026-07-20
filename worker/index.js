function hasFileExtension(pathname) {
  return /\/[^/]+\.[^/]+$/.test(pathname);
}

async function fetchAsset(request, env, pathname) {
  const url = new URL(request.url);
  url.pathname = pathname;
  return env.ASSETS.fetch(new Request(url.toString(), request));
}

export default {
  async fetch(request, env) {
    if (!env?.ASSETS?.fetch) {
      return new Response("Static asset binding is unavailable.", { status: 500 });
    }

    if (request.method !== "GET" && request.method !== "HEAD") {
      return new Response("Method not allowed.", {
        status: 405,
        headers: { Allow: "GET, HEAD" },
      });
    }

    const url = new URL(request.url);
    const assetResponse = await env.ASSETS.fetch(request);

    if (assetResponse.status !== 404) {
      return assetResponse;
    }

    const acceptsHtml = request.headers.get("accept")?.includes("text/html");
    const shouldServeAppShell =
      acceptsHtml && !hasFileExtension(url.pathname) && !url.pathname.startsWith("/api/");

    if (!shouldServeAppShell) {
      return assetResponse;
    }

    return fetchAsset(request, env, "/index.html");
  },
};
