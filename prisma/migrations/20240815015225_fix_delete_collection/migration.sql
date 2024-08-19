-- DropForeignKey
ALTER TABLE "ItemFields" DROP CONSTRAINT "ItemFields_itemId_fkey";

-- AddForeignKey
ALTER TABLE "ItemFields" ADD CONSTRAINT "ItemFields_itemId_fkey" FOREIGN KEY ("itemId") REFERENCES "Item"("id") ON DELETE CASCADE ON UPDATE CASCADE;
