// /src/routes/question/[questionId]/rate/+page.server.ts (Updated)
import { error, redirect } from "@sveltejs/kit";
import type { PageServerLoad, Actions } from "./$types";
import prisma from "$lib/server/prisma";

export const load: PageServerLoad = async ({ params, locals }) => {
  if (!locals.user) {
    throw redirect(302, "/login");
  }

  // --- NEW: Fetch the user's attempt for this question ---
  const attempt = await prisma.answerAttempt.findUnique({
    where: {
      userId_questionId: {
        userId: locals.user.id,
        questionId: params.questionId,
      },
    },
  });

  // If the user hasn't made an attempt yet, they shouldn't be here.
  // Redirect them back to the solving page.
  if (!attempt) {
    throw redirect(303, `/question/${params.questionId}`);
  }

  // If user has already rated this question, send them to the discussion
  const existingRating = await prisma.rating.findUnique({
    where: {
      userId_questionId: {
        userId: locals.user.id,
        questionId: params.questionId,
      },
    },
  });
  if (existingRating) {
    throw redirect(303, `/question/${params.questionId}/discuss`);
  }

  // --- UPDATED: Fetch the question body AND the correct answer ---
  const question = await prisma.question.findUnique({
    where: { id: params.questionId },
    select: { body: true, answer: true }, // Now also fetching the answer
  });

  if (!question) {
    throw error(404, "Question not found");
  }

  // --- UPDATED: Return both the question and the attempt details ---
  return { question, attempt };
};

// The actions object remains the same and is still correct.
export const actions: Actions = {
  default: async ({ request, locals, params }) => {
    if (!locals.user) {
      throw redirect(302, "/login");
    }

    const data = await request.formData();
    const ratingValue = Number(data.get("rating"));

    if (ratingValue < 1 || ratingValue > 5) {
      throw error(400, "Invalid rating value");
    }

    await prisma.rating.create({
      data: {
        value: ratingValue,
        userId: locals.user.id,
        questionId: params.questionId,
      },
    });

    throw redirect(303, `/question/${params.questionId}/discuss`);
  },
};
