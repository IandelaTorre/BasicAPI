/*
  Warnings:

  - The `uuid` column on the `Cat_Rols` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `uuid` column on the `Cat_Url` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `uuid` column on the `Cat_rol_Permission` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `uuid` column on the `User` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `uuid` column on the `UserLog` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- DropIndex
DROP INDEX "catalogs"."Cat_Rols_uuid_key";

-- DropIndex
DROP INDEX "catalogs"."Cat_Url_uuid_key";

-- DropIndex
DROP INDEX "catalogs"."Cat_rol_Permission_uuid_key";

-- DropIndex
DROP INDEX "user"."User_uuid_key";

-- DropIndex
DROP INDEX "user"."UserLog_uuid_key";

-- AlterTable
ALTER TABLE "catalogs"."Cat_Rols" DROP COLUMN "uuid",
ADD COLUMN     "uuid" UUID NOT NULL DEFAULT gen_random_uuid();

-- AlterTable
ALTER TABLE "catalogs"."Cat_Url" DROP COLUMN "uuid",
ADD COLUMN     "uuid" UUID NOT NULL DEFAULT gen_random_uuid();

-- AlterTable
ALTER TABLE "catalogs"."Cat_rol_Permission" DROP COLUMN "uuid",
ADD COLUMN     "uuid" UUID NOT NULL DEFAULT gen_random_uuid();

-- AlterTable
ALTER TABLE "user"."User" DROP COLUMN "uuid",
ADD COLUMN     "uuid" UUID NOT NULL DEFAULT gen_random_uuid();

-- AlterTable
ALTER TABLE "user"."UserLog" DROP COLUMN "uuid",
ADD COLUMN     "uuid" UUID NOT NULL DEFAULT gen_random_uuid();
