PRAGMA foreign_keys=OFF;--> statement-breakpoint
CREATE TABLE `__new_accounts` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`userId` integer NOT NULL,
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
INSERT INTO `__new_accounts`("id", "userId", "type", "provider", "providerAccountId", "refresh_token", "access_token", "expires_at", "token_type", "scope", "id_token", "session_state") SELECT "id", "userId", "type", "provider", "providerAccountId", "refresh_token", "access_token", "expires_at", "token_type", "scope", "id_token", "session_state" FROM `accounts`;--> statement-breakpoint
DROP TABLE `accounts`;--> statement-breakpoint
ALTER TABLE `__new_accounts` RENAME TO `accounts`;--> statement-breakpoint
PRAGMA foreign_keys=ON;--> statement-breakpoint
CREATE UNIQUE INDEX `accounts_provider_providerAccountId_unique` ON `accounts` (`provider`,`providerAccountId`);--> statement-breakpoint
CREATE TABLE `__new_sessions` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`sessionToken` text NOT NULL,
	`userId` integer NOT NULL,
	`expires` text NOT NULL
);
--> statement-breakpoint
INSERT INTO `__new_sessions`("id", "sessionToken", "userId", "expires") SELECT "id", "sessionToken", "userId", "expires" FROM `sessions`;--> statement-breakpoint
DROP TABLE `sessions`;--> statement-breakpoint
ALTER TABLE `__new_sessions` RENAME TO `sessions`;--> statement-breakpoint
CREATE UNIQUE INDEX `sessions_sessionToken_unique` ON `sessions` (`sessionToken`);--> statement-breakpoint
CREATE TABLE `__new_users` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
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
INSERT INTO `__new_users`("id", "email", "emailVerified", "name", "phone", "image", "password", "googleId", "role", "status", "preferredLang", "createdAt", "updatedAt", "lastLoginAt") SELECT "id", "email", "emailVerified", "name", "phone", "image", "password", "googleId", "role", "status", "preferredLang", "createdAt", "updatedAt", "lastLoginAt" FROM `users`;--> statement-breakpoint
DROP TABLE `users`;--> statement-breakpoint
ALTER TABLE `__new_users` RENAME TO `users`;--> statement-breakpoint
CREATE UNIQUE INDEX `users_email_unique` ON `users` (`email`);--> statement-breakpoint
CREATE UNIQUE INDEX `users_googleId_unique` ON `users` (`googleId`);