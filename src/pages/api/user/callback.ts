import type { APIRoute } from "astro";

const CLIENT_ID = import.meta.env.DISCORD_CLIENT_ID;
const CLIENT_SECRET = import.meta.env.DISCORD_CLIENT_SECRET;
const REDIRECT_URI = import.meta.env.DISCORD_REDIRECT_URI;

export const GET: APIRoute = async ({ request, cookies, redirect }) => {
  const url = new URL(request.url);
  const code = url.searchParams.get("code");

  if (!code) {
    return new Response("No code provided", { status: 400 });
  }

  try {
    // Exchange the code for an access token using fetch
    const tokenResponse = await fetch("https://discord.com/api/oauth2/token", {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: new URLSearchParams({
        client_id: CLIENT_ID,
        client_secret: CLIENT_SECRET,
        grant_type: "authorization_code",
        code: code,
        redirect_uri: REDIRECT_URI,
      }),
    });

    if (!tokenResponse.ok) {
      const error = await tokenResponse.text();
      console.error("Error fetching access token:", error);
      return new Response(`Failed to fetch access token: ${error}`, {
        status: 500,
      });
    }

    const { access_token: accessToken } = await tokenResponse.json();

    // Set access token as a secure HTTP-only cookie
    cookies.set("access", accessToken, {
      path: "/",
      secure: true,
      httpOnly: true,
      sameSite: "strict",
      maxAge: 60 * 60 * 24 * 7, // 1 week
    });

    // Redirect to dashboard
    return redirect("/dashboard", 302);
  } catch (error) {
    console.error("Error during Discord OAuth2:", error);
    return new Response(`Authentication failed: ${error.message}`, {
      status: 500,
    });
  }
};
