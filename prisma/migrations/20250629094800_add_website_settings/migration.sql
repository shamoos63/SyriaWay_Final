-- CreateTable
CREATE TABLE "website_settings" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "siteName" TEXT NOT NULL DEFAULT 'Syria Ways',
    "siteDescription" TEXT,
    "logoUrl" TEXT,
    "faviconUrl" TEXT,
    "contactEmail" TEXT,
    "contactPhone" TEXT,
    "contactAddress" TEXT,
    "googleMapsEmbed" TEXT,
    "facebookUrl" TEXT,
    "instagramUrl" TEXT,
    "twitterUrl" TEXT,
    "websiteUrl" TEXT,
    "youtubeUrl" TEXT,
    "linkedinUrl" TEXT,
    "enableContactForm" BOOLEAN NOT NULL DEFAULT true,
    "recipientEmail" TEXT,
    "autoReplyMessage" TEXT,
    "enableRecaptcha" BOOLEAN NOT NULL DEFAULT true,
    "enableSocialSharing" BOOLEAN NOT NULL DEFAULT true,
    "shareFacebook" BOOLEAN NOT NULL DEFAULT true,
    "shareTwitter" BOOLEAN NOT NULL DEFAULT true,
    "shareInstagram" BOOLEAN NOT NULL DEFAULT false,
    "shareWhatsapp" BOOLEAN NOT NULL DEFAULT true,
    "metaTitle" TEXT,
    "metaDescription" TEXT,
    "keywords" TEXT,
    "generateSitemap" BOOLEAN NOT NULL DEFAULT true,
    "enableRobotsTxt" BOOLEAN NOT NULL DEFAULT true,
    "googleAnalyticsId" TEXT,
    "enableAnalytics" BOOLEAN NOT NULL DEFAULT true,
    "enableCookieConsent" BOOLEAN NOT NULL DEFAULT true,
    "defaultLanguage" TEXT NOT NULL DEFAULT 'ENGLISH',
    "timezone" TEXT NOT NULL DEFAULT 'Asia/Damascus',
    "dateFormat" TEXT NOT NULL DEFAULT 'DD/MM/YYYY',
    "currency" TEXT NOT NULL DEFAULT 'USD',
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);
