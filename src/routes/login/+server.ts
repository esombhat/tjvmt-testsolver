// src/routes/login/+server.ts
import { redirect } from "@sveltejs/kit";
import { authorizationUri } from "$lib/server/oauth";

export async function GET() {
  // Redirect the user to the Ion login page
  throw redirect(302, authorizationUri);
}
