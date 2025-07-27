/*
  Warnings:

  - You are about to drop the column `userId` on the `UserLog` table. All the data in the column will be lost.
  - Added the required column `userUuid` to the `UserLog` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "user"."UserLog" DROP CONSTRAINT "UserLog_userId_fkey";

-- AlterTable
ALTER TABLE "user"."UserLog" DROP COLUMN "userId",
ADD COLUMN     "userUuid" UUID NOT NULL;

-- AddForeignKey
ALTER TABLE "user"."UserLog" ADD CONSTRAINT "UserLog_userUuid_fkey" FOREIGN KEY ("userUuid") REFERENCES "user"."User"("uuid") ON DELETE RESTRICT ON UPDATE CASCADE;
