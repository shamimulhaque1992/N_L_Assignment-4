/*
  Warnings:

  - You are about to drop the column `transactionId` on the `payments` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[stripeCustomerId]` on the table `payments` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[stripeSubscriptionId]` on the table `payments` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[stripeSessionId]` on the table `payments` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterEnum
ALTER TYPE "RequestStatus" ADD VALUE 'ACTIVE';

-- DropIndex
DROP INDEX "payments_transactionId_key";

-- AlterTable
ALTER TABLE "payments" DROP COLUMN "transactionId",
ADD COLUMN     "currentPeriodEnd" TIMESTAMP(3),
ADD COLUMN     "stripeCustomerId" TEXT,
ADD COLUMN     "stripeSessionId" TEXT,
ADD COLUMN     "stripeSubscriptionId" TEXT,
ALTER COLUMN "provider" SET DEFAULT 'STRIPE',
ALTER COLUMN "method" SET DEFAULT 'CARD';

-- CreateIndex
CREATE UNIQUE INDEX "payments_stripeCustomerId_key" ON "payments"("stripeCustomerId");

-- CreateIndex
CREATE UNIQUE INDEX "payments_stripeSubscriptionId_key" ON "payments"("stripeSubscriptionId");

-- CreateIndex
CREATE UNIQUE INDEX "payments_stripeSessionId_key" ON "payments"("stripeSessionId");
