// /src/routes/question/[questionId]/discuss/+page.server.ts (Verified Version)
import { error, redirect } from "@sveltejs/kit";
import type { PageServerLoad, Actions } from "./$types";
import prisma from "$lib/server/prisma";

export const load: PageServerLoad = async ({ params, locals }) => {
  if (!locals.user) {
    throw redirect(302, "/login");
  }

  const question = await prisma.question.findUnique({
    where: { id: params.questionId },
    select: { body: true, answer: true, solution: true },
  });

  if (!question) {
    throw error(404, "Question not found");
  }

  const messages = await prisma.chatMessage.findMany({
    where: { questionId: params.questionId },
    include: {
      user: {
        select: { name: true, email: true },
      },
    },
    orderBy: {
      createdAt: "asc",
    },
  });

  // This is the only successful return path, and it ALWAYS includes question and messages.
  return { question, messages };
};

export const actions: Actions = {
  addComment: async ({ request, locals, params }) => {
    if (!locals.user) {
      throw redirect(302, "/login");
    }

    const data = await request.formData();
    const comment = data.get("comment") as string;

    if (!comment || comment.trim().length === 0) {
      return { success: false, message: "Comment cannot be empty." };
    }

    await prisma.chatMessage.create({
      data: {
        content: comment,
        userId: locals.user.id,
        questionId: params.questionId,
      },
    });

    return { success: true };
  },
};
