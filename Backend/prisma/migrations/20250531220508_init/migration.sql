-- CreateTable
CREATE TABLE "HouseholdJoinRequest" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "userId" TEXT NOT NULL,
    "householdId" TEXT NOT NULL,

    CONSTRAINT "HouseholdJoinRequest_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "HouseholdJoinRequest_userId_householdId_key" ON "HouseholdJoinRequest"("userId", "householdId");

-- AddForeignKey
ALTER TABLE "HouseholdJoinRequest" ADD CONSTRAINT "HouseholdJoinRequest_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "HouseholdJoinRequest" ADD CONSTRAINT "HouseholdJoinRequest_householdId_fkey" FOREIGN KEY ("householdId") REFERENCES "Household"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
