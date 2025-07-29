ALTER TABLE `bundles` ADD `duration` integer DEFAULT 1;--> statement-breakpoint
ALTER TABLE `bundles` ADD `maxGuests` integer DEFAULT 2;--> statement-breakpoint
ALTER TABLE `bundles` ADD `originalPrice` real;--> statement-breakpoint
ALTER TABLE `bundles` ADD `includesHotel` integer DEFAULT false;--> statement-breakpoint
ALTER TABLE `bundles` ADD `includesCar` integer DEFAULT false;--> statement-breakpoint
ALTER TABLE `bundles` ADD `includesGuide` integer DEFAULT false;--> statement-breakpoint
ALTER TABLE `bundles` ADD `itinerary` text;--> statement-breakpoint
ALTER TABLE `bundles` ADD `inclusions` text;--> statement-breakpoint
ALTER TABLE `bundles` ADD `exclusions` text;--> statement-breakpoint
ALTER TABLE `bundles` ADD `isFeatured` integer DEFAULT false;