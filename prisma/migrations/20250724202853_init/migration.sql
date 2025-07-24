/*
  Warnings:

  - The `enabled` column on the `Cat_Rols` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - You are about to drop the column `enable` on the `Cat_Url` table. All the data in the column will be lost.
  - You are about to drop the column `enable` on the `Cat_rol_Permission` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "catalogs"."Cat_Rols" DROP COLUMN "enabled",
ADD COLUMN     "enabled" BOOLEAN NOT NULL DEFAULT true;

-- AlterTable
ALTER TABLE "catalogs"."Cat_Url" DROP COLUMN "enable",
ADD COLUMN     "enabled" BOOLEAN NOT NULL DEFAULT true;

-- AlterTable
ALTER TABLE "catalogs"."Cat_rol_Permission" DROP COLUMN "enable",
ADD COLUMN     "enabled" BOOLEAN NOT NULL DEFAULT true;
