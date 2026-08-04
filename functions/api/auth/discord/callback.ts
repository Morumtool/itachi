export async function onRequestGet(context: any) {
  const { request, env } = context;
  const url = new URL(request.url);
  const code = url.searchParams.get("code");

  if (!code) {
    return new Response("Missing authorization code", { status: 400 });
  }

  const clientId = env.DISCORD_CLIENT_ID;
  const clientSecret = env.DISCORD_CLIENT_SECRET;
  const redirectUri = env.DISCORD_REDIRECT_URI;
  const targetGuildId = env.DISCORD_GUILD_ID;

  try {
    // 1. コードをアクセストークンに交換
    const tokenResponse = await fetch("https://discord.com/api/v10/oauth2/token", {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: new URLSearchParams({
        client_id: clientId,
        client_secret: clientSecret,
        grant_type: "authorization_code",
        code: code,
        redirect_uri: redirectUri,
      }),
    });

    if (!tokenResponse.ok) {
      const errorText = await tokenResponse.text();
      return new Response(`Failed to exchange code: ${errorText}`, { status: 400 });
    }

    const tokenData: any = await tokenResponse.json();
    const accessToken = tokenData.access_token;

    // 2. ユーザープロフィール取得
    const userResponse = await fetch("https://discord.com/api/v10/users/@me", {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
    const userData: any = await userResponse.json();

    // 3. 所属ギルド(サーバー)取得
    const guildsResponse = await fetch("https://discord.com/api/v10/users/@me/guilds", {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
    const guildsData: any = await guildsResponse.json();

    // 指定サーバーに参加しているか確認
    const inTargetServer = Array.isArray(guildsData) && guildsData.some((g: any) => g.id === targetGuildId);

    const sessionUser = {
      id: userData.id,
      username: userData.username,
      globalName: userData.global_name || userData.username,
      avatar: userData.avatar
        ? `https://cdn.discordapp.com/avatars/${userData.id}/${userData.avatar}.png`
        : '⚡',
      inTargetServer: inTargetServer,
    };

    const cookieValue = encodeURIComponent(JSON.stringify(sessionUser));

    // リダイレクト先 (トップページへ)
    return new Response(null, {
      status: 302,
      headers: {
        Location: "/",
        "Set-Cookie": `discord_user=${cookieValue}; Path=/; HttpOnly; Secure; SameSite=Lax; Max-Age=86400`,
      },
    });
  } catch (err: any) {
    return new Response(`Authentication error: ${err.message}`, { status: 500 });
  }
}
