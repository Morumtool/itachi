export async function onRequestGet(context: any) {
  const { request } = context;
  const cookieHeader = request.headers.get("Cookie") || "";

  const cookies = Object.fromEntries(
    cookieHeader.split(";").map((c: string) => {
      const [key, ...v] = c.trim().split("=");
      return [key, v.join("=")];
    })
  );

  if (cookies.discord_user) {
    try {
      const user = JSON.parse(decodeURIComponent(cookies.discord_user));
      return new Response(JSON.stringify({ authenticated: true, user }), {
        headers: { "Content-Type": "application/json" },
      });
    } catch {
      // JSON parse failure
    }
  }

  return new Response(JSON.stringify({ authenticated: false, user: null }), {
    headers: { "Content-Type": "application/json" },
  });
}
