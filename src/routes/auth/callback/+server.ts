import { redirect } from "@sveltejs/kit";
import { oauth } from "$lib/server/oauth";
import { env } from "$env/dynamic/private";
import db from "$lib/server/prisma";

export async function GET({ url, cookies }) {
  const code = url.searchParams.get("code");
  const redirect_uri = env.ION_REDIRECT_URI;

  if (!code) {
    throw redirect(302, "/");
  }

  try {
    // Exchange code for token
    const tokenParams = {
      code,
      redirect_uri,
    };
    const result = await oauth.getToken(tokenParams);

    const accessToken = result.token.access_token;

    // Fetch profile from Ion
    const profileResponse = await fetch("https://ion.tjhsst.edu/api/profile", {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    if (!profileResponse.ok) {
      throw new Error("Failed to fetch user profile from Ion.");
    }

    const profile = await profileResponse.json();

    // Debug log to see profile shape - remove/comment out in production
    console.log("PROFILE FROM ION:", profile);

    // Extract email and name with fallbacks
    const userEmail = profile.tj_email ?? profile.email ?? null;
    const userName =
      profile.full_name ??
      profile.display_name ??
      (profile.first_name && profile.last_name
        ? `${profile.first_name} ${profile.last_name}`
        : null);

    if (!userEmail || !userName) {
      console.error("Invalid profile data:", profile);
      throw redirect(302, "/");
    }

    // Upsert user in DB
    const user = await db.user.upsert({
      where: { email: userEmail },
      update: { name: userName },
      create: { email: userEmail, name: userName },
    });

    // Set session cookie
    cookies.set("session", user.id, {
      path: "/",
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 60 * 60 * 24 * 30,
      sameSite: "lax",
    });
  } catch (error) {
    console.error("Authentication failed:", error);
    throw redirect(302, "/");
  }

  throw redirect(302, "/");
}
