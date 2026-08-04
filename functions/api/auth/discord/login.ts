export async function onRequestGet(context: any) {
  const { env } = context;
  const clientId = env.DISCORD_CLIENT_ID;
  const redirectUri = env.DISCORD_REDIRECT_URI;

  if (!clientId || !redirectUri) {
    return new Response(
      JSON.stringify({
        error: "Discord Client ID or Redirect URI is missing in Cloudflare environment variables.",
      }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }

  const params = new URLSearchParams({
    client_id: clientId,
    redirect_uri: redirectUri,
    response_type: "code",
    scope: "identify guilds",
  });

  const discordAuthUrl = `https://discord.com/oauth2/authorize?${params.toString()}`;
  return Response.redirect(discordAuthUrl, 302);
}
