-- DropForeignKey
ALTER TABLE "AutoGalleryAgent" DROP CONSTRAINT "AutoGalleryAgent_city_id_fkey";

-- AlterTable
ALTER TABLE "AutoGalleryAgent" ALTER COLUMN "city_id" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "AutoGalleryAgent" ADD CONSTRAINT "AutoGalleryAgent_city_id_fkey" FOREIGN KEY ("city_id") REFERENCES "City"("id") ON DELETE SET NULL ON UPDATE CASCADE;
