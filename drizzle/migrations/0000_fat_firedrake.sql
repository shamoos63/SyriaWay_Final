CREATE TABLE `accounts` (
	`id` text PRIMARY KEY NOT NULL,
	`userId` text NOT NULL,
	`type` text NOT NULL,
	`provider` text NOT NULL,
	`providerAccountId` text NOT NULL,
	`refresh_token` text,
	`access_token` text,
	`expires_at` integer,
	`token_type` text,
	`scope` text,
	`id_token` text,
	`session_state` text
);
--> statement-breakpoint
CREATE UNIQUE INDEX `accounts_provider_providerAccountId_unique` ON `accounts` (`provider`,`providerAccountId`);--> statement-breakpoint
CREATE TABLE `blog_reactions` (
	`id` text PRIMARY KEY NOT NULL,
	`blogId` text NOT NULL,
	`userId` text NOT NULL,
	`reaction` text NOT NULL,
	`createdAt` text DEFAULT 'CURRENT_TIMESTAMP' NOT NULL,
	`updatedAt` text DEFAULT 'CURRENT_TIMESTAMP' NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `blog_reactions_blogId_userId_unique` ON `blog_reactions` (`blogId`,`userId`);--> statement-breakpoint
CREATE TABLE `blog_translations` (
	`id` text PRIMARY KEY NOT NULL,
	`blogId` text NOT NULL,
	`language` text NOT NULL,
	`title` text NOT NULL,
	`slug` text NOT NULL,
	`excerpt` text,
	`content` text NOT NULL,
	`metaTitle` text,
	`metaDescription` text
);
--> statement-breakpoint
CREATE UNIQUE INDEX `blog_translations_blogId_language_unique` ON `blog_translations` (`blogId`,`language`);--> statement-breakpoint
CREATE UNIQUE INDEX `blog_translations_slug_language_unique` ON `blog_translations` (`slug`,`language`);--> statement-breakpoint
CREATE TABLE `blogs` (
	`id` text PRIMARY KEY NOT NULL,
	`authorId` text NOT NULL,
	`title` text NOT NULL,
	`slug` text NOT NULL,
	`excerpt` text,
	`content` text NOT NULL,
	`metaTitle` text,
	`metaDescription` text,
	`keywords` text,
	`featuredImage` text,
	`images` text,
	`category` text,
	`tags` text,
	`status` text DEFAULT 'DRAFT',
	`isPublished` integer DEFAULT false,
	`isFeatured` integer DEFAULT false,
	`likes` integer DEFAULT 0,
	`dislikes` integer DEFAULT 0,
	`views` integer DEFAULT 0,
	`submittedAt` text,
	`approvedAt` text,
	`approvedBy` text,
	`rejectedAt` text,
	`rejectedBy` text,
	`rejectionReason` text,
	`publishedAt` text,
	`createdAt` text DEFAULT 'CURRENT_TIMESTAMP' NOT NULL,
	`updatedAt` text DEFAULT 'CURRENT_TIMESTAMP' NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `blogs_slug_unique` ON `blogs` (`slug`);--> statement-breakpoint
CREATE TABLE `bookings` (
	`id` text PRIMARY KEY NOT NULL,
	`userId` text NOT NULL,
	`serviceType` text NOT NULL,
	`hotelId` text,
	`roomId` text,
	`carId` text,
	`guideId` text,
	`tourId` text,
	`healthServiceId` text,
	`educationalProgramId` text,
	`umrahPackageId` text,
	`bundleId` text,
	`startDate` text NOT NULL,
	`endDate` text NOT NULL,
	`guests` integer DEFAULT 1,
	`totalPrice` real NOT NULL,
	`currency` text DEFAULT 'USD',
	`status` text DEFAULT 'PENDING' NOT NULL,
	`paymentStatus` text DEFAULT 'PENDING' NOT NULL,
	`specialRequests` text,
	`notes` text,
	`contactName` text,
	`contactPhone` text,
	`contactEmail` text,
	`createdAt` text DEFAULT 'CURRENT_TIMESTAMP' NOT NULL,
	`updatedAt` text DEFAULT 'CURRENT_TIMESTAMP' NOT NULL
);
--> statement-breakpoint
CREATE TABLE `bundle_translations` (
	`id` text PRIMARY KEY NOT NULL,
	`bundleId` text NOT NULL,
	`language` text NOT NULL,
	`name` text NOT NULL,
	`description` text,
	`itinerary` text,
	`inclusions` text,
	`exclusions` text
);
--> statement-breakpoint
CREATE UNIQUE INDEX `bundle_translations_bundleId_language_unique` ON `bundle_translations` (`bundleId`,`language`);--> statement-breakpoint
CREATE TABLE `bundles` (
	`id` text PRIMARY KEY NOT NULL,
	`name` text NOT NULL,
	`description` text,
	`duration` integer NOT NULL,
	`maxGuests` integer DEFAULT 2,
	`price` real NOT NULL,
	`originalPrice` real,
	`currency` text DEFAULT 'USD',
	`includesHotel` integer DEFAULT false,
	`includesCar` integer DEFAULT false,
	`includesGuide` integer DEFAULT false,
	`hotelIds` text,
	`carIds` text,
	`guideIds` text,
	`itinerary` text,
	`inclusions` text,
	`exclusions` text,
	`images` text,
	`isActive` integer DEFAULT true,
	`isFeatured` integer DEFAULT false,
	`createdAt` text DEFAULT 'CURRENT_TIMESTAMP' NOT NULL,
	`updatedAt` text DEFAULT 'CURRENT_TIMESTAMP' NOT NULL
);
--> statement-breakpoint
CREATE TABLE `car_translations` (
	`id` text PRIMARY KEY NOT NULL,
	`carId` text NOT NULL,
	`language` text NOT NULL,
	`description` text
);
--> statement-breakpoint
CREATE UNIQUE INDEX `car_translations_carId_language_unique` ON `car_translations` (`carId`,`language`);--> statement-breakpoint
CREATE TABLE `cars` (
	`id` text PRIMARY KEY NOT NULL,
	`brand` text NOT NULL,
	`model` text NOT NULL,
	`year` integer NOT NULL,
	`color` text NOT NULL,
	`licensePlate` text NOT NULL,
	`ownerId` text NOT NULL,
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
CREATE UNIQUE INDEX `cars_licensePlate_unique` ON `cars` (`licensePlate`);--> statement-breakpoint
CREATE TABLE `contact_forms` (
	`id` text PRIMARY KEY NOT NULL,
	`name` text NOT NULL,
	`email` text NOT NULL,
	`phone` text,
	`subject` text NOT NULL,
	`message` text NOT NULL,
	`userId` text,
	`category` text,
	`priority` text DEFAULT 'Normal',
	`status` text DEFAULT 'New',
	`assignedTo` text,
	`response` text,
	`respondedAt` text,
	`respondedBy` text,
	`createdAt` text DEFAULT 'CURRENT_TIMESTAMP' NOT NULL,
	`updatedAt` text DEFAULT 'CURRENT_TIMESTAMP' NOT NULL
);
--> statement-breakpoint
CREATE TABLE `educational_program_translations` (
	`id` text PRIMARY KEY NOT NULL,
	`programId` text NOT NULL,
	`language` text NOT NULL,
	`name` text NOT NULL,
	`description` text
);
--> statement-breakpoint
CREATE UNIQUE INDEX `educational_program_translations_programId_language_unique` ON `educational_program_translations` (`programId`,`language`);--> statement-breakpoint
CREATE TABLE `educational_programs` (
	`id` text PRIMARY KEY NOT NULL,
	`name` text NOT NULL,
	`description` text,
	`category` text NOT NULL,
	`duration` text NOT NULL,
	`level` text,
	`institution` text NOT NULL,
	`location` text NOT NULL,
	`price` real NOT NULL,
	`currency` text DEFAULT 'USD',
	`startDates` text,
	`maxStudents` integer DEFAULT 20,
	`images` text,
	`isActive` integer DEFAULT true,
	`createdAt` text DEFAULT 'CURRENT_TIMESTAMP' NOT NULL,
	`updatedAt` text DEFAULT 'CURRENT_TIMESTAMP' NOT NULL
);
--> statement-breakpoint
CREATE TABLE `health_service_translations` (
	`id` text PRIMARY KEY NOT NULL,
	`serviceId` text NOT NULL,
	`language` text NOT NULL,
	`name` text NOT NULL,
	`description` text
);
--> statement-breakpoint
CREATE UNIQUE INDEX `health_service_translations_serviceId_language_unique` ON `health_service_translations` (`serviceId`,`language`);--> statement-breakpoint
CREATE TABLE `health_services` (
	`id` text PRIMARY KEY NOT NULL,
	`name` text NOT NULL,
	`description` text,
	`category` text NOT NULL,
	`duration` text,
	`providerName` text NOT NULL,
	`providerAddress` text NOT NULL,
	`providerPhone` text,
	`providerEmail` text,
	`price` real NOT NULL,
	`currency` text DEFAULT 'USD',
	`images` text,
	`isActive` integer DEFAULT true,
	`createdAt` text DEFAULT 'CURRENT_TIMESTAMP' NOT NULL,
	`updatedAt` text DEFAULT 'CURRENT_TIMESTAMP' NOT NULL
);
--> statement-breakpoint
CREATE TABLE `hotel_settings` (
	`id` text PRIMARY KEY NOT NULL,
	`ownerId` text NOT NULL,
	`autoApproveBookings` integer DEFAULT false,
	`maintenanceMode` integer DEFAULT false,
	`requirePasswordChange` integer DEFAULT false,
	`sessionTimeout` integer DEFAULT 30,
	`createdAt` text DEFAULT 'CURRENT_TIMESTAMP' NOT NULL,
	`updatedAt` text DEFAULT 'CURRENT_TIMESTAMP' NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `hotel_settings_ownerId_unique` ON `hotel_settings` (`ownerId`);--> statement-breakpoint
CREATE TABLE `hotel_translations` (
	`id` text PRIMARY KEY NOT NULL,
	`hotelId` text NOT NULL,
	`language` text NOT NULL,
	`name` text NOT NULL,
	`description` text
);
--> statement-breakpoint
CREATE UNIQUE INDEX `hotel_translations_hotelId_language_unique` ON `hotel_translations` (`hotelId`,`language`);--> statement-breakpoint
CREATE TABLE `hotels` (
	`id` text PRIMARY KEY NOT NULL,
	`name` text NOT NULL,
	`description` text,
	`address` text NOT NULL,
	`city` text NOT NULL,
	`phone` text,
	`email` text,
	`website` text,
	`ownerId` text NOT NULL,
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
CREATE TABLE `notifications` (
	`id` text PRIMARY KEY NOT NULL,
	`userId` text NOT NULL,
	`title` text NOT NULL,
	`message` text NOT NULL,
	`type` text NOT NULL,
	`category` text NOT NULL,
	`relatedId` text,
	`relatedType` text,
	`isRead` integer DEFAULT false,
	`isArchived` integer DEFAULT false,
	`priority` text DEFAULT 'NORMAL',
	`createdAt` text DEFAULT 'CURRENT_TIMESTAMP' NOT NULL,
	`readAt` text
);
--> statement-breakpoint
CREATE TABLE `offer_translations` (
	`id` text PRIMARY KEY NOT NULL,
	`offerId` text NOT NULL,
	`language` text NOT NULL,
	`title` text NOT NULL,
	`description` text
);
--> statement-breakpoint
CREATE UNIQUE INDEX `offer_translations_offerId_language_unique` ON `offer_translations` (`offerId`,`language`);--> statement-breakpoint
CREATE TABLE `offers` (
	`id` text PRIMARY KEY NOT NULL,
	`title` text NOT NULL,
	`description` text,
	`originalPrice` real NOT NULL,
	`discountedPrice` real NOT NULL,
	`discountPercentage` integer NOT NULL,
	`startDate` text NOT NULL,
	`endDate` text NOT NULL,
	`serviceType` text NOT NULL,
	`serviceId` text,
	`image` text,
	`isActive` integer DEFAULT true,
	`isFeatured` integer DEFAULT false,
	`createdAt` text DEFAULT 'CURRENT_TIMESTAMP' NOT NULL,
	`updatedAt` text DEFAULT 'CURRENT_TIMESTAMP' NOT NULL
);
--> statement-breakpoint
CREATE TABLE `reviews` (
	`id` text PRIMARY KEY NOT NULL,
	`userId` text NOT NULL,
	`hotelId` text,
	`carId` text,
	`guideId` text,
	`tourId` text,
	`tourismSiteId` text,
	`bookingId` text,
	`rating` integer NOT NULL,
	`title` text,
	`comment` text,
	`isApproved` integer DEFAULT false,
	`isVerified` integer DEFAULT false,
	`createdAt` text DEFAULT 'CURRENT_TIMESTAMP' NOT NULL,
	`updatedAt` text DEFAULT 'CURRENT_TIMESTAMP' NOT NULL
);
--> statement-breakpoint
CREATE TABLE `room_translations` (
	`id` text PRIMARY KEY NOT NULL,
	`roomId` text NOT NULL,
	`language` text NOT NULL,
	`name` text NOT NULL,
	`description` text
);
--> statement-breakpoint
CREATE UNIQUE INDEX `room_translations_roomId_language_unique` ON `room_translations` (`roomId`,`language`);--> statement-breakpoint
CREATE TABLE `rooms` (
	`id` text PRIMARY KEY NOT NULL,
	`hotelId` text NOT NULL,
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
CREATE UNIQUE INDEX `rooms_hotelId_roomNumber_unique` ON `rooms` (`hotelId`,`roomNumber`);--> statement-breakpoint
CREATE TABLE `sessions` (
	`id` text PRIMARY KEY NOT NULL,
	`sessionToken` text NOT NULL,
	`userId` text NOT NULL,
	`expires` text NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `sessions_sessionToken_unique` ON `sessions` (`sessionToken`);--> statement-breakpoint
CREATE TABLE `special_tour_requests` (
	`id` text PRIMARY KEY NOT NULL,
	`guideId` text,
	`customerName` text NOT NULL,
	`customerEmail` text NOT NULL,
	`customerPhone` text,
	`tourType` text NOT NULL,
	`preferredDates` text,
	`groupSize` integer,
	`specialRequirements` text,
	`budget` real,
	`message` text,
	`status` text DEFAULT 'PENDING',
	`createdAt` text DEFAULT 'CURRENT_TIMESTAMP' NOT NULL,
	`updatedAt` text DEFAULT 'CURRENT_TIMESTAMP' NOT NULL
);
--> statement-breakpoint
CREATE TABLE `system_settings` (
	`id` text PRIMARY KEY NOT NULL,
	`key` text NOT NULL,
	`value` text NOT NULL,
	`description` text,
	`category` text,
	`createdAt` text DEFAULT 'CURRENT_TIMESTAMP' NOT NULL,
	`updatedAt` text DEFAULT 'CURRENT_TIMESTAMP' NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `system_settings_key_unique` ON `system_settings` (`key`);--> statement-breakpoint
CREATE TABLE `tour_guide_translations` (
	`id` text PRIMARY KEY NOT NULL,
	`guideId` text NOT NULL,
	`language` text NOT NULL,
	`bio` text
);
--> statement-breakpoint
CREATE UNIQUE INDEX `tour_guide_translations_guideId_language_unique` ON `tour_guide_translations` (`guideId`,`language`);--> statement-breakpoint
CREATE TABLE `tour_guides` (
	`id` text PRIMARY KEY NOT NULL,
	`userId` text NOT NULL,
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
CREATE TABLE `tour_translations` (
	`id` text PRIMARY KEY NOT NULL,
	`tourId` text NOT NULL,
	`language` text NOT NULL,
	`name` text NOT NULL,
	`description` text,
	`itinerary` text,
	`includes` text,
	`excludes` text
);
--> statement-breakpoint
CREATE UNIQUE INDEX `tour_translations_tourId_language_unique` ON `tour_translations` (`tourId`,`language`);--> statement-breakpoint
CREATE TABLE `tourism_news` (
	`id` text PRIMARY KEY NOT NULL,
	`title` text NOT NULL,
	`content` text NOT NULL,
	`excerpt` text,
	`featuredImage` text,
	`images` text,
	`category` text,
	`tags` text,
	`isPublished` integer DEFAULT false,
	`isFeatured` integer DEFAULT false,
	`publishedAt` text,
	`createdAt` text DEFAULT 'CURRENT_TIMESTAMP' NOT NULL,
	`updatedAt` text DEFAULT 'CURRENT_TIMESTAMP' NOT NULL
);
--> statement-breakpoint
CREATE TABLE `tourism_news_translations` (
	`id` text PRIMARY KEY NOT NULL,
	`newsId` text NOT NULL,
	`language` text NOT NULL,
	`title` text NOT NULL,
	`content` text NOT NULL,
	`excerpt` text
);
--> statement-breakpoint
CREATE UNIQUE INDEX `tourism_news_translations_newsId_language_unique` ON `tourism_news_translations` (`newsId`,`language`);--> statement-breakpoint
CREATE TABLE `tourism_site_translations` (
	`id` text PRIMARY KEY NOT NULL,
	`siteId` text NOT NULL,
	`language` text NOT NULL,
	`name` text NOT NULL,
	`description` text,
	`tips` text
);
--> statement-breakpoint
CREATE UNIQUE INDEX `tourism_site_translations_siteId_language_unique` ON `tourism_site_translations` (`siteId`,`language`);--> statement-breakpoint
CREATE TABLE `tourism_sites` (
	`id` text PRIMARY KEY NOT NULL,
	`name` text NOT NULL,
	`description` text,
	`category` text NOT NULL,
	`subcategory` text,
	`city` text NOT NULL,
	`governorate` text,
	`latitude` real,
	`longitude` real,
	`period` text,
	`religion` text,
	`bestSeason` text,
	`entryFee` real,
	`openingHours` text,
	`images` text,
	`featuredImage` text,
	`tips` text,
	`facilities` text,
	`isActive` integer DEFAULT true,
	`isFeatured` integer DEFAULT false,
	`createdAt` text DEFAULT 'CURRENT_TIMESTAMP' NOT NULL,
	`updatedAt` text DEFAULT 'CURRENT_TIMESTAMP' NOT NULL
);
--> statement-breakpoint
CREATE TABLE `tours` (
	`id` text PRIMARY KEY NOT NULL,
	`name` text NOT NULL,
	`description` text,
	`guideId` text NOT NULL,
	`category` text NOT NULL,
	`duration` integer NOT NULL,
	`capacity` integer DEFAULT 12,
	`startDate` text NOT NULL,
	`endDate` text NOT NULL,
	`maxGroupSize` integer DEFAULT 12,
	`minGroupSize` integer DEFAULT 2,
	`price` real NOT NULL,
	`currency` text DEFAULT 'USD',
	`availableDays` text,
	`startTime` text,
	`endTime` text,
	`startLocation` text NOT NULL,
	`endLocation` text NOT NULL,
	`itinerary` text,
	`includedSites` text,
	`includes` text,
	`excludes` text,
	`images` text,
	`isActive` integer DEFAULT true,
	`isFeatured` integer DEFAULT false,
	`isSpecialOffer` integer DEFAULT false,
	`createdAt` text DEFAULT 'CURRENT_TIMESTAMP' NOT NULL,
	`updatedAt` text DEFAULT 'CURRENT_TIMESTAMP' NOT NULL
);
--> statement-breakpoint
CREATE TABLE `umrah_package_translations` (
	`id` text PRIMARY KEY NOT NULL,
	`packageId` text NOT NULL,
	`language` text NOT NULL,
	`name` text NOT NULL,
	`description` text
);
--> statement-breakpoint
CREATE UNIQUE INDEX `umrah_package_translations_packageId_language_unique` ON `umrah_package_translations` (`packageId`,`language`);--> statement-breakpoint
CREATE TABLE `umrah_packages` (
	`id` text PRIMARY KEY NOT NULL,
	`name` text NOT NULL,
	`description` text,
	`duration` integer NOT NULL,
	`groupSize` text NOT NULL,
	`season` text,
	`price` real NOT NULL,
	`currency` text DEFAULT 'USD',
	`includes` text,
	`images` text,
	`isActive` integer DEFAULT true,
	`createdAt` text DEFAULT 'CURRENT_TIMESTAMP' NOT NULL,
	`updatedAt` text DEFAULT 'CURRENT_TIMESTAMP' NOT NULL
);
--> statement-breakpoint
CREATE TABLE `umrah_requests` (
	`id` text PRIMARY KEY NOT NULL,
	`customerId` text NOT NULL,
	`packageId` text NOT NULL,
	`preferredDates` text,
	`groupSize` integer NOT NULL,
	`specialRequirements` text,
	`message` text,
	`phoneNumber` text,
	`alternativeEmail` text,
	`status` text DEFAULT 'PENDING',
	`adminNotes` text,
	`createdAt` text DEFAULT 'CURRENT_TIMESTAMP' NOT NULL,
	`updatedAt` text DEFAULT 'CURRENT_TIMESTAMP' NOT NULL
);
--> statement-breakpoint
CREATE TABLE `users` (
	`id` text PRIMARY KEY NOT NULL,
	`email` text NOT NULL,
	`emailVerified` text,
	`name` text,
	`phone` text,
	`image` text,
	`password` text,
	`googleId` text,
	`role` text DEFAULT 'CUSTOMER' NOT NULL,
	`status` text DEFAULT 'ACTIVE' NOT NULL,
	`preferredLang` text DEFAULT 'ENGLISH' NOT NULL,
	`createdAt` text DEFAULT 'CURRENT_TIMESTAMP' NOT NULL,
	`updatedAt` text DEFAULT 'CURRENT_TIMESTAMP' NOT NULL,
	`lastLoginAt` text
);
--> statement-breakpoint
CREATE UNIQUE INDEX `users_email_unique` ON `users` (`email`);--> statement-breakpoint
CREATE UNIQUE INDEX `users_googleId_unique` ON `users` (`googleId`);--> statement-breakpoint
CREATE TABLE `verificationtokens` (
	`identifier` text NOT NULL,
	`token` text NOT NULL,
	`expires` text NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `verificationtokens_token_unique` ON `verificationtokens` (`token`);--> statement-breakpoint
CREATE UNIQUE INDEX `verificationtokens_identifier_token_unique` ON `verificationtokens` (`identifier`,`token`);--> statement-breakpoint
CREATE TABLE `website_settings` (
	`id` text PRIMARY KEY NOT NULL,
	`siteName` text DEFAULT 'Syria Ways',
	`siteDescription` text,
	`logoUrl` text,
	`faviconUrl` text,
	`contactEmail` text,
	`contactPhone` text,
	`contactAddress` text,
	`googleMapsEmbed` text,
	`facebookUrl` text,
	`instagramUrl` text,
	`twitterUrl` text,
	`websiteUrl` text,
	`youtubeUrl` text,
	`linkedinUrl` text,
	`enableContactForm` integer DEFAULT true,
	`recipientEmail` text,
	`autoReplyMessage` text,
	`enableRecaptcha` integer DEFAULT true,
	`enableSocialSharing` integer DEFAULT true,
	`shareFacebook` integer DEFAULT true,
	`shareTwitter` integer DEFAULT true,
	`shareInstagram` integer DEFAULT false,
	`shareWhatsapp` integer DEFAULT true,
	`metaTitle` text,
	`metaDescription` text,
	`keywords` text,
	`generateSitemap` integer DEFAULT true,
	`enableRobotsTxt` integer DEFAULT true,
	`googleAnalyticsId` text,
	`enableAnalytics` integer DEFAULT true,
	`enableCookieConsent` integer DEFAULT true,
	`defaultLanguage` text DEFAULT 'ENGLISH',
	`timezone` text DEFAULT 'Asia/Damascus',
	`dateFormat` text DEFAULT 'DD/MM/YYYY',
	`currency` text DEFAULT 'USD',
	`createdAt` text DEFAULT 'CURRENT_TIMESTAMP' NOT NULL,
	`updatedAt` text DEFAULT 'CURRENT_TIMESTAMP' NOT NULL
);
