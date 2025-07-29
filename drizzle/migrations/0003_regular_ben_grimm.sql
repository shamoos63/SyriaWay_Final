CREATE TABLE `tourism_news` (
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
	`isFeatured` integer DEFAULT false,
	`seoTitle` text,
	`seoDescription` text,
	`seoKeywords` text,
	`slug` text,
	`createdAt` text DEFAULT CURRENT_TIMESTAMP NOT NULL,
	`updatedAt` text DEFAULT CURRENT_TIMESTAMP NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `tourism_news_slug_unique` ON `tourism_news` (`slug`);--> statement-breakpoint
CREATE TABLE `tourism_news_translations` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`newsId` integer NOT NULL,
	`language` text NOT NULL,
	`title` text NOT NULL,
	`content` text NOT NULL,
	`excerpt` text,
	`seoTitle` text,
	`seoDescription` text,
	`seoKeywords` text
);
--> statement-breakpoint
CREATE UNIQUE INDEX `tourism_news_translations_newsId_language_unique` ON `tourism_news_translations` (`newsId`,`language`);--> statement-breakpoint
CREATE TABLE `umrah_package_translations` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`packageId` integer NOT NULL,
	`language` text NOT NULL,
	`name` text NOT NULL,
	`description` text
);
--> statement-breakpoint
CREATE UNIQUE INDEX `umrah_package_translations_packageId_language_unique` ON `umrah_package_translations` (`packageId`,`language`);--> statement-breakpoint
DROP INDEX "accounts_provider_providerAccountId_unique";--> statement-breakpoint
DROP INDEX "blog_reactions_blogId_userId_unique";--> statement-breakpoint
DROP INDEX "blog_translations_blogId_language_unique";--> statement-breakpoint
DROP INDEX "blogs_slug_unique";--> statement-breakpoint
DROP INDEX "bundle_translations_bundleId_language_unique";--> statement-breakpoint
DROP INDEX "car_translations_carId_language_unique";--> statement-breakpoint
DROP INDEX "cars_licensePlate_unique";--> statement-breakpoint
DROP INDEX "educational_program_translations_programId_language_unique";--> statement-breakpoint
DROP INDEX "health_service_translations_serviceId_language_unique";--> statement-breakpoint
DROP INDEX "hotel_settings_ownerId_unique";--> statement-breakpoint
DROP INDEX "hotel_translations_hotelId_language_unique";--> statement-breakpoint
DROP INDEX "offer_translations_offerId_language_unique";--> statement-breakpoint
DROP INDEX "room_translations_roomId_language_unique";--> statement-breakpoint
DROP INDEX "rooms_hotelId_roomNumber_unique";--> statement-breakpoint
DROP INDEX "sessions_sessionToken_unique";--> statement-breakpoint
DROP INDEX "system_settings_key_unique";--> statement-breakpoint
DROP INDEX "tour_guide_translations_guideId_language_unique";--> statement-breakpoint
DROP INDEX "tour_translations_tourId_language_unique";--> statement-breakpoint
DROP INDEX "tourism_news_slug_unique";--> statement-breakpoint
DROP INDEX "tourism_news_translations_newsId_language_unique";--> statement-breakpoint
DROP INDEX "tourism_site_translations_siteId_language_unique";--> statement-breakpoint
DROP INDEX "umrah_package_translations_packageId_language_unique";--> statement-breakpoint
DROP INDEX "users_email_unique";--> statement-breakpoint
DROP INDEX "users_googleId_unique";--> statement-breakpoint
DROP INDEX "verificationtokens_token_unique";--> statement-breakpoint
DROP INDEX "verificationtokens_identifier_token_unique";--> statement-breakpoint
ALTER TABLE `blog_reactions` ALTER COLUMN "createdAt" TO "createdAt" text NOT NULL DEFAULT CURRENT_TIMESTAMP;--> statement-breakpoint
CREATE UNIQUE INDEX `accounts_provider_providerAccountId_unique` ON `accounts` (`provider`,`providerAccountId`);--> statement-breakpoint
CREATE UNIQUE INDEX `blog_reactions_blogId_userId_unique` ON `blog_reactions` (`blogId`,`userId`);--> statement-breakpoint
CREATE UNIQUE INDEX `blog_translations_blogId_language_unique` ON `blog_translations` (`blogId`,`language`);--> statement-breakpoint
CREATE UNIQUE INDEX `blogs_slug_unique` ON `blogs` (`slug`);--> statement-breakpoint
CREATE UNIQUE INDEX `bundle_translations_bundleId_language_unique` ON `bundle_translations` (`bundleId`,`language`);--> statement-breakpoint
CREATE UNIQUE INDEX `car_translations_carId_language_unique` ON `car_translations` (`carId`,`language`);--> statement-breakpoint
CREATE UNIQUE INDEX `cars_licensePlate_unique` ON `cars` (`licensePlate`);--> statement-breakpoint
CREATE UNIQUE INDEX `educational_program_translations_programId_language_unique` ON `educational_program_translations` (`programId`,`language`);--> statement-breakpoint
CREATE UNIQUE INDEX `health_service_translations_serviceId_language_unique` ON `health_service_translations` (`serviceId`,`language`);--> statement-breakpoint
CREATE UNIQUE INDEX `hotel_settings_ownerId_unique` ON `hotel_settings` (`ownerId`);--> statement-breakpoint
CREATE UNIQUE INDEX `hotel_translations_hotelId_language_unique` ON `hotel_translations` (`hotelId`,`language`);--> statement-breakpoint
CREATE UNIQUE INDEX `offer_translations_offerId_language_unique` ON `offer_translations` (`offerId`,`language`);--> statement-breakpoint
CREATE UNIQUE INDEX `room_translations_roomId_language_unique` ON `room_translations` (`roomId`,`language`);--> statement-breakpoint
CREATE UNIQUE INDEX `rooms_hotelId_roomNumber_unique` ON `rooms` (`hotelId`,`roomNumber`);--> statement-breakpoint
CREATE UNIQUE INDEX `sessions_sessionToken_unique` ON `sessions` (`sessionToken`);--> statement-breakpoint
CREATE UNIQUE INDEX `system_settings_key_unique` ON `system_settings` (`key`);--> statement-breakpoint
CREATE UNIQUE INDEX `tour_guide_translations_guideId_language_unique` ON `tour_guide_translations` (`guideId`,`language`);--> statement-breakpoint
CREATE UNIQUE INDEX `tour_translations_tourId_language_unique` ON `tour_translations` (`tourId`,`language`);--> statement-breakpoint
CREATE UNIQUE INDEX `tourism_site_translations_siteId_language_unique` ON `tourism_site_translations` (`siteId`,`language`);--> statement-breakpoint
CREATE UNIQUE INDEX `users_email_unique` ON `users` (`email`);--> statement-breakpoint
CREATE UNIQUE INDEX `users_googleId_unique` ON `users` (`googleId`);--> statement-breakpoint
CREATE UNIQUE INDEX `verificationtokens_token_unique` ON `verificationtokens` (`token`);--> statement-breakpoint
CREATE UNIQUE INDEX `verificationtokens_identifier_token_unique` ON `verificationtokens` (`identifier`,`token`);--> statement-breakpoint
ALTER TABLE `blogs` ALTER COLUMN "createdAt" TO "createdAt" text NOT NULL DEFAULT CURRENT_TIMESTAMP;--> statement-breakpoint
ALTER TABLE `blogs` ALTER COLUMN "updatedAt" TO "updatedAt" text NOT NULL DEFAULT CURRENT_TIMESTAMP;--> statement-breakpoint
ALTER TABLE `bookings` ALTER COLUMN "createdAt" TO "createdAt" text NOT NULL DEFAULT CURRENT_TIMESTAMP;--> statement-breakpoint
ALTER TABLE `bookings` ALTER COLUMN "updatedAt" TO "updatedAt" text NOT NULL DEFAULT CURRENT_TIMESTAMP;--> statement-breakpoint
ALTER TABLE `bundles` ALTER COLUMN "createdAt" TO "createdAt" text NOT NULL DEFAULT CURRENT_TIMESTAMP;--> statement-breakpoint
ALTER TABLE `bundles` ALTER COLUMN "updatedAt" TO "updatedAt" text NOT NULL DEFAULT CURRENT_TIMESTAMP;--> statement-breakpoint
ALTER TABLE `cars` ALTER COLUMN "createdAt" TO "createdAt" text NOT NULL DEFAULT CURRENT_TIMESTAMP;--> statement-breakpoint
ALTER TABLE `cars` ALTER COLUMN "updatedAt" TO "updatedAt" text NOT NULL DEFAULT CURRENT_TIMESTAMP;--> statement-breakpoint
ALTER TABLE `contact_forms` ALTER COLUMN "createdAt" TO "createdAt" text NOT NULL DEFAULT CURRENT_TIMESTAMP;--> statement-breakpoint
ALTER TABLE `contact_forms` ALTER COLUMN "updatedAt" TO "updatedAt" text NOT NULL DEFAULT CURRENT_TIMESTAMP;--> statement-breakpoint
ALTER TABLE `educational_programs` ALTER COLUMN "createdAt" TO "createdAt" text NOT NULL DEFAULT CURRENT_TIMESTAMP;--> statement-breakpoint
ALTER TABLE `educational_programs` ALTER COLUMN "updatedAt" TO "updatedAt" text NOT NULL DEFAULT CURRENT_TIMESTAMP;--> statement-breakpoint
ALTER TABLE `health_services` ALTER COLUMN "createdAt" TO "createdAt" text NOT NULL DEFAULT CURRENT_TIMESTAMP;--> statement-breakpoint
ALTER TABLE `health_services` ALTER COLUMN "updatedAt" TO "updatedAt" text NOT NULL DEFAULT CURRENT_TIMESTAMP;--> statement-breakpoint
ALTER TABLE `hotel_settings` ALTER COLUMN "createdAt" TO "createdAt" text NOT NULL DEFAULT CURRENT_TIMESTAMP;--> statement-breakpoint
ALTER TABLE `hotel_settings` ALTER COLUMN "updatedAt" TO "updatedAt" text NOT NULL DEFAULT CURRENT_TIMESTAMP;--> statement-breakpoint
ALTER TABLE `hotels` ALTER COLUMN "createdAt" TO "createdAt" text NOT NULL DEFAULT CURRENT_TIMESTAMP;--> statement-breakpoint
ALTER TABLE `hotels` ALTER COLUMN "updatedAt" TO "updatedAt" text NOT NULL DEFAULT CURRENT_TIMESTAMP;--> statement-breakpoint
ALTER TABLE `notifications` ALTER COLUMN "createdAt" TO "createdAt" text NOT NULL DEFAULT CURRENT_TIMESTAMP;--> statement-breakpoint
ALTER TABLE `offers` ALTER COLUMN "createdAt" TO "createdAt" text NOT NULL DEFAULT CURRENT_TIMESTAMP;--> statement-breakpoint
ALTER TABLE `offers` ALTER COLUMN "updatedAt" TO "updatedAt" text NOT NULL DEFAULT CURRENT_TIMESTAMP;--> statement-breakpoint
ALTER TABLE `reviews` ALTER COLUMN "createdAt" TO "createdAt" text NOT NULL DEFAULT CURRENT_TIMESTAMP;--> statement-breakpoint
ALTER TABLE `reviews` ALTER COLUMN "updatedAt" TO "updatedAt" text NOT NULL DEFAULT CURRENT_TIMESTAMP;--> statement-breakpoint
ALTER TABLE `rooms` ALTER COLUMN "createdAt" TO "createdAt" text NOT NULL DEFAULT CURRENT_TIMESTAMP;--> statement-breakpoint
ALTER TABLE `rooms` ALTER COLUMN "updatedAt" TO "updatedAt" text NOT NULL DEFAULT CURRENT_TIMESTAMP;--> statement-breakpoint
ALTER TABLE `special_tour_requests` ALTER COLUMN "createdAt" TO "createdAt" text NOT NULL DEFAULT CURRENT_TIMESTAMP;--> statement-breakpoint
ALTER TABLE `special_tour_requests` ALTER COLUMN "updatedAt" TO "updatedAt" text NOT NULL DEFAULT CURRENT_TIMESTAMP;--> statement-breakpoint
ALTER TABLE `system_settings` ALTER COLUMN "createdAt" TO "createdAt" text NOT NULL DEFAULT CURRENT_TIMESTAMP;--> statement-breakpoint
ALTER TABLE `system_settings` ALTER COLUMN "updatedAt" TO "updatedAt" text NOT NULL DEFAULT CURRENT_TIMESTAMP;--> statement-breakpoint
ALTER TABLE `tour_guides` ALTER COLUMN "createdAt" TO "createdAt" text NOT NULL DEFAULT CURRENT_TIMESTAMP;--> statement-breakpoint
ALTER TABLE `tour_guides` ALTER COLUMN "updatedAt" TO "updatedAt" text NOT NULL DEFAULT CURRENT_TIMESTAMP;--> statement-breakpoint
ALTER TABLE `tourism_sites` ALTER COLUMN "createdAt" TO "createdAt" text NOT NULL DEFAULT CURRENT_TIMESTAMP;--> statement-breakpoint
ALTER TABLE `tourism_sites` ALTER COLUMN "updatedAt" TO "updatedAt" text NOT NULL DEFAULT CURRENT_TIMESTAMP;--> statement-breakpoint
ALTER TABLE `tours` ALTER COLUMN "createdAt" TO "createdAt" text NOT NULL DEFAULT CURRENT_TIMESTAMP;--> statement-breakpoint
ALTER TABLE `tours` ALTER COLUMN "updatedAt" TO "updatedAt" text NOT NULL DEFAULT CURRENT_TIMESTAMP;--> statement-breakpoint
ALTER TABLE `umrah_packages` ALTER COLUMN "createdAt" TO "createdAt" text NOT NULL DEFAULT CURRENT_TIMESTAMP;--> statement-breakpoint
ALTER TABLE `umrah_packages` ALTER COLUMN "updatedAt" TO "updatedAt" text NOT NULL DEFAULT CURRENT_TIMESTAMP;--> statement-breakpoint
ALTER TABLE `umrah_requests` ALTER COLUMN "createdAt" TO "createdAt" text NOT NULL DEFAULT CURRENT_TIMESTAMP;--> statement-breakpoint
ALTER TABLE `umrah_requests` ALTER COLUMN "updatedAt" TO "updatedAt" text NOT NULL DEFAULT CURRENT_TIMESTAMP;--> statement-breakpoint
ALTER TABLE `users` ALTER COLUMN "createdAt" TO "createdAt" text NOT NULL DEFAULT CURRENT_TIMESTAMP;--> statement-breakpoint
ALTER TABLE `users` ALTER COLUMN "updatedAt" TO "updatedAt" text NOT NULL DEFAULT CURRENT_TIMESTAMP;--> statement-breakpoint
ALTER TABLE `website_settings` ALTER COLUMN "createdAt" TO "createdAt" text NOT NULL DEFAULT CURRENT_TIMESTAMP;--> statement-breakpoint
ALTER TABLE `website_settings` ALTER COLUMN "updatedAt" TO "updatedAt" text NOT NULL DEFAULT CURRENT_TIMESTAMP;