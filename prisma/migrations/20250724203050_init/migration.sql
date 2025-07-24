/*
  Warnings:

  - A unique constraint covering the columns `[uuid]` on the table `Cat_Rols` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[uuid]` on the table `UserLog` will be added. If there are existing duplicate values, this will fail.
  - The required column `uuid` was added to the `Cat_Rols` table with a prisma-level default value. This is not possible if the table is not empty. Please add this column as optional, then populate it before making it required.
  - The required column `uuid` was added to the `UserLog` table with a prisma-level default value. This is not possible if the table is not empty. Please add this column as optional, then populate it before making it required.

*/
-- AlterTable
ALTER TABLE "catalogs"."Cat_Rols" ADD COLUMN     "uuid" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "user"."UserLog" ADD COLUMN     "uuid" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Cat_Rols_uuid_key" ON "catalogs"."Cat_Rols"("uuid");

-- CreateIndex
CREATE UNIQUE INDEX "UserLog_uuid_key" ON "user"."UserLog"("uuid");
