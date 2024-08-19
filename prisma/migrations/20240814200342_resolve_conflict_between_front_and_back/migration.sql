/*
  Warnings:

  - You are about to drop the column `datetimeFieldValue` on the `ItemFields` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "ItemFields" DROP COLUMN "datetimeFieldValue",
ADD COLUMN     "dateFieldValue" TIMESTAMP(3);
