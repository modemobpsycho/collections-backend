/*
  Warnings:

  - You are about to drop the `_ItemToTag` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `itemId` to the `Tag` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "_ItemToTag" DROP CONSTRAINT "_ItemToTag_A_fkey";

-- DropForeignKey
ALTER TABLE "_ItemToTag" DROP CONSTRAINT "_ItemToTag_B_fkey";

-- AlterTable
ALTER TABLE "Tag" ADD COLUMN     "itemId" INTEGER NOT NULL;

-- DropTable
DROP TABLE "_ItemToTag";

-- AddForeignKey
ALTER TABLE "Tag" ADD CONSTRAINT "Tag_itemId_fkey" FOREIGN KEY ("itemId") REFERENCES "Item"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
