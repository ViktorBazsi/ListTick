/*
  Warnings:

  - You are about to drop the `_Good_Household` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `householdId` to the `Good` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "_Good_Household" DROP CONSTRAINT "_Good_Household_A_fkey";

-- DropForeignKey
ALTER TABLE "_Good_Household" DROP CONSTRAINT "_Good_Household_B_fkey";

-- AlterTable
ALTER TABLE "Good" ADD COLUMN     "householdId" TEXT NOT NULL;

-- DropTable
DROP TABLE "_Good_Household";

-- AddForeignKey
ALTER TABLE "Good" ADD CONSTRAINT "Good_householdId_fkey" FOREIGN KEY ("householdId") REFERENCES "Household"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
