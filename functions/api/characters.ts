export async function onRequestGet(context: any) {
  const { env } = context;
  if (env.CHARACTERS_KV) {
    const data = await env.CHARACTERS_KV.get("characters");
    if (data) {
      return new Response(data, { headers: { "Content-Type": "application/json" } });
    }
  }
  return new Response(JSON.stringify(null), {
    headers: { "Content-Type": "application/json" },
  });
}

export async function onRequestPost(context: any) {
  const { request, env } = context;

  // Cookie認証チェック
  const cookieHeader = request.headers.get("Cookie") || "";
  const cookies = Object.fromEntries(
    cookieHeader.split(";").map((c: string) => {
      const [key, ...v] = c.trim().split("=");
      return [key, v.join("=")];
    })
  );

  let user = null;
  if (cookies.discord_user) {
    try {
      user = JSON.parse(decodeURIComponent(cookies.discord_user));
    } catch {}
  }

  if (!user || !user.inTargetServer) {
    return new Response(
      JSON.stringify({ error: "Unauthorized. Designated Discord server membership required." }),
      {
        status: 403,
        headers: { "Content-Type": "application/json" },
      }
    );
  }

  const characters = await request.json();
  if (env.CHARACTERS_KV) {
    await env.CHARACTERS_KV.put("characters", JSON.stringify(characters));
  }

  return new Response(JSON.stringify({ success: true, characters }), {
    headers: { "Content-Type": "application/json" },
  });
}
