export async function onRequestGet(context: any) {
  const { request, env } = context;
  const url = new URL(request.url);
  const clientId = env.DISCORD_CLIENT_ID;
  const redirectUri = env.DISCORD_REDIRECT_URI;

  if (!clientId || !redirectUri) {
    // 環境変数が未設定の場合はトップページへエラーパラメーター付きで安全にリダイレクト
    const targetUrl = new URL("/", request.url);
    targetUrl.searchParams.set("error", "discord_env_missing");
    return Response.redirect(targetUrl.toString(), 302);
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
