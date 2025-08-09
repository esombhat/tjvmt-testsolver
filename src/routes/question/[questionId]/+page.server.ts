// /src/routes/question/[questionId]/+page.server.ts (Refactored)
import { error, fail, redirect } from "@sveltejs/kit";
import type { PageServerLoad, Actions } from "./$types";
import prisma from "$lib/server/prisma";

export const load: PageServerLoad = async ({ params, locals }) => {
  if (!locals.user) {
    throw redirect(302, "/login");
  }

  // This logic remains: if an attempt exists, go straight to discussion.
  const existingAttempt = await prisma.answerAttempt.findUnique({
    where: {
      userId_questionId: {
        userId: locals.user.id,
        questionId: params.questionId,
      },
    },
  });

  if (existingAttempt) {
    throw redirect(303, `/question/${params.questionId}/discuss`);
  }

  const question = await prisma.question.findUnique({
    where: { id: params.questionId },
    include: { author: { select: { name: true } } },
  });

  if (!question) {
    throw error(404, "Question not found");
  }

  return { question };
};

export const actions: Actions = {
  submitAnswer: async ({ request, locals, params }) => {
    if (!locals.user) throw redirect(302, "/login");

    const data = await request.formData();
    const userAnswer = data.get("answer") as string;

    const question = await prisma.question.findUnique({
      where: { id: params.questionId },
      select: { answer: true },
    });

    if (!question) throw error(404, "Question not found");

    const isCorrect =
      userAnswer.trim().toLowerCase() === question.answer.trim().toLowerCase();

    await prisma.answerAttempt.upsert({
      where: {
        userId_questionId: {
          userId: locals.user.id,
          questionId: params.questionId,
        },
      },
      update: {}, // No need to update anything if it exists, just ensure it's there
      create: {
        userId: locals.user.id,
        questionId: params.questionId,
        isCorrect,
      },
    });

    // The new logic: ALWAYS redirect to the rating page after an attempt.
    throw redirect(303, `/question/${params.questionId}/rate`);
  },
};
