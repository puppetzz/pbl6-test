-- AlterTable
ALTER TABLE "Question" ADD COLUMN     "isTemplate" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "templateQuestionId" TEXT;
