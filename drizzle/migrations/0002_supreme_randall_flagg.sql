DROP TABLE `tourism_news`;--> statement-breakpoint
DROP TABLE `tourism_news_translations`;--> statement-breakpoint
DROP TABLE `umrah_package_translations`;--> statement-breakpoint
PRAGMA foreign_keys=OFF;--> statement-breakpoint
CREATE TABLE `__new_blogs` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`title` text NOT NULL,
	`content` text NOT NULL,
	`excerpt` text,
	`authorId` integer NOT NULL,
	`status` text DEFAULT 'DRAFT' NOT NULL,
	`publishedAt` text,
	`featuredImage` text,
	`tags` text,
	`category` text,
	`viewCount` integer DEFAULT 0,
	`likeCount` integer DEFAULT 0,
	`commentCount` integer DEFAULT 0,
	`isFeatured` integer DEFAULT false,
	`seoTitle` text,
	`seoDescription` text,
	`seoKeywords` text,
	`slug` text,
	`createdAt` text DEFAULT 'CURRENT_TIMESTAMP' NOT NULL,
	`updatedAt` text DEFAULT 'CURRENT_TIMESTAMP' NOT NULL
);
--> statement-breakpoint
INSERT INTO `__new_blogs`("id", "title", "content", "excerpt", "authorId", "status", "publishedAt", "featuredImage", "tags", "category", "viewCount", "likeCount", "commentCount", "isFeatured", "seoTitle", "seoDescription", "seoKeywords", "slug", "createdAt", "updatedAt") SELECT "id", "title", "content", "excerpt", "authorId", "status", "publishedAt", "featuredImage", "tags", "category", "viewCount", "likeCount", "commentCount", "isFeatured", "seoTitle", "seoDescription", "seoKeywords", "slug", "createdAt", "updatedAt" FROM `blogs`;--> statement-breakpoint
DROP TABLE `blogs`;--> statement-breakpoint
ALTER TABLE `__new_blogs` RENAME TO `blogs`;--> statement-breakpoint
PRAGMA foreign_keys=ON;--> statement-breakpoint
CREATE UNIQUE INDEX `blogs_slug_unique` ON `blogs` (`slug`);--> statement-breakpoint
CREATE TABLE `__new_bookings` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`userId` integer NOT NULL,
	`serviceType` text NOT NULL,
	`serviceId` integer NOT NULL,
	`startDate` text NOT NULL,
	`endDate` text NOT NULL,
	`totalPrice` real NOT NULL,
	`currency` text DEFAULT 'USD',
	`status` text DEFAULT 'PENDING' NOT NULL,
	`paymentStatus` text DEFAULT 'PENDING' NOT NULL,
	`specialRequests` text,
	`numberOfPeople` integer DEFAULT 1,
	`contactPhone` text,
	`contactEmail` text,
	`cancellationReason` text,
	`refundAmount` real,
	`createdAt` text DEFAULT 'CURRENT_TIMESTAMP' NOT NULL,
	`updatedAt` text DEFAULT 'CURRENT_TIMESTAMP' NOT NULL
);
--> statement-breakpoint
INSERT INTO `__new_bookings`("id", "userId", "serviceType", "serviceId", "startDate", "endDate", "totalPrice", "currency", "status", "paymentStatus", "specialRequests", "numberOfPeople", "contactPhone", "contactEmail", "cancellationReason", "refundAmount", "createdAt", "updatedAt") SELECT "id", "userId", "serviceType", "serviceId", "startDate", "endDate", "totalPrice", "currency", "status", "paymentStatus", "specialRequests", "numberOfPeople", "contactPhone", "contactEmail", "cancellationReason", "refundAmount", "createdAt", "updatedAt" FROM `bookings`;--> statement-breakpoint
DROP TABLE `bookings`;--> statement-breakpoint
ALTER TABLE `__new_bookings` RENAME TO `bookings`;--> statement-breakpoint
CREATE TABLE `__new_blog_translations` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`blogId` integer NOT NULL,
	`language` text NOT NULL,
	`title` text NOT NULL,
	`content` text NOT NULL,
	`excerpt` text,
	`seoTitle` text,
	`seoDescription` text,
	`seoKeywords` text
);
--> statement-breakpoint
INSERT INTO `__new_blog_translations`("id", "blogId", "language", "title", "content", "excerpt", "seoTitle", "seoDescription", "seoKeywords") SELECT "id", "blogId", "language", "title", "content", "excerpt", "seoTitle", "seoDescription", "seoKeywords" FROM `blog_translations`;--> statement-breakpoint
DROP TABLE `blog_translations`;--> statement-breakpoint
ALTER TABLE `__new_blog_translations` RENAME TO `blog_translations`;--> statement-breakpoint
CREATE UNIQUE INDEX `blog_translations_blogId_language_unique` ON `blog_translations` (`blogId`,`language`);--> statement-breakpoint
CREATE TABLE `__new_blog_reactions` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`blogId` integer NOT NULL,
	`userId` integer NOT NULL,
	`reactionType` text NOT NULL,
	`createdAt` text DEFAULT 'CURRENT_TIMESTAMP' NOT NULL
);
--> statement-breakpoint
INSERT INTO `__new_blog_reactions`("id", "blogId", "userId", "reactionType", "createdAt") SELECT "id", "blogId", "userId", "reactionType", "createdAt" FROM `blog_reactions`;--> statement-breakpoint
DROP TABLE `blog_reactions`;--> statement-breakpoint
ALTER TABLE `__new_blog_reactions` RENAME TO `blog_reactions`;--> statement-breakpoint
CREATE UNIQUE INDEX `blog_reactions_blogId_userId_unique` ON `blog_reactions` (`blogId`,`userId`);--> statement-breakpoint
CREATE TABLE `__new_bundle_translations` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`bundleId` integer NOT NULL,
	`language` text NOT NULL,
	`name` text NOT NULL,
	`description` text
);
--> statement-breakpoint
INSERT INTO `__new_bundle_translations`("id", "bundleId", "language", "name", "description") SELECT "id", "bundleId", "language", "name", "description" FROM `bundle_translations`;--> statement-breakpoint
DROP TABLE `bundle_translations`;--> statement-breakpoint
ALTER TABLE `__new_bundle_translations` RENAME TO `bundle_translations`;--> statement-breakpoint
CREATE UNIQUE INDEX `bundle_translations_bundleId_language_unique` ON `bundle_translations` (`bundleId`,`language`);--> statement-breakpoint
CREATE TABLE `__new_bundles` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`name` text NOT NULL,
	`description` text,
	`price` real NOT NULL,
	`currency` text DEFAULT 'USD',
	`services` text NOT NULL,
	`isActive` integer DEFAULT true,
	`isSpecialOffer` integer DEFAULT false,
	`discountPercentage` integer DEFAULT 0,
	`startDate` text NOT NULL,
	`endDate` text NOT NULL,
	`maxBookings` integer,
	`currentBookings` integer DEFAULT 0,
	`images` text,
	`createdAt` text DEFAULT 'CURRENT_TIMESTAMP' NOT NULL,
	`updatedAt` text DEFAULT 'CURRENT_TIMESTAMP' NOT NULL
);
--> statement-breakpoint
INSERT INTO `__new_bundles`("id", "name", "description", "price", "currency", "services", "isActive", "isSpecialOffer", "discountPercentage", "startDate", "endDate", "maxBookings", "currentBookings", "images", "createdAt", "updatedAt") SELECT "id", "name", "description", "price", "currency", "services", "isActive", "isSpecialOffer", "discountPercentage", "startDate", "endDate", "maxBookings", "currentBookings", "images", "createdAt", "updatedAt" FROM `bundles`;--> statement-breakpoint
DROP TABLE `bundles`;--> statement-breakpoint
ALTER TABLE `__new_bundles` RENAME TO `bundles`;--> statement-breakpoint
CREATE TABLE `__new_car_translations` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`carId` integer NOT NULL,
	`language` text NOT NULL,
	`description` text
);
--> statement-breakpoint
INSERT INTO `__new_car_translations`("id", "carId", "language", "description") SELECT "id", "carId", "language", "description" FROM `car_translations`;--> statement-breakpoint
DROP TABLE `car_translations`;--> statement-breakpoint
ALTER TABLE `__new_car_translations` RENAME TO `car_translations`;--> statement-breakpoint
CREATE UNIQUE INDEX `car_translations_carId_language_unique` ON `car_translations` (`carId`,`language`);--> statement-breakpoint
CREATE TABLE `__new_cars` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`brand` text NOT NULL,
	`model` text NOT NULL,
	`year` integer NOT NULL,
	`color` text NOT NULL,
	`licensePlate` text NOT NULL,
	`ownerId` integer NOT NULL,
	`category` text NOT NULL,
	`transmission` text NOT NULL,
	`fuelType` text NOT NULL,
	`seats` integer DEFAULT 5,
	`doors` integer DEFAULT 4,
	`pricePerDay` real NOT NULL,
	`currency` text DEFAULT 'USD',
	`features` text,
	`images` text,
	`currentLocation` text,
	`isAvailable` integer DEFAULT true,
	`isVerified` integer DEFAULT false,
	`isSpecialOffer` integer DEFAULT false,
	`lastServiceDate` text,
	`nextServiceDate` text,
	`mileage` integer DEFAULT 0,
	`createdAt` text DEFAULT 'CURRENT_TIMESTAMP' NOT NULL,
	`updatedAt` text DEFAULT 'CURRENT_TIMESTAMP' NOT NULL
);
--> statement-breakpoint
INSERT INTO `__new_cars`("id", "brand", "model", "year", "color", "licensePlate", "ownerId", "category", "transmission", "fuelType", "seats", "doors", "pricePerDay", "currency", "features", "images", "currentLocation", "isAvailable", "isVerified", "isSpecialOffer", "lastServiceDate", "nextServiceDate", "mileage", "createdAt", "updatedAt") SELECT "id", "brand", "model", "year", "color", "licensePlate", "ownerId", "category", "transmission", "fuelType", "seats", "doors", "pricePerDay", "currency", "features", "images", "currentLocation", "isAvailable", "isVerified", "isSpecialOffer", "lastServiceDate", "nextServiceDate", "mileage", "createdAt", "updatedAt" FROM `cars`;--> statement-breakpoint
DROP TABLE `cars`;--> statement-breakpoint
ALTER TABLE `__new_cars` RENAME TO `cars`;--> statement-breakpoint
CREATE UNIQUE INDEX `cars_licensePlate_unique` ON `cars` (`licensePlate`);--> statement-breakpoint
CREATE TABLE `__new_contact_forms` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`name` text NOT NULL,
	`email` text NOT NULL,
	`phone` text,
	`subject` text NOT NULL,
	`message` text NOT NULL,
	`status` text DEFAULT 'PENDING' NOT NULL,
	`priority` text DEFAULT 'NORMAL',
	`assignedTo` integer,
	`response` text,
	`respondedAt` text,
	`createdAt` text DEFAULT 'CURRENT_TIMESTAMP' NOT NULL,
	`updatedAt` text DEFAULT 'CURRENT_TIMESTAMP' NOT NULL
);
--> statement-breakpoint
INSERT INTO `__new_contact_forms`("id", "name", "email", "phone", "subject", "message", "status", "priority", "assignedTo", "response", "respondedAt", "createdAt", "updatedAt") SELECT "id", "name", "email", "phone", "subject", "message", "status", "priority", "assignedTo", "response", "respondedAt", "createdAt", "updatedAt" FROM `contact_forms`;--> statement-breakpoint
DROP TABLE `contact_forms`;--> statement-breakpoint
ALTER TABLE `__new_contact_forms` RENAME TO `contact_forms`;--> statement-breakpoint
CREATE TABLE `__new_educational_program_translations` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`programId` integer NOT NULL,
	`language` text NOT NULL,
	`name` text NOT NULL,
	`description` text
);
--> statement-breakpoint
INSERT INTO `__new_educational_program_translations`("id", "programId", "language", "name", "description") SELECT "id", "programId", "language", "name", "description" FROM `educational_program_translations`;--> statement-breakpoint
DROP TABLE `educational_program_translations`;--> statement-breakpoint
ALTER TABLE `__new_educational_program_translations` RENAME TO `educational_program_translations`;--> statement-breakpoint
CREATE UNIQUE INDEX `educational_program_translations_programId_language_unique` ON `educational_program_translations` (`programId`,`language`);--> statement-breakpoint
CREATE TABLE `__new_educational_programs` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`name` text NOT NULL,
	`description` text,
	`providerId` integer NOT NULL,
	`programType` text NOT NULL,
	`duration` integer NOT NULL,
	`price` real NOT NULL,
	`currency` text DEFAULT 'USD',
	`maxStudents` integer,
	`currentStudents` integer DEFAULT 0,
	`startDate` text NOT NULL,
	`endDate` text NOT NULL,
	`isActive` integer DEFAULT true,
	`isVerified` integer DEFAULT false,
	`createdAt` text DEFAULT 'CURRENT_TIMESTAMP' NOT NULL,
	`updatedAt` text DEFAULT 'CURRENT_TIMESTAMP' NOT NULL
);
--> statement-breakpoint
INSERT INTO `__new_educational_programs`("id", "name", "description", "providerId", "programType", "duration", "price", "currency", "maxStudents", "currentStudents", "startDate", "endDate", "isActive", "isVerified", "createdAt", "updatedAt") SELECT "id", "name", "description", "providerId", "programType", "duration", "price", "currency", "maxStudents", "currentStudents", "startDate", "endDate", "isActive", "isVerified", "createdAt", "updatedAt" FROM `educational_programs`;--> statement-breakpoint
DROP TABLE `educational_programs`;--> statement-breakpoint
ALTER TABLE `__new_educational_programs` RENAME TO `educational_programs`;--> statement-breakpoint
CREATE TABLE `__new_health_service_translations` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`serviceId` integer NOT NULL,
	`language` text NOT NULL,
	`name` text NOT NULL,
	`description` text
);
--> statement-breakpoint
INSERT INTO `__new_health_service_translations`("id", "serviceId", "language", "name", "description") SELECT "id", "serviceId", "language", "name", "description" FROM `health_service_translations`;--> statement-breakpoint
DROP TABLE `health_service_translations`;--> statement-breakpoint
ALTER TABLE `__new_health_service_translations` RENAME TO `health_service_translations`;--> statement-breakpoint
CREATE UNIQUE INDEX `health_service_translations_serviceId_language_unique` ON `health_service_translations` (`serviceId`,`language`);--> statement-breakpoint
CREATE TABLE `__new_health_services` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`name` text NOT NULL,
	`description` text,
	`providerId` integer NOT NULL,
	`serviceType` text NOT NULL,
	`price` real NOT NULL,
	`currency` text DEFAULT 'USD',
	`duration` integer,
	`isActive` integer DEFAULT true,
	`isVerified` integer DEFAULT false,
	`createdAt` text DEFAULT 'CURRENT_TIMESTAMP' NOT NULL,
	`updatedAt` text DEFAULT 'CURRENT_TIMESTAMP' NOT NULL
);
--> statement-breakpoint
INSERT INTO `__new_health_services`("id", "name", "description", "providerId", "serviceType", "price", "currency", "duration", "isActive", "isVerified", "createdAt", "updatedAt") SELECT "id", "name", "description", "providerId", "serviceType", "price", "currency", "duration", "isActive", "isVerified", "createdAt", "updatedAt" FROM `health_services`;--> statement-breakpoint
DROP TABLE `health_services`;--> statement-breakpoint
ALTER TABLE `__new_health_services` RENAME TO `health_services`;--> statement-breakpoint
CREATE TABLE `__new_hotel_settings` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`ownerId` integer NOT NULL,
	`autoApproveBookings` integer DEFAULT false,
	`maintenanceMode` integer DEFAULT false,
	`requirePasswordChange` integer DEFAULT false,
	`sessionTimeout` integer DEFAULT 30,
	`createdAt` text DEFAULT 'CURRENT_TIMESTAMP' NOT NULL,
	`updatedAt` text DEFAULT 'CURRENT_TIMESTAMP' NOT NULL
);
--> statement-breakpoint
INSERT INTO `__new_hotel_settings`("id", "ownerId", "autoApproveBookings", "maintenanceMode", "requirePasswordChange", "sessionTimeout", "createdAt", "updatedAt") SELECT "id", "ownerId", "autoApproveBookings", "maintenanceMode", "requirePasswordChange", "sessionTimeout", "createdAt", "updatedAt" FROM `hotel_settings`;--> statement-breakpoint
DROP TABLE `hotel_settings`;--> statement-breakpoint
ALTER TABLE `__new_hotel_settings` RENAME TO `hotel_settings`;--> statement-breakpoint
CREATE UNIQUE INDEX `hotel_settings_ownerId_unique` ON `hotel_settings` (`ownerId`);--> statement-breakpoint
CREATE TABLE `__new_hotel_translations` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`hotelId` integer NOT NULL,
	`language` text NOT NULL,
	`name` text NOT NULL,
	`description` text
);
--> statement-breakpoint
INSERT INTO `__new_hotel_translations`("id", "hotelId", "language", "name", "description") SELECT "id", "hotelId", "language", "name", "description" FROM `hotel_translations`;--> statement-breakpoint
DROP TABLE `hotel_translations`;--> statement-breakpoint
ALTER TABLE `__new_hotel_translations` RENAME TO `hotel_translations`;--> statement-breakpoint
CREATE UNIQUE INDEX `hotel_translations_hotelId_language_unique` ON `hotel_translations` (`hotelId`,`language`);--> statement-breakpoint
CREATE TABLE `__new_hotels` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`name` text NOT NULL,
	`description` text,
	`address` text NOT NULL,
	`city` text NOT NULL,
	`phone` text,
	`email` text,
	`website` text,
	`ownerId` integer NOT NULL,
	`starRating` integer DEFAULT 0,
	`checkInTime` text DEFAULT '14:00',
	`checkOutTime` text DEFAULT '12:00',
	`amenities` text,
	`images` text,
	`latitude` real,
	`longitude` real,
	`googleMapLink` text,
	`isActive` integer DEFAULT true,
	`isVerified` integer DEFAULT false,
	`isSpecialOffer` integer DEFAULT false,
	`createdAt` text DEFAULT 'CURRENT_TIMESTAMP' NOT NULL,
	`updatedAt` text DEFAULT 'CURRENT_TIMESTAMP' NOT NULL
);
--> statement-breakpoint
INSERT INTO `__new_hotels`("id", "name", "description", "address", "city", "phone", "email", "website", "ownerId", "starRating", "checkInTime", "checkOutTime", "amenities", "images", "latitude", "longitude", "googleMapLink", "isActive", "isVerified", "isSpecialOffer", "createdAt", "updatedAt") SELECT "id", "name", "description", "address", "city", "phone", "email", "website", "ownerId", "starRating", "checkInTime", "checkOutTime", "amenities", "images", "latitude", "longitude", "googleMapLink", "isActive", "isVerified", "isSpecialOffer", "createdAt", "updatedAt" FROM `hotels`;--> statement-breakpoint
DROP TABLE `hotels`;--> statement-breakpoint
ALTER TABLE `__new_hotels` RENAME TO `hotels`;--> statement-breakpoint
CREATE TABLE `__new_notifications` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`userId` integer NOT NULL,
	`title` text NOT NULL,
	`message` text NOT NULL,
	`type` text NOT NULL,
	`isRead` integer DEFAULT false,
	`data` text,
	`createdAt` text DEFAULT 'CURRENT_TIMESTAMP' NOT NULL
);
--> statement-breakpoint
INSERT INTO `__new_notifications`("id", "userId", "title", "message", "type", "isRead", "data", "createdAt") SELECT "id", "userId", "title", "message", "type", "isRead", "data", "createdAt" FROM `notifications`;--> statement-breakpoint
DROP TABLE `notifications`;--> statement-breakpoint
ALTER TABLE `__new_notifications` RENAME TO `notifications`;--> statement-breakpoint
CREATE TABLE `__new_offer_translations` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`offerId` integer NOT NULL,
	`language` text NOT NULL,
	`title` text NOT NULL,
	`description` text
);
--> statement-breakpoint
INSERT INTO `__new_offer_translations`("id", "offerId", "language", "title", "description") SELECT "id", "offerId", "language", "title", "description" FROM `offer_translations`;--> statement-breakpoint
DROP TABLE `offer_translations`;--> statement-breakpoint
ALTER TABLE `__new_offer_translations` RENAME TO `offer_translations`;--> statement-breakpoint
CREATE UNIQUE INDEX `offer_translations_offerId_language_unique` ON `offer_translations` (`offerId`,`language`);--> statement-breakpoint
CREATE TABLE `__new_offers` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`title` text NOT NULL,
	`description` text,
	`discountPercentage` integer NOT NULL,
	`startDate` text NOT NULL,
	`endDate` text NOT NULL,
	`serviceType` text NOT NULL,
	`serviceId` integer NOT NULL,
	`isActive` integer DEFAULT true,
	`maxUses` integer,
	`currentUses` integer DEFAULT 0,
	`createdAt` text DEFAULT 'CURRENT_TIMESTAMP' NOT NULL,
	`updatedAt` text DEFAULT 'CURRENT_TIMESTAMP' NOT NULL
);
--> statement-breakpoint
INSERT INTO `__new_offers`("id", "title", "description", "discountPercentage", "startDate", "endDate", "serviceType", "serviceId", "isActive", "maxUses", "currentUses", "createdAt", "updatedAt") SELECT "id", "title", "description", "discountPercentage", "startDate", "endDate", "serviceType", "serviceId", "isActive", "maxUses", "currentUses", "createdAt", "updatedAt" FROM `offers`;--> statement-breakpoint
DROP TABLE `offers`;--> statement-breakpoint
ALTER TABLE `__new_offers` RENAME TO `offers`;--> statement-breakpoint
CREATE TABLE `__new_reviews` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`userId` integer NOT NULL,
	`serviceType` text NOT NULL,
	`serviceId` integer NOT NULL,
	`rating` integer NOT NULL,
	`comment` text,
	`isVerified` integer DEFAULT false,
	`helpfulCount` integer DEFAULT 0,
	`createdAt` text DEFAULT 'CURRENT_TIMESTAMP' NOT NULL,
	`updatedAt` text DEFAULT 'CURRENT_TIMESTAMP' NOT NULL
);
--> statement-breakpoint
INSERT INTO `__new_reviews`("id", "userId", "serviceType", "serviceId", "rating", "comment", "isVerified", "helpfulCount", "createdAt", "updatedAt") SELECT "id", "userId", "serviceType", "serviceId", "rating", "comment", "isVerified", "helpfulCount", "createdAt", "updatedAt" FROM `reviews`;--> statement-breakpoint
DROP TABLE `reviews`;--> statement-breakpoint
ALTER TABLE `__new_reviews` RENAME TO `reviews`;--> statement-breakpoint
CREATE TABLE `__new_room_translations` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`roomId` integer NOT NULL,
	`language` text NOT NULL,
	`name` text NOT NULL,
	`description` text
);
--> statement-breakpoint
INSERT INTO `__new_room_translations`("id", "roomId", "language", "name", "description") SELECT "id", "roomId", "language", "name", "description" FROM `room_translations`;--> statement-breakpoint
DROP TABLE `room_translations`;--> statement-breakpoint
ALTER TABLE `__new_room_translations` RENAME TO `room_translations`;--> statement-breakpoint
CREATE UNIQUE INDEX `room_translations_roomId_language_unique` ON `room_translations` (`roomId`,`language`);--> statement-breakpoint
CREATE TABLE `__new_rooms` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`hotelId` integer NOT NULL,
	`name` text NOT NULL,
	`roomNumber` text NOT NULL,
	`description` text,
	`roomType` text NOT NULL,
	`capacity` integer NOT NULL,
	`size` real,
	`pricePerNight` real NOT NULL,
	`currency` text DEFAULT 'USD',
	`bedType` text,
	`bedCount` integer DEFAULT 1,
	`bathroomCount` integer DEFAULT 1,
	`amenities` text,
	`images` text,
	`isAvailable` integer DEFAULT true,
	`maxOccupancy` integer DEFAULT 2,
	`createdAt` text DEFAULT 'CURRENT_TIMESTAMP' NOT NULL,
	`updatedAt` text DEFAULT 'CURRENT_TIMESTAMP' NOT NULL
);
--> statement-breakpoint
INSERT INTO `__new_rooms`("id", "hotelId", "name", "roomNumber", "description", "roomType", "capacity", "size", "pricePerNight", "currency", "bedType", "bedCount", "bathroomCount", "amenities", "images", "isAvailable", "maxOccupancy", "createdAt", "updatedAt") SELECT "id", "hotelId", "name", "roomNumber", "description", "roomType", "capacity", "size", "pricePerNight", "currency", "bedType", "bedCount", "bathroomCount", "amenities", "images", "isAvailable", "maxOccupancy", "createdAt", "updatedAt" FROM `rooms`;--> statement-breakpoint
DROP TABLE `rooms`;--> statement-breakpoint
ALTER TABLE `__new_rooms` RENAME TO `rooms`;--> statement-breakpoint
CREATE UNIQUE INDEX `rooms_hotelId_roomNumber_unique` ON `rooms` (`hotelId`,`roomNumber`);--> statement-breakpoint
CREATE TABLE `__new_special_tour_requests` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`userId` integer NOT NULL,
	`title` text NOT NULL,
	`description` text NOT NULL,
	`preferredDates` text,
	`numberOfPeople` integer NOT NULL,
	`budget` real,
	`currency` text DEFAULT 'USD',
	`destinations` text,
	`specialRequirements` text,
	`status` text DEFAULT 'PENDING' NOT NULL,
	`assignedGuideId` integer,
	`response` text,
	`respondedAt` text,
	`createdAt` text DEFAULT 'CURRENT_TIMESTAMP' NOT NULL,
	`updatedAt` text DEFAULT 'CURRENT_TIMESTAMP' NOT NULL
);
--> statement-breakpoint
INSERT INTO `__new_special_tour_requests`("id", "userId", "title", "description", "preferredDates", "numberOfPeople", "budget", "currency", "destinations", "specialRequirements", "status", "assignedGuideId", "response", "respondedAt", "createdAt", "updatedAt") SELECT "id", "userId", "title", "description", "preferredDates", "numberOfPeople", "budget", "currency", "destinations", "specialRequirements", "status", "assignedGuideId", "response", "respondedAt", "createdAt", "updatedAt" FROM `special_tour_requests`;--> statement-breakpoint
DROP TABLE `special_tour_requests`;--> statement-breakpoint
ALTER TABLE `__new_special_tour_requests` RENAME TO `special_tour_requests`;--> statement-breakpoint
CREATE TABLE `__new_system_settings` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`key` text NOT NULL,
	`value` text NOT NULL,
	`description` text,
	`type` text DEFAULT 'STRING',
	`isPublic` integer DEFAULT false,
	`createdAt` text DEFAULT 'CURRENT_TIMESTAMP' NOT NULL,
	`updatedAt` text DEFAULT 'CURRENT_TIMESTAMP' NOT NULL
);
--> statement-breakpoint
INSERT INTO `__new_system_settings`("id", "key", "value", "description", "type", "isPublic", "createdAt", "updatedAt") SELECT "id", "key", "value", "description", "type", "isPublic", "createdAt", "updatedAt" FROM `system_settings`;--> statement-breakpoint
DROP TABLE `system_settings`;--> statement-breakpoint
ALTER TABLE `__new_system_settings` RENAME TO `system_settings`;--> statement-breakpoint
CREATE UNIQUE INDEX `system_settings_key_unique` ON `system_settings` (`key`);--> statement-breakpoint
CREATE TABLE `__new_tour_guide_translations` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`guideId` integer NOT NULL,
	`language` text NOT NULL,
	`bio` text,
	`specialties` text
);
--> statement-breakpoint
INSERT INTO `__new_tour_guide_translations`("id", "guideId", "language", "bio", "specialties") SELECT "id", "guideId", "language", "bio", "specialties" FROM `tour_guide_translations`;--> statement-breakpoint
DROP TABLE `tour_guide_translations`;--> statement-breakpoint
ALTER TABLE `__new_tour_guide_translations` RENAME TO `tour_guide_translations`;--> statement-breakpoint
CREATE UNIQUE INDEX `tour_guide_translations_guideId_language_unique` ON `tour_guide_translations` (`guideId`,`language`);--> statement-breakpoint
CREATE TABLE `__new_tour_guides` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`userId` integer NOT NULL,
	`bio` text,
	`experience` integer,
	`languages` text,
	`specialties` text,
	`baseLocation` text,
	`serviceAreas` text,
	`isAvailable` integer DEFAULT true,
	`isVerified` integer DEFAULT false,
	`hourlyRate` real,
	`dailyRate` real,
	`currency` text DEFAULT 'USD',
	`profileImage` text,
	`certifications` text,
	`createdAt` text DEFAULT 'CURRENT_TIMESTAMP' NOT NULL,
	`updatedAt` text DEFAULT 'CURRENT_TIMESTAMP' NOT NULL
);
--> statement-breakpoint
INSERT INTO `__new_tour_guides`("id", "userId", "bio", "experience", "languages", "specialties", "baseLocation", "serviceAreas", "isAvailable", "isVerified", "hourlyRate", "dailyRate", "currency", "profileImage", "certifications", "createdAt", "updatedAt") SELECT "id", "userId", "bio", "experience", "languages", "specialties", "baseLocation", "serviceAreas", "isAvailable", "isVerified", "hourlyRate", "dailyRate", "currency", "profileImage", "certifications", "createdAt", "updatedAt" FROM `tour_guides`;--> statement-breakpoint
DROP TABLE `tour_guides`;--> statement-breakpoint
ALTER TABLE `__new_tour_guides` RENAME TO `tour_guides`;--> statement-breakpoint
CREATE TABLE `__new_tour_translations` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`tourId` integer NOT NULL,
	`language` text NOT NULL,
	`name` text NOT NULL,
	`description` text,
	`itinerary` text,
	`included` text,
	`notIncluded` text,
	`requirements` text
);
--> statement-breakpoint
INSERT INTO `__new_tour_translations`("id", "tourId", "language", "name", "description", "itinerary", "included", "notIncluded", "requirements") SELECT "id", "tourId", "language", "name", "description", "itinerary", "included", "notIncluded", "requirements" FROM `tour_translations`;--> statement-breakpoint
DROP TABLE `tour_translations`;--> statement-breakpoint
ALTER TABLE `__new_tour_translations` RENAME TO `tour_translations`;--> statement-breakpoint
CREATE UNIQUE INDEX `tour_translations_tourId_language_unique` ON `tour_translations` (`tourId`,`language`);--> statement-breakpoint
CREATE TABLE `__new_tourism_site_translations` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`siteId` integer NOT NULL,
	`language` text NOT NULL,
	`name` text NOT NULL,
	`description` text
);
--> statement-breakpoint
INSERT INTO `__new_tourism_site_translations`("id", "siteId", "language", "name", "description") SELECT "id", "siteId", "language", "name", "description" FROM `tourism_site_translations`;--> statement-breakpoint
DROP TABLE `tourism_site_translations`;--> statement-breakpoint
ALTER TABLE `__new_tourism_site_translations` RENAME TO `tourism_site_translations`;--> statement-breakpoint
CREATE UNIQUE INDEX `tourism_site_translations_siteId_language_unique` ON `tourism_site_translations` (`siteId`,`language`);--> statement-breakpoint
CREATE TABLE `__new_tourism_sites` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`name` text NOT NULL,
	`description` text,
	`category` text NOT NULL,
	`address` text NOT NULL,
	`city` text NOT NULL,
	`latitude` real,
	`longitude` real,
	`images` text,
	`openingHours` text,
	`entryFee` real,
	`currency` text DEFAULT 'USD',
	`contactPhone` text,
	`contactEmail` text,
	`website` text,
	`isActive` integer DEFAULT true,
	`isVerified` integer DEFAULT false,
	`rating` real DEFAULT 0,
	`reviewCount` integer DEFAULT 0,
	`createdAt` text DEFAULT 'CURRENT_TIMESTAMP' NOT NULL,
	`updatedAt` text DEFAULT 'CURRENT_TIMESTAMP' NOT NULL
);
--> statement-breakpoint
INSERT INTO `__new_tourism_sites`("id", "name", "description", "category", "address", "city", "latitude", "longitude", "images", "openingHours", "entryFee", "currency", "contactPhone", "contactEmail", "website", "isActive", "isVerified", "rating", "reviewCount", "createdAt", "updatedAt") SELECT "id", "name", "description", "category", "address", "city", "latitude", "longitude", "images", "openingHours", "entryFee", "currency", "contactPhone", "contactEmail", "website", "isActive", "isVerified", "rating", "reviewCount", "createdAt", "updatedAt" FROM `tourism_sites`;--> statement-breakpoint
DROP TABLE `tourism_sites`;--> statement-breakpoint
ALTER TABLE `__new_tourism_sites` RENAME TO `tourism_sites`;--> statement-breakpoint
CREATE TABLE `__new_tours` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`name` text NOT NULL,
	`description` text,
	`category` text NOT NULL,
	`duration` integer NOT NULL,
	`maxGroupSize` integer DEFAULT 10,
	`price` real NOT NULL,
	`currency` text DEFAULT 'USD',
	`guideId` integer NOT NULL,
	`startLocation` text NOT NULL,
	`endLocation` text NOT NULL,
	`itinerary` text,
	`included` text,
	`notIncluded` text,
	`requirements` text,
	`images` text,
	`isActive` integer DEFAULT true,
	`isVerified` integer DEFAULT false,
	`isSpecialOffer` integer DEFAULT false,
	`rating` real DEFAULT 0,
	`reviewCount` integer DEFAULT 0,
	`startDate` text NOT NULL,
	`endDate` text NOT NULL,
	`capacity` integer DEFAULT 10,
	`createdAt` text DEFAULT 'CURRENT_TIMESTAMP' NOT NULL,
	`updatedAt` text DEFAULT 'CURRENT_TIMESTAMP' NOT NULL
);
--> statement-breakpoint
INSERT INTO `__new_tours`("id", "name", "description", "category", "duration", "maxGroupSize", "price", "currency", "guideId", "startLocation", "endLocation", "itinerary", "included", "notIncluded", "requirements", "images", "isActive", "isVerified", "isSpecialOffer", "rating", "reviewCount", "startDate", "endDate", "capacity", "createdAt", "updatedAt") SELECT "id", "name", "description", "category", "duration", "maxGroupSize", "price", "currency", "guideId", "startLocation", "endLocation", "itinerary", "included", "notIncluded", "requirements", "images", "isActive", "isVerified", "isSpecialOffer", "rating", "reviewCount", "startDate", "endDate", "capacity", "createdAt", "updatedAt" FROM `tours`;--> statement-breakpoint
DROP TABLE `tours`;--> statement-breakpoint
ALTER TABLE `__new_tours` RENAME TO `tours`;--> statement-breakpoint
CREATE TABLE `__new_umrah_packages` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`name` text NOT NULL,
	`description` text,
	`providerId` integer NOT NULL,
	`duration` integer NOT NULL,
	`price` real NOT NULL,
	`currency` text DEFAULT 'USD',
	`maxPilgrims` integer,
	`currentPilgrims` integer DEFAULT 0,
	`startDate` text NOT NULL,
	`endDate` text NOT NULL,
	`isActive` integer DEFAULT true,
	`isVerified` integer DEFAULT false,
	`createdAt` text DEFAULT 'CURRENT_TIMESTAMP' NOT NULL,
	`updatedAt` text DEFAULT 'CURRENT_TIMESTAMP' NOT NULL
);
--> statement-breakpoint
INSERT INTO `__new_umrah_packages`("id", "name", "description", "providerId", "duration", "price", "currency", "maxPilgrims", "currentPilgrims", "startDate", "endDate", "isActive", "isVerified", "createdAt", "updatedAt") SELECT "id", "name", "description", "providerId", "duration", "price", "currency", "maxPilgrims", "currentPilgrims", "startDate", "endDate", "isActive", "isVerified", "createdAt", "updatedAt" FROM `umrah_packages`;--> statement-breakpoint
DROP TABLE `umrah_packages`;--> statement-breakpoint
ALTER TABLE `__new_umrah_packages` RENAME TO `umrah_packages`;--> statement-breakpoint
CREATE TABLE `__new_umrah_requests` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`userId` integer NOT NULL,
	`packageId` integer NOT NULL,
	`numberOfPilgrims` integer NOT NULL,
	`preferredDates` text,
	`specialRequirements` text,
	`status` text DEFAULT 'PENDING' NOT NULL,
	`totalPrice` real NOT NULL,
	`currency` text DEFAULT 'USD',
	`contactPhone` text,
	`contactEmail` text,
	`createdAt` text DEFAULT 'CURRENT_TIMESTAMP' NOT NULL,
	`updatedAt` text DEFAULT 'CURRENT_TIMESTAMP' NOT NULL
);
--> statement-breakpoint
INSERT INTO `__new_umrah_requests`("id", "userId", "packageId", "numberOfPilgrims", "preferredDates", "specialRequirements", "status", "totalPrice", "currency", "contactPhone", "contactEmail", "createdAt", "updatedAt") SELECT "id", "userId", "packageId", "numberOfPilgrims", "preferredDates", "specialRequirements", "status", "totalPrice", "currency", "contactPhone", "contactEmail", "createdAt", "updatedAt" FROM `umrah_requests`;--> statement-breakpoint
DROP TABLE `umrah_requests`;--> statement-breakpoint
ALTER TABLE `__new_umrah_requests` RENAME TO `umrah_requests`;--> statement-breakpoint
CREATE TABLE `__new_website_settings` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`siteName` text NOT NULL,
	`siteDescription` text,
	`siteKeywords` text,
	`siteLogo` text,
	`siteFavicon` text,
	`contactEmail` text,
	`contactPhone` text,
	`contactAddress` text,
	`socialFacebook` text,
	`socialTwitter` text,
	`socialInstagram` text,
	`socialLinkedin` text,
	`socialYoutube` text,
	`googleAnalyticsId` text,
	`googleMapsApiKey` text,
	`stripePublicKey` text,
	`stripeSecretKey` text,
	`paypalClientId` text,
	`paypalSecret` text,
	`smtpHost` text,
	`smtpPort` text,
	`smtpUser` text,
	`smtpPass` text,
	`defaultLanguage` text DEFAULT 'ENGLISH',
	`supportedLanguages` text,
	`maintenanceMode` integer DEFAULT false,
	`maintenanceMessage` text,
	`createdAt` text DEFAULT 'CURRENT_TIMESTAMP' NOT NULL,
	`updatedAt` text DEFAULT 'CURRENT_TIMESTAMP' NOT NULL
);
--> statement-breakpoint
INSERT INTO `__new_website_settings`("id", "siteName", "siteDescription", "siteKeywords", "siteLogo", "siteFavicon", "contactEmail", "contactPhone", "contactAddress", "socialFacebook", "socialTwitter", "socialInstagram", "socialLinkedin", "socialYoutube", "googleAnalyticsId", "googleMapsApiKey", "stripePublicKey", "stripeSecretKey", "paypalClientId", "paypalSecret", "smtpHost", "smtpPort", "smtpUser", "smtpPass", "defaultLanguage", "supportedLanguages", "maintenanceMode", "maintenanceMessage", "createdAt", "updatedAt") SELECT "id", "siteName", "siteDescription", "siteKeywords", "siteLogo", "siteFavicon", "contactEmail", "contactPhone", "contactAddress", "socialFacebook", "socialTwitter", "socialInstagram", "socialLinkedin", "socialYoutube", "googleAnalyticsId", "googleMapsApiKey", "stripePublicKey", "stripeSecretKey", "paypalClientId", "paypalSecret", "smtpHost", "smtpPort", "smtpUser", "smtpPass", "defaultLanguage", "supportedLanguages", "maintenanceMode", "maintenanceMessage", "createdAt", "updatedAt" FROM `website_settings`;--> statement-breakpoint
DROP TABLE `website_settings`;--> statement-breakpoint
ALTER TABLE `__new_website_settings` RENAME TO `website_settings`;