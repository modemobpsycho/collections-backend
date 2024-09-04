/*
  Warnings:

  - You are about to drop the `JiraAccount` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
DROP TABLE "JiraAccount";

-- CreateTable
CREATE TABLE "JiraTickets" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "ticketId" INTEGER NOT NULL,

    CONSTRAINT "JiraTickets_pkey" PRIMARY KEY ("id")
);
