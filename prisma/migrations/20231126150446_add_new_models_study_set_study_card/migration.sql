-- CreateTable
CREATE TABLE "StudySet" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "isPublic" BOOLEAN NOT NULL DEFAULT false,
    "userId" TEXT,

    CONSTRAINT "StudySet_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "StudyCard" (
    "id" TEXT NOT NULL,
    "term" TEXT NOT NULL,
    "definition" TEXT NOT NULL,
    "imageURL" TEXT,
    "index" INTEGER,
    "studySetId" TEXT NOT NULL,

    CONSTRAINT "StudyCard_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "StudySet" ADD CONSTRAINT "StudySet_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "StudyCard" ADD CONSTRAINT "StudyCard_studySetId_fkey" FOREIGN KEY ("studySetId") REFERENCES "StudySet"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
