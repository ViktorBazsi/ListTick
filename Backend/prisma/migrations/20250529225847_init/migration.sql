-- CreateEnum
CREATE TYPE "Status" AS ENUM ('out', 'quarter', 'half', 'threeQuarter', 'full');

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "firstName" TEXT,
    "lastName" TEXT,
    "userName" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Household" (
    "id" TEXT NOT NULL,
    "address" TEXT,

    CONSTRAINT "Household_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Good" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "expiration" TEXT,
    "price" INTEGER,
    "shop" TEXT,
    "status" "Status"[],

    CONSTRAINT "Good_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_Household_User" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,

    CONSTRAINT "_Household_User_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateTable
CREATE TABLE "_Good_Household" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,

    CONSTRAINT "_Good_Household_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_userName_key" ON "User"("userName");

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE INDEX "_Household_User_B_index" ON "_Household_User"("B");

-- CreateIndex
CREATE INDEX "_Good_Household_B_index" ON "_Good_Household"("B");

-- AddForeignKey
ALTER TABLE "_Household_User" ADD CONSTRAINT "_Household_User_A_fkey" FOREIGN KEY ("A") REFERENCES "Household"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_Household_User" ADD CONSTRAINT "_Household_User_B_fkey" FOREIGN KEY ("B") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_Good_Household" ADD CONSTRAINT "_Good_Household_A_fkey" FOREIGN KEY ("A") REFERENCES "Good"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_Good_Household" ADD CONSTRAINT "_Good_Household_B_fkey" FOREIGN KEY ("B") REFERENCES "Household"("id") ON DELETE CASCADE ON UPDATE CASCADE;
