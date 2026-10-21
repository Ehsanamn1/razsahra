/**
 * SPA deep-link fallback for the Madar app mounted under /madar/.
 *
 * The corporate site intentionally ships its own top-level 404 page, which
 * disables Cloudflare Pages' default root-SPA fallback. Re-serve the app shell
 * for browser navigations to extensionless routes while letting real static
 * assets pass through untouched. API traffic is rooted at /api/medar/* and is
 * handled by functions/api/[[path]].js instead.
 */
export async function onRequest(context) {
  const { request } = context;
  const url = new URL(request.url);

  if (request.method !== "GET" && request.method !== "HEAD") {
    return context.next();
  }

  const accept = request.headers.get("accept") || "";
  const lastSegment = url.pathname.slice("/madar/".length).split("/").pop() || "";
  if (!accept.includes("text/html") || /\.[a-z0-9]{1,12}$/i.test(lastSegment)) {
    return context.next();
  }

  // Pages Functions expose an ASSETS binding. Request the pretty URL, not
  // /index.html, so the Pages asset router serves the built Madar index file.
  url.pathname = "/madar/";
  return context.env.ASSETS.fetch(new Request(url.toString(), request));
}
