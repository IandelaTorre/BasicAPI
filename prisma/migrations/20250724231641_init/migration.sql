/*
  Warnings:

  - A unique constraint covering the columns `[uuid]` on the table `Cat_Rols` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[uuid]` on the table `Cat_Url` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[uuid]` on the table `Cat_rol_Permission` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[uuid]` on the table `User` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[uuid]` on the table `UserLog` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Cat_Rols_uuid_key" ON "catalogs"."Cat_Rols"("uuid");

-- CreateIndex
CREATE UNIQUE INDEX "Cat_Url_uuid_key" ON "catalogs"."Cat_Url"("uuid");

-- CreateIndex
CREATE UNIQUE INDEX "Cat_rol_Permission_uuid_key" ON "catalogs"."Cat_rol_Permission"("uuid");

-- CreateIndex
CREATE UNIQUE INDEX "User_uuid_key" ON "user"."User"("uuid");

-- CreateIndex
CREATE UNIQUE INDEX "UserLog_uuid_key" ON "user"."UserLog"("uuid");
