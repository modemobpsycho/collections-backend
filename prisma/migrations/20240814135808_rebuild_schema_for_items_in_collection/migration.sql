/*
  Warnings:

  - You are about to drop the column `collectionId` on the `ItemFields` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "ItemFields" DROP CONSTRAINT "ItemFields_collectionId_fkey";

-- AlterTable
ALTER TABLE "ItemFields" DROP COLUMN "collectionId";

-- CreateTable
CREATE TABLE "CollectionFields" (
    "id" SERIAL NOT NULL,
    "fieldName" TEXT NOT NULL,
    "fieldType" TEXT NOT NULL,
    "collectionId" INTEGER,

    CONSTRAINT "CollectionFields_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "CollectionFields" ADD CONSTRAINT "CollectionFields_collectionId_fkey" FOREIGN KEY ("collectionId") REFERENCES "Collection"("id") ON DELETE SET NULL ON UPDATE CASCADE;
