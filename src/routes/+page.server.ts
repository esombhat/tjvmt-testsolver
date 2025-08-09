// /src/routes/+page.server.ts
import { redirect } from "@sveltejs/kit";
import type { PageServerLoad } from "./$types";
import prisma from "$lib/server/prisma";

export const load: PageServerLoad = async ({ locals, url }) => {
  // The root page is now the dashboard, which requires a login.
  if (!locals.user) {
    throw redirect(302, "/login");
  }

  // 1. Get the selected tag from the URL search parameters
  const selectedTag = url.searchParams.get("tag");

  // 2. Build a dynamic Prisma query based on the selected tag
  const whereClause = selectedTag
    ? {
        // If a tag is selected, find questions that have at least one tag
        // with the matching name.
        tags: {
          some: {
            name: selectedTag,
          },
        },
      }
    : {}; // If no tag is selected, the where clause is empty, fetching all questions.

  // 3. Fetch the questions using the dynamic where clause
  const questions = await prisma.question.findMany({
    where: whereClause,
    include: {
      author: { select: { name: true } }, // Include author's name
      tags: { select: { name: true } }, // Include the tags for each question
    },
    orderBy: {
      createdAt: "desc", // Show newest questions first
    },
  });

  // 4. Fetch all unique tags to display as filter buttons
  const allTags = await prisma.tag.findMany({
    orderBy: {
      name: "asc", // Sort tags alphabetically
    },
  });

  // 5. Return all the necessary data to the page
  return {
    user: locals.user,
    questions,
    allTags,
    selectedTag,
  };
};
