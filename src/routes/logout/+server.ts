// src/routes/logout/+server.ts
import { redirect } from "@sveltejs/kit";

export async function GET({ cookies }) {
  // Delete the cookie
  cookies.delete("session", { path: "/" });

  // Redirect to home
  throw redirect(302, "/");
}
