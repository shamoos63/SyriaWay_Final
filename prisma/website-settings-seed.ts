import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Seeding website settings...')

  // Check if settings already exist
  const existingSettings = await prisma.websiteSettings.findFirst()
  
  if (existingSettings) {
    console.log('✅ Website settings already exist, skipping...')
    return
  }

  // Create default website settings
  const settings = await prisma.websiteSettings.create({
    data: {
      siteName: "Syria Ways",
      siteDescription: "Syria Ways is a comprehensive tourism platform for exploring Syria's rich cultural heritage, historical sites, and natural beauty. Discover amazing destinations, book tours, hotels, and experience the authentic Syrian hospitality.",
      contactEmail: "info@syriaways.com",
      contactPhone: "+963 11 123 4567",
      contactAddress: "Damascus, Syria",
      googleMapsEmbed: "<iframe src='https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d106456.51594432085!2d36.25106570000001!3d33.5073755!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x1518e6dc413cc6a7%3A0x6b9f66ebd1e394f2!2sDamascus%2C%20Syria!5e0!3m2!1sen!2sus!4v1652345678901!5m2!1sen!2sus' width='100%' height='300' style='border:0;' allowfullscreen='' loading='lazy' referrerpolicy='no-referrer-when-downgrade'></iframe>",
      facebookUrl: "https://facebook.com/syriaways",
      instagramUrl: "https://instagram.com/syriaways",
      twitterUrl: "https://twitter.com/syriaways",
      websiteUrl: "https://syriaways.com",
      youtubeUrl: "https://youtube.com/@syriaways",
      linkedinUrl: "https://linkedin.com/company/syriaways",
      enableContactForm: true,
      recipientEmail: "contact@syriaways.com",
      autoReplyMessage: "Thank you for contacting Syria Ways. We have received your message and will get back to you as soon as possible. Your inquiry is important to us.",
      enableRecaptcha: true,
      enableSocialSharing: true,
      shareFacebook: true,
      shareTwitter: true,
      shareInstagram: false,
      shareWhatsapp: true,
      metaTitle: "Syria Ways - Discover the Beauty of Syria",
      metaDescription: "Explore Syria's rich cultural heritage, historical sites, and natural beauty with Syria Ways. Book tours, hotels, car rentals, and experience authentic Syrian hospitality.",
      keywords: "Syria tourism, Syria travel, Syria hotels, Syria tours, Damascus, Aleppo, Palmyra, Syrian history, Syrian culture, Middle East tourism, historical sites Syria, natural sites Syria, religious sites Syria",
      generateSitemap: true,
      enableRobotsTxt: true,
      googleAnalyticsId: "",
      enableAnalytics: true,
      enableCookieConsent: true,
      defaultLanguage: "ENGLISH",
      timezone: "Asia/Damascus",
      dateFormat: "DD/MM/YYYY",
      currency: "USD",
    },
  })

  console.log('✅ Website settings seeded successfully:', settings.siteName)
}

main()
  .catch((e) => {
    console.error('❌ Error seeding website settings:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  }) 