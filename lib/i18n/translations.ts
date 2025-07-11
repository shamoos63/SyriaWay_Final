export type Language = "en" | "ar" | "fr"

export interface Translations {
  common: {
    signIn: string
    signUp: string
    learnMore: string
    submit: string
    contactUs: string
    chatWithUs: string
    howCanIHelp: string
    typeMessage: string
    send: string
    goBack: string
    returnHome: string
    cancel: string
    save: string
    create: string
  }
  nav: {
    services: string
    tourismSites: string
    tourismNews: string
    blog: string
    offers: string
  }
  blog: {
    readMore: string
    createPost: string
    editPost: string
    postTitle: string
    postExcerpt: string
    postContent: string
    postCategory: string
    postImage: string
    postTags: string
  }
  services: {
    bookingHotels: string
    healthTourism: string
    educationalTourism: string
    historicalTourism: string
    nationalTourism: string
    carsRental: string
    tours: string
    bookingFlights: string
    umrah: string
  }
  tourismSites: {
    historicalSites: string
    naturalSites: string
    religiousSites: string
  }
  home: {
    whoAreWe: string
    introduction: string
    introductionTitle: string
    sections: string
    detailedServices: string
    hotelBooking: string
    carRental: string
    exploringTouristSites: string
    umrahPrograms: string
    domesticTourism: string
    bundles: string
    aboutSyriaWay: string
    ourPlatform: string
    comprehensiveSupport: string
    comprehensiveSupportDescription: string
          specialOffers: string
      specialOffersDescription: string
      travelBundles: string
      travelBundlesDescription: string
      whyChooseSyriaWays: string
      whyChooseSyriaWaysDescription: string
      ourBenefits: string
      ourBenefitsDescription: string
  }
  features: {
    hotelBooking: string
    hotelBookingDescription: string
    carRental: string
    carRentalDescription: string
    flightBooking: string
    flightBookingDescription: string
    tourGuides: string
    tourGuidesDescription: string
    educationalTours: string
    educationalToursDescription: string
    healthTourism: string
    healthTourismDescription: string
  }
  benefits: {
    qualityService: string
    qualityServiceDescription: string
    secureBooking: string
    secureBookingDescription: string
    fastBooking: string
    fastBookingDescription: string
    support247: string
    support247Description: string
  }
  footer: {
    findUs: string
    allRightsReserved: string
    codedBy: string
  }
  bundles: {
    basic: string
    golden: string
    premium: string
    recommended: string
    features: {
      hotelBookingAssistance: string
      carRentalService: string
      customerSupport: string
      basicTourPackages: string
      standardAccommodation: string
      premiumHotelSelection: string
      luxuryCarOptions: string
      guidedToursIncluded: string
      airportTransfers: string
      personalizedItinerary: string
      prioritySupport: string
      vipAccommodations: string
      executiveCarService: string
      privateGuidedTours: string
      exclusiveEventAccess: string
      personalizedConcierge: string
      luxuryDiningReservations: string
      travelInsurance: string
    }
  }
  search?: {
    placeholder: string
    search?: string
    searchButton?: string
  }
  dashboard?: {
    dashboard: string
    offers: string
    plans: string
    settings: string
    logout: string
    profile: string
    profilePic: string
    pic: string
    personalInfo: string
    security: string
    notifications: string
    preferences: string
    username: string
    email: string
    businessName: string
    businessType: string
    phone: string
    address: string
    saveChanges: string
    currentPassword: string
    newPassword: string
    confirmPassword: string
    twoFactorAuth: string
    enableTwoFactor: string
    recoveryEmail: string
    emailNotifications: string
    smsNotifications: string
    marketingEmails: string
    offerAlerts: string
    language: string
    theme: string
    currency: string
    darkMode: string
    lightMode: string
    systemDefault: string
    sortBy: string
    creationDate: string
    editDate: string
    mostVisited: string
    lessVisited: string
    addNewOffer: string
    basicPlan: string
    premiumPlan: string
    enterprisePlan: string
    month: string
    selectPlan: string
    currentPlan: string
    standardListing: string
    enhancedVisibility: string
    topListing: string
    socialMediaPromotion: string
    featuredInNewsletter: string
    priorityCustomerSupport: string
    analyticsReports: string
    dedicatedAccountManager: string
    customBranding: string
    profileUpdated: string
    passwordChanged: string
    settingsSaved: string
  }
  userDashboard?: {
    dashboard: string
    requests: string
    posts: string
    activeBookings: string
    pendingRequests: string
    totalSpent: string
    loyaltyPoints: string
    upcomingTrips: string
    pointsEarned: string
    thisYear: string
    awaitingApproval: string
    activeReservations: string
    carRental: string
    hotelBooking: string
    flightBooking: string
    palmyraExcursion: string
    pickupDate: string
    returnDate: string
    checkIn: string
    checkOut: string
    departureDate: string
    startDate: string
    endDate: string
    daysRemaining: string
    confirmed: string
    hotelIncluded: string
    transportIncluded: string
    myRequests: string
    verified: string
    pending: string
    rejected: string
    edit: string
    delete: string
    myPosts: string
    newPost: string
    views: string
    comments: string
    fullName: string
    updatePersonalInfo: string
    managePassword: string
    enhanceSecurity: string
    backupEmail: string
    manageNotifications: string
    receiveEmails: string
    receiveSMS: string
    receiveMarketing: string
    receiveOffers: string
    customizeExperience: string
  }
  errors?: {
    pageNotFound: string
    pageNotFoundMessage: string
  }
}

export const translations: Record<Language, Translations> = {
  en: {
    common: {
      signIn: "Sign in",
      signUp: "Sign up",
      learnMore: "Learn More",
      submit: "Submit",
      contactUs: "Contact Us",
      chatWithUs: "Chat with us",
      howCanIHelp: "Hi, how can I help you today?",
      typeMessage: "Type your message...",
      send: "Send",
      goBack: "Go Back",
      returnHome: "Return Home",
      cancel: "Cancel",
      save: "Save",
      create: "Create",
    },
    nav: {
      services: "Services",
      tourismSites: "Tourism Sites",
      tourismNews: "Tourism News",
      blog: "Blog",
      offers: "Offers",
    },
    blog: {
      readMore: "Read More",
      createPost: "Create Post",
      editPost: "Edit Post",
      postTitle: "Post Title",
      postExcerpt: "Post Excerpt",
      postContent: "Post Content",
      postCategory: "Post Category",
      postImage: "Post Image",
      postTags: "Post Tags",
    },
    services: {
      bookingHotels: "Booking Hotels",
      healthTourism: "Health Tourism",
      educationalTourism: "Educational Tourism",
      historicalTourism: "Historical Tourism",
      nationalTourism: "National Tourism",
      carsRental: "Cars Rental",
      tours: "Tours",
      bookingFlights: "Booking Flights",
      umrah: "Umrah",
    },
    tourismSites: {
      historicalSites: "Historical Sites",
      naturalSites: "Natural Sites",
      religiousSites: "Religious Sites",
    },
    home: {
      whoAreWe: "Who Are We and What We Do?",
      introduction:
        "Introduction to the App: The Syria App is built to facilitate tourism in Syria. The app integrates various services to create a modern and user-friendly interface with multilingual support (Arabic, English,French).",
      introductionTitle: "Introduction",
      sections:
        "Sections: The app provides services for tourism needs, car rentals, hotel bookings, tourist sites, and Umrah programs overall.",
      detailedServices: "Detailed Services:",
      hotelBooking:
        "Hotel Booking: Advanced Search Options, Filter by location, rating, price, and reviews, real-time availability, secure payment.",
      carRental:
        "Car Rental: Vehicle browsing by type, pricing calendar, pick-up and drop-off dates, Car Details: Type, specifications, seating capacity, images, daily price.",
      exploringTouristSites:
        "Exploring Tourist Sites: Categories: Historical, natural, religious, Interactive map of Syria, Personalized Recommendations Based on booking history and user preferences.",
      umrahPrograms:
        "Umrah Programs: Available Packages, Economy, mid-range, and luxury, Services Provided: Accommodation and transportation.",
      domesticTourism:
        "Domestic Tourism: Tour Packages: Day trips, nature tours, historical sites, family adventures, Local Events: Cultural festivals, art exhibitions, concerts.",
      bundles: "Bundles",
      aboutSyriaWay: "About Syria Way",
      ourPlatform: "Our Platform",
      comprehensiveSupport: "Comprehensive Support",
      comprehensiveSupportDescription: "We provide comprehensive support throughout your journey, ensuring a seamless and enjoyable experience.",
      specialOffers: "Special Offers",
      specialOffersDescription: "Discover our exclusive deals and limited-time offers for your perfect Syrian adventure.",
      travelBundles: "Travel Bundles",
      travelBundlesDescription: "Choose from our carefully curated travel bundles designed to meet your specific needs and preferences.",
      whyChooseSyriaWays: "Why Choose Syria Ways?",
      whyChooseSyriaWaysDescription: "Discover the unique advantages that make Syria Ways your trusted travel partner.",
      ourBenefits: "Our Benefits",
      ourBenefitsDescription: "Experience the benefits of choosing Syria Ways for your travel needs.",
    },
    features: {
      hotelBooking: "Hotel Booking",
      hotelBookingDescription: "Find and book the perfect accommodation for your stay in Syria.",
      carRental: "Car Rental",
      carRentalDescription: "Rent reliable vehicles for your transportation needs across Syria.",
      flightBooking: "Flight Booking",
      flightBookingDescription: "Book flights to and from Syria with competitive prices and flexible options.",
      tourGuides: "Tour Guides",
      tourGuidesDescription: "Professional guides to enhance your travel experience with local insights.",
      educationalTours: "Educational Tours",
      educationalToursDescription: "Educational tours designed to enrich your knowledge about Syria's rich history and culture.",
      healthTourism: "Health Tourism",
      healthTourismDescription: "Access quality healthcare services while enjoying your stay in Syria.",
    },
    benefits: {
      qualityService: "Quality Service",
      qualityServiceDescription: "We provide high-quality services to ensure your satisfaction.",
      secureBooking: "Secure Booking",
      secureBookingDescription: "Your bookings are protected with advanced security measures.",
      fastBooking: "Fast Booking",
      fastBookingDescription: "Quick and efficient booking process to save your time.",
      support247: "24/7 Support",
      support247Description: "Round-the-clock customer support to assist you anytime.",
    },
    footer: {
      findUs: "Find Us",
      allRightsReserved: "© 2024 Syria Ways. All rights reserved.",
      codedBy: "Coded by",
    },
    search: {
      placeholder: "Search for destinations, services...",
      searchButton: "Search",
    },
    bundles: {
      basic: "Basic",
      golden: "Golden",
      premium: "Premium",
      recommended: "Recommended",
      features: {
        hotelBookingAssistance: "Hotel booking assistance",
        carRentalService: "Car rental service",
        customerSupport: "24/7 customer support",
        basicTourPackages: "Basic tour packages",
        standardAccommodation: "Standard accommodation options",
        premiumHotelSelection: "Premium hotel selection",
        luxuryCarOptions: "Luxury car options",
        guidedToursIncluded: "Guided tours included",
        airportTransfers: "Airport transfers",
        personalizedItinerary: "Personalized itinerary",
        prioritySupport: "Priority customer support",
        vipAccommodations: "VIP hotel accommodations",
        executiveCarService: "Executive car service",
        privateGuidedTours: "Private guided tours",
        exclusiveEventAccess: "Exclusive event access",
        personalizedConcierge: "Personalized concierge",
        luxuryDiningReservations: "Luxury dining reservations",
        travelInsurance: "Comprehensive travel insurance",
      },
    },
    dashboard: {
      dashboard: "Dashboard",
      offers: "Offers",
      plans: "Plans",
      settings: "Settings",
      logout: "Logout",
      profile: "USER",
      profilePic: "Profile",
      pic: "Pic",
      personalInfo: "Personal Information",
      security: "Security",
      notifications: "Notifications",
      preferences: "Preferences",
      username: "Username",
      email: "Email",
      businessName: "Business Name",
      businessType: "Business Type",
      phone: "Phone",
      address: "Address",
      saveChanges: "Save Changes",
      currentPassword: "Current Password",
      newPassword: "New Password",
      confirmPassword: "Confirm Password",
      twoFactorAuth: "Two-Factor Authentication",
      enableTwoFactor: "Enable Two-Factor Authentication",
      recoveryEmail: "Recovery Email",
      emailNotifications: "Email Notifications",
      smsNotifications: "SMS Notifications",
      marketingEmails: "Marketing Emails",
      offerAlerts: "Offer Alerts",
      language: "Language",
      theme: "Theme",
      currency: "Currency",
      darkMode: "Dark Mode",
      lightMode: "Light Mode",
      systemDefault: "System Default",
      sortBy: "Sort By",
      creationDate: "Creation Date",
      editDate: "Edit Date",
      mostVisited: "Most Visited",
      lessVisited: "Less Visited",
      addNewOffer: "Add New Offer",
      basicPlan: "Basic Plan",
      premiumPlan: "Premium Plan",
      enterprisePlan: "Enterprise Plan",
      month: "month",
      selectPlan: "Select Plan",
      currentPlan: "Current Plan",
      standardListing: "Standard Listing",
      enhancedVisibility: "Enhanced Visibility",
      topListing: "Top Listing",
      socialMediaPromotion: "Social Media Promotion",
      featuredInNewsletter: "Featured in Newsletter",
      priorityCustomerSupport: "Priority Customer Support",
      analyticsReports: "Analytics Reports",
      dedicatedAccountManager: "Dedicated Account Manager",
      customBranding: "Custom Branding",
      profileUpdated: "Profile updated successfully!",
      passwordChanged: "Password changed successfully!",
      settingsSaved: "Settings saved successfully!",
    },
    userDashboard: {
      dashboard: "Dashboard",
      requests: "Requests",
      posts: "Posts",
      activeBookings: "Active Bookings",
      pendingRequests: "Pending Requests",
      totalSpent: "Total Spent",
      loyaltyPoints: "Loyalty Points",
      upcomingTrips: "Upcoming Trips",
      pointsEarned: "Points earned",
      thisYear: "This year",
      awaitingApproval: "Awaiting approval",
      activeReservations: "Active Reservations",
      carRental: "Car Rental",
      hotelBooking: "Hotel Booking",
      flightBooking: "Flight Booking",
      palmyraExcursion: "Palmyra Excursion",
      pickupDate: "Pickup",
      returnDate: "Return",
      checkIn: "Check-in",
      checkOut: "Check-out",
      departureDate: "Departure",
      startDate: "Start",
      endDate: "End",
      daysRemaining: "3 days remaining",
      confirmed: "Confirmed",
      hotelIncluded: "Hotel included",
      transportIncluded: "Transport included",
      myRequests: "My Requests",
      verified: "Verified",
      pending: "Pending",
      rejected: "Rejected",
      edit: "Edit",
      delete: "Delete",
      myPosts: "My Posts",
      newPost: "New Post",
      views: "views",
      comments: "comments",
      fullName: "Full Name",
      updatePersonalInfo: "Update your personal information and contact details.",
      managePassword: "Manage your password and security settings.",
      enhanceSecurity: "Enhance your account security with two-factor authentication.",
      backupEmail: "Set a backup email for account recovery.",
      manageNotifications: "Manage how you receive notifications.",
      receiveEmails: "Receive notifications via email.",
      receiveSMS: "Receive notifications via SMS.",
      receiveMarketing: "Receive marketing emails and promotions.",
      receiveOffers: "Receive alerts about new offers and deals.",
      customizeExperience: "Customize your experience.",
    },
    errors: {
      pageNotFound: "Page Not Found",
      pageNotFoundMessage: "The page you are looking for doesn't exist or has been moved.",
    },
  },
  ar: {
    common: {
      signIn: "تسجيل الدخول",
      signUp: "إنشاء حساب",
      learnMore: "اقرأ المزيد",
      submit: "إرسال",
      contactUs: "اتصل بنا",
      chatWithUs: "تحدث معنا",
      howCanIHelp: "مرحباً، كيف يمكنني مساعدتك اليوم؟",
      typeMessage: "اكتب رسالتك...",
      send: "إرسال",
      goBack: "العودة",
      returnHome: "العودة للرئيسية",
      cancel: "إلغاء",
      save: "حفظ",
      create: "إنشاء",
    },
    nav: {
      services: "الخدمات",
      tourismSites: "المواقع السياحية",
      tourismNews: "أخبار السياحة",
      blog: "المدونة",
      offers: "العروض",
    },
    blog: {
      readMore: "اقرأ المزيد",
      createPost: "إنشاء منشور",
      editPost: "تعديل المنشور",
      postTitle: "عنوان المنشور",
      postExcerpt: "مقتطف من المنشور",
      postContent: "محتوى المنشور",
      postCategory: "فئة المنشور",
      postImage: "صورة المنشور",
      postTags: "وسوم المنشور",
    },
    services: {
      bookingHotels: "حجز الفنادق",
      healthTourism: "السياحة الصحية",
      educationalTourism: "السياحة التعليمية",
      historicalTourism: "السياحة التاريخية",
      nationalTourism: "السياحة الوطنية",
      carsRental: "تأجير السيارات",
      tours: "الجولات",
      bookingFlights: "حجز الرحلات",
      umrah: "العمرة",
    },
    tourismSites: {
      historicalSites: "المواقع التاريخية",
      naturalSites: "المواقع الطبيعية",
      religiousSites: "المواقع الدينية",
    },
    home: {
      whoAreWe: "من نحن وماذا نفعل؟",
      introduction:
        "مقدمة عن التطبيق: تم بناء تطبيق سوريا لتسهيل السياحة في سوريا. يدمج التطبيق خدمات متنوعة لإنشاء واجهة حديثة وسهلة الاستخدام مع دعم متعدد اللغات (العربية، الإنجليزية).",
      introductionTitle: "مقدمة",
      sections:
        "الأقسام: يوفر التطبيق خدمات للاحتياجات السياحية، وتأجير السيارات، وحجز الفنادق، والمواقع السياحية، وبرامج العمرة بشكل عام.",
      detailedServices: "الخدمات التفصيلية:",
      hotelBooking:
        "حجز الفنادق: خيارات بحث متقدمة، تصفية حسب الموقع، التقييم، السعر، والمراجعات، توفر في الوقت الحقيقي، دفع آمن.",
      carRental:
        "تأجير السيارات: تصفح المركبات حسب النوع، تقويم الأسعار، تواريخ الاستلام والتسليم، تفاصيل السيارة: النوع، المواصفات، سعة الجلوس، الصور، السعر اليومي.",
      exploringTouristSites:
        "استكشاف المواقع السياحية: الفئات: تاريخية، طبيعية، دينية، خريطة تفاعلية لسوريا، توصيات شخصية بناءً على سجل الحجز وتفضيلات المستخدم.",
      umrahPrograms: "برامج العمرة: الباقات المتاحة، اقتصادية، متوسطة، وفاخرة، الخدمات المقدمة: الإقامة والنقل.",
      domesticTourism:
        "السياحة الداخلية: باقات الجولات: رحلات يومية، جولات طبيعية، مواقع تاريخية، مغامرات عائلية، الفعاليات المحلية: مهرجانات ثقافية، معارض فنية، حفلات موسيقية.",
      bundles: "الباقات",
      aboutSyriaWay: "عن سوريا وايز",
      ourPlatform: "منصتنا",
      comprehensiveSupport: "دعم شامل",
      comprehensiveSupportDescription: "نوفر دعم شامل طوال رحلتك، مما يضمن تجربة سلسة وممتعة.",
      specialOffers: "عروض خاصة",
      specialOffersDescription: "اكتشف عروضنا الحصرية والعروض المحدودة الوقت لمغامرتك السورية المثالية.",
      travelBundles: "باقات السفر",
      travelBundlesDescription: "اختر من باقات السفر المختارة بعناية المصممة لتلبية احتياجاتك وتفضيلاتك المحددة.",
      whyChooseSyriaWays: "لماذا تختار سوريا وايز؟",
      whyChooseSyriaWaysDescription: "اكتشف المزايا الفريدة التي تجعل سوريا وايز شريك سفرك الموثوق.",
      ourBenefits: "مزايانا",
      ourBenefitsDescription: "اختبر مزايا اختيار سوريا وايز لاحتياجات سفرك.",
    },
    features: {
      hotelBooking: "حجز الفنادق",
      hotelBookingDescription: "ابحث واحجز الإقامة المثالية لإقامتك في سوريا.",
      carRental: "تأجير السيارات",
      carRentalDescription: "استأجر مركبات موثوقة لاحتياجات النقل عبر سوريا.",
      flightBooking: "حجز الرحلات",
      flightBookingDescription: "احجز رحلات إلى ومن سوريا بأسعار تنافسية وخيارات مرنة.",
      tourGuides: "المرشدين السياحيين",
      tourGuidesDescription: "مرشدين محترفين لتعزيز تجربة سفرك مع رؤى محلية.",
      educationalTours: "الجولات التعليمية",
      educationalToursDescription: "جولات تعليمية مصممة لإثراء معرفتك بتاريخ سوريا وثقافتها الغنية.",
      healthTourism: "السياحة الصحية",
      healthTourismDescription: "احصل على خدمات رعاية صحية عالية الجودة أثناء الاستمتاع بإقامتك في سوريا.",
    },
    benefits: {
      qualityService: "خدمة عالية الجودة",
      qualityServiceDescription: "نوفر خدمات عالية الجودة لضمان رضاك.",
      secureBooking: "حجز آمن",
      secureBookingDescription: "حجوزاتك محمية بإجراءات أمان متقدمة.",
      fastBooking: "حجز سريع",
      fastBookingDescription: "عملية حجز سريعة وفعالة لتوفير وقتك.",
      support247: "دعم 24/7",
      support247Description: "دعم العملاء على مدار الساعة لمساعدتك في أي وقت.",
    },
    footer: {
      findUs: "اعثر علينا",
      allRightsReserved: "© 2024 سوريا وايز. جميع الحقوق محفوظة.",
      codedBy: "مبرمج بواسطة",
    },
    search: {
      placeholder: "ابحث عن الوجهات والخدمات...",
      searchButton: "بحث",
    },
    bundles: {
      basic: "أساسي",
      golden: "ذهبي",
      premium: "متميز",
      recommended: "موصى به",
      features: {
        hotelBookingAssistance: "مساعدة في حجز الفنادق",
        carRentalService: "خدمة تأجير السيارات",
        customerSupport: "دعم العملاء على مدار الساعة",
        basicTourPackages: "باقات جولات أساسية",
        standardAccommodation: "خيارات إقامة قياسية",
        premiumHotelSelection: "اختيار فنادق متميزة",
        luxuryCarOptions: "خيارات سيارات فاخرة",
        guidedToursIncluded: "جولات مع مرشد سياحي",
        airportTransfers: "نقل من وإلى المطار",
        personalizedItinerary: "جدول سفر مخصص",
        prioritySupport: "دعم عملاء ذو أولوية",
        vipAccommodations: "إقامة فندقية VIP",
        executiveCarService: "خدمة سيارات تنفيذية",
        privateGuidedTours: "جولات خاصة مع مرشد",
        exclusiveEventAccess: "وصول حصري للفعاليات",
        personalizedConcierge: "خدمة كونسيرج شخصية",
        luxuryDiningReservations: "حجوزات مطاعم فاخرة",
        travelInsurance: "تأمين سفر شامل",
      },
    },
    dashboard: {
      dashboard: "لوحة التحكم",
      offers: "العروض",
      plans: "الخطط",
      settings: "الإعدادات",
      logout: "تسجيل الخروج",
      profile: "المستخدم",
      profilePic: "صورة",
      pic: "الملف",
      personalInfo: "المعلومات الشخصية",
      security: "الأمان",
      notifications: "الإشعارات",
      preferences: "التفضيلات",
      username: "اسم المستخدم",
      email: "البريد الإلكتروني",
      businessName: "اسم الشركة",
      businessType: "نوع النشاط التجاري",
      phone: "الهاتف",
      address: "العنوان",
      saveChanges: "حفظ التغييرات",
      currentPassword: "كلمة المرور الحالية",
      newPassword: "كلمة المرور الجديدة",
      confirmPassword: "تأكيد كلمة المرور",
      twoFactorAuth: "المصادقة الثنائية",
      enableTwoFactor: "تفعيل المصادقة الثنائية",
      recoveryEmail: "بريد استعادة الحساب",
      emailNotifications: "إشعارات البريد الإلكتروني",
      smsNotifications: "إشعارات الرسائل النصية",
      marketingEmails: "رسائل تسويقية",
      offerAlerts: "تنبيهات العروض",
      language: "اللغة",
      theme: "المظهر",
      currency: "العملة",
      darkMode: "الوضع الداكن",
      lightMode: "الوضع الفاتح",
      systemDefault: "إعدادات النظام",
      sortBy: "ترتيب حسب",
      creationDate: "تاريخ الإنشاء",
      editDate: "تاريخ التعديل",
      mostVisited: "الأكثر زيارة",
      lessVisited: "الأقل زيارة",
      addNewOffer: "إضافة عرض جديد",
      basicPlan: "الخطة الأساسية",
      premiumPlan: "الخطة المميزة",
      enterprisePlan: "خطة المؤسسات",
      month: "شهر",
      selectPlan: "اختيار الخطة",
      currentPlan: "الخطة الحالية",
      standardListing: "إدراج قياسي",
      enhancedVisibility: "ظهور محسن",
      topListing: "إدراج في المقدمة",
      socialMediaPromotion: "ترويج على وسائل التواصل",
      featuredInNewsletter: "عرض في النشرة الإخبارية",
      priorityCustomerSupport: "دعم عملاء ذو أولوية",
      analyticsReports: "تقارير تحليلية",
      dedicatedAccountManager: "مدير حساب مخصص",
      customBranding: "تخصيص العلامة التجارية",
      profileUpdated: "تم تحديث الملف الشخصي بنجاح!",
      passwordChanged: "تم تغيير كلمة المرور بنجاح!",
      settingsSaved: "تم حفظ الإعدادات بنجاح!",
    },
    userDashboard: {
      dashboard: "لوحة التحكم",
      requests: "الطلبات",
      posts: "المنشورات",
      activeBookings: "الحجوزات النشطة",
      pendingRequests: "الطلبات المعلقة",
      totalSpent: "إجمالي المصروفات",
      loyaltyPoints: "نقاط الولاء",
      upcomingTrips: "الرحلات القادمة",
      pointsEarned: "النقاط المكتسبة",
      thisYear: "هذا العام",
      awaitingApproval: "في انتظار الموافقة",
      activeReservations: "الحجوزات النشطة",
      carRental: "تأجير سيارة",
      hotelBooking: "حجز فندق",
      flightBooking: "حجز طيران",
      palmyraExcursion: "رحلة تدمر",
      pickupDate: "تاريخ الاستلام",
      returnDate: "تاريخ الإرجاع",
      checkIn: "تسجيل الدخول",
      checkOut: "تسجيل الخروج",
      departureDate: "تاريخ المغادرة",
      startDate: "تاريخ البدء",
      endDate: "تاريخ الانتهاء",
      daysRemaining: "3 أيام متبقية",
      confirmed: "مؤكد",
      hotelIncluded: "الفندق مشمول",
      transportIncluded: "النقل مشمول",
      myRequests: "طلباتي",
      verified: "تم التحقق",
      pending: "قيد الانتظار",
      rejected: "مرفوض",
      edit: "تعديل",
      delete: "حذف",
      myPosts: "منشوراتي",
      newPost: "منشور جديد",
      views: "مشاهدات",
      comments: "تعليقات",
      fullName: "الاسم الكامل",
      updatePersonalInfo: "تحديث معلوماتك الشخصية وتفاصيل الاتصال.",
      managePassword: "إدارة كلمة المرور وإعدادات الأمان.",
      enhanceSecurity: "تعزيز أمان حسابك باستخدام المصادقة الثنائية.",
      backupEmail: "تعيين بريد إلكتروني احتياطي لاستعادة الحساب.",
      manageNotifications: "إدارة كيفية تلقي الإشعارات.",
      receiveEmails: "تلقي الإشعارات عبر البريد الإلكتروني.",
      receiveSMS: "تلقي الإشعارات عبر الرسائل القصيرة.",
      receiveMarketing: "تلقي رسائل البريد الإلكتروني التسويقية والعروض الترويجية.",
      receiveOffers: "تلقي تنبيهات حول العروض والصفقات الجديدة.",
      customizeExperience: "تخصيص تجربتك.",
    },
    errors: {
      pageNotFound: "الصفحة غير موجودة",
      pageNotFoundMessage: "الصفحة التي تبحث عنها غير موجودة أو تم نقلها.",
    },
  },
  fr: {
    common: {
      signIn: "Se connecter",
      signUp: "S'inscrire",
      learnMore: "En savoir plus",
      submit: "Envoyer",
      contactUs: "Contactez-nous",
      chatWithUs: "Discutez avec nous",
      howCanIHelp: "Bonjour, comment puis-je vous aider aujourd'hui?",
      typeMessage: "Tapez votre message...",
      send: "Envoyer",
      goBack: "Retour",
      returnHome: "Retour à l'accueil",
      cancel: "Annuler",
      save: "Enregistrer",
      create: "Créer",
    },
    nav: {
      services: "Services",
      tourismSites: "Sites touristiques",
      tourismNews: "Actualités touristiques",
      blog: "Blog",
      offers: "Offres",
    },
    blog: {
      readMore: "Lire plus",
      createPost: "Créer un article",
      editPost: "Modifier l'article",
      postTitle: "Titre de l'article",
      postExcerpt: "Extrait de l'article",
      postContent: "Contenu de l'article",
      postCategory: "Catégorie de l'article",
      postImage: "Image de l'article",
      postTags: "Tags de l'article",
    },
    services: {
      bookingHotels: "Réservation d'hôtels",
      healthTourism: "Tourisme de santé",
      educationalTourism: "Tourisme éducatif",
      historicalTourism: "Tourisme historique",
      nationalTourism: "Tourisme national",
      carsRental: "Location de voitures",
      tours: "Circuits",
      bookingFlights: "Réservation de vols",
      umrah: "Omra",
    },
    tourismSites: {
      historicalSites: "Sites historiques",
      naturalSites: "Sites naturels",
      religiousSites: "Sites religieux",
    },
    home: {
      whoAreWe: "Qui sommes-nous et que faisons-nous?",
      introduction:
        "Introduction à l'application: L'application Syria est conçue pour faciliter le tourisme en Syrie. L'application intègre divers services pour créer une interface moderne et conviviale avec un support multilingue (arabe, anglais).",
      introductionTitle: "Introduction",
      sections:
        "Sections: L'application fournit des services pour les besoins touristiques, la location de voitures, la réservation d'hôtels, les sites touristiques et les programmes d'Omra dans l'ensemble.",
      detailedServices: "Services détaillés:",
      hotelBooking:
        "Réservation d'hôtel: Options de recherche avancées, Filtrage par emplacement, évaluation, prix et avis, disponibilité en temps réel, paiement sécurisé.",
      carRental:
        "Location de voitures: Navigation des véhicules par type, calendrier des prix, dates de prise en charge et de retour, Détails de la voiture: Type, spécifications, capacité d'assise, images, prix journalier.",
      exploringTouristSites:
        "Explorer les sites touristiques: Catégories: Historique, naturel, religieux, Carte interactive de la Syrie, Recommandations personnalisées basées sur l'historique des réservations et les préférences de l'utilisateur.",
      umrahPrograms:
        "Programmes d'Omra: Forfaits disponibles, Économique, milieu de gamme et luxe, Services fournis: Hébergement et transport.",
      domesticTourism:
        "Tourisme intérieur: Forfaits touristiques: Excursions d'une journée, visites de la nature, sites historiques, aventures familiales, Événements locaux: Festivals culturels, expositions d'art, concerts.",
      bundles: "Forfaits",
      aboutSyriaWay: "À propos de Syria Way",
      ourPlatform: "Notre plateforme",
      comprehensiveSupport: "Support complet",
      comprehensiveSupportDescription: "Nous fournissons un support complet tout au long de votre voyage, garantissant une expérience fluide et agréable.",
      specialOffers: "Offres spéciales",
      specialOffersDescription: "Découvrez nos offres exclusives et offres à durée limitée pour votre aventure syrienne parfaite.",
      travelBundles: "Forfaits de voyage",
      travelBundlesDescription: "Choisissez parmi nos forfaits de voyage soigneusement sélectionnés conçus pour répondre à vos besoins et préférences spécifiques.",
      whyChooseSyriaWays: "Pourquoi choisir Syria Ways?",
      whyChooseSyriaWaysDescription: "Découvrez les avantages uniques qui font de Syria Ways votre partenaire de voyage de confiance.",
      ourBenefits: "Nos avantages",
      ourBenefitsDescription: "Découvrez les avantages de choisir Syria Ways pour vos besoins de voyage.",
    },
    features: {
      hotelBooking: "Réservation d'hôtels",
      hotelBookingDescription: "Trouvez et réservez l'hébergement parfait pour votre séjour en Syrie.",
      carRental: "Location de voitures",
      carRentalDescription: "Louez des véhicules fiables pour vos besoins de transport à travers la Syrie.",
      flightBooking: "Réservation de vols",
      flightBookingDescription: "Réservez des vols vers et depuis la Syrie avec des prix compétitifs et des options flexibles.",
      tourGuides: "Guides touristiques",
      tourGuidesDescription: "Guides professionnels pour enrichir votre expérience de voyage avec des aperçus locaux.",
      educationalTours: "Tours éducatifs",
      educationalToursDescription: "Tours éducatifs conçus pour enrichir vos connaissances sur l'histoire et la culture riches de la Syrie.",
      healthTourism: "Tourisme de santé",
      healthTourismDescription: "Accédez à des services de santé de qualité tout en profitant de votre séjour en Syrie.",
    },
    benefits: {
      qualityService: "Service de qualité",
      qualityServiceDescription: "Nous fournissons des services de haute qualité pour assurer votre satisfaction.",
      secureBooking: "Réservation sécurisée",
      secureBookingDescription: "Vos réservations sont protégées par des mesures de sécurité avancées.",
      fastBooking: "Réservation rapide",
      fastBookingDescription: "Processus de réservation rapide et efficace pour vous faire gagner du temps.",
      support247: "Support 24/7",
      support247Description: "Support client 24h/24 et 7j/7 pour vous assister à tout moment.",
    },
    footer: {
      findUs: "Trouvez-nous",
      allRightsReserved: "© 2024 Syria Ways. Tous droits réservés.",
      codedBy: "Programmé par",
    },
    search: {
      placeholder: "Rechercher des destinations, services...",
      searchButton: "Rechercher",
    },
    bundles: {
      basic: "Basique",
      golden: "Or",
      premium: "Premium",
      recommended: "Recommandé",
      features: {
        hotelBookingAssistance: "Assistance à la réservation d'hôtel",
        carRentalService: "Service de location de voitures",
        customerSupport: "Support client 24/7",
        basicTourPackages: "Forfaits touristiques de base",
        standardAccommodation: "Options d'hébergement standard",
        premiumHotelSelection: "Sélection d'hôtels premium",
        luxuryCarOptions: "Options de voitures de luxe",
        guidedToursIncluded: "Visites guidées incluses",
        airportTransfers: "Transferts aéroport",
        personalizedItinerary: "Itinéraire personnalisé",
        prioritySupport: "Support client prioritaire",
        vipAccommodations: "Hébergements hôteliers VIP",
        executiveCarService: "Service de voiture exécutive",
        privateGuidedTours: "Visites guidées privées",
        exclusiveEventAccess: "Accès exclusif aux événements",
        personalizedConcierge: "Conciergerie personnalisée",
        luxuryDiningReservations: "Réservations de restaurants de luxe",
        travelInsurance: "Assurance voyage complète",
      },
    },
    dashboard: {
      dashboard: "Tableau de bord",
      offers: "Offres",
      plans: "Plans",
      settings: "Paramètres",
      logout: "Déconnexion",
      profile: "UTILISATEUR",
      profilePic: "Photo de",
      pic: "profil",
      personalInfo: "Informations personnelles",
      security: "Sécurité",
      notifications: "Notifications",
      preferences: "Préférences",
      username: "Nom d'utilisateur",
      email: "Email",
      businessName: "Nom de l'entreprise",
      businessType: "Type d'activité",
      phone: "Téléphone",
      address: "Adresse",
      saveChanges: "Enregistrer les modifications",
      currentPassword: "Mot de passe actuel",
      newPassword: "Nouveau mot de passe",
      confirmPassword: "Confirmer le mot de passe",
      twoFactorAuth: "Authentification à deux facteurs",
      enableTwoFactor: "Activer l'authentification à deux facteurs",
      recoveryEmail: "Email de récupération",
      emailNotifications: "Notifications par email",
      smsNotifications: "Notifications par SMS",
      marketingEmails: "Emails marketing",
      offerAlerts: "Alertes d'offres",
      language: "Langue",
      theme: "Thème",
      currency: "Devise",
      darkMode: "Mode sombre",
      lightMode: "Mode clair",
      systemDefault: "Paramètres système",
      sortBy: "Trier par",
      creationDate: "Date de création",
      editDate: "Date de modification",
      mostVisited: "Plus visités",
      lessVisited: "Moins visités",
      addNewOffer: "Ajouter une nouvelle offre",
      basicPlan: "Plan basique",
      premiumPlan: "Plan premium",
      enterprisePlan: "Plan entreprise",
      month: "mois",
      selectPlan: "Sélectionner le plan",
      currentPlan: "Plan actuel",
      standardListing: "Référencement standard",
      enhancedVisibility: "Visibilité améliorée",
      topListing: "Référencement prioritaire",
      socialMediaPromotion: "Promotion sur les réseaux sociaux",
      featuredInNewsletter: "Mise en avant dans la newsletter",
      priorityCustomerSupport: "Support client prioritaire",
      analyticsReports: "Rapports d'analyse",
      dedicatedAccountManager: "Gestionnaire de compte dédié",
      customBranding: "Personnalisation de la marque",
      profileUpdated: "Profil mis à jour avec succès!",
      passwordChanged: "Mot de passe modifié avec succès!",
      settingsSaved: "Paramètres enregistrés avec succès!",
    },
    userDashboard: {
      dashboard: "Tableau de bord",
      requests: "Demandes",
      posts: "Publications",
      activeBookings: "Réservations actives",
      pendingRequests: "Demandes en attente",
      totalSpent: "Total dépensé",
      loyaltyPoints: "Points de fidélité",
      upcomingTrips: "Voyages à venir",
      pointsEarned: "Points gagnés",
      thisYear: "Cette année",
      awaitingApproval: "En attente d'approbation",
      activeReservations: "Réservations actives",
      carRental: "Location de voiture",
      hotelBooking: "Réservation d'hôtel",
      flightBooking: "Réservation de vol",
      palmyraExcursion: "Excursion à Palmyre",
      pickupDate: "Date de prise en charge",
      returnDate: "Date de retour",
      checkIn: "Arrivée",
      checkOut: "Départ",
      departureDate: "Date de départ",
      startDate: "Date de début",
      endDate: "Date de fin",
      daysRemaining: "3 jours restants",
      confirmed: "Confirmé",
      hotelIncluded: "Hôtel inclus",
      transportIncluded: "Transport inclus",
      myRequests: "Mes demandes",
      verified: "Vérifié",
      pending: "En attente",
      rejected: "Rejeté",
      edit: "Modifier",
      delete: "Supprimer",
      myPosts: "Mes publications",
      newPost: "Nouvelle publication",
      views: "vues",
      comments: "commentaires",
      fullName: "Nom complet",
      updatePersonalInfo: "Mettez à jour vos informations personnelles et coordonnées.",
      managePassword: "Gérez votre mot de passe et vos paramètres de sécurité.",
      enhanceSecurity: "Renforcez la sécurité de votre compte avec l'authentification à deux facteurs.",
      backupEmail: "Définissez un email de secours pour la récupération du compte.",
      manageNotifications: "Gérez la façon dont vous recevez les notifications.",
      receiveEmails: "Recevoir des notifications par email.",
      receiveSMS: "Recevoir des notifications par SMS.",
      receiveMarketing: "Recevoir des emails marketing et des promotions.",
      receiveOffers: "Recevoir des alertes sur les nouvelles offres et promotions.",
      customizeExperience: "Personnalisez votre expérience.",
    },
    errors: {
      pageNotFound: "Page non trouvée",
      pageNotFoundMessage: "La page que vous recherchez n'existe pas ou a été déplacée.",
    },
  },
}
