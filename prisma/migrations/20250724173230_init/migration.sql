/*
  Warnings:

  - Added the required column `rolId` to the `User` table without a default value. This is not possible if the table is not empty.

*/
-- CreateSchema
CREATE SCHEMA IF NOT EXISTS "catalogs";

-- AlterTable
ALTER TABLE "user"."User" ADD COLUMN     "rolId" INTEGER NOT NULL;

-- CreateTable
CREATE TABLE "catalogs"."Cat_Url" (
    "id" SERIAL NOT NULL,
    "uuid" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "enable" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "Cat_Url_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "catalogs"."Cat_rol_Permission" (
    "id" SERIAL NOT NULL,
    "uuid" TEXT NOT NULL,
    "cat_rols_id" INTEGER NOT NULL,
    "cat_url_id" INTEGER NOT NULL,
    "enable" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "Cat_rol_Permission_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "catalogs"."Cat_Rols" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "visual_name" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "enabled" INTEGER NOT NULL DEFAULT 1,

    CONSTRAINT "Cat_Rols_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Cat_Url_uuid_key" ON "catalogs"."Cat_Url"("uuid");

-- CreateIndex
CREATE UNIQUE INDEX "unique_cat_urls_code" ON "catalogs"."Cat_Url"("code");

-- CreateIndex
CREATE UNIQUE INDEX "Cat_rol_Permission_uuid_key" ON "catalogs"."Cat_rol_Permission"("uuid");

-- CreateIndex
CREATE UNIQUE INDEX "unique_cat_rols_name" ON "catalogs"."Cat_Rols"("name");

-- AddForeignKey
ALTER TABLE "user"."User" ADD CONSTRAINT "User_rolId_fkey" FOREIGN KEY ("rolId") REFERENCES "catalogs"."Cat_Rols"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "catalogs"."Cat_rol_Permission" ADD CONSTRAINT "Cat_rol_Permission_cat_rols_id_fkey" FOREIGN KEY ("cat_rols_id") REFERENCES "catalogs"."Cat_Rols"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "catalogs"."Cat_rol_Permission" ADD CONSTRAINT "Cat_rol_Permission_cat_url_id_fkey" FOREIGN KEY ("cat_url_id") REFERENCES "catalogs"."Cat_Url"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
