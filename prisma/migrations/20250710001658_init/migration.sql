-- CreateIndex
CREATE INDEX "bookings_userId_idx" ON "bookings"("userId");

-- CreateIndex
CREATE INDEX "bookings_serviceType_idx" ON "bookings"("serviceType");

-- CreateIndex
CREATE INDEX "bookings_status_idx" ON "bookings"("status");

-- CreateIndex
CREATE INDEX "bookings_paymentStatus_idx" ON "bookings"("paymentStatus");

-- CreateIndex
CREATE INDEX "bookings_startDate_idx" ON "bookings"("startDate");

-- CreateIndex
CREATE INDEX "bookings_endDate_idx" ON "bookings"("endDate");

-- CreateIndex
CREATE INDEX "bookings_createdAt_idx" ON "bookings"("createdAt");

-- CreateIndex
CREATE INDEX "bookings_hotelId_idx" ON "bookings"("hotelId");

-- CreateIndex
CREATE INDEX "bookings_carId_idx" ON "bookings"("carId");

-- CreateIndex
CREATE INDEX "bookings_guideId_idx" ON "bookings"("guideId");

-- CreateIndex
CREATE INDEX "bookings_tourId_idx" ON "bookings"("tourId");

-- CreateIndex
CREATE INDEX "cars_ownerId_idx" ON "cars"("ownerId");

-- CreateIndex
CREATE INDEX "cars_isAvailable_idx" ON "cars"("isAvailable");

-- CreateIndex
CREATE INDEX "cars_isVerified_idx" ON "cars"("isVerified");

-- CreateIndex
CREATE INDEX "cars_isSpecialOffer_idx" ON "cars"("isSpecialOffer");

-- CreateIndex
CREATE INDEX "cars_category_idx" ON "cars"("category");

-- CreateIndex
CREATE INDEX "cars_brand_model_idx" ON "cars"("brand", "model");

-- CreateIndex
CREATE INDEX "cars_pricePerDay_idx" ON "cars"("pricePerDay");

-- CreateIndex
CREATE INDEX "hotels_ownerId_idx" ON "hotels"("ownerId");

-- CreateIndex
CREATE INDEX "hotels_city_idx" ON "hotels"("city");

-- CreateIndex
CREATE INDEX "hotels_isActive_idx" ON "hotels"("isActive");

-- CreateIndex
CREATE INDEX "hotels_isVerified_idx" ON "hotels"("isVerified");

-- CreateIndex
CREATE INDEX "hotels_isSpecialOffer_idx" ON "hotels"("isSpecialOffer");

-- CreateIndex
CREATE INDEX "hotels_createdAt_idx" ON "hotels"("createdAt");

-- CreateIndex
CREATE INDEX "rooms_hotelId_idx" ON "rooms"("hotelId");

-- CreateIndex
CREATE INDEX "rooms_isAvailable_idx" ON "rooms"("isAvailable");

-- CreateIndex
CREATE INDEX "rooms_pricePerNight_idx" ON "rooms"("pricePerNight");

-- CreateIndex
CREATE INDEX "rooms_roomType_idx" ON "rooms"("roomType");

-- CreateIndex
CREATE INDEX "users_role_idx" ON "users"("role");

-- CreateIndex
CREATE INDEX "users_status_idx" ON "users"("status");

-- CreateIndex
CREATE INDEX "users_createdAt_idx" ON "users"("createdAt");
