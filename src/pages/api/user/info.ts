import type { APIRoute } from "astro";

const SERVER_ID = import.meta.env.DISCORD_SERVER_ID;
const ROLE_ID = import.meta.env.DISCORD_ROLE_ID;

export const GET: APIRoute = async ({ cookies, redirect }) => {
  const accessToken = cookies.get('access')?.value;

  if (!accessToken) {
    return new Response(JSON.stringify({ error: 'No access token' }), {
      status: 401,
      headers: { 'Content-Type': 'application/json' }
    });
  }

  try {
    // Fetch user information using the access token
    const userResponse = await fetch("https://discord.com/api/users/@me", {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    if (!userResponse.ok) {
      throw new Error(`Failed to fetch user info: ${await userResponse.text()}`);
    }

    const user = await userResponse.json();

    // Fetch guild member information
    const guildMemberResponse = await fetch(`https://discord.com/api/users/@me/guilds/${SERVER_ID}/member`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    let hasRole = false;
    if (guildMemberResponse.ok) {
      const guildMember = await guildMemberResponse.json();
      hasRole = guildMember.roles.includes(ROLE_ID);
    }

    const avatarUrl = user.avatar 
      ? `https://cdn.discordapp.com/avatars/${user.id}/${user.avatar}.png` 
      : 'https://cdn.discordapp.com/embed/avatars/0.png';

    return new Response(JSON.stringify({
      discordId: user.id,
      discordUsername: user.username,
      discordAvatar: avatarUrl,
      hasRole
    }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error) {
    console.error("Error fetching user data:", error);
    return new Response(JSON.stringify({ error: 'Failed to fetch user data' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
};

