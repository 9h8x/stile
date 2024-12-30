import type { APIRoute } from "astro";

export const GET: APIRoute = ({ redirect }) => {
  const CLIENT_ID = import.meta.env.DISCORD_CLIENT_ID;
  const REDIRECT_URI = import.meta.env.DISCORD_REDIRECT_URI;
  const scope = "identify guilds.members.read";
  const discordOAuthURL = `https://discord.com/api/oauth2/authorize?client_id=${CLIENT_ID}&redirect_uri=${encodeURIComponent(
    REDIRECT_URI
  )}&response_type=code&scope=${scope}`;

  return redirect(discordOAuthURL);
};

