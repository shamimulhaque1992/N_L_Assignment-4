/*
  Warnings:

  - You are about to drop the column `profilePhoto` on the `profiles` table. All the data in the column will be lost.
  - Added the required column `avatar` to the `profiles` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "profiles" DROP COLUMN "profilePhoto",
ADD COLUMN     "avatar" VARCHAR(255) NOT NULL;
