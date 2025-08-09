-- AlterTable
ALTER TABLE "public"."Question" ADD COLUMN     "solution" TEXT,
ADD COLUMN     "title" TEXT NOT NULL DEFAULT 'Untitled question';
