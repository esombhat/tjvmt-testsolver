// src/hooks.server.ts
import type { Handle } from "@sveltejs/kit";
import db from "$lib/server/prisma";

export const handle: Handle = async ({ event, resolve }) => {
  // Get the user ID from the cookie
  const userId = event.cookies.get("session");

  if (userId) {
    // If a session cookie exists, find the user in the database
    const user = await db.user.findUnique({
      where: { id: userId },
    });

    if (user) {
      // Attach the user object to the event so we can access it anywhere
      event.locals.user = user;
    }
  }

  // Continue processing the request
  return resolve(event);
};
