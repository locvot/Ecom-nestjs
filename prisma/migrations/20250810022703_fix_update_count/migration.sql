/*
  Warnings:

  - You are about to drop the column `updateCOunt` on the `Review` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Review" DROP COLUMN "updateCOunt",
ADD COLUMN     "updateCount" INTEGER NOT NULL DEFAULT 0;
