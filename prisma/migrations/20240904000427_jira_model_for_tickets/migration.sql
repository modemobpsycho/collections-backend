-- CreateTable
CREATE TABLE "JiraAccount" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "ticketId" INTEGER NOT NULL,

    CONSTRAINT "JiraAccount_pkey" PRIMARY KEY ("id")
);
