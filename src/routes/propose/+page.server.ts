// /src/routes/propose/+page.server.ts
import { fail, redirect } from "@sveltejs/kit";
import type { Actions, PageServerLoad } from "./$types";
import prisma from "$lib/server/prisma";

// Protect the page; only logged-in users can propose questions
// The corrected version
export const load: PageServerLoad = async ({ locals }) => {
  if (!locals.user) {
    throw redirect(302, "/login");
  }

  // THE FIX: Pass the user data through to the page.
  return {
    user: locals.user,
  };
};

// /src/routes/propose/+page.server.ts (The corrected version)

// /src/routes/propose/+page.server.ts
// ... (imports and load function are the same)
// /src/routes/propose/+page.server.ts

// ... (imports and load function are the same)

export const actions: Actions = {
  create: async ({ request, locals }) => {
    if (!locals.user) {
      return fail(401, {
        error: "You must be logged in to propose a question.",
      });
    }

    const data = await request.formData();
    const title = data.get("title") as string;
    const body = data.get("body") as string;
    const answer = data.get("answer") as string;
    const solution = data.get("solution") as string;
    const tags = data.get("tags") as string;
    const timer = data.get("timer") as string;

    if (!body || !answer) {
      return fail(400, { error: "Question body and answer cannot be blank." });
    }

    // --- THIS IS THE CORRECTED STRUCTURE ---

    // Define the question variable outside the try block
    let newQuestion;

    try {
      // The try block should ONLY contain operations that can fail, like database calls.
      newQuestion = await prisma.question.create({
        data: {
          title: title || "Pending Title", // Use a placeholder for now
          body,
          answer,
          solution,
          timerDuration: Number(timer) || 900,
          author: { connect: { id: locals.user.id } },
          tags: {
            connectOrCreate: tags
              .split(",")
              .map((tag) => tag.trim())
              .filter((tag) => tag)
              .map((tag) => ({
                where: { name: tag },
                create: { name: tag },
              })),
          },
        },
      });

      // If the title was blank, update the record with the formatted default title.
      if (!title) {
        // We keep this inside the try block as it's another database call.
        await prisma.question.update({
          where: { id: newQuestion.id },
          data: {
            title: `Untitled question ${newQuestion.id}`,
          },
        });
      }
    } catch (err) {
      console.error(err);
      return fail(500, { error: "An unexpected error occurred." });
    }

    // The redirect is now OUTSIDE the try...catch block.
    // It will only run if the try block completes successfully.
    throw redirect(303, `/question/${newQuestion.id}`);
  },
};
