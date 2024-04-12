/*
  Warnings:

  - Added the required column `city_id` to the `AutoGalleryAgent` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "RequestStatus" AS ENUM ('PENDING', 'ACCEPTED', 'DECLINED');

-- AlterEnum
ALTER TYPE "Role" ADD VALUE 'ADMIN';

-- AlterTable
ALTER TABLE "AutoGalleryAgent" ADD COLUMN     "city_id" INTEGER NOT NULL;

-- CreateTable
CREATE TABLE "Announcement" (
    "id" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "city_id" INTEGER NOT NULL,
    "user_id" TEXT NOT NULL,

    CONSTRAINT "Announcement_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "UserSavedCars" (
    "user_id" TEXT NOT NULL,
    "car_id" TEXT NOT NULL,

    CONSTRAINT "UserSavedCars_pkey" PRIMARY KEY ("user_id","car_id")
);

-- CreateTable
CREATE TABLE "RentRequest" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "car_id" TEXT NOT NULL,
    "auto_gallery_id" TEXT NOT NULL,
    "status" "RequestStatus" NOT NULL DEFAULT 'PENDING',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "RentRequest_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Announcement" ADD CONSTRAINT "Announcement_city_id_fkey" FOREIGN KEY ("city_id") REFERENCES "City"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Announcement" ADD CONSTRAINT "Announcement_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "AutoGalleryAgent"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserSavedCars" ADD CONSTRAINT "UserSavedCars_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "AutoGalleryAgent"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserSavedCars" ADD CONSTRAINT "UserSavedCars_car_id_fkey" FOREIGN KEY ("car_id") REFERENCES "Car"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RentRequest" ADD CONSTRAINT "RentRequest_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "AutoGalleryAgent"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RentRequest" ADD CONSTRAINT "RentRequest_car_id_fkey" FOREIGN KEY ("car_id") REFERENCES "Car"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RentRequest" ADD CONSTRAINT "RentRequest_auto_gallery_id_fkey" FOREIGN KEY ("auto_gallery_id") REFERENCES "AutoGallery"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AutoGalleryAgent" ADD CONSTRAINT "AutoGalleryAgent_city_id_fkey" FOREIGN KEY ("city_id") REFERENCES "City"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
