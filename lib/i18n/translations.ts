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
      whyChooseSyriaway: string
      whyChooseSyriawayDescription: string
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
    basicPackage: string
    goldenPackage: string
    premiumPackage: string
    noBundlesAvailable: string
    chooseBundle: string
    days: string
    upTo: string
    of: string
    refreshBundles: string
    requestBundle: string
    bundleRequest: string
    preferredStartDate: string
    preferredEndDate: string
    numberOfGuests: string
    travelStyle: string
    budgetRange: string
    contactPhoneNumber: string
    specialRequirements: string
    additionalMessage: string
    submitRequest: string
    submitting: string
    guest: string
    guests: string
    budget: string
    standard: string
    premiumStyle: string
    luxury: string
    authenticationRequired: string
    pleaseSignIn: string
    noBundleSelected: string
    missingInformation: string
    fillRequiredFields: string
    requestSubmitted: string
    requestSubmittedDescription: string
          failedToSubmit: string
      budgetPlaceholder: string
      phonePlaceholder: string
      requirementsPlaceholder: string
      messagePlaceholder: string
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
      // Bundle checkbox features
      hotelAccommodation: string
      carRentalService: string
      professionalTourGuide: string
      customItinerary: string
      localSupport: string
      flexibleBooking: string
    }
  }
  umrah: {
    title: string
    subtitle: string
    availablePackages: string
    noPackagesAvailable: string
    selectSeason: string
    allSeasons: string
    ramadan: string
    hajj: string
    packageDetails: string
    requestPackage: string
    requestUmrah: string
    packageRequest: string
    preferredDates: string
    startDate: string
    endDate: string
    numberOfPilgrims: string
    maxPilgrims: string
    contactPhoneNumber: string
    alternativeEmail: string
    specialRequirements: string
    additionalMessage: string
    submitRequest: string
    submitting: string
    authenticationRequired: string
    pleaseSignIn: string
    noPackageSelected: string
    missingInformation: string
    fillRequiredFields: string
    requestSubmitted: string
    requestSubmittedDescription: string
    failedToSubmit: string
    phonePlaceholder: string
    emailPlaceholder: string
    requirementsPlaceholder: string
    messagePlaceholder: string
    features: {
      accommodation: string
      transportation: string
      visaAssistance: string
      guidedTours: string
      meals: string
      airportTransfers: string
      hotelNearHaram: string
      luxuryAccommodation: string
      privateTransportation: string
      vipServices: string
      spiritualGuidance: string
      groupPrayers: string
      ziyarahTours: string
      medicalSupport: string
      insurance: string
      documentation: string
    }
    packageDetails: {
      days: string
      numberOfPilgrims: string
      maxPilgrims: string
      duration: string
      price: string
      currency: string
      startDate: string
      endDate: string
      packageType: string
      standard: string
      premium: string
      luxury: string
      economy: string
      midRange: string
      highEnd: string
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
    // New translations for posts and settings
    myBlogPosts: string
    noBlogPostsYet: string
    startSharingExperiences: string
    createFirstPost: string
    loadingBlogPosts: string
    blogPostDeleted: string
    blogPostUpdated: string
    blogPostCreated: string
    deleteBlogPost: string
    deleteBlogPostConfirm: string
    deleteBlogPostDescription: string
    profile: string
    security: string
    preferences: string
    role: string
    accountStatus: string
    memberSince: string
    emailNotifications: string
    smsNotifications: string
    marketingEmails: string
    language: string
    theme: string
    currency: string
    darkMode: string
    lightMode: string
    systemDefault: string
    saveChanges: string
    saving: string
    profileUpdated: string
    passwordChanged: string
    settingsSaved: string
    currentPassword: string
    newPassword: string
    confirmPassword: string
    showPassword: string
    hidePassword: string
    passwordMismatch: string
    passwordTooShort: string
    passwordChangedSuccess: string
    passwordChangeError: string
    unknown: string
    // Sidebar translations
    myBookings: string
    settings: string
    goToHomepage: string
    user: string
    member: string
    active: string
    // Settings page translations
    personalInformation: string
    updatePersonalInfoDescription: string
    fullName: string
    email: string
    phone: string
    managePasswordDescription: string
    changePassword: string
    changingPassword: string
    passwordChangedSuccess: string
    notifications: string
    manageNotificationsDescription: string
    receiveNotificationsViaEmail: string
    receiveNotificationsViaSMS: string
    receiveMarketingEmails: string
    customizeAccountPreferences: string
    choosePreferredLanguage: string
    currentAccountStatus: string
    whenYouJoinedSyriaWay: string
    saving: string
    settingsSavedSuccess: string
    profileUpdatedSuccess: string
    // Notifications page translations
    unreadNotifications: string
    markAllAsRead: string
    filters: string
    searchNotifications: string
    category: string
    status: string
    loadingNotifications: string
    noNotificationsFound: string
    tryAdjustingFilters: string
    allCaughtUp: string
    markAsRead: string
    archive: string
    urgent: string
    justNow: string
    ago: string
    minutes: string
    hours: string
    // Notification bell translations
    markAllRead: string
    noNotifications: string
    markRead: string
    viewAllNotifications: string
  }
  userDropdown?: {
    profile: string
    serviceDashboard: string
    dashboard: string
    controlPanel: string
    settings: string
    signOut: string
  }
  errors?: {
    pageNotFound: string
    pageNotFoundMessage: string
  }
  booking?: {
    bookTour: string
    bookCar: string
    tourDetails: string
    carDetails: string
    rentalPeriod: string
    rentalOptions: string
    contactInformation: string
    specialRequests: string
    priceSummary: string
    bookingSummary: string
    tourDates: string
    tourGuide: string
    description: string
    startLocation: string
    endLocation: string
    duration: string
    capacity: string
    pricePerPerson: string
    pricePerDay: string
    startDate: string
    endDate: string
    numberOfGuests: string
    includeDriver: string
    professionalDriver: string
    fullName: string
    phoneNumber: string
    emailAddress: string
    specialRequests: string
    anySpecialRequirements: string
    total: string
    rental: string
    driver: string
    days: string
    confirmBooking: string
    creatingBooking: string
    bookNow: string
    booking: string
    cancel: string
    close: string
    bookThisTour: string
    maximumCapacity: string
    totalPrice: string
    theseDatesAreFixed: string
    authenticationRequired: string
    pleaseSignInToBook: string
    bookingNotAllowed: string
    serviceProvidersCannotBook: string
    validationError: string
    pleaseFillRequiredFields: string
    capacityError: string
    tourCanOnlyAccommodate: string
    numberGuestsMustBeAtLeast: string
    bookingSuccessful: string
    tourBookingCreated: string
    bookingError: string
    failedToCreateBooking: string
    pleaseSignInToBookCar: string
    cannotBookOwnCar: string
    pleaseSelectDates: string
    endDateMustBeAfterStart: string
    startDateCannotBePast: string
    bookingRequestSent: string
    waitingForApproval: string
    failedToBookCar: string
    brand: string
    model: string
    year: string
    color: string
    licensePlate: string
    location: string
    pickADate: string
    reviews: string
    guide: string
    dates: string
    guests: string
  }
  tourTypes?: {
    historical: string
    cultural: string
    adventure: string
    religious: string
    nature: string
    custom: string
  }
  tours?: {
    pageTitle: string
    pageDescription: string
    requestSpecialTour: string
    searchPlaceholder: string
    allCategories: string
    allGuides: string
    allPrices: string
    under100: string
    price100to300: string
    over300: string
    clear: string
    showingResults: string
    noToursFound: string
    viewDetails: string
    bookNow: string
    tourGuide: string
    description: string
    duration: string
    capacity: string
    people: string
    hours: string
    close: string
    bookThisTour: string
    requestSpecialTourTitle: string
    requestSpecialTourDescription: string
    fullName: string
    email: string
    phoneNumber: string
    tourType: string
    selectTourType: string
    selectGuide: string
    chooseGuideOrLetUsPick: string
    loadingGuides: string
    letUsChoose: string
    preferredDates: string
    groupSize: string
    budget: string
    specialRequirements: string
    additionalMessage: string
    cancel: string
    submitRequest: string
    yourFullName: string
    yourEmail: string
    yourPhone: string
    datesExample: string
    numberOfPeople: string
    budgetPerPerson: string
    specialNeedsPlaceholder: string
    dreamTourPlaceholder: string
    authenticationRequired: string
    pleaseSignIn: string
    requestNotAllowed: string
    serviceProvidersNotAllowed: string
    missingInformation: string
    fillRequiredFields: string
    success: string
    requestSubmitted: string
    error: string
    failedToLoadTours: string
    failedToLoadGuides: string
    failedToSubmitRequest: string
    new: string
    reviews: string
    bio: string
    specialties: string
    languages: string
    baseLocation: string
    yearsExp: string
    perDay: string
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
      whyChooseSyriaway: "Why Choose Syria way?",
      whyChooseSyriawayDescription: "Discover the unique advantages that make Syria way your trusted travel partner.",
      ourBenefits: "Our Benefits",
      ourBenefitsDescription: "Experience the benefits of choosing Syria way for your travel needs.",
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
      allRightsReserved: "© 2025 Syria way. All rights reserved.",
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
      basicPackage: "Basic Package",
      goldenPackage: "Golden Package",
      premiumPackage: "Premium Package",
      noBundlesAvailable: "No bundles available at the moment",
      chooseBundle: "Choose Bundle",
      days: "days",
      upTo: "Up to",
      of: "of",
      refreshBundles: "Refresh Bundles",
      requestBundle: "Request Bundle",
      bundleRequest: "Bundle Request",
      preferredStartDate: "Preferred Start Date",
      preferredEndDate: "Preferred End Date",
      numberOfGuests: "Number of Guests",
      travelStyle: "Travel Style",
      budgetRange: "Budget Range (Optional)",
      contactPhoneNumber: "Contact Phone Number",
      specialRequirements: "Special Requirements",
      additionalMessage: "Additional Message",
      submitRequest: "Submit Request",
      submitting: "Submitting...",
      guest: "Guest",
      guests: "Guests",
      budget: "Budget",
      standard: "Standard",
      premiumStyle: "Premium",
      luxury: "Luxury",
      authenticationRequired: "Authentication Required",
      pleaseSignIn: "Please sign in to request a bundle.",
      noBundleSelected: "No bundle selected.",
      missingInformation: "Missing Information",
      fillRequiredFields: "Please fill in all required fields.",
      requestSubmitted: "Request Submitted",
      requestSubmittedDescription: "Your bundle request has been submitted successfully. We will contact you soon to discuss the details.",
      failedToSubmit: "Failed to submit bundle request",
      budgetPlaceholder: "e.g., $1000-2000 USD",
      phonePlaceholder: "+963 11 123 4567",
      requirementsPlaceholder: "Any special requirements, dietary restrictions, accessibility needs, etc.",
      messagePlaceholder: "Any additional information or questions you'd like to share...",
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
        // Bundle checkbox features
        hotelAccommodation: "Hotel accommodation",
        carRentalService: "Car rental service",
        professionalTourGuide: "Professional tour guide",
        customItinerary: "Custom itinerary",
        localSupport: "Local support",
        flexibleBooking: "Flexible booking",
      },
    },
    umrah: {
      title: "Umrah Packages",
      subtitle: "Discover our comprehensive Umrah packages for a spiritual journey",
      availablePackages: "Available Packages",
      noPackagesAvailable: "No packages available at the moment",
      selectSeason: "Select Season",
      allSeasons: "All Seasons",
      ramadan: "Ramadan",
      hajj: "Hajj",
      packageDetails: "Package Details",
      requestPackage: "Request Package",
      requestUmrah: "Request Umrah",
      packageRequest: "Package Request",
      preferredDates: "Preferred Dates",
      startDate: "Start Date",
      endDate: "End Date",
      numberOfPilgrims: "Number of Pilgrims",
      maxPilgrims: "Max Pilgrims",
      contactPhoneNumber: "Contact Phone Number",
      alternativeEmail: "Alternative Email",
      specialRequirements: "Special Requirements",
      additionalMessage: "Additional Message",
      submitRequest: "Submit Request",
      submitting: "Submitting...",
      authenticationRequired: "Authentication Required",
      pleaseSignIn: "Please sign in to request an Umrah package.",
      noPackageSelected: "No package selected.",
      missingInformation: "Missing Information",
      fillRequiredFields: "Please fill in all required fields.",
      requestSubmitted: "Request Submitted",
      requestSubmittedDescription: "Your Umrah request has been submitted successfully. We will contact you soon to discuss the details.",
      failedToSubmit: "Failed to submit Umrah request",
      phonePlaceholder: "+963 11 123 4567",
      emailPlaceholder: "your.email@example.com",
      requirementsPlaceholder: "Any special requirements, dietary restrictions, accessibility needs, etc.",
      messagePlaceholder: "Any additional information or questions you'd like to share...",
      features: {
        accommodation: "Accommodation",
        transportation: "Transportation",
        visaAssistance: "Visa Assistance",
        guidedTours: "Guided Tours",
        meals: "Meals",
        airportTransfers: "Airport Transfers",
        hotelNearHaram: "Hotel Near Haram",
        luxuryAccommodation: "Luxury Accommodation",
        privateTransportation: "Private Transportation",
        vipServices: "VIP Services",
        spiritualGuidance: "Spiritual Guidance",
        groupPrayers: "Group Prayers",
        ziyarahTours: "Ziyarah Tours",
        medicalSupport: "Medical Support",
        insurance: "Insurance",
        documentation: "Documentation",
      },
      packageDetails: {
        days: "Days",
        numberOfPilgrims: "Number of Pilgrims",
        maxPilgrims: "Max Pilgrims",
        duration: "Duration",
        price: "Price",
        currency: "Currency",
        startDate: "Start Date",
        endDate: "End Date",
        packageType: "Package Type",
        standard: "Standard",
        premium: "Premium",
        luxury: "Luxury",
        economy: "Economy",
        midRange: "Mid-Range",
        highEnd: "High-End",
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
      myBlogPosts: "My Blog Posts",
      noBlogPostsYet: "No blog posts yet",
      startSharingExperiences: "Start sharing experiences",
      createFirstPost: "Create your first post",
      loadingBlogPosts: "Loading blog posts...",
      blogPostDeleted: "Blog post deleted",
      blogPostUpdated: "Blog post updated",
      blogPostCreated: "Blog post created",
      deleteBlogPost: "Delete blog post",
      deleteBlogPostConfirm: "Are you sure you want to delete this blog post?",
      deleteBlogPostDescription: "This action cannot be undone.",
      profile: "Profile",
      security: "Security",
      preferences: "Preferences",
      role: "Role",
      accountStatus: "Account Status",
      memberSince: "Member Since",
      emailNotifications: "Email Notifications",
      smsNotifications: "SMS Notifications",
      marketingEmails: "Marketing Emails",
      language: "Language",
      theme: "Theme",
      currency: "Currency",
      darkMode: "Dark Mode",
      lightMode: "Light Mode",
      systemDefault: "System Default",
      saveChanges: "Save Changes",
      saving: "Saving...",
      profileUpdated: "Profile updated successfully!",
      passwordChanged: "Password changed successfully!",
      settingsSaved: "Settings saved successfully!",
      currentPassword: "Current Password",
      newPassword: "New Password",
      confirmPassword: "Confirm Password",
      showPassword: "Show Password",
      hidePassword: "Hide Password",
      passwordMismatch: "Password mismatch",
      passwordTooShort: "Password too short",
      passwordChangedSuccess: "Password changed successfully!",
      passwordChangeError: "Password change error",
      unknown: "Unknown",
      myBookings: "My Bookings",
      settings: "Settings",
      goToHomepage: "Go to Homepage",
      user: "User",
      member: "Member",
      active: "Active",
      personalInformation: "Personal Information",
      updatePersonalInfoDescription: "Update your personal information and contact details.",
      fullName: "Full Name",
      email: "Email",
      phone: "Phone",
      managePasswordDescription: "Manage your password and security settings.",
      changePassword: "Change Password",
      changingPassword: "Changing Password",
      passwordChangedSuccess: "Password changed successfully!",
      notifications: "Notifications",
      manageNotificationsDescription: "Manage how you receive notifications.",
      receiveNotificationsViaEmail: "Receive notifications via email.",
      receiveNotificationsViaSMS: "Receive notifications via SMS.",
      receiveMarketingEmails: "Receive marketing emails and promotions.",
      customizeAccountPreferences: "Customize your account preferences.",
      choosePreferredLanguage: "Choose Preferred Language",
      currentAccountStatus: "Current Account Status",
      whenYouJoinedSyriaWay: "When you joined Syria Way",
      saving: "Saving...",
      settingsSavedSuccess: "Settings saved successfully!",
      profileUpdatedSuccess: "Profile updated successfully!",
      unreadNotifications: "Unread Notifications",
      markAllAsRead: "Mark All as Read",
      filters: "Filters",
      searchNotifications: "Search Notifications",
      category: "Category",
      status: "Status",
      loadingNotifications: "Loading Notifications",
      noNotificationsFound: "No Notifications Found",
      tryAdjustingFilters: "Try Adjusting Filters",
      allCaughtUp: "All Caught Up",
      markAsRead: "Mark as Read",
      archive: "Archive",
      urgent: "Urgent",
      justNow: "Just Now",
      ago: "Ago",
      minutes: "Minutes",
      hours: "Hours",
      markAllRead: "Mark All as Read",
      noNotifications: "No Notifications",
      markRead: "Mark as Read",
      viewAllNotifications: "View All Notifications",
    },
    userDropdown: {
      profile: "Profile",
      serviceDashboard: "Service Dashboard",
      dashboard: "Dashboard",
      controlPanel: "Control Panel",
      settings: "Settings",
      signOut: "Sign out",
    },
    errors: {
      pageNotFound: "Page Not Found",
      pageNotFoundMessage: "The page you are looking for doesn't exist or has been moved.",
    },
    booking: {
      bookTour: "Book Tour",
      bookCar: "Book Car",
      tourDetails: "Tour Details",
      carDetails: "Car Details",
      rentalPeriod: "Rental Period",
      rentalOptions: "Rental Options",
      contactInformation: "Contact Information",
      specialRequests: "Special Requests (Optional)",
      priceSummary: "Price Summary",
      bookingSummary: "Booking Summary",
      tourDates: "Tour Dates",
      tourGuide: "Tour Guide",
      description: "Description",
      startLocation: "Start Location",
      endLocation: "End Location",
      duration: "Duration",
      capacity: "Capacity",
      pricePerPerson: "Price per person",
      pricePerDay: "Price per Day",
      startDate: "Start Date",
      endDate: "End Date",
      numberOfGuests: "Number of Guests",
      includeDriver: "Include Driver",
      professionalDriver: "Professional driver (+$50/day)",
      fullName: "Full Name",
      phoneNumber: "Phone Number",
      emailAddress: "Email Address",
      specialRequests: "Special Requirements",
      anySpecialRequirements: "Any special requirements or requests...",
      total: "Total",
      rental: "Rental",
      driver: "Driver",
      days: "days",
      confirmBooking: "Confirm Booking",
      creatingBooking: "Creating Booking...",
      bookNow: "Book Now",
      booking: "Booking...",
      cancel: "Cancel",
      close: "Close",
      bookThisTour: "Book This Tour",
      maximumCapacity: "Maximum capacity",
      totalPrice: "Total Price",
      theseDatesAreFixed: "These dates are fixed for this tour and cannot be changed.",
      authenticationRequired: "Authentication Required",
      pleaseSignInToBook: "Please sign in to make a booking.",
      bookingNotAllowed: "Booking Not Allowed",
      serviceProvidersCannotBook: "Service providers and administrators cannot make bookings. Please use a customer account.",
      validationError: "Validation Error",
      pleaseFillRequiredFields: "Please fill in all required fields.",
      capacityError: "Capacity Error",
      tourCanOnlyAccommodate: "This tour can only accommodate up to",
      numberGuestsMustBeAtLeast: "Number of guests must be at least 1.",
      bookingSuccessful: "Booking Successful!",
      tourBookingCreated: "Your tour booking has been created successfully.",
      bookingError: "Booking Error",
      failedToCreateBooking: "Failed to create booking. Please try again.",
      pleaseSignInToBookCar: "Please sign in to book a car",
      cannotBookOwnCar: "You cannot book your own car.",
      pleaseSelectDates: "Please select start and end dates",
      endDateMustBeAfterStart: "End date must be after start date",
      startDateCannotBePast: "Start date cannot be in the past",
      bookingRequestSent: "Booking request sent successfully! Waiting for car owner approval.",
      waitingForApproval: "Waiting for car owner approval.",
      failedToBookCar: "Failed to book car",
      brand: "Brand/Model",
      model: "Model",
      year: "Year",
      color: "Color",
      licensePlate: "License Plate",
      location: "Location",
      pickADate: "Pick a date",
      reviews: "reviews",
      guide: "Guide",
      dates: "Dates",
      guests: "Guests",
    },
    tourTypes: {
      historical: "تاريخي",
      cultural: "ثقافي",
      adventure: "مغامرة",
      religious: "ديني",
      nature: "طبيعي",
      custom: "مخصص",
    },
         tours: {
       pageTitle: "Guided Tours",
       pageDescription: "Discover the best of Syria with our expertly guided tours. From historical expeditions to cultural experiences and natural adventures, our tours offer authentic insights into Syria's rich heritage and beauty.",
       requestSpecialTour: "Request Special Tour",
       searchPlaceholder: "Search tours...",
       allCategories: "All Categories",
       allGuides: "All Guides",
       allPrices: "All Prices",
       under100: "Under $100",
       price100to300: "$100 - $300",
       over300: "Over $300",
       clear: "Clear",
       showingResults: "Showing {count} of {total} tours",
       noToursFound: "No tours found matching your search criteria.",
       viewDetails: "View Details",
       bookNow: "Book Now",
       tourGuide: "Tour Guide",
       description: "Description",
       duration: "Duration",
       capacity: "Capacity",
       people: "people",
       hours: "hours",
       close: "Close",
       bookThisTour: "Book This Tour",
       requestSpecialTourTitle: "Request Special Tour",
       requestSpecialTourDescription: "Tell us about your dream tour and we'll connect you with the perfect guide.",
       fullName: "Full Name",
       email: "Email",
       phoneNumber: "Phone Number",
       tourType: "Tour Type",
       selectTourType: "Select tour type",
       selectGuide: "Select Guide",
       chooseGuideOrLetUsPick: "Choose a guide or let us pick for you",
       loadingGuides: "Loading guides...",
       letUsChoose: "Let us choose the best guide for you",
       preferredDates: "Preferred Dates",
       groupSize: "Group Size",
       budget: "Budget (USD)",
       specialRequirements: "Special Requirements",
       additionalMessage: "Additional Message",
       cancel: "Cancel",
       submitRequest: "Submit Request",
       yourFullName: "Your full name",
       yourEmail: "your.email@example.com",
       yourPhone: "+1234567890",
       datesExample: "e.g., July 15-20, 2024",
       numberOfPeople: "Number of people",
       budgetPerPerson: "Your budget per person",
       specialNeedsPlaceholder: "Any special needs, accessibility requirements, or specific requests...",
       dreamTourPlaceholder: "Tell us more about your dream tour...",
       authenticationRequired: "Authentication Required",
       pleaseSignIn: "Please sign in to submit a special tour request.",
       requestNotAllowed: "Request Not Allowed",
       serviceProvidersNotAllowed: "Service providers and administrators cannot submit special tour requests. Please use a customer account.",
       missingInformation: "Missing Information",
       fillRequiredFields: "Please fill in all required fields (Name, Email, and Tour Type).",
       success: "Success",
       requestSubmitted: "Your special tour request has been submitted successfully!",
       error: "Error",
       failedToLoadTours: "Failed to load tours. Please try again.",
       failedToLoadGuides: "Failed to load guides. Please try again.",
       failedToSubmitRequest: "Failed to submit special tour request. Please try again.",
       new: "New",
       reviews: "reviews",
       bio: "Bio",
       specialties: "Specialties",
       languages: "Languages",
       baseLocation: "Base Location",
       yearsExp: "years exp.",
       perDay: "/day"
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
      whyChooseSyriaway: "لماذا تختار سوريا وايز؟",
      whyChooseSyriawayDescription: "اكتشف المزايا الفريدة التي تجعل سوريا وايز شريك سفرك الموثوق.",
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
      allRightsReserved: "© 2025 سوريا واي. جميع الحقوق محفوظة.",
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
      basicPackage: "الباقة الأساسية",
      goldenPackage: "الباقة الذهبية",
      premiumPackage: "الباقة المتميزة",
      noBundlesAvailable: "لا توجد باقات متاحة حالياً",
      chooseBundle: "اختر الباقة",
      days: "أيام",
      upTo: "حتى",
      of: "من",
      refreshBundles: "تحديث الباقات",
      requestBundle: "طلب الباقة",
      bundleRequest: "طلب الباقة",
      preferredStartDate: "تاريخ البداية المفضل",
      preferredEndDate: "تاريخ النهاية المفضل",
      numberOfGuests: "عدد الضيوف",
      travelStyle: "نمط السفر",
      budgetRange: "نطاق الميزانية (اختياري)",
      contactPhoneNumber: "رقم الهاتف للتواصل",
      specialRequirements: "المتطلبات الخاصة",
      additionalMessage: "رسالة إضافية",
      submitRequest: "إرسال الطلب",
      submitting: "جاري الإرسال...",
      guest: "ضيف",
      guests: "ضيوف",
      budget: "ميزانية",
      standard: "قياسي",
      premiumStyle: "متميز",
      luxury: "فاخر",
      authenticationRequired: "مطلوب تسجيل الدخول",
      pleaseSignIn: "يرجى تسجيل الدخول لطلب الباقة.",
      noBundleSelected: "لم يتم اختيار باقة.",
      missingInformation: "معلومات مفقودة",
      fillRequiredFields: "يرجى ملء جميع الحقول المطلوبة.",
      requestSubmitted: "تم إرسال الطلب",
      requestSubmittedDescription: "تم إرسال طلب الباقة بنجاح. سنتواصل معك قريباً لمناقشة التفاصيل.",
      failedToSubmit: "فشل في إرسال طلب الباقة",
      budgetPlaceholder: "مثال: 1000-2000 دولار أمريكي",
      phonePlaceholder: "+963 11 123 4567",
      requirementsPlaceholder: "أي متطلبات خاصة، قيود غذائية، احتياجات ذوي الهمم، إلخ.",
      messagePlaceholder: "أي معلومات إضافية أو أسئلة تود مشاركتها...",
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
        // Bundle checkbox features
        hotelAccommodation: "إقامة فندقية",
        carRentalService: "خدمة تأجير السيارات",
        professionalTourGuide: "مرشد سياحي محترف",
        customItinerary: "جدول سفر مخصص",
        localSupport: "دعم محلي",
        flexibleBooking: "حجز مرن",
      },
    },
    umrah: {
      title: "باقات العمرة",
      subtitle: "اكتشف باقات العمرة الشاملة لرحلة روحية",
      availablePackages: "الباقات المتاحة",
      noPackagesAvailable: "لا توجد باقات متاحة حالياً",
      selectSeason: "اختر الموسم",
      allSeasons: "جميع المواسم",
      ramadan: "رمضان",
      hajj: "الحج",
      packageDetails: "تفاصيل الباقة",
      requestPackage: "طلب الباقة",
      requestUmrah: "طلب العمرة",
      packageRequest: "طلب الباقة",
      preferredDates: "التواريخ المفضلة",
      startDate: "تاريخ البداية",
      endDate: "تاريخ النهاية",
      numberOfPilgrims: "عدد الحجاج",
      maxPilgrims: "الحد الأقصى للحجاج",
      contactPhoneNumber: "رقم الهاتف للتواصل",
      alternativeEmail: "البريد الإلكتروني البديل",
      specialRequirements: "المتطلبات الخاصة",
      additionalMessage: "رسالة إضافية",
      submitRequest: "إرسال الطلب",
      submitting: "جاري الإرسال...",
      authenticationRequired: "مطلوب تسجيل الدخول",
      pleaseSignIn: "يرجى تسجيل الدخول لطلب باقة العمرة.",
      noPackageSelected: "لم يتم اختيار باقة.",
      missingInformation: "معلومات مفقودة",
      fillRequiredFields: "يرجى ملء جميع الحقول المطلوبة.",
      requestSubmitted: "تم إرسال الطلب",
      requestSubmittedDescription: "تم إرسال طلب العمرة بنجاح. سنتواصل معك قريباً لمناقشة التفاصيل.",
      failedToSubmit: "فشل في إرسال طلب العمرة",
      phonePlaceholder: "+963 11 123 4567",
      emailPlaceholder: "بريدك.الإلكتروني@مثال.com",
      requirementsPlaceholder: "أي متطلبات خاصة، قيود غذائية، احتياجات ذوي الهمم، إلخ.",
      messagePlaceholder: "أي معلومات إضافية أو أسئلة تود مشاركتها...",
      features: {
        accommodation: "الإقامة",
        transportation: "النقل",
        visaAssistance: "مساعدة التأشيرة",
        guidedTours: "جولات مع مرشد",
        meals: "الوجبات",
        airportTransfers: "نقل من وإلى المطار",
        hotelNearHaram: "فندق قريب من الحرم",
        luxuryAccommodation: "إقامة فاخرة",
        privateTransportation: "نقل خاص",
        vipServices: "خدمات VIP",
        spiritualGuidance: "إرشاد روحي",
        groupPrayers: "صلاة جماعية",
        ziyarahTours: "جولات الزيارة",
        medicalSupport: "دعم طبي",
        insurance: "التأمين",
        documentation: "التوثيق",
      },
      packageDetails: {
        days: "أيام",
        numberOfPilgrims: "عدد الحجاج",
        maxPilgrims: "الحد الأقصى للحجاج",
        duration: "المدة",
        price: "السعر",
        currency: "العملة",
        startDate: "تاريخ البداية",
        endDate: "تاريخ النهاية",
        packageType: "نوع الباقة",
        standard: "قياسي",
        premium: "متميز",
        luxury: "فاخر",
        economy: "اقتصادي",
        midRange: "متوسط",
        highEnd: "عالي الجودة",
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
      myBlogPosts: "منشوراتي في المدونة",
      noBlogPostsYet: "لا توجد منشورات في المدونة بعد",
      startSharingExperiences: "ابدأ مشاركة التجربة",
      createFirstPost: "أنشأ منشورًا جديدًا",
      loadingBlogPosts: "جاري تحميل المنشورات...",
      blogPostDeleted: "تم حذف المنشور",
      blogPostUpdated: "تم تحديث المنشور",
      blogPostCreated: "تم إنشاء منشور جديد",
      deleteBlogPost: "حذف المنشور",
      deleteBlogPostConfirm: "هل أنت متأكد؟",
      deleteBlogPostDescription: "هذا العمل غير قابل للتراجع.",
      profile: "الملف الشخصي",
      security: "الأمان",
      preferences: "التفضيلات",
      role: "الدور",
      accountStatus: "حالة الحساب",
      memberSince: "منذ",
      emailNotifications: "إشعارات البريد الإلكتروني",
      smsNotifications: "إشعارات الرسائل النصية",
      marketingEmails: "رسائل تسويقية",
      language: "اللغة",
      theme: "المظهر",
      currency: "العملة",
      darkMode: "الوضع الداكن",
      lightMode: "الوضع الفاتح",
      systemDefault: "إعدادات النظام",
      saveChanges: "حفظ التغييرات",
      saving: "جاري الحفظ...",
      profileUpdated: "تم تحديث الملف الشخصي بنجاح!",
      passwordChanged: "تم تغيير كلمة المرور بنجاح!",
      settingsSaved: "تم حفظ الإعدادات بنجاح!",
      currentPassword: "كلمة المرور الحالية",
      newPassword: "كلمة المرور الجديدة",
      confirmPassword: "تأكيد كلمة المرور",
      showPassword: "إظهار كلمة المرور",
      hidePassword: "إخفاء كلمة المرور",
      passwordMismatch: "كلمة المرور غير متطابقة",
      passwordTooShort: "كلمة المرور قصيرة جدًا",
      passwordChangedSuccess: "تم تغيير كلمة المرور بنجاح!",
      passwordChangeError: "خطأ في تغيير كلمة المرور",
      unknown: "مجهول",
      myBookings: "حجوزاتي",
      settings: "الإعدادات",
      goToHomepage: "العودة للرئيسية",
      user: "المستخدم",
      member: "الأعضاء",
      active: "الحالي",
      personalInformation: "المعلومات الشخصية",
      updatePersonalInfoDescription: "تحديث معلوماتك الشخصية وتفاصيل الاتصال.",
      fullName: "الاسم الكامل",
      email: "البريد الإلكتروني",
      phone: "رقم الهاتف",
      managePasswordDescription: "إدارة كلمة المرور وإعدادات الأمان.",
      changePassword: "تغيير كلمة المرور",
      changingPassword: "تغيير كلمة المرور",
      passwordChangedSuccess: "تم تغيير كلمة المرور بنجاح!",
      notifications: "الإشعارات",
      manageNotificationsDescription: "إدارة كيفية تلقي الإشعارات.",
      receiveNotificationsViaEmail: "تلقي الإشعارات عبر البريد الإلكتروني.",
      receiveNotificationsViaSMS: "تلقي الإشعارات عبر الرسائل القصيرة.",
      receiveMarketingEmails: "تلقي رسائل البريد الإلكتروني التسويقية والعروض الترويجية.",
      customizeAccountPreferences: "تخصيص تفضيلات الحساب.",
      choosePreferredLanguage: "اختيار اللغة المفضلة",
      currentAccountStatus: "حالة الحساب الحالية",
      whenYouJoinedSyriaWay: "متى ستضيف سوريا وايز",
      saving: "جاري الحفظ...",
      settingsSavedSuccess: "تم حفظ الإعدادات بنجاح!",
      profileUpdatedSuccess: "تم تحديث الملف الشخصي بنجاح!",
      unreadNotifications: "إشعارات غير مقروءة",
      markAllAsRead: "إشعارات جميع المقروءة",
      filters: "المرشحات",
      searchNotifications: "بحث عن الإشعارات",
      category: "الفئة",
      status: "الحالة",
      loadingNotifications: "جاري تحميل الإشعارات",
      noNotificationsFound: "لم يتم العثور على إشعارات",
      tryAdjustingFilters: "حاول تعديل المرشحات",
      allCaughtUp: "جميع الإشعارات مقروءة",
      markAsRead: "إشعارات جديدة",
      archive: "أرشيف",
      urgent: "مهم",
      justNow: "منذ لحظات",
      ago: "منذ",
      minutes: "دقائق",
      hours: "ساعات",
      markAllRead: "إشعارات جميع المقروءة",
      noNotifications: "لا توجد إشعارات",
      markRead: "إشعارات جديدة",
      viewAllNotifications: "عرض جميع الإشعارات",
    },
    userDropdown: {
      profile: "الملف الشخصي",
      serviceDashboard: "لوحة تحكم الخدمات",
      dashboard: "لوحة التحكم",
      controlPanel: "لوحة التحكم الرئيسية",
      settings: "الإعدادات",
      signOut: "تسجيل الخروج",
    },
    errors: {
      pageNotFound: "الصفحة غير موجودة",
      pageNotFoundMessage: "الصفحة التي تبحث عنها غير موجودة أو تم نقلها.",
    },
    booking: {
      bookTour: "حجز جولة",
      bookCar: "حجز سيارة",
      tourDetails: "تفاصيل الجولة",
      carDetails: "تفاصيل السيارة",
      rentalPeriod: "فترة التأجير",
      rentalOptions: "خيارات التأجير",
      contactInformation: "معلومات الاتصال",
      specialRequests: "طلبات خاصة (اختياري)",
      priceSummary: "ملخص السعر",
      bookingSummary: "ملخص الحجز",
      tourDates: "تواريخ الجولة",
      tourGuide: "المرشد السياحي",
      description: "الوصف",
      startLocation: "موقع البداية",
      endLocation: "موقع النهاية",
      duration: "المدة",
      capacity: "السعة",
      pricePerPerson: "السعر للشخص الواحد",
      pricePerDay: "السعر في اليوم",
      startDate: "تاريخ البداية",
      endDate: "تاريخ النهاية",
      numberOfGuests: "عدد الضيوف",
      includeDriver: "تضمين سائق",
      professionalDriver: "سائق محترف (+50$ في اليوم)",
      fullName: "الاسم الكامل",
      phoneNumber: "رقم الهاتف",
      emailAddress: "عنوان البريد الإلكتروني",
      specialRequests: "المتطلبات الخاصة",
      anySpecialRequirements: "أي متطلبات أو طلبات خاصة...",
      total: "المجموع",
      rental: "التأجير",
      driver: "السائق",
      days: "أيام",
      confirmBooking: "تأكيد الحجز",
      creatingBooking: "جاري إنشاء الحجز...",
      bookNow: "احجز الآن",
      booking: "جاري الحجز...",
      cancel: "إلغاء",
      close: "إغلاق",
      bookThisTour: "احجز هذه الجولة",
      maximumCapacity: "السعة القصوى",
      totalPrice: "السعر الإجمالي",
      theseDatesAreFixed: "هذه التواريخ ثابتة لهذه الجولة ولا يمكن تغييرها.",
      authenticationRequired: "مطلوب تسجيل الدخول",
      pleaseSignInToBook: "يرجى تسجيل الدخول لإجراء الحجز.",
      bookingNotAllowed: "الحجز غير مسموح",
      serviceProvidersCannotBook: "لا يمكن لمقدمي الخدمات والإداريين إجراء الحجوزات. يرجى استخدام حساب العميل.",
      validationError: "خطأ في التحقق",
      pleaseFillRequiredFields: "يرجى ملء جميع الحقول المطلوبة.",
      capacityError: "خطأ في السعة",
      tourCanOnlyAccommodate: "يمكن لهذه الجولة استيعاب ما يصل إلى",
      numberGuestsMustBeAtLeast: "يجب أن يكون عدد الضيوف واحد على الأقل.",
      bookingSuccessful: "تم الحجز بنجاح!",
      tourBookingCreated: "تم إنشاء حجز الجولة بنجاح.",
      bookingError: "خطأ في الحجز",
      failedToCreateBooking: "فشل في إنشاء الحجز. يرجى المحاولة مرة أخرى.",
      pleaseSignInToBookCar: "يرجى تسجيل الدخول لحجز سيارة",
      cannotBookOwnCar: "لا يمكنك حجز سيارتك الخاصة.",
      pleaseSelectDates: "يرجى اختيار تواريخ البداية والنهاية",
      endDateMustBeAfterStart: "يجب أن يكون تاريخ النهاية بعد تاريخ البداية",
      startDateCannotBePast: "لا يمكن أن يكون تاريخ البداية في الماضي",
      bookingRequestSent: "تم إرسال طلب الحجز بنجاح! في انتظار موافقة مالك السيارة.",
      waitingForApproval: "في انتظار موافقة مالك السيارة.",
      failedToBookCar: "فشل في حجز السيارة",
      brand: "الماركة/الموديل",
      model: "الموديل",
      year: "السنة",
      color: "اللون",
      licensePlate: "رقم اللوحة",
      location: "الموقع",
      pickADate: "اختر تاريخاً",
      reviews: "مراجعات",
      guide: "المرشد",
      dates: "التواريخ",
      guests: "الضيوف",
    },
    tourTypes: {
      historical: "تاريخي",
      cultural: "ثقافي",
      adventure: "مغامرة",
      religious: "ديني",
      nature: "طبيعي",
      custom: "مخصص",
    },
    tours: {
      pageTitle: "جولات سياحية",
      pageDescription: "اكتشف أفضل ما في سوريا مع جولاتنا المصحوبة بمرشدين خبراء. من الرحلات التاريخية إلى التجارب الثقافية والمغامرات الطبيعية، تقدم جولاتنا رؤى أصيلة لتراث سوريا الغني وجمالها.",
      requestSpecialTour: "طلب جولة خاصة",
      searchPlaceholder: "البحث في الجولات...",
      allCategories: "جميع الفئات",
      allGuides: "جميع المرشدين",
      allPrices: "جميع الأسعار",
      under100: "أقل من 100$",
      price100to300: "100$ - 300$",
      over300: "أكثر من 300$",
      clear: "مسح",
      showingResults: "عرض {count} من {total} جولة",
      noToursFound: "لم يتم العثور على جولات تطابق معايير البحث.",
      viewDetails: "عرض التفاصيل",
      bookNow: "احجز الآن",
      tourGuide: "مرشد الجولة",
      description: "الوصف",
      duration: "المدة",
      capacity: "السعة",
      people: "أشخاص",
      hours: "ساعات",
      close: "إغلاق",
      bookThisTour: "احجز هذه الجولة",
      requestSpecialTourTitle: "طلب جولة خاصة",
      requestSpecialTourDescription: "أخبرنا عن جولتك المثالية وسنربطك بأفضل مرشد.",
      fullName: "الاسم الكامل",
      email: "البريد الإلكتروني",
      phoneNumber: "رقم الهاتف",
      tourType: "نوع الجولة",
      selectTourType: "اختر نوع الجولة",
      selectGuide: "اختر المرشد",
      chooseGuideOrLetUsPick: "اختر مرشداً أو دعنا نختار لك",
      loadingGuides: "جاري تحميل المرشدين...",
      letUsChoose: "دعنا نختار أفضل مرشد لك",
      preferredDates: "التواريخ المفضلة",
      groupSize: "حجم المجموعة",
      budget: "الميزانية (دولار أمريكي)",
      specialRequirements: "المتطلبات الخاصة",
      additionalMessage: "رسالة إضافية",
      cancel: "إلغاء",
      submitRequest: "إرسال الطلب",
      yourFullName: "اسمك الكامل",
      yourEmail: "بريدك.الإلكتروني@مثال.com",
      yourPhone: "+1234567890",
      datesExample: "مثال: 15-20 يوليو 2024",
      numberOfPeople: "عدد الأشخاص",
      budgetPerPerson: "ميزانيتك للشخص الواحد",
      specialNeedsPlaceholder: "أي احتياجات خاصة أو متطلبات إمكانية الوصول أو طلبات محددة...",
      dreamTourPlaceholder: "أخبرنا المزيد عن جولتك المثالية...",
      authenticationRequired: "مطلوب تسجيل الدخول",
      pleaseSignIn: "يرجى تسجيل الدخول لإرسال طلب جولة خاصة.",
      requestNotAllowed: "الطلب غير مسموح",
      serviceProvidersNotAllowed: "لا يمكن لمقدمي الخدمات والإداريين إرسال طلبات جولات خاصة. يرجى استخدام حساب عميل.",
      missingInformation: "معلومات مفقودة",
      fillRequiredFields: "يرجى ملء جميع الحقول المطلوبة (الاسم والبريد الإلكتروني ونوع الجولة).",
      success: "نجح",
      requestSubmitted: "تم إرسال طلب جولتك الخاصة بنجاح!",
      error: "خطأ",
      failedToLoadTours: "فشل في تحميل الجولات. يرجى المحاولة مرة أخرى.",
      failedToLoadGuides: "فشل في تحميل المرشدين. يرجى المحاولة مرة أخرى.",
      failedToSubmitRequest: "فشل في إرسال طلب الجولة الخاصة. يرجى المحاولة مرة أخرى.",
      new: "جديد",
      reviews: "تقييمات",
      bio: "السيرة الذاتية",
      specialties: "التخصصات",
      languages: "اللغات",
      baseLocation: "الموقع الأساسي",
      yearsExp: "سنوات خبرة",
      perDay: "/يوم"
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
      whyChooseSyriaway: "Pourquoi choisir Syria way?",
      whyChooseSyriawayDescription: "Découvrez les avantages uniques qui font de Syria way votre partenaire de voyage de confiance.",
      ourBenefits: "Nos avantages",
      ourBenefitsDescription: "Découvrez les avantages de choisir Syria way pour vos besoins de voyage.",
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
      allRightsReserved: "© 2025 Syria way. Tous droits réservés.",
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
      basicPackage: "Forfait de base",
      goldenPackage: "Forfait doré",
      premiumPackage: "Forfait premium",
      noBundlesAvailable: "Aucun forfait disponible pour le moment",
      chooseBundle: "Choisir le forfait",
      days: "jours",
      upTo: "Jusqu'à",
      of: "sur",
      refreshBundles: "Actualiser les forfaits",
      requestBundle: "Demander un forfait",
      bundleRequest: "Demande de forfait",
      preferredStartDate: "Date de début préférée",
      preferredEndDate: "Date de fin préférée",
      numberOfGuests: "Nombre d'invités",
      travelStyle: "Style de voyage",
      budgetRange: "Fourchette budgétaire (optionnel)",
      contactPhoneNumber: "Numéro de téléphone de contact",
      specialRequirements: "Exigences spéciales",
      additionalMessage: "Message supplémentaire",
      submitRequest: "Soumettre la demande",
      submitting: "Soumission...",
      guest: "Invité",
      guests: "Invités",
      budget: "Budget",
      standard: "Standard",
      premiumStyle: "Premium",
      luxury: "Luxe",
      authenticationRequired: "Authentification requise",
      pleaseSignIn: "Veuillez vous connecter pour demander un forfait.",
      noBundleSelected: "Aucun forfait sélectionné.",
      missingInformation: "Informations manquantes",
      fillRequiredFields: "Veuillez remplir tous les champs obligatoires.",
      requestSubmitted: "Demande soumise",
      requestSubmittedDescription: "Votre demande de forfait a été soumise avec succès. Nous vous contacterons bientôt pour discuter des détails.",
      failedToSubmit: "Échec de la soumission de la demande de forfait",
      budgetPlaceholder: "ex: 1000-2000 USD",
      phonePlaceholder: "+963 11 123 4567",
      requirementsPlaceholder: "Toute exigence spéciale, restriction alimentaire, besoin d'accessibilité, etc.",
      messagePlaceholder: "Toute information supplémentaire ou question que vous aimeriez partager...",
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
        // Bundle checkbox features
        hotelAccommodation: "Hébergement hôtelier",
        carRentalService: "Service de location de voitures",
        professionalTourGuide: "Guide touristique professionnel",
        customItinerary: "Itinéraire personnalisé",
        localSupport: "Support local",
        flexibleBooking: "Réservation flexible",
      },
    },
    umrah: {
      title: "Forfaits Omra",
      subtitle: "Découvrez nos forfaits Omra complets pour un voyage spirituel",
      availablePackages: "Forfaits disponibles",
      noPackagesAvailable: "Aucun forfait disponible pour le moment",
      selectSeason: "Sélectionner la saison",
      allSeasons: "Toutes les saisons",
      ramadan: "Ramadan",
      hajj: "Hajj",
      packageDetails: "Détails du forfait",
      requestPackage: "Demander le forfait",
      requestUmrah: "Demander l'Omra",
      packageRequest: "Demande de forfait",
      preferredDates: "Dates préférées",
      startDate: "Date de début",
      endDate: "Date de fin",
      numberOfPilgrims: "Nombre de pèlerins",
      maxPilgrims: "Pèlerins max",
      contactPhoneNumber: "Numéro de téléphone de contact",
      alternativeEmail: "Email alternatif",
      specialRequirements: "Exigences spéciales",
      additionalMessage: "Message supplémentaire",
      submitRequest: "Soumettre la demande",
      submitting: "Soumission...",
      authenticationRequired: "Authentification requise",
      pleaseSignIn: "Veuillez vous connecter pour demander un forfait Omra.",
      noPackageSelected: "Aucun forfait sélectionné.",
      missingInformation: "Informations manquantes",
      fillRequiredFields: "Veuillez remplir tous les champs obligatoires.",
      requestSubmitted: "Demande soumise",
      requestSubmittedDescription: "Votre demande d'Omra a été soumise avec succès. Nous vous contacterons bientôt pour discuter des détails.",
      failedToSubmit: "Échec de la soumission de la demande d'Omra",
      phonePlaceholder: "+963 11 123 4567",
      emailPlaceholder: "votre.email@exemple.com",
      requirementsPlaceholder: "Toute exigence spéciale, restriction alimentaire, besoin d'accessibilité, etc.",
      messagePlaceholder: "Toute information supplémentaire ou question que vous aimeriez partager...",
      features: {
        accommodation: "Hébergement",
        transportation: "Transport",
        visaAssistance: "Assistance visa",
        guidedTours: "Visites guidées",
        meals: "Repas",
        airportTransfers: "Transferts aéroport",
        hotelNearHaram: "Hôtel près du Haram",
        luxuryAccommodation: "Hébergement de luxe",
        privateTransportation: "Transport privé",
        vipServices: "Services VIP",
        spiritualGuidance: "Guidance spirituelle",
        groupPrayers: "Prières de groupe",
        ziyarahTours: "Tours de Ziyarah",
        medicalSupport: "Support médical",
        insurance: "Assurance",
        documentation: "Documentation",
      },
      packageDetails: {
        days: "Jours",
        numberOfPilgrims: "Nombre de pèlerins",
        maxPilgrims: "Pèlerins max",
        duration: "Durée",
        price: "Prix",
        currency: "Devise",
        startDate: "Date de début",
        endDate: "Date de fin",
        packageType: "Type de forfait",
        standard: "Standard",
        premium: "Premium",
        luxury: "Luxe",
        economy: "Économique",
        midRange: "Milieu de gamme",
        highEnd: "Haut de gamme",
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
      myBlogPosts: "Mes articles sur le blog",
      noBlogPostsYet: "Aucun article sur le blog pour le moment",
      startSharingExperiences: "Commencer à partager des expériences",
      createFirstPost: "Créer votre premier article",
      loadingBlogPosts: "Chargement des articles du blog...",
      blogPostDeleted: "Article du blog supprimé",
      blogPostUpdated: "Article du blog mis à jour",
      blogPostCreated: "Article du blog créé",
      deleteBlogPost: "Supprimer l'article",
      deleteBlogPostConfirm: "Êtes-vous sûr de vouloir supprimer cet article?",
      deleteBlogPostDescription: "Cette action est irréversible.",
      profile: "Profil",
      security: "Sécurité",
      preferences: "Préférences",
      role: "Rôle",
      accountStatus: "Statut du compte",
      memberSince: "Membre depuis",
      emailNotifications: "Notifications par email",
      smsNotifications: "Notifications par SMS",
      marketingEmails: "Emails marketing",
      language: "Langue",
      theme: "Thème",
      currency: "Devise",
      darkMode: "Mode sombre",
      lightMode: "Mode clair",
      systemDefault: "Paramètres système",
      saveChanges: "Enregistrer les modifications",
      saving: "Sauvegarde en cours...",
      profileUpdated: "Profil mis à jour avec succès!",
      passwordChanged: "Mot de passe modifié avec succès!",
      settingsSaved: "Paramètres enregistrés avec succès!",
      currentPassword: "Mot de passe actuel",
      newPassword: "Nouveau mot de passe",
      confirmPassword: "Confirmer le mot de passe",
      showPassword: "Afficher le mot de passe",
      hidePassword: "Masquer le mot de passe",
      passwordMismatch: "Mot de passe non conforme",
      passwordTooShort: "Mot de passe trop court",
      passwordChangedSuccess: "Mot de passe changé avec succès!",
      passwordChangeError: "Erreur lors du changement de mot de passe",
      unknown: "Inconnu",
      myBookings: "Mes réservations",
      settings: "Paramètres",
      goToHomepage: "Retour à l'accueil",
      user: "Utilisateur",
      member: "Membre",
      active: "Actif",
      personalInformation: "Informations personnelles",
      updatePersonalInfoDescription: "Mettre à jour vos informations personnelles et coordonnées.",
      fullName: "Nom complet",
      email: "Email",
      phone: "Téléphone",
      managePasswordDescription: "Gérer votre mot de passe et vos paramètres de sécurité.",
      changePassword: "Changer le mot de passe",
      changingPassword: "Changement de mot de passe",
      passwordChangedSuccess: "Mot de passe changé avec succès!",
      notifications: "Notifications",
      manageNotificationsDescription: "Gérer la façon dont vous recevez les notifications.",
      receiveNotificationsViaEmail: "Recevoir des notifications par email.",
      receiveNotificationsViaSMS: "Recevoir des notifications par SMS.",
      receiveMarketingEmails: "Recevoir des emails marketing et des promotions.",
      customizeAccountPreferences: "Personnaliser les préférences de votre compte.",
      choosePreferredLanguage: "Choisir la langue préférée",
      currentAccountStatus: "Statut du compte actuel",
      whenYouJoinedSyriaWay: "Quand vous avez rejoint Syria Way",
      saving: "Sauvegarde en cours...",
      settingsSavedSuccess: "Paramètres enregistrés avec succès!",
      profileUpdatedSuccess: "Profil mis à jour avec succès!",
      unreadNotifications: "Notifications non lues",
      markAllAsRead: "Marquer toutes comme lues",
      filters: "Filtres",
      searchNotifications: "Rechercher dans les notifications",
      category: "Catégorie",
      status: "Statut",
      loadingNotifications: "Chargement des notifications",
      noNotificationsFound: "Aucune notification trouvée",
      tryAdjustingFilters: "Essayez de réajuster les filtres",
      allCaughtUp: "Toutes les notifications lues",
      markAsRead: "Marquer comme lue",
      archive: "Archiver",
      urgent: "Urgent",
      justNow: "Il y a quelques secondes",
      ago: "Il y a",
      minutes: "minutes",
      hours: "heures",
      markAllRead: "Mark All as Read",
      noNotifications: "No Notifications",
      markRead: "Mark as Read",
      viewAllNotifications: "View All Notifications",
    },
    userDropdown: {
      profile: "Profil",
      serviceDashboard: "Tableau de bord des services",
      dashboard: "Tableau de bord",
      controlPanel: "Panneau de contrôle",
      settings: "Paramètres",
      signOut: "Se déconnecter",
    },
    errors: {
      pageNotFound: "Page non trouvée",
      pageNotFoundMessage: "La page que vous recherchez n'existe pas ou a été déplacée.",
    },
    booking: {
      bookTour: "Réserver un circuit",
      bookCar: "Réserver une voiture",
      tourDetails: "Détails du circuit",
      carDetails: "Détails de la voiture",
      rentalPeriod: "Période de location",
      rentalOptions: "Options de location",
      contactInformation: "Informations de contact",
      specialRequests: "Demandes spéciales (optionnel)",
      priceSummary: "Résumé des prix",
      bookingSummary: "Résumé de la réservation",
      tourDates: "Dates du circuit",
      tourGuide: "Guide touristique",
      description: "Description",
      startLocation: "Lieu de départ",
      endLocation: "Lieu d'arrivée",
      duration: "Durée",
      capacity: "Capacité",
      pricePerPerson: "Prix par personne",
      pricePerDay: "Prix par jour",
      startDate: "Date de début",
      endDate: "Date de fin",
      numberOfGuests: "Nombre d'invités",
      includeDriver: "Inclure un chauffeur",
      professionalDriver: "Chauffeur professionnel (+50$/jour)",
      fullName: "Nom complet",
      phoneNumber: "Numéro de téléphone",
      emailAddress: "Adresse e-mail",
      specialRequests: "Exigences spéciales",
      anySpecialRequirements: "Toute exigence ou demande spéciale...",
      total: "Total",
      rental: "Location",
      driver: "Chauffeur",
      days: "jours",
      confirmBooking: "Confirmer la réservation",
      creatingBooking: "Création de la réservation...",
      bookNow: "Réserver maintenant",
      booking: "Réservation...",
      cancel: "Annuler",
      close: "Fermer",
      bookThisTour: "Réserver ce circuit",
      maximumCapacity: "Capacité maximale",
      totalPrice: "Prix total",
      theseDatesAreFixed: "Ces dates sont fixes pour ce circuit et ne peuvent pas être modifiées.",
      authenticationRequired: "Authentification requise",
      pleaseSignInToBook: "Veuillez vous connecter pour effectuer une réservation.",
      bookingNotAllowed: "Réservation non autorisée",
      serviceProvidersCannotBook: "Les prestataires de services et les administrateurs ne peuvent pas effectuer de réservations. Veuillez utiliser un compte client.",
      validationError: "Erreur de validation",
      pleaseFillRequiredFields: "Veuillez remplir tous les champs obligatoires.",
      capacityError: "Erreur de capacité",
      tourCanOnlyAccommodate: "Ce circuit ne peut accueillir que jusqu'à",
      numberGuestsMustBeAtLeast: "Le nombre d'invités doit être d'au moins 1.",
      bookingSuccessful: "Réservation réussie !",
      tourBookingCreated: "Votre réservation de circuit a été créée avec succès.",
      bookingError: "Erreur de réservation",
      failedToCreateBooking: "Échec de la création de la réservation. Veuillez réessayer.",
      pleaseSignInToBookCar: "Veuillez vous connecter pour réserver une voiture",
      cannotBookOwnCar: "Vous ne pouvez pas réserver votre propre voiture.",
      pleaseSelectDates: "Veuillez sélectionner les dates de début et de fin",
      endDateMustBeAfterStart: "La date de fin doit être après la date de début",
      startDateCannotBePast: "La date de début ne peut pas être dans le passé",
      bookingRequestSent: "Demande de réservation envoyée avec succès ! En attente de l'approbation du propriétaire de la voiture.",
      waitingForApproval: "En attente de l'approbation du propriétaire de la voiture.",
      failedToBookCar: "Échec de la réservation de la voiture",
      brand: "Marque/Modèle",
      model: "Modèle",
      year: "Année",
      color: "Couleur",
      licensePlate: "Plaque d'immatriculation",
      location: "Emplacement",
      pickADate: "Choisir une date",
      reviews: "avis",
      guide: "Guide",
      dates: "Dates",
      guests: "Invités",
    },
    tourTypes: {
      historical: "Historical",
      cultural: "Cultural",
      adventure: "Adventure",
      religious: "Religious",
      nature: "Nature",
      custom: "Custom",
    },
    tours: {
      pageTitle: "Tours Spéciaux",
      pageDescription: "Découvrez nos tours spéciaux pour une expérience unique",
      requestSpecialTour: "Demandez un tour spécial",
      searchPlaceholder: "Rechercher un tour spécial...",
      allCategories: "Toutes les catégories",
      allGuides: "Tous les guides",
      allPrices: "Tous les prix",
      under100: "Moins de $100",
      price100to300: "$100-300",
      over300: "Plus de $300",
      clear: "Effacer",
      showingResults: "Affichage des résultats",
      noToursFound: "Aucun tour trouvé",
      viewDetails: "Voir les détails",
      bookNow: "Réserver maintenant",
      tourGuide: "Guide",
      description: "Description",
      duration: "Durée",
      capacity: "Capacité",
      people: "Personnes",
      hours: "Heures",
      close: "Fermer",
      bookThisTour: "Réserver ce tour",
      requestSpecialTourTitle: "Demande de tour spécial",
      requestSpecialTourDescription: "Dites-nous vos préférences et nous trouverons le tour parfait pour vous.",
      fullName: "Nom complet",
      email: "Email",
      phoneNumber: "Numéro de téléphone",
      tourType: "Type de tour",
      selectTourType: "Sélectionner le type de tour",
      selectGuide: "Sélectionner un guide",
      chooseGuideOrLetUsPick: "Choisir un guide ou laisser nous choisir",
      loadingGuides: "Chargement des guides...",
      letUsChoose: "Laissons-nous choisir",
      preferredDates: "Dates préférées",
      groupSize: "Taille du groupe",
      budget: "Budget",
      specialRequirements: "Exigences spéciales",
      additionalMessage: "Message supplémentaire",
      cancel: "Annuler",
      submitRequest: "Soumettre la demande",
      yourFullName: "Votre nom complet",
      yourEmail: "Votre email",
      yourPhone: "Votre numéro de téléphone",
      datesExample: "ex: 2023-05-15",
      numberOfPeople: "Nombre de personnes",
      budgetPerPerson: "Budget par personne",
      specialNeedsPlaceholder: "ex: besoins spécifiques, besoins d'accessibilité",
      dreamTourPlaceholder: "ex: destination de rêve",
      authenticationRequired: "Authentification requise",
      pleaseSignIn: "Veuillez vous connecter pour demander un tour spécial.",
      requestNotAllowed: "Demande non autorisée",
      serviceProvidersNotAllowed: "Les fournisseurs de services ne peuvent pas répondre à cette demande. Veuillez utiliser un autre service.",
      missingInformation: "Informations manquantes",
      fillRequiredFields: "Veuillez remplir tous les champs obligatoires.",
      success: "Votre demande a été soumise avec succès. Nous vous contacterons bientôt pour discuter des détails.",
      requestSubmitted: "Demande soumise",
      error: "Erreur lors de la soumission de la demande",
      failedToLoadTours: "Échec du chargement des tours",
      failedToLoadGuides: "Échec du chargement des guides",
      failedToSubmitRequest: "Échec de la soumission de la demande",
      new: "Nouveau",
      reviews: "Avis",
      bio: "Bio",
      specialties: "Spécialités",
      languages: "Langues",
      baseLocation: "Lieu de base",
      yearsExp: "Expérience",
      perDay: "Par jour",
    },
  },
}
