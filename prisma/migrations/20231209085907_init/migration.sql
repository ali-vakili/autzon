-- CreateEnum
CREATE TYPE "Role" AS ENUM ('USER', 'AGENT');

-- CreateTable
CREATE TABLE "AutoGalleryAndCarCategory" (
    "id" SERIAL NOT NULL,
    "category" TEXT NOT NULL,
    "abbreviation" TEXT,

    CONSTRAINT "AutoGalleryAndCarCategory_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PhoneNumber" (
    "id" TEXT NOT NULL,
    "number" VARCHAR(11) NOT NULL,
    "gallery_id" TEXT,

    CONSTRAINT "PhoneNumber_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Image" (
    "id" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "agent_id" TEXT,
    "gallery_id" TEXT,
    "car_id" TEXT,

    CONSTRAINT "Image_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ActivationToken" (
    "id" TEXT NOT NULL,
    "verifyToken" TEXT NOT NULL,
    "agent_id" TEXT NOT NULL,
    "activatedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ActivationToken_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Province" (
    "id" INTEGER NOT NULL,
    "name_fa" TEXT NOT NULL,
    "name_en" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "latitude" DOUBLE PRECISION NOT NULL,
    "longitude" DOUBLE PRECISION NOT NULL,

    CONSTRAINT "Province_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "City" (
    "id" INTEGER NOT NULL,
    "name_fa" TEXT NOT NULL,
    "name_en" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "latitude" DOUBLE PRECISION NOT NULL,
    "longitude" DOUBLE PRECISION NOT NULL,
    "province_id" INTEGER NOT NULL,

    CONSTRAINT "City_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Model" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "brand_id" INTEGER NOT NULL,
    "fuel_type_id" INTEGER,

    CONSTRAINT "Model_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Brand" (
    "id" INTEGER NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "Brand_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "BuildYear" (
    "id" SERIAL NOT NULL,
    "year" TEXT NOT NULL,

    CONSTRAINT "BuildYear_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "FuelType" (
    "id" SERIAL NOT NULL,
    "type" TEXT NOT NULL,

    CONSTRAINT "FuelType_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CarSeat" (
    "id" INTEGER NOT NULL,
    "seats" TEXT NOT NULL,
    "seats_count" TEXT NOT NULL,

    CONSTRAINT "CarSeat_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CarColor" (
    "id" INTEGER NOT NULL,
    "color_name" TEXT NOT NULL,
    "color_code" TEXT NOT NULL,

    CONSTRAINT "CarColor_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Car" (
    "id" TEXT NOT NULL,
    "title" VARCHAR(30) NOT NULL,
    "model_id" INTEGER NOT NULL,
    "car_seat_id" INTEGER NOT NULL,
    "build_year_id" INTEGER NOT NULL,
    "fuel_type_id" INTEGER NOT NULL,
    "category_id" INTEGER NOT NULL,
    "gallery_id" TEXT NOT NULL,
    "description" VARCHAR(1024) NOT NULL,
    "is_published" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Car_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "RentalCar" (
    "id" TEXT NOT NULL,
    "car_id" TEXT NOT NULL,
    "price_per_day" DOUBLE PRECISION NOT NULL,
    "pick_up_place" TEXT NOT NULL,
    "drop_off_place" TEXT NOT NULL,
    "reservation_fee_percentage" DOUBLE PRECISION,
    "late_return_fee_per_hour" DOUBLE PRECISION,
    "extra_time" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "RentalCar_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "RentedCar" (
    "id" TEXT NOT NULL,
    "rented_user_id" TEXT NOT NULL,
    "car_id" TEXT NOT NULL,
    "days" INTEGER NOT NULL,
    "pick_up_date" TIMESTAMP(3) NOT NULL,
    "drop_off_date" TIMESTAMP(3) NOT NULL,
    "reservation_fee" DOUBLE PRECISION,
    "total_price" DOUBLE PRECISION NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "RentedCar_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "RentalCarHistory" (
    "id" TEXT NOT NULL,
    "car_id" TEXT NOT NULL,
    "rented_user_id" TEXT NOT NULL,
    "pick_up_date" TIMESTAMP(3) NOT NULL,
    "drop_off_date" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "RentalCarHistory_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SaleCar" (
    "id" TEXT NOT NULL,
    "car_id" TEXT NOT NULL,
    "price" DOUBLE PRECISION NOT NULL,
    "mileage" DOUBLE PRECISION NOT NULL,
    "color_id" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "SaleCar_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AutoGallery" (
    "id" TEXT NOT NULL,
    "name" VARCHAR(30) NOT NULL,
    "city_id" INTEGER NOT NULL,
    "address" TEXT NOT NULL,
    "about" VARCHAR(1024),
    "agent_id" TEXT NOT NULL,
    "is_verified" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "AutoGallery_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AutoGalleryAgent" (
    "id" TEXT NOT NULL,
    "firstName" VARCHAR(30),
    "lastName" VARCHAR(30),
    "role" "Role" NOT NULL DEFAULT 'AGENT',
    "email" TEXT NOT NULL,
    "password" TEXT,
    "phone_number" VARCHAR(11),
    "bio" VARCHAR(1024),
    "is_profile_complete" BOOLEAN NOT NULL DEFAULT false,
    "is_subscribed" BOOLEAN NOT NULL DEFAULT false,
    "is_verified" BOOLEAN NOT NULL DEFAULT false,
    "join_date" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "AutoGalleryAgent_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Account" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "provider" TEXT NOT NULL,
    "providerAccountId" TEXT NOT NULL,
    "refresh_token" TEXT,
    "access_token" TEXT,
    "expires_at" INTEGER,
    "token_type" TEXT,
    "scope" TEXT,
    "id_token" TEXT,
    "session_state" TEXT,

    CONSTRAINT "Account_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Session" (
    "id" TEXT NOT NULL,
    "sessionToken" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "expires" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Session_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PasswordResetToken" (
    "id" TEXT NOT NULL,
    "token" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "resetAt" TIMESTAMP(3),
    "agent_id" TEXT,

    CONSTRAINT "PasswordResetToken_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_AutoGalleryToAutoGalleryAndCarCategory" (
    "A" TEXT NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "Image_agent_id_key" ON "Image"("agent_id");

-- CreateIndex
CREATE UNIQUE INDEX "Image_gallery_id_key" ON "Image"("gallery_id");

-- CreateIndex
CREATE UNIQUE INDEX "ActivationToken_verifyToken_key" ON "ActivationToken"("verifyToken");

-- CreateIndex
CREATE UNIQUE INDEX "RentalCar_car_id_key" ON "RentalCar"("car_id");

-- CreateIndex
CREATE UNIQUE INDEX "RentedCar_car_id_key" ON "RentedCar"("car_id");

-- CreateIndex
CREATE UNIQUE INDEX "RentedCar_car_id_rented_user_id_key" ON "RentedCar"("car_id", "rented_user_id");

-- CreateIndex
CREATE UNIQUE INDEX "SaleCar_car_id_key" ON "SaleCar"("car_id");

-- CreateIndex
CREATE UNIQUE INDEX "AutoGalleryAgent_email_key" ON "AutoGalleryAgent"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Account_provider_providerAccountId_key" ON "Account"("provider", "providerAccountId");

-- CreateIndex
CREATE UNIQUE INDEX "Session_sessionToken_key" ON "Session"("sessionToken");

-- CreateIndex
CREATE UNIQUE INDEX "PasswordResetToken_token_key" ON "PasswordResetToken"("token");

-- CreateIndex
CREATE UNIQUE INDEX "_AutoGalleryToAutoGalleryAndCarCategory_AB_unique" ON "_AutoGalleryToAutoGalleryAndCarCategory"("A", "B");

-- CreateIndex
CREATE INDEX "_AutoGalleryToAutoGalleryAndCarCategory_B_index" ON "_AutoGalleryToAutoGalleryAndCarCategory"("B");

-- AddForeignKey
ALTER TABLE "PhoneNumber" ADD CONSTRAINT "PhoneNumber_gallery_id_fkey" FOREIGN KEY ("gallery_id") REFERENCES "AutoGallery"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Image" ADD CONSTRAINT "Image_agent_id_fkey" FOREIGN KEY ("agent_id") REFERENCES "AutoGalleryAgent"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Image" ADD CONSTRAINT "Image_gallery_id_fkey" FOREIGN KEY ("gallery_id") REFERENCES "AutoGallery"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Image" ADD CONSTRAINT "Image_car_id_fkey" FOREIGN KEY ("car_id") REFERENCES "Car"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ActivationToken" ADD CONSTRAINT "ActivationToken_agent_id_fkey" FOREIGN KEY ("agent_id") REFERENCES "AutoGalleryAgent"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "City" ADD CONSTRAINT "City_province_id_fkey" FOREIGN KEY ("province_id") REFERENCES "Province"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Model" ADD CONSTRAINT "Model_brand_id_fkey" FOREIGN KEY ("brand_id") REFERENCES "Brand"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Model" ADD CONSTRAINT "Model_fuel_type_id_fkey" FOREIGN KEY ("fuel_type_id") REFERENCES "FuelType"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Car" ADD CONSTRAINT "Car_model_id_fkey" FOREIGN KEY ("model_id") REFERENCES "Model"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Car" ADD CONSTRAINT "Car_build_year_id_fkey" FOREIGN KEY ("build_year_id") REFERENCES "BuildYear"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Car" ADD CONSTRAINT "Car_car_seat_id_fkey" FOREIGN KEY ("car_seat_id") REFERENCES "CarSeat"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Car" ADD CONSTRAINT "Car_fuel_type_id_fkey" FOREIGN KEY ("fuel_type_id") REFERENCES "FuelType"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Car" ADD CONSTRAINT "Car_category_id_fkey" FOREIGN KEY ("category_id") REFERENCES "AutoGalleryAndCarCategory"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Car" ADD CONSTRAINT "Car_gallery_id_fkey" FOREIGN KEY ("gallery_id") REFERENCES "AutoGallery"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RentalCar" ADD CONSTRAINT "RentalCar_car_id_fkey" FOREIGN KEY ("car_id") REFERENCES "Car"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RentedCar" ADD CONSTRAINT "RentedCar_rented_user_id_fkey" FOREIGN KEY ("rented_user_id") REFERENCES "AutoGalleryAgent"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RentedCar" ADD CONSTRAINT "RentedCar_car_id_fkey" FOREIGN KEY ("car_id") REFERENCES "Car"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RentalCarHistory" ADD CONSTRAINT "RentalCarHistory_car_id_fkey" FOREIGN KEY ("car_id") REFERENCES "Car"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RentalCarHistory" ADD CONSTRAINT "RentalCarHistory_rented_user_id_fkey" FOREIGN KEY ("rented_user_id") REFERENCES "AutoGalleryAgent"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SaleCar" ADD CONSTRAINT "SaleCar_car_id_fkey" FOREIGN KEY ("car_id") REFERENCES "Car"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SaleCar" ADD CONSTRAINT "SaleCar_color_id_fkey" FOREIGN KEY ("color_id") REFERENCES "CarColor"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AutoGallery" ADD CONSTRAINT "AutoGallery_city_id_fkey" FOREIGN KEY ("city_id") REFERENCES "City"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AutoGallery" ADD CONSTRAINT "AutoGallery_agent_id_fkey" FOREIGN KEY ("agent_id") REFERENCES "AutoGalleryAgent"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Account" ADD CONSTRAINT "Account_userId_fkey" FOREIGN KEY ("userId") REFERENCES "AutoGalleryAgent"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Session" ADD CONSTRAINT "Session_userId_fkey" FOREIGN KEY ("userId") REFERENCES "AutoGalleryAgent"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PasswordResetToken" ADD CONSTRAINT "PasswordResetToken_agent_id_fkey" FOREIGN KEY ("agent_id") REFERENCES "AutoGalleryAgent"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_AutoGalleryToAutoGalleryAndCarCategory" ADD CONSTRAINT "_AutoGalleryToAutoGalleryAndCarCategory_A_fkey" FOREIGN KEY ("A") REFERENCES "AutoGallery"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_AutoGalleryToAutoGalleryAndCarCategory" ADD CONSTRAINT "_AutoGalleryToAutoGalleryAndCarCategory_B_fkey" FOREIGN KEY ("B") REFERENCES "AutoGalleryAndCarCategory"("id") ON DELETE CASCADE ON UPDATE CASCADE;
