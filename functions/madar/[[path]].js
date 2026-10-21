/**
 * SPA deep-link fallback for the Madar app mounted under /madar/.
 *
 * The parent website has its own root-level 404 page. Without this scoped
 * fallback, refreshing a route such as /madar/app/home can serve the parent
 * site's 404 instead of the React application shell.
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

  url.pathname = "/madar/";
  return context.env.ASSETS.fetch(new Request(url.toString(), request));
}
