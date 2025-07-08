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
    loading: string
    error: string
    success: string
    cancel: string
    save: string
    edit: string
    delete: string
    view: string
    create: string
    update: string
    confirm: string
    yes: string
    no: string
    close: string
    next: string
    previous: string
    search: string
    filter: string
    sort: string
    all: string
    none: string
    select: string
    choose: string
    upload: string
    download: string
    share: string
    like: string
    dislike: string
    comment: string
    reply: string
    follow: string
    unfollow: string
    bookmark: string
    rate: string
    review: string
    report: string
    block: string
    unblock: string
    verify: string
    approve: string
    reject: string
    publish: string
    unpublish: string
    draft: string
    pending: string
    published: string
    rejected: string
    featured: string
    popular: string
    trending: string
    latest: string
    oldest: string
    newest: string
    best: string
    worst: string
    highest: string
    lowest: string
    most: string
    least: string
    total: string
    average: string
    minimum: string
    maximum: string
    count: string
    amount: string
    price: string
    cost: string
    free: string
    paid: string
    discount: string
    offer: string
    deal: string
    sale: string
    new: string
    used: string
    available: string
    unavailable: string
    inStock: string
    outOfStock: string
    limited: string
    unlimited: string
    required: string
    optional: string
    recommended: string
    suggested: string
  }
  nav: {
    services: string
    tourismSites: string
    tourismNews: string
    blog: string
    offers: string
    home: string
    about: string
    contact: string
    dashboard: string
    profile: string
    settings: string
    logout: string
    login: string
    register: string
    language: string
    theme: string
    notifications: string
    messages: string
    help: string
    support: string
    faq: string
    terms: string
    privacy: string
    cookies: string
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
    allServices: string
    popularServices: string
    featuredServices: string
    newServices: string
    serviceDetails: string
    serviceDescription: string
    serviceFeatures: string
    serviceBenefits: string
    serviceRequirements: string
    serviceDuration: string
    serviceLocation: string
    servicePrice: string
    serviceRating: string
    serviceReviews: string
    bookNow: string
    learnMore: string
    getQuote: string
    contactProvider: string
    viewDetails: string
    compareServices: string
    shareService: string
    recommendService: string
  }
  tourismSites: {
    historicalSites: string
    naturalSites: string
    religiousSites: string
    allSites: string
    popularSites: string
    featuredSites: string
    newSites: string
    siteDetails: string
    siteDescription: string
    siteHistory: string
    siteLocation: string
    siteTips: string
    siteFacilities: string
    siteOpeningHours: string
    siteEntryFee: string
    siteBestTime: string
    siteHowToReach: string
    siteNearbyHotels: string
    siteNearbyRestaurants: string
    sitePhotos: string
    siteVideos: string
    siteReviews: string
    siteRating: string
    visitSite: string
    planVisit: string
    getDirections: string
    shareSite: string
    recommendSite: string
    addToFavorites: string
    removeFromFavorites: string
  }
  blog: {
    title: string
    subtitle: string
    description: string
    readMore: string
    readFull: string
    author: string
    publishedOn: string
    updatedOn: string
    category: string
    categories: string
    tags: string
    tag: string
    relatedPosts: string
    popularPosts: string
    recentPosts: string
    featuredPosts: string
    allPosts: string
    searchPosts: string
    filterPosts: string
    sortPosts: string
    createPost: string
    editPost: string
    deletePost: string
    publishPost: string
    unpublishPost: string
    approvePost: string
    rejectPost: string
    postTitle: string
    postContent: string
    postExcerpt: string
    postImage: string
    postImages: string
    postCategory: string
    postTags: string
    postStatus: string
    postViews: string
    postLikes: string
    postDislikes: string
    postComments: string
    postShares: string
    postBookmarks: string
    postRating: string
    postReview: string
    postReport: string
    postBlock: string
    postUnblock: string
    postVerify: string
    postApprove: string
    postReject: string
    postPublish: string
    postUnpublish: string
    postDraft: string
    postPending: string
    postPublished: string
    postRejected: string
    postFeatured: string
    postPopular: string
    postTrending: string
    postLatest: string
    postOldest: string
    postNewest: string
    postBest: string
    postWorst: string
    postHighest: string
    postLowest: string
    postMost: string
    postLeast: string
    postTotal: string
    postAverage: string
    postMinimum: string
    postMaximum: string
    postCount: string
    postAmount: string
    postPrice: string
    postCost: string
    postFree: string
    postPaid: string
    postDiscount: string
    postOffer: string
    postDeal: string
    postSale: string
    postNew: string
    postUsed: string
    postAvailable: string
    postUnavailable: string
    postInStock: string
    postOutOfStock: string
    postLimited: string
    postUnlimited: string
    postRequired: string
    postOptional: string
    postRecommended: string
    postSuggested: string
    // Multi-language blog fields
    titleEn: string
    titleAr: string
    titleFr: string
    contentEn: string
    contentAr: string
    contentFr: string
    excerptEn: string
    excerptAr: string
    excerptFr: string
    metaTitleEn: string
    metaTitleAr: string
    metaTitleFr: string
    metaDescriptionEn: string
    metaDescriptionAr: string
    metaDescriptionFr: string
    // Blog form labels
    blogFormTitle: string
    blogFormContent: string
    blogFormExcerpt: string
    blogFormCategory: string
    blogFormTags: string
    blogFormImage: string
    blogFormStatus: string
    blogFormLanguage: string
    blogFormTranslations: string
    blogFormEnglish: string
    blogFormArabic: string
    blogFormFrench: string
    blogFormSave: string
    blogFormCancel: string
    blogFormPreview: string
    blogFormPublish: string
    blogFormDraft: string
    blogFormSubmit: string
    blogFormUpdate: string
    blogFormDelete: string
    blogFormConfirmDelete: string
    blogFormDeleteMessage: string
    blogFormSuccess: string
    blogFormError: string
    blogFormValidation: string
    blogFormRequired: string
    blogFormOptional: string
    blogFormMinLength: string
    blogFormMaxLength: string
    blogFormInvalidFormat: string
    blogFormInvalidEmail: string
    blogFormInvalidUrl: string
    blogFormInvalidPhone: string
    blogFormInvalidDate: string
    blogFormInvalidTime: string
    blogFormInvalidNumber: string
    blogFormInvalidInteger: string
    blogFormInvalidDecimal: string
    blogFormInvalidCurrency: string
    blogFormInvalidPercentage: string
    blogFormInvalidFile: string
    blogFormInvalidImage: string
    blogFormInvalidVideo: string
    blogFormInvalidAudio: string
    blogFormInvalidDocument: string
    blogFormInvalidArchive: string
    blogFormInvalidSize: string
    blogFormInvalidType: string
    blogFormInvalidExtension: string
    blogFormInvalidMimeType: string
    blogFormInvalidEncoding: string
    blogFormInvalidCharset: string
    blogFormInvalidLanguage: string
    blogFormInvalidCountry: string
    blogFormInvalidRegion: string
    blogFormInvalidCity: string
    blogFormInvalidAddress: string
    blogFormInvalidPostalCode: string
    blogFormInvalidPhoneCode: string
    blogFormInvalidCurrencyCode: string
    blogFormInvalidTimezone: string
    blogFormInvalidLocale: string
    blogFormInvalidFormat: string
  }
      home: {
      whoAreWe: string
      aboutSyriaWay: string
      introduction: string
            introductionTitle: string
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
      sections: string
      detailedServices: string
    hotelBooking: string
    carRental: string
    exploringTouristSites: string
    umrahPrograms: string
    domesticTourism: string
    bundles: string
    welcome: string
    welcomeMessage: string
    discoverSyria: string
    discoverMessage: string
    exploreServices: string
    exploreMessage: string
    featuredDestinations: string
    featuredDestinationsMessage: string
    latestNews: string
    latestNewsMessage: string
    testimonials: string
    testimonialsMessage: string
    statistics: string
    statisticsMessage: string
    partners: string
    partnersMessage: string
    newsletter: string
    newsletterMessage: string
    subscribe: string
    subscribeMessage: string
    contactInfo: string
    contactInfoMessage: string
    socialMedia: string
    socialMediaMessage: string
    footer: string
    footerMessage: string
    copyright: string
    copyrightMessage: string
    rights: string
    rightsMessage: string
    terms: string
    termsMessage: string
    privacy: string
    privacyMessage: string
    cookies: string
    cookiesMessage: string
    sitemap: string
    sitemapMessage: string
          accessibility: string
      accessibilityMessage: string
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
      allRightsReserved: string
      codedBy: string
      findUs: string
      contactInfo: string
      socialMedia: string
      facebook: string
      twitter: string
      instagram: string
      youtube: string
      linkedin: string
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
    bundleTitle: string
    bundleDescription: string
    bundleFeatures: string
    bundlePrice: string
    bundleDuration: string
    bundleValidity: string
    bundleIncludes: string
    bundleExcludes: string
    bundleTerms: string
    bundleConditions: string
    bundleCancellation: string
    bundleRefund: string
    bundleModification: string
    bundleTransfer: string
    bundleSharing: string
    bundleUpgrade: string
    bundleDowngrade: string
    bundleExtension: string
    bundleRenewal: string
    bundleExpiry: string
    bundleActivation: string
    bundleDeactivation: string
    bundleSuspension: string
    bundleTermination: string
    bundleReactivation: string
    bundleRefundPolicy: string
    bundleCancellationPolicy: string
    bundleModificationPolicy: string
    bundleTransferPolicy: string
    bundleSharingPolicy: string
    bundleUpgradePolicy: string
    bundleDowngradePolicy: string
    bundleExtensionPolicy: string
    bundleRenewalPolicy: string
    bundleExpiryPolicy: string
    bundleActivationPolicy: string
    bundleDeactivationPolicy: string
    bundleSuspensionPolicy: string
    bundleTerminationPolicy: string
    bundleReactivationPolicy: string
  }
  search?: {
    placeholder: string
    search?: string
    searchButton?: string
    searchResults: string
    searchResultsCount: string
    searchResultsEmpty: string
    searchResultsError: string
    searchFilters: string
    searchSort: string
    searchView: string
    searchGrid: string
    searchList: string
    searchMap: string
    searchCalendar: string
    searchTimeline: string
    searchGallery: string
    searchSlideshow: string
    searchCarousel: string
    searchTabs: string
    searchAccordion: string
    searchModal: string
    searchDrawer: string
    searchSidebar: string
    searchHeader: string
    searchFooter: string
    searchNavigation: string
    searchBreadcrumb: string
    searchPagination: string
    searchInfinite: string
    searchLoadMore: string
    searchLoadAll: string
    searchLoadPrevious: string
    searchLoadNext: string
    searchFirst: string
    searchLast: string
    searchPrevious: string
    searchNext: string
    searchPage: string
    searchOf: string
    searchShowing: string
    searchTo: string
    searchFrom: string
    searchTotal: string
    searchPerPage: string
    searchItems: string
    searchItem: string
    searchNoResults: string
    searchNoResultsMessage: string
    searchTryAgain: string
    searchTryDifferent: string
    searchTryBroader: string
    searchTryNarrower: string
    searchTrySynonyms: string
    searchTryRelated: string
    searchTryPopular: string
    searchTryRecent: string
    searchTryTrending: string
    searchTryFeatured: string
    searchTryRecommended: string
    searchTrySuggested: string
    searchTrySimilar: string
    searchTryMatching: string
    searchTryExact: string
    searchTryPartial: string
    searchTryFuzzy: string
    searchTryWildcard: string
    searchTryRegex: string
    searchTryAdvanced: string
    searchTryBasic: string
    searchTrySimple: string
    searchTryComplex: string
    searchTryCustom: string
    searchTrySaved: string
    searchTryHistory: string
    searchTryFavorites: string
    searchTryBookmarks: string
    searchTryRecent: string
    searchTryPopular: string
    searchTryTrending: string
    searchTryFeatured: string
    searchTryRecommended: string
    searchTrySuggested: string
    searchTrySimilar: string
    searchTryMatching: string
    searchTryExact: string
    searchTryPartial: string
    searchTryFuzzy: string
    searchTryWildcard: string
    searchTryRegex: string
    searchTryAdvanced: string
    searchTryBasic: string
    searchTrySimple: string
    searchTryComplex: string
    searchTryCustom: string
    searchTrySaved: string
    searchTryHistory: string
    searchTryFavorites: string
    searchTryBookmarks: string
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
    unauthorized: string
    unauthorizedMessage: string
    forbidden: string
    forbiddenMessage: string
    serverError: string
    serverErrorMessage: string
    networkError: string
    networkErrorMessage: string
    validationError: string
    validationErrorMessage: string
    invalidInput: string
    invalidInputMessage: string
    missingField: string
    missingFieldMessage: string
    invalidFormat: string
    invalidFormatMessage: string
    invalidEmail: string
    invalidEmailMessage: string
    invalidPassword: string
    invalidPasswordMessage: string
    invalidPhone: string
    invalidPhoneMessage: string
    invalidUrl: string
    invalidUrlMessage: string
    invalidDate: string
    invalidDateMessage: string
    invalidTime: string
    invalidTimeMessage: string
    invalidNumber: string
    invalidNumberMessage: string
    invalidInteger: string
    invalidIntegerMessage: string
    invalidDecimal: string
    invalidDecimalMessage: string
    invalidCurrency: string
    invalidCurrencyMessage: string
    invalidPercentage: string
    invalidPercentageMessage: string
    invalidFile: string
    invalidFileMessage: string
    invalidImage: string
    invalidImageMessage: string
    invalidVideo: string
    invalidVideoMessage: string
    invalidAudio: string
    invalidAudioMessage: string
    invalidDocument: string
    invalidDocumentMessage: string
    invalidArchive: string
    invalidArchiveMessage: string
    invalidSize: string
    invalidSizeMessage: string
    invalidType: string
    invalidTypeMessage: string
    invalidExtension: string
    invalidExtensionMessage: string
    invalidMimeType: string
    invalidMimeTypeMessage: string
    invalidEncoding: string
    invalidEncodingMessage: string
    invalidCharset: string
    invalidCharsetMessage: string
    invalidLanguage: string
    invalidLanguageMessage: string
    invalidCountry: string
    invalidCountryMessage: string
    invalidRegion: string
    invalidRegionMessage: string
    invalidCity: string
    invalidCityMessage: string
    invalidAddress: string
    invalidAddressMessage: string
    invalidPostalCode: string
    invalidPostalCodeMessage: string
    invalidPhoneCode: string
    invalidPhoneCodeMessage: string
    invalidCurrencyCode: string
    invalidCurrencyCodeMessage: string
    invalidTimezone: string
    invalidTimezoneMessage: string
    invalidLocale: string
    invalidLocaleMessage: string
    invalidFormat: string
    invalidFormatMessage: string
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
      loading: "Loading",
      error: "Error",
      success: "Success",
      cancel: "Cancel",
      save: "Save",
      edit: "Edit",
      delete: "Delete",
      view: "View",
      create: "Create",
      update: "Update",
      confirm: "Confirm",
      yes: "Yes",
      no: "No",
      close: "Close",
      next: "Next",
      previous: "Previous",
      search: "Search",
      filter: "Filter",
      sort: "Sort",
      all: "All",
      none: "None",
      select: "Select",
      choose: "Choose",
      upload: "Upload",
      download: "Download",
      share: "Share",
      like: "Like",
      dislike: "Dislike",
      comment: "Comment",
      reply: "Reply",
      follow: "Follow",
      unfollow: "Unfollow",
      bookmark: "Bookmark",
      rate: "Rate",
      review: "Review",
      report: "Report",
      block: "Block",
      unblock: "Unblock",
      verify: "Verify",
      approve: "Approve",
      reject: "Reject",
      publish: "Publish",
      unpublish: "Unpublish",
      draft: "Draft",
      pending: "Pending",
      published: "Published",
      rejected: "Rejected",
      featured: "Featured",
      popular: "Popular",
      trending: "Trending",
      latest: "Latest",
      oldest: "Oldest",
      newest: "Newest",
      best: "Best",
      worst: "Worst",
      highest: "Highest",
      lowest: "Lowest",
      most: "Most",
      least: "Least",
      total: "Total",
      average: "Average",
      minimum: "Minimum",
      maximum: "Maximum",
      count: "Count",
      amount: "Amount",
      price: "Price",
      cost: "Cost",
      free: "Free",
      paid: "Paid",
      discount: "Discount",
      offer: "Offer",
      deal: "Deal",
      sale: "Sale",
      new: "New",
      used: "Used",
      available: "Available",
      unavailable: "Unavailable",
      inStock: "In Stock",
      outOfStock: "Out of Stock",
      limited: "Limited",
      unlimited: "Unlimited",
      required: "Required",
      optional: "Optional",
      recommended: "Recommended",
      suggested: "Suggested",
    },
    nav: {
      services: "Services",
      tourismSites: "Tourism Sites",
      tourismNews: "Tourism News",
      blog: "Blog",
      offers: "Offers",
      home: "Home",
      about: "About",
      contact: "Contact",
      dashboard: "Dashboard",
      profile: "Profile",
      settings: "Settings",
      logout: "Logout",
      login: "Login",
      register: "Register",
      language: "Language",
      theme: "Theme",
      notifications: "Notifications",
      messages: "Messages",
      help: "Help",
      support: "Support",
      faq: "FAQ",
      terms: "Terms",
      privacy: "Privacy",
      cookies: "Cookies",
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
      allServices: "All Services",
      popularServices: "Popular Services",
      featuredServices: "Featured Services",
      newServices: "New Services",
      serviceDetails: "Service Details",
      serviceDescription: "Service Description",
      serviceFeatures: "Service Features",
      serviceBenefits: "Service Benefits",
      serviceRequirements: "Service Requirements",
      serviceDuration: "Service Duration",
      serviceLocation: "Service Location",
      servicePrice: "Service Price",
      serviceRating: "Service Rating",
      serviceReviews: "Service Reviews",
      bookNow: "Book Now",
      learnMore: "Learn More",
      getQuote: "Get Quote",
      contactProvider: "Contact Provider",
      viewDetails: "View Details",
      compareServices: "Compare Services",
      shareService: "Share Service",
      recommendService: "Recommend Service",
    },
    tourismSites: {
      historicalSites: "Historical Sites",
      naturalSites: "Natural Sites",
      religiousSites: "Religious Sites",
      allSites: "All Sites",
      popularSites: "Popular Sites",
      featuredSites: "Featured Sites",
      newSites: "New Sites",
      siteDetails: "Site Details",
      siteDescription: "Site Description",
      siteHistory: "Site History",
      siteLocation: "Site Location",
      siteTips: "Site Tips",
      siteFacilities: "Site Facilities",
      siteOpeningHours: "Site Opening Hours",
      siteEntryFee: "Site Entry Fee",
      siteBestTime: "Site Best Time",
      siteHowToReach: "Site How to Reach",
      siteNearbyHotels: "Site Nearby Hotels",
      siteNearbyRestaurants: "Site Nearby Restaurants",
      sitePhotos: "Site Photos",
      siteVideos: "Site Videos",
      siteReviews: "Site Reviews",
      siteRating: "Site Rating",
      visitSite: "Visit Site",
      planVisit: "Plan Visit",
      getDirections: "Get Directions",
      shareSite: "Share Site",
      recommendSite: "Recommend Site",
      addToFavorites: "Add to Favorites",
      removeFromFavorites: "Remove from Favorites",
    },
    blog: {
      title: "Title",
      subtitle: "Subtitle",
      description: "Description",
      readMore: "Read More",
      readFull: "Read Full",
      author: "Author",
      publishedOn: "Published On",
      updatedOn: "Updated On",
      category: "Category",
      categories: "Categories",
      tags: "Tags",
      tag: "Tag",
      relatedPosts: "Related Posts",
      popularPosts: "Popular Posts",
      recentPosts: "Recent Posts",
      featuredPosts: "Featured Posts",
      allPosts: "All Posts",
      searchPosts: "Search Posts",
      filterPosts: "Filter Posts",
      sortPosts: "Sort Posts",
      createPost: "Create Post",
      editPost: "Edit Post",
      deletePost: "Delete Post",
      publishPost: "Publish Post",
      unpublishPost: "Unpublish Post",
      approvePost: "Approve Post",
      rejectPost: "Reject Post",
      postTitle: "Post Title",
      postContent: "Post Content",
      postExcerpt: "Post Excerpt",
      postImage: "Post Image",
      postImages: "Post Images",
      postCategory: "Post Category",
      postTags: "Post Tags",
      postStatus: "Post Status",
      postViews: "Post Views",
      postLikes: "Post Likes",
      postDislikes: "Post Dislikes",
      postComments: "Post Comments",
      postShares: "Post Shares",
      postBookmarks: "Post Bookmarks",
      postRating: "Post Rating",
      postReview: "Post Review",
      postReport: "Post Report",
      postBlock: "Post Block",
      postUnblock: "Post Unblock",
      postVerify: "Post Verify",
      postApprove: "Post Approve",
      postReject: "Post Reject",
      postPublish: "Post Publish",
      postUnpublish: "Post Unpublish",
      postDraft: "Post Draft",
      postPending: "Post Pending",
      postPublished: "Post Published",
      postRejected: "Post Rejected",
      postFeatured: "Post Featured",
      postPopular: "Post Popular",
      postTrending: "Post Trending",
      postLatest: "Post Latest",
      postOldest: "Post Oldest",
      postNewest: "Post Newest",
      postBest: "Post Best",
      postWorst: "Post Worst",
      postHighest: "Post Highest",
      postLowest: "Post Lowest",
      postMost: "Post Most",
      postLeast: "Post Least",
      postTotal: "Post Total",
      postAverage: "Post Average",
      postMinimum: "Post Minimum",
      postMaximum: "Post Maximum",
      postCount: "Post Count",
      postAmount: "Post Amount",
      postPrice: "Post Price",
      postCost: "Post Cost",
      postFree: "Post Free",
      postPaid: "Post Paid",
      postDiscount: "Post Discount",
      postOffer: "Post Offer",
      postDeal: "Post Deal",
      postSale: "Post Sale",
      postNew: "Post New",
      postUsed: "Post Used",
      postAvailable: "Post Available",
      postUnavailable: "Post Unavailable",
      postInStock: "Post In Stock",
      postOutOfStock: "Post Out of Stock",
      postLimited: "Post Limited",
      postUnlimited: "Post Unlimited",
      postRequired: "Post Required",
      postOptional: "Post Optional",
      postRecommended: "Post Recommended",
      postSuggested: "Post Suggested",
      // Multi-language blog fields
      titleEn: "Title (English)",
      titleAr: "Title (Arabic)",
      titleFr: "Title (French)",
      contentEn: "Content (English)",
      contentAr: "Content (Arabic)",
      contentFr: "Content (French)",
      excerptEn: "Excerpt (English)",
      excerptAr: "Excerpt (Arabic)",
      excerptFr: "Excerpt (French)",
      metaTitleEn: "Meta Title (English)",
      metaTitleAr: "Meta Title (Arabic)",
      metaTitleFr: "Meta Title (French)",
      metaDescriptionEn: "Meta Description (English)",
      metaDescriptionAr: "Meta Description (Arabic)",
      metaDescriptionFr: "Meta Description (French)",
      // Blog form labels
      blogFormTitle: "Post Title",
      blogFormContent: "Post Content",
      blogFormExcerpt: "Post Excerpt",
      blogFormCategory: "Post Category",
      blogFormTags: "Post Tags",
      blogFormImage: "Post Image",
      blogFormStatus: "Post Status",
      blogFormLanguage: "Post Language",
      blogFormTranslations: "Post Translations",
      blogFormEnglish: "Post (English)",
      blogFormArabic: "Post (Arabic)",
      blogFormFrench: "Post (French)",
      blogFormSave: "Save Post",
      blogFormCancel: "Cancel",
      blogFormPreview: "Preview Post",
      blogFormPublish: "Publish Post",
      blogFormDraft: "Save as Draft",
      blogFormSubmit: "Submit Post",
      blogFormUpdate: "Update Post",
      blogFormDelete: "Delete Post",
      blogFormConfirmDelete: "Are you sure you want to delete this post?",
      blogFormDeleteMessage: "This action cannot be undone.",
      blogFormSuccess: "Post saved successfully!",
      blogFormError: "There was an error saving the post.",
      blogFormValidation: "Please fill out all required fields.",
      blogFormRequired: "Required",
      blogFormOptional: "Optional",
      blogFormMinLength: "Minimum length",
      blogFormMaxLength: "Maximum length",
      blogFormInvalidFormat: "Invalid format",
      blogFormInvalidEmail: "Invalid email",
      blogFormInvalidUrl: "Invalid URL",
      blogFormInvalidPhone: "Invalid phone",
      blogFormInvalidDate: "Invalid date",
      blogFormInvalidTime: "Invalid time",
      blogFormInvalidNumber: "Invalid number",
      blogFormInvalidInteger: "Invalid integer",
      blogFormInvalidDecimal: "Invalid decimal",
      blogFormInvalidCurrency: "Invalid currency",
      blogFormInvalidPercentage: "Invalid percentage",
      blogFormInvalidFile: "Invalid file",
      blogFormInvalidImage: "Invalid image",
      blogFormInvalidVideo: "Invalid video",
      blogFormInvalidAudio: "Invalid audio",
      blogFormInvalidDocument: "Invalid document",
      blogFormInvalidArchive: "Invalid archive",
      blogFormInvalidSize: "Invalid size",
      blogFormInvalidType: "Invalid type",
      blogFormInvalidExtension: "Invalid extension",
      blogFormInvalidMimeType: "Invalid MIME type",
      blogFormInvalidEncoding: "Invalid encoding",
      blogFormInvalidCharset: "Invalid charset",
      blogFormInvalidLanguage: "Invalid language",
      blogFormInvalidCountry: "Invalid country",
      blogFormInvalidRegion: "Invalid region",
      blogFormInvalidCity: "Invalid city",
      blogFormInvalidAddress: "Invalid address",
      blogFormInvalidPostalCode: "Invalid postal code",
      blogFormInvalidPhoneCode: "Invalid phone code",
      blogFormInvalidCurrencyCode: "Invalid currency code",
      blogFormInvalidTimezone: "Invalid timezone",
      blogFormInvalidLocale: "Invalid locale",
      blogFormInvalidFormat: "Invalid format",
    },
    home: {
      whoAreWe: "Who Are We and What We Do?",
      aboutSyriaWay: "About SyriaWay",
      introductionTitle: "Introduction",
      ourPlatform: "Our Platform",
      comprehensiveSupport: "Comprehensive Support",
      comprehensiveSupportDescription: "24/7 customer support, multilingual assistance, and personalized travel planning",
      specialOffers: "Special Offers",
      specialOffersDescription: "Discover amazing deals on hotels, car rentals, and tours. Limited time offers with exclusive discounts!",
      travelBundles: "Travel Bundles",
      travelBundlesDescription: "Choose from our carefully crafted travel packages",
      whyChooseSyriaWays: "Why Choose Syria Ways?",
      whyChooseSyriaWaysDescription: "We offer comprehensive tourism services to make your Syrian adventure unforgettable",
      ourBenefits: "Our Benefits",
      ourBenefitsDescription: "Experience the advantages of choosing Syria Ways for your travel needs",
      introduction:
        "Introduction to the App: The Syria App is built to facilitate tourism in Syria. The app integrates various services to create a modern and user-friendly interface with multilingual support (Arabic, English,French).",
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
      welcome: "Welcome",
      welcomeMessage: "Welcome Message",
      discoverSyria: "Discover Syria",
      discoverMessage: "Discover Message",
      exploreServices: "Explore Services",
      exploreMessage: "Explore Message",
      featuredDestinations: "Featured Destinations",
      featuredDestinationsMessage: "Featured Destinations Message",
      latestNews: "Latest News",
      latestNewsMessage: "Latest News Message",
      testimonials: "Testimonials",
      testimonialsMessage: "Testimonials Message",
      statistics: "Statistics",
      statisticsMessage: "Statistics Message",
      partners: "Partners",
      partnersMessage: "Partners Message",
      newsletter: "Newsletter",
      newsletterMessage: "Newsletter Message",
      subscribe: "Subscribe",
      subscribeMessage: "Subscribe Message",
      contactInfo: "Contact Info",
      contactInfoMessage: "Contact Info Message",
      socialMedia: "Social Media",
      socialMediaMessage: "Social Media Message",
      footer: "Footer",
      footerMessage: "Footer Message",
      copyright: "Copyright",
      copyrightMessage: "Copyright Message",
      rights: "Rights",
      rightsMessage: "Rights Message",
      terms: "Terms",
      termsMessage: "Terms Message",
      privacy: "Privacy",
      privacyMessage: "Privacy Message",
      cookies: "Cookies",
      cookiesMessage: "Cookies Message",
      sitemap: "Sitemap",
      sitemapMessage: "Sitemap Message",
      accessibility: "Accessibility",
      accessibilityMessage: "Accessibility Message",
    },
    footer: {
      allRightsReserved: "All Rights Reserved ®",
      codedBy: "Coded and designed by",
      findUs: "Find Us",
      contactInfo: "Contact Information",
      socialMedia: "Social Media",
      facebook: "Facebook",
      twitter: "Twitter",
      instagram: "Instagram",
      youtube: "YouTube",
      linkedin: "LinkedIn",
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
      bundleTitle: "Bundle Title",
      bundleDescription: "Bundle Description",
      bundleFeatures: "Bundle Features",
      bundlePrice: "Bundle Price",
      bundleDuration: "Bundle Duration",
      bundleValidity: "Bundle Validity",
      bundleIncludes: "Bundle Includes",
      bundleExcludes: "Bundle Excludes",
      bundleTerms: "Bundle Terms",
      bundleConditions: "Bundle Conditions",
      bundleCancellation: "Bundle Cancellation",
      bundleRefund: "Bundle Refund",
      bundleModification: "Bundle Modification",
      bundleTransfer: "Bundle Transfer",
      bundleSharing: "Bundle Sharing",
      bundleUpgrade: "Bundle Upgrade",
      bundleDowngrade: "Bundle Downgrade",
      bundleExtension: "Bundle Extension",
      bundleRenewal: "Bundle Renewal",
      bundleExpiry: "Bundle Expiry",
      bundleActivation: "Bundle Activation",
      bundleDeactivation: "Bundle Deactivation",
      bundleSuspension: "Bundle Suspension",
      bundleTermination: "Bundle Termination",
      bundleReactivation: "Bundle Reactivation",
      bundleRefundPolicy: "Bundle Refund Policy",
      bundleCancellationPolicy: "Bundle Cancellation Policy",
      bundleModificationPolicy: "Bundle Modification Policy",
      bundleTransferPolicy: "Bundle Transfer Policy",
      bundleSharingPolicy: "Bundle Sharing Policy",
      bundleUpgradePolicy: "Bundle Upgrade Policy",
      bundleDowngradePolicy: "Bundle Downgrade Policy",
      bundleExtensionPolicy: "Bundle Extension Policy",
      bundleRenewalPolicy: "Bundle Renewal Policy",
      bundleExpiryPolicy: "Bundle Expiry Policy",
      bundleActivationPolicy: "Bundle Activation Policy",
      bundleDeactivationPolicy: "Bundle Deactivation Policy",
      bundleSuspensionPolicy: "Bundle Suspension Policy",
      bundleTerminationPolicy: "Bundle Termination Policy",
      bundleReactivationPolicy: "Bundle Reactivation Policy",
    },
    search: {
      placeholder: "Search for destinations, services...",
      searchButton: "Search",
      searchResults: "Search Results",
      searchResultsCount: "Search Results Count",
      searchResultsEmpty: "Search Results Empty",
      searchResultsError: "Search Results Error",
      searchFilters: "Search Filters",
      searchSort: "Search Sort",
      searchView: "Search View",
      searchGrid: "Search Grid",
      searchList: "Search List",
      searchMap: "Search Map",
      searchCalendar: "Search Calendar",
      searchTimeline: "Search Timeline",
      searchGallery: "Search Gallery",
      searchSlideshow: "Search Slideshow",
      searchCarousel: "Search Carousel",
      searchTabs: "Search Tabs",
      searchAccordion: "Search Accordion",
      searchModal: "Search Modal",
      searchDrawer: "Search Drawer",
      searchSidebar: "Search Sidebar",
      searchHeader: "Search Header",
      searchFooter: "Search Footer",
      searchNavigation: "Search Navigation",
      searchBreadcrumb: "Search Breadcrumb",
      searchPagination: "Search Pagination",
      searchInfinite: "Search Infinite",
      searchLoadMore: "Search Load More",
      searchLoadAll: "Search Load All",
      searchLoadPrevious: "Search Load Previous",
      searchLoadNext: "Search Load Next",
      searchFirst: "Search First",
      searchLast: "Search Last",
      searchPrevious: "Search Previous",
      searchNext: "Search Next",
      searchPage: "Search Page",
      searchOf: "Search Of",
      searchShowing: "Search Showing",
      searchTo: "Search To",
      searchFrom: "Search From",
      searchTotal: "Search Total",
      searchPerPage: "Search Per Page",
      searchItems: "Search Items",
      searchItem: "Search Item",
      searchNoResults: "Search No Results",
      searchNoResultsMessage: "Search No Results Message",
      searchTryAgain: "Search Try Again",
      searchTryDifferent: "Search Try Different",
      searchTryBroader: "Search Try Broader",
      searchTryNarrower: "Search Try Narrower",
      searchTrySynonyms: "Search Try Synonyms",
      searchTryRelated: "Search Try Related",
      searchTryPopular: "Search Try Popular",
      searchTryRecent: "Search Try Recent",
      searchTryTrending: "Search Try Trending",
      searchTryFeatured: "Search Try Featured",
      searchTryRecommended: "Search Try Recommended",
      searchTrySuggested: "Search Try Suggested",
      searchTrySimilar: "Search Try Similar",
      searchTryMatching: "Search Try Matching",
      searchTryExact: "Search Try Exact",
      searchTryPartial: "Search Try Partial",
      searchTryFuzzy: "Search Try Fuzzy",
      searchTryWildcard: "Search Try Wildcard",
      searchTryRegex: "Search Try Regex",
      searchTryAdvanced: "Search Try Advanced",
      searchTryBasic: "Search Try Basic",
      searchTrySimple: "Search Try Simple",
      searchTryComplex: "Search Try Complex",
      searchTryCustom: "Search Try Custom",
      searchTrySaved: "Search Try Saved",
      searchTryHistory: "Search Try History",
      searchTryFavorites: "Search Try Favorites",
      searchTryBookmarks: "Search Try Bookmarks",
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
      unauthorized: "Unauthorized",
      unauthorizedMessage: "You are not authorized to access this resource.",
      forbidden: "Forbidden",
      forbiddenMessage: "You do not have permission to access this resource.",
      serverError: "Server Error",
      serverErrorMessage: "There was an error processing your request.",
      networkError: "Network Error",
      networkErrorMessage: "There was a network error processing your request.",
      validationError: "Validation Error",
      validationErrorMessage: "There was a validation error processing your request.",
      invalidInput: "Invalid Input",
      invalidInputMessage: "The input provided is invalid.",
      missingField: "Missing Field",
      missingFieldMessage: "A required field is missing.",
      invalidFormat: "Invalid Format",
      invalidFormatMessage: "The format of the input is invalid.",
      invalidEmail: "Invalid Email",
      invalidEmailMessage: "The email provided is invalid.",
      invalidPassword: "Invalid Password",
      invalidPasswordMessage: "The password provided is invalid.",
      invalidPhone: "Invalid Phone",
      invalidPhoneMessage: "The phone number provided is invalid.",
      invalidUrl: "Invalid URL",
      invalidUrlMessage: "The URL provided is invalid.",
      invalidDate: "Invalid Date",
      invalidDateMessage: "The date provided is invalid.",
      invalidTime: "Invalid Time",
      invalidTimeMessage: "The time provided is invalid.",
      invalidNumber: "Invalid Number",
      invalidNumberMessage: "The number provided is invalid.",
      invalidInteger: "Invalid Integer",
      invalidIntegerMessage: "The integer provided is invalid.",
      invalidDecimal: "Invalid Decimal",
      invalidDecimalMessage: "The decimal provided is invalid.",
      invalidCurrency: "Invalid Currency",
      invalidCurrencyMessage: "The currency provided is invalid.",
      invalidPercentage: "Invalid Percentage",
      invalidPercentageMessage: "The percentage provided is invalid.",
      invalidFile: "Invalid File",
      invalidFileMessage: "The file provided is invalid.",
      invalidImage: "Invalid Image",
      invalidImageMessage: "The image provided is invalid.",
      invalidVideo: "Invalid Video",
      invalidVideoMessage: "The video provided is invalid.",
      invalidAudio: "Invalid Audio",
      invalidAudioMessage: "The audio provided is invalid.",
      invalidDocument: "Invalid Document",
      invalidDocumentMessage: "The document provided is invalid.",
      invalidArchive: "Invalid Archive",
      invalidArchiveMessage: "The archive provided is invalid.",
      invalidSize: "Invalid Size",
      invalidSizeMessage: "The size provided is invalid.",
      invalidType: "Invalid Type",
      invalidTypeMessage: "The type provided is invalid.",
      invalidExtension: "Invalid Extension",
      invalidExtensionMessage: "The extension provided is invalid.",
      invalidMimeType: "Invalid MIME Type",
      invalidMimeTypeMessage: "The MIME type provided is invalid.",
      invalidEncoding: "Invalid Encoding",
      invalidEncodingMessage: "The encoding provided is invalid.",
      invalidCharset: "Invalid Charset",
      invalidCharsetMessage: "The charset provided is invalid.",
      invalidLanguage: "Invalid Language",
      invalidLanguageMessage: "The language provided is invalid.",
      invalidCountry: "Invalid Country",
      invalidCountryMessage: "The country provided is invalid.",
      invalidRegion: "Invalid Region",
      invalidRegionMessage: "The region provided is invalid.",
      invalidCity: "Invalid City",
      invalidCityMessage: "The city provided is invalid.",
      invalidAddress: "Invalid Address",
      invalidAddressMessage: "The address provided is invalid.",
      invalidPostalCode: "Invalid Postal Code",
      invalidPostalCodeMessage: "The postal code provided is invalid.",
      invalidPhoneCode: "Invalid Phone Code",
      invalidPhoneCodeMessage: "The phone code provided is invalid.",
      invalidCurrencyCode: "Invalid Currency Code",
      invalidCurrencyCodeMessage: "The currency code provided is invalid.",
      invalidTimezone: "Invalid Timezone",
      invalidTimezoneMessage: "The timezone provided is invalid.",
      invalidLocale: "Invalid Locale",
      invalidLocaleMessage: "The locale provided is invalid.",
      invalidFormat: "Invalid Format",
      invalidFormatMessage: "The format provided is invalid.",
    },
    features: {
      hotelBooking: "حجز الفنادق",
      hotelBookingDescription: "ابحث واحجز أفضل الفنادق في سوريا",
      carRental: "تأجير السيارات",
      carRentalDescription: "استأجر سيارات لرحلتك بسهولة",
      flightBooking: "حجز الرحلات الجوية",
      flightBookingDescription: "احجز رحلاتك من وإلى سوريا",
      tourGuides: "المرشدون السياحيون",
      tourGuidesDescription: "مرشدون سياحيون محترفون لمغامراتك",
      educationalTours: "الجولات التعليمية",
      educationalToursDescription: "تعرف على تاريخ وثقافة سوريا الغنية",
      healthTourism: "السياحة العلاجية",
      healthTourismDescription: "خدمات السياحة العلاجية في سوريا",
    },
    benefits: {
      qualityService: "خدمة عالية الجودة",
      qualityServiceDescription: "نقدم خدمة متميزة لضمان رضاك",
      secureBooking: "حجز آمن",
      secureBookingDescription: "حجوزاتك آمنة مع إجراءات الأمان المتقدمة لدينا",
      fastBooking: "حجز سريع",
      fastBookingDescription: "احجز خدماتك بسرعة وكفاءة",
      support247: "دعم 24/7",
      support247Description: "احصل على المساعدة في أي وقت مع دعم العملاء على مدار الساعة",
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
      loading: "جاري التحميل",
      error: "خطأ",
      success: "نجاح",
      cancel: "إلغاء",
      save: "حفظ",
      edit: "تعديل",
      delete: "حذف",
      view: "مشاهدة",
      create: "إنشاء",
      update: "تحديث",
      confirm: "تأكيد",
      yes: "نعم",
      no: "لا",
      close: "إغلاق",
      next: "التالي",
      previous: "السابق",
      search: "بحث",
      filter: "تصفية",
      sort: "ترتيب",
      all: "الكل",
      none: "لا شيء",
      select: "اختيار",
      choose: "اختيار",
      upload: "رفع",
      download: "تنزيل",
      share: "مشاركة",
      like: "إعجاب",
      dislike: "إبهام",
      comment: "تعليق",
      reply: "رد",
      follow: "متابعة",
      unfollow: "إيقاف المتابعة",
      bookmark: "تذكير",
      rate: "تقييم",
      review: "مراجعة",
      report: "تقرير",
      block: "حظر",
      unblock: "الإلغاء الحظر",
      verify: "تحقق",
      approve: "موافقة",
      reject: "رفض",
      publish: "نشر",
      unpublish: "إلغاء النشر",
      draft: "مسودة",
      pending: "في الانتظار",
      published: "منشور",
      rejected: "مرفوض",
      featured: "مميز",
      popular: "شعبي",
      trending: "متزايد",
      latest: "آخر",
      oldest: "أقدم",
      newest: "أحدث",
      best: "أفضل",
      worst: "أسوأ",
      highest: "أعلى",
      lowest: "أدنى",
      most: "أكثر",
      least: "أقل",
      total: "الكلي",
      average: "المتوسط",
      minimum: "الأدنى",
      maximum: "الأعلى",
      count: "العدد",
      amount: "المبلغ",
      price: "السعر",
      cost: "التكلفة",
      free: "مجاني",
      paid: "مدفوع",
      discount: "خصم",
      offer: "عرض",
      deal: "صفقة",
      sale: "مبيع",
      new: "جديد",
      used: "مستعمل",
      available: "متاح",
      unavailable: "غير متاح",
      inStock: "في المخزن",
      outOfStock: "إنتهاء المخزن",
      limited: "مقتصر",
      unlimited: "غير مقتصر",
      required: "مطلوب",
      optional: "اختياري",
      recommended: "موصى به",
      suggested: "مقترح",
    },
    nav: {
      services: "الخدمات",
      tourismSites: "المواقع السياحية",
      tourismNews: "أخبار السياحة",
      blog: "المدونة",
      offers: "العروض",
      home: "الرئيسية",
      about: "عن التطبيق",
      contact: "الاتصال",
      dashboard: "لوحة التحكم",
      profile: "المستخدم",
      settings: "الإعدادات",
      logout: "تسجيل خروج",
      login: "تسجيل الدخول",
      register: "إنشاء حساب",
      language: "اللغة",
      theme: "المظهر",
      notifications: "الإشعارات",
      messages: "الرسائل",
      help: "المساعدة",
      support: "الدعم",
      faq: "الأسئلة الشائعة",
      terms: "الشروط",
      privacy: "الخصوصية",
      cookies: "الكوكيز",
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
      allServices: "كل الخدمات",
      popularServices: "الخدمات الشعبية",
      featuredServices: "الخدمات المميزة",
      newServices: "الخدمات الجديدة",
      serviceDetails: "تفاصيل الخدمة",
      serviceDescription: "وصف الخدمة",
      serviceFeatures: "ميزات الخدمة",
      serviceBenefits: "فوائد الخدمة",
      serviceRequirements: "متطلبات الخدمة",
      serviceDuration: "مدة الخدمة",
      serviceLocation: "موقع الخدمة",
      servicePrice: "سعر الخدمة",
      serviceRating: "تقييم الخدمة",
      serviceReviews: "مراجعات الخدمة",
      bookNow: "احجز الآن",
      learnMore: "تعرف على المزيد",
      getQuote: "احصل على عرض",
      contactProvider: "تواصل مع المزود",
      viewDetails: "مشاهدة تفاصيل",
      compareServices: "مقارنة الخدمات",
      shareService: "مشاركة الخدمة",
      recommendService: "توصية الخدمة",
    },
    tourismSites: {
      historicalSites: "المواقع التاريخية",
      naturalSites: "المواقع الطبيعية",
      religiousSites: "المواقع الدينية",
      allSites: "كل المواقع",
      popularSites: "المواقع الشعبية",
      featuredSites: "المواقع المميزة",
      newSites: "المواقع الجديدة",
      siteDetails: "تفاصيل الموقع",
      siteDescription: "وصف الموقع",
      siteHistory: "تاريخ الموقع",
      siteLocation: "موقع الموقع",
      siteTips: "نصائح الموقع",
      siteFacilities: "مرافق الموقع",
      siteOpeningHours: "ساعات العمل الموقع",
      siteEntryFee: "رسوم دخول الموقع",
      siteBestTime: "أفضل وقت لزيارة الموقع",
      siteHowToReach: "كيفية الوصول إلى الموقع",
      siteNearbyHotels: "فنادق الموقع القريبة",
      siteNearbyRestaurants: "مطاعم الموقع القريبة",
      sitePhotos: "صور الموقع",
      siteVideos: "فيديوهات الموقع",
      siteReviews: "مراجعات الموقع",
      siteRating: "تقييم الموقع",
      visitSite: "زيارة الموقع",
      planVisit: "تخطيط زيارة الموقع",
      getDirections: "احصل على الإرشادات",
      shareSite: "مشاركة الموقع",
      recommendSite: "توصية الموقع",
      addToFavorites: "إضافة الموقع إلى المفضلة",
      removeFromFavorites: "إزالة الموقع من المفضلة",
    },
    blog: {
      title: "عنوان المقال",
      subtitle: "تصطلح المقال",
      description: "وصف المقال",
      readMore: "قراءة المزيد",
      readFull: "قراءة الكل",
      author: "المؤلف",
      publishedOn: "نشر على",
      updatedOn: "آخر تحديث",
      category: "فئة المقال",
      categories: "فئات المقال",
      tags: "كلمات التصنيف",
      tag: "تصنيف",
      relatedPosts: "مقالات ذات صلة",
      popularPosts: "المقالات الشعبية",
      recentPosts: "المقالات الأخيرة",
      featuredPosts: "المقالات المميزة",
      allPosts: "كل المقالات",
      searchPosts: "بحث المقالات",
      filterPosts: "تصفية المقالات",
      sortPosts: "ترتيب المقالات",
      createPost: "إنشاء مقال",
      editPost: "تعديل المقال",
      deletePost: "حذف المقال",
      publishPost: "نشر المقال",
      unpublishPost: "إلغاء نشر المقال",
      approvePost: "موافقة المقال",
      rejectPost: "رفض المقال",
      postTitle: "عنوان المقال",
      postContent: "محتوى المقال",
      postExcerpt: "مقتطف المقال",
      postImage: "صورة المقال",
      postImages: "صور المقال",
      postCategory: "فئة المقال",
      postTags: "كلمات تصنيف المقال",
      postStatus: "حالة المقال",
      postViews: "عدد مشاهدات المقال",
      postLikes: "عدد الإعجابات",
      postDislikes: "عدد الإبهامات",
      postComments: "عدد التعليقات",
      postShares: "عدد المشاركات",
      postBookmarks: "عدد التذكيرات",
      postRating: "تقييم المقال",
      postReview: "مراجعة المقال",
      postReport: "تقرير المقال",
      postBlock: "حظر المقال",
      postUnblock: "الإلغاء الحظر",
      postVerify: "تحقق المقال",
      postApprove: "موافقة المقال",
      postReject: "رفض المقال",
      postPublish: "نشر المقال",
      postUnpublish: "إلغاء نشر المقال",
      postDraft: "مسودة المقال",
      postPending: "في الانتظار المقال",
      postPublished: "منشور المقال",
      postRejected: "مرفوض المقال",
      postFeatured: "مميز المقال",
      postPopular: "شعبي المقال",
      postTrending: "متزايد المقال",
      postLatest: "آخر المقال",
      postOldest: "أقدم المقال",
      postNewest: "أحدث المقال",
      postBest: "أفضل المقال",
      postWorst: "أسوأ المقال",
      postHighest: "أعلى المقال",
      postLowest: "أدنى المقال",
      postMost: "أكثر المقال",
      postLeast: "أقل المقال",
      postTotal: "الكلي المقال",
      postAverage: "المتوسط المقال",
      postMinimum: "الأدنى المقال",
      postMaximum: "الأعلى المقال",
      postCount: "عدد المقال",
      postAmount: "المبلغ المقال",
      postPrice: "السعر المقال",
      postCost: "التكلفة المقال",
      postFree: "مجاني المقال",
      postPaid: "مدفوع المقال",
      postDiscount: "خصم المقال",
      postOffer: "عرض المقال",
      postDeal: "صفقة المقال",
      postSale: "مبيع المقال",
      postNew: "جديد المقال",
      postUsed: "مستعمل المقال",
      postAvailable: "متاح المقال",
      postUnavailable: "غير متاح المقال",
      postInStock: "في المخزن المقال",
      postOutOfStock: "إنتهاء المخزن المقال",
      postLimited: "مقتصر المقال",
      postUnlimited: "غير مقتصر المقال",
      postRequired: "مطلوب المقال",
      postOptional: "اختياري المقال",
      postRecommended: "موصى به المقال",
      postSuggested: "مقترح المقال",
      // Multi-language blog fields
      titleEn: "Title (English)",
      titleAr: "Title (Arabic)",
      titleFr: "Title (French)",
      contentEn: "Content (English)",
      contentAr: "Content (Arabic)",
      contentFr: "Content (French)",
      excerptEn: "Excerpt (English)",
      excerptAr: "Excerpt (Arabic)",
      excerptFr: "Excerpt (French)",
      metaTitleEn: "Meta Title (English)",
      metaTitleAr: "Meta Title (Arabic)",
      metaTitleFr: "Meta Title (French)",
      metaDescriptionEn: "Meta Description (English)",
      metaDescriptionAr: "Meta Description (Arabic)",
      metaDescriptionFr: "Meta Description (French)",
      // Blog form labels
      blogFormTitle: "Post Title",
      blogFormContent: "Post Content",
      blogFormExcerpt: "Post Excerpt",
      blogFormCategory: "Post Category",
      blogFormTags: "Post Tags",
      blogFormImage: "Post Image",
      blogFormStatus: "Post Status",
      blogFormLanguage: "Post Language",
      blogFormTranslations: "Post Translations",
      blogFormEnglish: "Post (English)",
      blogFormArabic: "Post (Arabic)",
      blogFormFrench: "Post (French)",
      blogFormSave: "Save Post",
      blogFormCancel: "Cancel",
      blogFormPreview: "Preview Post",
      blogFormPublish: "Publish Post",
      blogFormDraft: "Save as Draft",
      blogFormSubmit: "Submit Post",
      blogFormUpdate: "Update Post",
      blogFormDelete: "Delete Post",
      blogFormConfirmDelete: "Are you sure you want to delete this post?",
      blogFormDeleteMessage: "This action cannot be undone.",
      blogFormSuccess: "Post saved successfully!",
      blogFormError: "There was an error saving the post.",
      blogFormValidation: "Please fill out all required fields.",
      blogFormRequired: "Required",
      blogFormOptional: "Optional",
      blogFormMinLength: "Minimum length",
      blogFormMaxLength: "Maximum length",
      blogFormInvalidFormat: "Invalid format",
      blogFormInvalidEmail: "Invalid email",
      blogFormInvalidUrl: "Invalid URL",
      blogFormInvalidPhone: "Invalid phone",
      blogFormInvalidDate: "Invalid date",
      blogFormInvalidTime: "Invalid time",
      blogFormInvalidNumber: "Invalid number",
      blogFormInvalidInteger: "Invalid integer",
      blogFormInvalidDecimal: "Invalid decimal",
      blogFormInvalidCurrency: "Invalid currency",
      blogFormInvalidPercentage: "Invalid percentage",
      blogFormInvalidFile: "Invalid file",
      blogFormInvalidImage: "Invalid image",
      blogFormInvalidVideo: "Invalid video",
      blogFormInvalidAudio: "Invalid audio",
      blogFormInvalidDocument: "Invalid document",
      blogFormInvalidArchive: "Invalid archive",
      blogFormInvalidSize: "Invalid size",
      blogFormInvalidType: "Invalid type",
      blogFormInvalidExtension: "Invalid extension",
      blogFormInvalidMimeType: "Invalid MIME type",
      blogFormInvalidEncoding: "Invalid encoding",
      blogFormInvalidCharset: "Invalid charset",
      blogFormInvalidLanguage: "Invalid language",
      blogFormInvalidCountry: "Invalid country",
      blogFormInvalidRegion: "Invalid region",
      blogFormInvalidCity: "Invalid city",
      blogFormInvalidAddress: "Invalid address",
      blogFormInvalidPostalCode: "Invalid postal code",
      blogFormInvalidPhoneCode: "Invalid phone code",
      blogFormInvalidCurrencyCode: "Invalid currency code",
      blogFormInvalidTimezone: "Invalid timezone",
      blogFormInvalidLocale: "Invalid locale",
      blogFormInvalidFormat: "Invalid format",
    },
    home: {
      whoAreWe: "من نحن وماذا نفعل؟",
      aboutSyriaWay: "حول سوريا واي",
      introductionTitle: "مقدمة",
      ourPlatform: "منصتنا",
      comprehensiveSupport: "دعم شامل",
      comprehensiveSupportDescription: "دعم العملاء على مدار الساعة، مساعدة متعددة اللغات، وتخطيط السفر الشخصي",
      specialOffers: "عروض خاصة",
      specialOffersDescription: "اكتشف عروضاً مذهلة على الفنادق وتأجير السيارات والجولات. عروض محدودة بخصومات حصرية!",
      travelBundles: "باقات السفر",
      travelBundlesDescription: "اختر من باقات السفر المصممة بعناية",
      whyChooseSyriaWays: "لماذا تختار سوريا واي؟",
      whyChooseSyriaWaysDescription: "نقدم خدمات سياحية شاملة لجعل مغامرتك السورية لا تنسى",
      introduction:
        "مقدمة عن التطبيق: تم بناء تطبيق سوريا لتسهيل السياحة في سوريا. يدمج التطبيق خدمات متنوعة لإنشاء واجهة حديثة وسهلة الاستخدام مع دعم متعدد اللغات (العربية، الإنجليزية).",
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
      welcome: "مرحباً بك",
      welcomeMessage: "مرحباً بكم في تطبيق سوريا",
      discoverSyria: "اكتشف سوريا",
      discoverMessage: "اكتشف سوريا معنا",
      exploreServices: "استكشف الخدمات",
      exploreMessage: "استكشف الخدمات معنا",
      featuredDestinations: "الوجهات المميزة",
      featuredDestinationsMessage: "الوجهات المميزة على تطبيق سوريا",
      latestNews: "أخر الأخبار",
      latestNewsMessage: "أخر الأخبار على تطبيق سوريا",
      testimonials: "التعريفات",
      testimonialsMessage: "التعريفات على تطبيق سوريا",
      statistics: "الإحصائيات",
      statisticsMessage: "الإحصائيات على تطبيق سوريا",
      partners: "الشركاء",
      partnersMessage: "الشركاء على تطبيق سوريا",
      newsletter: "النشرة الإخبارية",
      newsletterMessage: "النشرة الإخبارية على تطبيق سوريا",
      subscribe: "اشترك",
      subscribeMessage: "اشترك معنا في تطبيق سوريا",
      contactInfo: "معلومات الاتصال",
      contactInfoMessage: "معلومات الاتصال على تطبيق سوريا",
      socialMedia: "وسائل التواصل الاجتماعي",
      socialMediaMessage: "وسائل التواصل الاجتماعي على تطبيق سوريا",
      footer: "الإحتفاظ",
      footerMessage: "الإحتفاظ على تطبيق سوريا",
      copyright: "حقوق النشر",
      copyrightMessage: "حقوق النشر على تطبيق سوريا",
      rights: "الحقون",
      rightsMessage: "الحقون على تطبيق سوريا",
      terms: "الشروط",
      termsMessage: "الشروط على تطبيق سوريا",
      privacy: "الخصوصية",
      privacyMessage: "الخصوصية على تطبيق سوريا",
      cookies: "الكوكيز",
      cookiesMessage: "الكوكيز على تطبيق سوريا",
      sitemap: "خريطة الموقع",
      sitemapMessage: "خريطة الموقع على تطبيق سوريا",
      accessibility: "الوصول",
      accessibilityMessage: "الوصول على تطبيق سوريا",
    },
    footer: {
      allRightsReserved: "جميع الحقوق محفوظة ®",
      codedBy: "تم التطوير والتصميم بواسطة",
      findUs: "اعثر علينا",
      contactInfo: "معلومات الاتصال",
      socialMedia: "وسائل التواصل الاجتماعي",
      facebook: "فيسبوك",
      twitter: "تويتر",
      instagram: "إنستغرام",
      youtube: "يوتيوب",
      linkedin: "لينكد إن",
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
      bundleTitle: "عنوان الباقة",
      bundleDescription: "وصف الباقة",
      bundleFeatures: "ميزات الباقة",
      bundlePrice: "سعر الباقة",
      bundleDuration: "مدة الباقة",
      bundleValidity: "مدة الباقة",
      bundleIncludes: "ما يشمله الباقة",
      bundleExcludes: "ما لا يشمله الباقة",
      bundleTerms: "شروط الباقة",
      bundleConditions: "ظروف الباقة",
      bundleCancellation: "إلغاء الباقة",
      bundleRefund: "إرجاع الباقة",
      bundleModification: "تعديل الباقة",
      bundleTransfer: "نقل الباقة",
      bundleSharing: "مشاركة الباقة",
      bundleUpgrade: "ترقية الباقة",
      bundleDowngrade: "تنزيل الباقة",
      bundleExtension: "تمديد الباقة",
      bundleRenewal: "تجديد الباقة",
      bundleExpiry: "انتهاء الباقة",
      bundleActivation: "تفعيل الباقة",
      bundleDeactivation: "إيقاف الباقة",
      bundleSuspension: "تعليق الباقة",
      bundleTermination: "إيقاف الباقة",
      bundleReactivation: "تفعيل الباقة",
      bundleRefundPolicy: "سياسة الإرجاع",
      bundleCancellationPolicy: "سياسة الإلغاء",
      bundleModificationPolicy: "سياسة التعديل",
      bundleTransferPolicy: "سياسة النقل",
      bundleSharingPolicy: "سياسة المشاركة",
      bundleUpgradePolicy: "سياسة الترقية",
      bundleDowngradePolicy: "سياسة التنزيل",
      bundleExtensionPolicy: "سياسة التمديد",
      bundleRenewalPolicy: "سياسة التجديد",
      bundleExpiryPolicy: "سياسة انتهاء الباقة",
      bundleActivationPolicy: "سياسة التفعيل",
      bundleDeactivationPolicy: "سياسة الإيقاف",
      bundleSuspensionPolicy: "سياسة التعليق",
      bundleTerminationPolicy: "سياسة الإيقاف",
      bundleReactivationPolicy: "سياسة التفعيل",
    },
    search: {
      placeholder: "ابحث عن الوجهات والخدمات...",
      searchButton: "بحث",
      searchResults: "نتائج البحث",
      searchResultsCount: "عدد نتائج البحث",
      searchResultsEmpty: "لا توجد نتائج للبحث",
      searchResultsError: "خطأ في نتائج البحث",
      searchFilters: "مرشحات البحث",
      searchSort: "ترتيب البحث",
      searchView: "طريقة البحث",
      searchGrid: "شبكة البحث",
      searchList: "قائمة البحث",
      searchMap: "خريطة البحث",
      searchCalendar: "تقويم البحث",
      searchTimeline: "مخطط البحث",
      searchGallery: "معرض البحث",
      searchSlideshow: "عرض شرائح البحث",
      searchCarousel: "دوران البحث",
      searchTabs: "علامات البحث",
      searchAccordion: "تفويض البحث",
      searchModal: "نافذة البحث",
      searchDrawer: "شريط البحث",
      searchSidebar: "شريط جانبي البحث",
      searchHeader: "رأس البحث",
      searchFooter: "تذييل البحث",
      searchNavigation: "تنقل البحث",
      searchBreadcrumb: "تمثيل البحث",
      searchPagination: "تصفيح البحث",
      searchInfinite: "بحث مستمر",
      searchLoadMore: "تحميل المزيد",
      searchLoadAll: "تحميل الكل",
      searchLoadPrevious: "تحميل السابق",
      searchLoadNext: "تحميل التالي",
      searchFirst: "البحث الأول",
      searchLast: "البحث الأخير",
      searchPrevious: "البحث السابق",
      searchNext: "البحث التالي",
      searchPage: "الصفحة البحث",
      searchOf: "من البحث",
      searchShowing: "البحث الظاهر",
      searchTo: "البحث إلى",
      searchFrom: "البحث من",
      searchTotal: "الكلي للبحث",
      searchPerPage: "البحث لكل صفحة",
      searchItems: "البحث لكل عنصر",
      searchItem: "البحث لكل عنصر",
      searchNoResults: "لا توجد نتائج للبحث",
      searchNoResultsMessage: "لا توجد نتائج للبحث",
      searchTryAgain: "حاول البحث مرة أخرى",
      searchTryDifferent: "حاول بحثًا مختلفًا",
      searchTryBroader: "حاول بحثًا أوسع",
      searchTryNarrower: "حاول بحثًا أضيق",
      searchTrySynonyms: "حاول بحثًا بأسماء مترادفة",
      searchTryRelated: "حاول بحثًا عن مواضيع ذات صلة",
      searchTryPopular: "حاول بحثًا شعبيًا",
      searchTryRecent: "حاول بحثًا حديثًا",
      searchTryTrending: "حاول بحثًا متزايدًا",
      searchTryFeatured: "حاول بحثًا مميزًا",
      searchTryRecommended: "حاول بحثًا موصى به",
      searchTrySuggested: "حاول بحثًا مقترح",
      searchTrySimilar: "حاول بحثًا مشابه",
      searchTryMatching: "حاول بحثًا مطابق",
      searchTryExact: "حاول بحثًا دقيقًا",
      searchTryPartial: "حاول بحثًا جزئيًا",
      searchTryFuzzy: "حاول بحثًا مبهمًا",
      searchTryWildcard: "حاول بحثًا بإستخدام الرموز المشبهة",
      searchTryRegex: "حاول بحثًا بإستخدام التعبيرات العادية",
      searchTryAdvanced: "حاول بحثًا متقدمًا",
      searchTryBasic: "حاول بحثًا بسيطًا",
      searchTrySimple: "حاول بحثًا بسيطًا",
      searchTryComplex: "حاول بحثًا معقدًا",
      searchTryCustom: "حاول بحثًا خاصًا",
      searchTrySaved: "حاول بحثًا محفوظ",
      searchTryHistory: "حاول بحثًا من تاريخ البحث",
      searchTryFavorites: "حاول بحثًا من المفضلة",
      searchTryBookmarks: "حاول بحثًا من المعالج",
    },
    dashboard: {
      dashboard: "لوحة التحكم",
      offers: "العروض",
      plans: "الخطط",
      settings: "الإعدادات",
      logout: "تسجيل خروج",
      profile: "المستخدم",
      profilePic: "صورة المستخدم",
      pic: "الملف",
      personalInfo: "معلومات شخصية",
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
      unauthorized: "غير مصرح به",
      unauthorizedMessage: "غير مصرح به للوصول إلى هذا المورد.",
      forbidden: "ممنوع",
      forbiddenMessage: "غير مصرح به للوصول إلى هذا المورد.",
      serverError: "خطأ في الخادم",
      serverErrorMessage: "حدث خطأ أثناء معالجة الطلب.",
      networkError: "خطأ في الشبكة",
      networkErrorMessage: "حدث خطأ في الشبكة أثناء معالجة الطلب.",
      validationError: "خطأ تحقق",
      validationErrorMessage: "حدث خطأ تحقق أثناء معالجة الطلب.",
      invalidInput: "مدخل غير صالح",
      invalidInputMessage: "المدخل المقدم غير صالح.",
      missingField: "حقل مفقود",
      missingFieldMessage: "حقل مطلوب مفقود.",
      invalidFormat: "تنسيق غير صالح",
      invalidFormatMessage: "تنسيق المدخل غير صالح.",
      invalidEmail: "بريد إلكتروني غير صالح",
      invalidEmailMessage: "البريد الإلكتروني المقدم غير صالح.",
      invalidPassword: "كلمة مرور غير صالحة",
      invalidPasswordMessage: "كلمة المرور المقدمة غير صالحة.",
      invalidPhone: "هاتف غير صالح",
      invalidPhoneMessage: "الهاتف المقدم غير صالح.",
      invalidUrl: "رابط غير صالح",
      invalidUrlMessage: "الرابط المقدم غير صالح.",
      invalidDate: "تاريخ غير صالح",
      invalidDateMessage: "التاريخ المقدم غير صالح.",
      invalidTime: "وقت غير صالح",
      invalidTimeMessage: "الوقت المقدم غير صالح.",
      invalidNumber: "رقم غير صالح",
      invalidNumberMessage: "الرقم المقدم غير صالح.",
      invalidInteger: "رقم صحيح غير صالح",
      invalidIntegerMessage: "الرقم الصحيح المقدم غير صالح.",
      invalidDecimal: "رقم عشري غير صالح",
      invalidDecimalMessage: "الرقم العشري المقدم غير صالح.",
      invalidCurrency: "عملة غير صالحة",
      invalidCurrencyMessage: "العملة المقدمة غير صالحة.",
      invalidPercentage: "نسبة غير صالحة",
      invalidPercentageMessage: "النسبة المقدمة غير صالحة.",
      invalidFile: "ملف غير صالح",
      invalidFileMessage: "الملف المقدم غير صالح.",
      invalidImage: "صورة غير صالحة",
      invalidImageMessage: "الصورة المقدمة غير صالحة.",
      invalidVideo: "فيديو غير صالح",
      invalidVideoMessage: "الفيديو المقدم غير صالح.",
      invalidAudio: "صوت غير صالح",
      invalidAudioMessage: "الصوت المقدم غير صالح.",
      invalidDocument: "مستند غير صالح",
      invalidDocumentMessage: "المستند المقدم غير صالح.",
      invalidArchive: "مضغوط غير صالح",
      invalidArchiveMessage: "المضغوط المقدم غير صالح.",
      invalidSize: "حجم غير صالح",
      invalidSizeMessage: "حجم المدخل غير صالح.",
      invalidType: "نوع غير صالح",
      invalidTypeMessage: "نوع المدخل غير صالح.",
      invalidExtension: "امتداد غير صالح",
      invalidExtensionMessage: "امتداد المدخل غير صالح.",
      invalidMimeType: "نوع MIME غير صالح",
      invalidMimeTypeMessage: "نوع MIME المقدم غير صالح.",
      invalidEncoding: "ترميز غير صالح",
      invalidEncodingMessage: "الترميز المقدم غير صالح.",
      invalidCharset: "مجموعة أحرف غير صالحة",
      invalidCharsetMessage: "مجموعة الأحرف المقدمة غير صالحة.",
      invalidLanguage: "لغة غير صالحة",
      invalidLanguageMessage: "اللغة المقدمة غير صالحة.",
      invalidCountry: "بلد غير صالح",
      invalidCountryMessage: "البلد المقدم غير صالح.",
      invalidRegion: "منطقة غير صالحة",
      invalidRegionMessage: "المنطقة المقدمة غير صالحة.",
      invalidCity: "مدينة غير صالحة",
      invalidCityMessage: "المدينة المقدمة غير صالحة.",
      invalidAddress: "عنوان غير صالح",
      invalidAddressMessage: "العنوان المقدم غير صالح.",
      invalidPostalCode: "رمز بريدي غير صالح",
      invalidPostalCodeMessage: "رمز البريد المقدم غير صالح.",
      invalidPhoneCode: "رمز هاتف غير صالح",
      invalidPhoneCodeMessage: "رمز الهاتف المقدم غير صالح.",
      invalidCurrencyCode: "رمز عملة غير صالح",
      invalidCurrencyCodeMessage: "رمز العملة المقدم غير صالح.",
      invalidTimezone: "منطقة زمنية غير صالحة",
      invalidTimezoneMessage: "منطقة الوقت المقدمة غير صالحة.",
      invalidLocale: "موقع غير صالح",
      invalidLocaleMessage: "الموقع المقدم غير صالح.",
      invalidFormat: "تنسيق غير صالح",
      invalidFormatMessage: "تنسيق المدخل غير صالح.",
    },
    features: {
      hotelBooking: "حجز الفنادق",
      hotelBookingDescription: "ابحث واحجز أفضل الفنادق في سوريا",
      carRental: "تأجير السيارات",
      carRentalDescription: "استأجر سيارات لرحلتك بسهولة",
      flightBooking: "حجز الرحلات الجوية",
      flightBookingDescription: "احجز رحلاتك من وإلى سوريا",
      tourGuides: "المرشدون السياحيون",
      tourGuidesDescription: "مرشدون سياحيون محترفون لمغامراتك",
      educationalTours: "الجولات التعليمية",
      educationalToursDescription: "تعرف على تاريخ وثقافة سوريا الغنية",
      healthTourism: "السياحة العلاجية",
      healthTourismDescription: "خدمات السياحة العلاجية في سوريا",
    },
    benefits: {
      qualityService: "خدمة عالية الجودة",
      qualityServiceDescription: "نقدم خدمة متميزة لضمان رضاك",
      secureBooking: "حجز آمن",
      secureBookingDescription: "حجوزاتك آمنة مع إجراءات الأمان المتقدمة لدينا",
      fastBooking: "حجز سريع",
      fastBookingDescription: "احجز خدماتك بسرعة وكفاءة",
      support247: "دعم 24/7",
      support247Description: "احصل على المساعدة في أي وقت مع دعم العملاء على مدار الساعة",
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
      loading: "Chargement",
      error: "Erreur",
      success: "Succès",
      cancel: "Annuler",
      save: "Enregistrer",
      edit: "Modifier",
      delete: "Supprimer",
      view: "Voir",
      create: "Créer",
      update: "Mettre à jour",
      confirm: "Confirmer",
      yes: "Oui",
      no: "Non",
      close: "Fermer",
      next: "Suivant",
      previous: "Précédent",
      search: "Rechercher",
      filter: "Filtrer",
      sort: "Trier",
      all: "Tout",
      none: "Aucun",
      select: "Sélectionner",
      choose: "Choisir",
      upload: "Télécharger",
      download: "Télécharger",
      share: "Partager",
      like: "Aimer",
      dislike: "Ne pas aimer",
      comment: "Commentaire",
      reply: "Répondre",
      follow: "Suivre",
      unfollow: "Ne plus suivre",
      bookmark: "Marquer",
      rate: "Évaluer",
      review: "Revoir",
      report: "Signaler",
      block: "Bloquer",
      unblock: "Débloquer",
      verify: "Vérifier",
      approve: "Approuver",
      reject: "Refuser",
      publish: "Publier",
      unpublish: "Retirer de la publication",
      draft: "Brouillon",
      pending: "En attente",
      published: "Publié",
      rejected: "Refusé",
      featured: "Mis en avant",
      popular: "Populaire",
      trending: "Tendance",
      latest: "Récent",
      oldest: "Ancien",
      newest: "Nouveau",
      best: "Meilleur",
      worst: "Pire",
      highest: "Le plus élevé",
      lowest: "Le plus bas",
      most: "Le plus",
      least: "Le moins",
      total: "Total",
      average: "Moyenne",
      minimum: "Minimum",
      maximum: "Maximum",
      count: "Compte",
      amount: "Montant",
      price: "Prix",
      cost: "Coût",
      free: "Gratuit",
      paid: "Payé",
      discount: "Réduction",
      offer: "Offre",
      deal: "Transaction",
      sale: "Vente",
      new: "Nouveau",
      used: "Utilisé",
      available: "Disponible",
      unavailable: "Indisponible",
      inStock: "En stock",
      outOfStock: "En rupture de stock",
      limited: "Limité",
      unlimited: "Illimité",
      required: "Nécessaire",
      optional: "Optionnel",
      recommended: "Recommendé",
      suggested: "Suggesté",
    },
    nav: {
      services: "Services",
      tourismSites: "Sites touristiques",
      tourismNews: "Actualités touristiques",
      blog: "Blog",
      offers: "Offres",
      home: "Accueil",
      about: "À propos",
      contact: "Contact",
      dashboard: "Tableau de bord",
      profile: "Profil",
      settings: "Paramètres",
      logout: "Se déconnecter",
      login: "Se connecter",
      register: "S'inscrire",
      language: "Langue",
      theme: "Thème",
      notifications: "Notifications",
      messages: "Messages",
      help: "Aide",
      support: "Support",
      faq: "FAQ",
      terms: "Termes",
      privacy: "Confidentialité",
      cookies: "Cookies",
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
      allServices: "Tous les services",
      popularServices: "Services populaires",
      featuredServices: "Services mis en avant",
      newServices: "Nouveaux services",
      serviceDetails: "Détails du service",
      serviceDescription: "Description du service",
      serviceFeatures: "Caractéristiques du service",
      serviceBenefits: "Avantages du service",
      serviceRequirements: "Exigences du service",
      serviceDuration: "Durée du service",
      serviceLocation: "Emplacement du service",
      servicePrice: "Prix du service",
      serviceRating: "Évaluation du service",
      serviceReviews: "Avis sur le service",
      bookNow: "Réserver maintenant",
      learnMore: "En savoir plus",
      getQuote: "Obtenir un devis",
      contactProvider: "Contacter le fournisseur",
      viewDetails: "Voir les détails",
      compareServices: "Comparer les services",
      shareService: "Partager le service",
      recommendService: "Recommander le service",
    },
    tourismSites: {
      historicalSites: "Sites historiques",
      naturalSites: "Sites naturels",
      religiousSites: "Sites religieux",
      allSites: "Tous les sites",
      popularSites: "Sites populaires",
      featuredSites: "Sites mis en avant",
      newSites: "Nouveaux sites",
      siteDetails: "Détails du site",
      siteDescription: "Description du site",
      siteHistory: "Histoire du site",
      siteLocation: "Emplacement du site",
      siteTips: "Conseils pour le site",
      siteFacilities: "Installations du site",
      siteOpeningHours: "Heures d'ouverture du site",
      siteEntryFee: "Frais d'entrée du site",
      siteBestTime: "Meilleur moment pour visiter le site",
      siteHowToReach: "Comment atteindre le site",
      siteNearbyHotels: "Hôtels à proximité",
      siteNearbyRestaurants: "Restaurants à proximité",
      sitePhotos: "Photos du site",
      siteVideos: "Vidéos du site",
      siteReviews: "Avis sur le site",
      siteRating: "Évaluation du site",
      visitSite: "Visiter le site",
      planVisit: "Planifier une visite",
      getDirections: "Obtenir des directions",
      shareSite: "Partager le site",
      recommendSite: "Recommander le site",
      addToFavorites: "Ajouter au favoris",
      removeFromFavorites: "Supprimer des favoris",
    },
    blog: {
      title: "Titre de l'article",
      subtitle: "Sous-titre de l'article",
      description: "Description de l'article",
      readMore: "Lire la suite",
      readFull: "Lire la totalité",
      author: "Auteur",
      publishedOn: "Publié le",
      updatedOn: "Mis à jour le",
      category: "Catégorie de l'article",
      categories: "Catégories de l'article",
      tags: "Mots-clés de l'article",
      tag: "Mots-clé",
      relatedPosts: "Articles liés",
      popularPosts: "Articles populaires",
      recentPosts: "Articles récents",
      featuredPosts: "Articles mis en avant",
      allPosts: "Tous les articles",
      searchPosts: "Rechercher des articles",
      filterPosts: "Filtrer les articles",
      sortPosts: "Trier les articles",
      createPost: "Créer un article",
      editPost: "Modifier l'article",
      deletePost: "Supprimer l'article",
      publishPost: "Publier l'article",
      unpublishPost: "Retirer de la publication l'article",
      approvePost: "Approuver l'article",
      rejectPost: "Refuser l'article",
      postTitle: "Titre de l'article",
      postContent: "Contenu de l'article",
      postExcerpt: "Extrait de l'article",
      postImage: "Image de l'article",
      postImages: "Images de l'article",
      postCategory: "Catégorie de l'article",
      postTags: "Mots-clés de l'article",
      postStatus: "État de l'article",
      postViews: "Vues de l'article",
      postLikes: "J'aime de l'article",
      postDislikes: "Je n'aime pas de l'article",
      postComments: "Commentaires de l'article",
      postShares: "Partages de l'article",
      postBookmarks: "Signets de l'article",
      postRating: "Évaluation de l'article",
      postReview: "Revue de l'article",
      postReport: "Signaler l'article",
      postBlock: "Bloquer l'article",
      postUnblock: "Débloquer l'article",
      postVerify: "Vérifier l'article",
      postApprove: "Approuver l'article",
      postReject: "Refuser l'article",
      postPublish: "Publier l'article",
      postUnpublish: "Retirer de la publication l'article",
      postDraft: "Brouillon de l'article",
      postPending: "En attente de l'article",
      postPublished: "Publié l'article",
      postRejected: "Refusé l'article",
      postFeatured: "Mis en avant l'article",
      postPopular: "Populaire l'article",
      postTrending: "Tendance l'article",
      postLatest: "Récent l'article",
      postOldest: "Ancien l'article",
      postNewest: "Nouveau l'article",
      postBest: "Meilleur l'article",
      postWorst: "Pire l'article",
      postHighest: "Le plus élevé l'article",
      postLowest: "Le plus bas l'article",
      postMost: "Le plus l'article",
      postLeast: "Le moins l'article",
      postTotal: "Total l'article",
      postAverage: "Moyenne l'article",
      postMinimum: "Minimum l'article",
      postMaximum: "Maximum l'article",
      postCount: "Compte l'article",
      postAmount: "Montant l'article",
      postPrice: "Prix l'article",
      postCost: "Coût l'article",
      postFree: "Gratuit l'article",
      postPaid: "Payé l'article",
      postDiscount: "Réduction l'article",
      postOffer: "Offre l'article",
      postDeal: "Transaction l'article",
      postSale: "Vente l'article",
      postNew: "Nouvel l'article",
      postUsed: "Utilisé l'article",
      postAvailable: "Disponible l'article",
      postUnavailable: "Indisponible l'article",
      postInStock: "En stock l'article",
      postOutOfStock: "En rupture de stock l'article",
      postLimited: "Limité l'article",
      postUnlimited: "Illimité l'article",
      postRequired: "Nécessaire l'article",
      postOptional: "Optionnel l'article",
      postRecommended: "Recommendé l'article",
      postSuggested: "Suggesté l'article",
      // Multi-language blog fields
      titleEn: "Title (English)",
      titleAr: "Title (Arabic)",
      titleFr: "Title (French)",
      contentEn: "Content (English)",
      contentAr: "Content (Arabic)",
      contentFr: "Content (French)",
      excerptEn: "Excerpt (English)",
      excerptAr: "Excerpt (Arabic)",
      excerptFr: "Excerpt (French)",
      metaTitleEn: "Meta Title (English)",
      metaTitleAr: "Meta Title (Arabic)",
      metaTitleFr: "Meta Title (French)",
      metaDescriptionEn: "Meta Description (English)",
      metaDescriptionAr: "Meta Description (Arabic)",
      metaDescriptionFr: "Meta Description (French)",
      // Blog form labels
      blogFormTitle: "Titre de l'article",
      blogFormContent: "Contenu de l'article",
      blogFormExcerpt: "Extrait de l'article",
      blogFormCategory: "Catégorie de l'article",
      blogFormTags: "Mots-clés de l'article",
      blogFormImage: "Image de l'article",
      blogFormStatus: "État de l'article",
      blogFormLanguage: "Langue de l'article",
      blogFormTranslations: "Traductions de l'article",
      blogFormEnglish: "Article (Anglais)",
      blogFormArabic: "Article (Arabe)",
      blogFormFrench: "Article (Français)",
      blogFormSave: "Enregistrer l'article",
      blogFormCancel: "Annuler",
      blogFormPreview: "Aperçu de l'article",
      blogFormPublish: "Publier l'article",
      blogFormDraft: "Enregistrer en brouillon",
      blogFormSubmit: "Soumettre l'article",
      blogFormUpdate: "Mettre à jour l'article",
      blogFormDelete: "Supprimer l'article",
      blogFormConfirmDelete: "Êtes-vous sûr de vouloir supprimer cet article ?",
      blogFormDeleteMessage: "Cette action ne peut être annulée.",
      blogFormSuccess: "Article enregistré avec succès !",
      blogFormError: "Erreur lors de la sauvegarde de l'article.",
      blogFormValidation: "Veuillez remplir tous les champs requis.",
      blogFormRequired: "Requis",
      blogFormOptional: "Optionnel",
      blogFormMinLength: "Longueur minimale",
      blogFormMaxLength: "Longueur maximale",
      blogFormInvalidFormat: "Format invalide",
      blogFormInvalidEmail: "Email invalide",
      blogFormInvalidUrl: "URL invalide",
      blogFormInvalidPhone: "Numéro de téléphone invalide",
      blogFormInvalidDate: "Date invalide",
      blogFormInvalidTime: "Temps invalide",
      blogFormInvalidNumber: "Nombre invalide",
      blogFormInvalidInteger: "Entier invalide",
      blogFormInvalidDecimal: "Décimal invalide",
      blogFormInvalidCurrency: "Devise invalide",
      blogFormInvalidPercentage: "Pourcentage invalide",
      blogFormInvalidFile: "Fichier invalide",
      blogFormInvalidImage: "Image invalide",
      blogFormInvalidVideo: "Vidéo invalide",
      blogFormInvalidAudio: "Audio invalide",
      blogFormInvalidDocument: "Document invalide",
      blogFormInvalidArchive: "Archive invalide",
      blogFormInvalidSize: "Taille invalide",
      blogFormInvalidType: "Type invalide",
      blogFormInvalidExtension: "Extension invalide",
      blogFormInvalidMimeType: "Type MIME invalide",
      blogFormInvalidEncoding: "Encodage invalide",
      blogFormInvalidCharset: "Jeux de caractères invalide",
      blogFormInvalidLanguage: "Langue invalide",
      blogFormInvalidCountry: "Pays invalide",
      blogFormInvalidRegion: "Région invalide",
      blogFormInvalidCity: "Ville invalide",
      blogFormInvalidAddress: "Adresse invalide",
      blogFormInvalidPostalCode: "Code postal invalide",
      blogFormInvalidPhoneCode: "Code de téléphone invalide",
      blogFormInvalidCurrencyCode: "Devise invalide",
      blogFormInvalidTimezone: "Fuseau horaire invalide",
      blogFormInvalidLocale: "Emplacement invalide",
      blogFormInvalidFormat: "Format invalide",
    },
    home: {
      whoAreWe: "Qui sommes-nous et que faisons-nous?",
      aboutSyriaWay: "À propos de SyriaWay",
      introductionTitle: "Introduction",
      ourPlatform: "Notre Plateforme",
      comprehensiveSupport: "Support Complet",
      comprehensiveSupportDescription: "Support client 24/7, assistance multilingue et planification de voyage personnalisée",
      specialOffers: "Offres Spéciales",
      specialOffersDescription: "Découvrez des offres incroyables sur les hôtels, la location de voitures et les circuits. Offres à durée limitée avec des réductions exclusives!",
      travelBundles: "Forfaits de Voyage",
      travelBundlesDescription: "Choisissez parmi nos forfaits de voyage soigneusement élaborés",
      whyChooseSyriaWays: "Pourquoi Choisir Syria Ways?",
      whyChooseSyriaWaysDescription: "Nous offrons des services touristiques complets pour rendre votre aventure syrienne inoubliable",
      introduction:
        "Introduction à l'application: L'application Syria est conçue pour faciliter le tourisme en Syrie. L'application intègre divers services pour créer une interface moderne et conviviale avec un support multilingue (arabe, anglais).",
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
      welcome: "Bienvenue",
      welcomeMessage: "Bienvenue dans l'application Syria",
      discoverSyria: "Découvrir Syrie",
      discoverMessage: "Découvrez Syrie avec nous",
      exploreServices: "Explorer les services",
      exploreMessage: "Explorez les services avec nous",
      featuredDestinations: "Destinations mises en avant",
      featuredDestinationsMessage: "Destinations mises en avant sur l'application Syria",
      latestNews: "Dernières actualités",
      latestNewsMessage: "Dernières actualités sur l'application Syria",
      testimonials: "Témoignages",
      testimonialsMessage: "Témoignages sur l'application Syria",
      statistics: "Statistiques",
      statisticsMessage: "Statistiques sur l'application Syria",
      partners: "Partenaires",
      partnersMessage: "Partenaires sur l'application Syria",
      newsletter: "Newsletter",
      newsletterMessage: "Newsletter sur l'application Syria",
      subscribe: "S'abonner",
      subscribeMessage: "S'abonner à l'application Syria",
      contactInfo: "Informations de contact",
      contactInfoMessage: "Informations de contact sur l'application Syria",
      socialMedia: "Réseaux sociaux",
      socialMediaMessage: "Réseaux sociaux sur l'application Syria",
      footer: "Pied de page",
      footerMessage: "Pied de page sur l'application Syria",
      copyright: "Copyright",
      copyrightMessage: "Copyright sur l'application Syria",
      rights: "Droits",
      rightsMessage: "Droits sur l'application Syria",
      terms: "Termes",
      termsMessage: "Termes sur l'application Syria",
      privacy: "Confidentialité",
      privacyMessage: "Confidentialité sur l'application Syria",
      cookies: "Cookies",
      cookiesMessage: "Cookies sur l'application Syria",
      sitemap: "Plan du site",
      sitemapMessage: "Plan du site sur l'application Syria",
      accessibility: "Accessibilité",
      accessibilityMessage: "Accessibilité sur l'application Syria",
    },
    footer: {
      allRightsReserved: "Tous droits réservés ®",
      codedBy: "Codé et conçu par",
      findUs: "Trouvez-nous",
      contactInfo: "Informations de contact",
      socialMedia: "Réseaux sociaux",
      facebook: "Facebook",
      twitter: "Twitter",
      instagram: "Instagram",
      youtube: "YouTube",
      linkedin: "LinkedIn",
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
      bundleTitle: "Titre du forfait",
      bundleDescription: "Description du forfait",
      bundleFeatures: "Caractéristiques du forfait",
      bundlePrice: "Prix du forfait",
      bundleDuration: "Durée du forfait",
      bundleValidity: "Validité du forfait",
      bundleIncludes: "Ce que le forfait inclut",
      bundleExcludes: "Ce que le forfait ne comprend pas",
      bundleTerms: "Termes du forfait",
      bundleConditions: "Conditions du forfait",
      bundleCancellation: "Annulation du forfait",
      bundleRefund: "Remboursement du forfait",
      bundleModification: "Modification du forfait",
      bundleTransfer: "Transfert du forfait",
      bundleSharing: "Partage du forfait",
      bundleUpgrade: "Mise à niveau du forfait",
      bundleDowngrade: "Rétrogradation du forfait",
      bundleExtension: "Extension du forfait",
      bundleRenewal: "Renouvellement du forfait",
      bundleExpiry: "Expiration du forfait",
      bundleActivation: "Activation du forfait",
      bundleDeactivation: "Désactivation du forfait",
      bundleSuspension: "Suspension du forfait",
      bundleTermination: "Termination du forfait",
      bundleReactivation: "Activation du forfait",
      bundleRefundPolicy: "Politique de remboursement",
      bundleCancellationPolicy: "Politique d'annulation",
      bundleModificationPolicy: "Politique de modification",
      bundleTransferPolicy: "Politique de transfert",
      bundleSharingPolicy: "Politique de partage",
      bundleUpgradePolicy: "Politique de mise à niveau",
      bundleDowngradePolicy: "Politique de rétrogradation",
      bundleExtensionPolicy: "Politique d'extension",
      bundleRenewalPolicy: "Politique de renouvellement",
      bundleExpiryPolicy: "Politique d'expiration",
      bundleActivationPolicy: "Politique d'activation",
      bundleDeactivationPolicy: "Politique de désactivation",
      bundleSuspensionPolicy: "Politique de suspension",
      bundleTerminationPolicy: "Politique de terminaison",
      bundleReactivationPolicy: "Politique d'activation",
    },
    search: {
      placeholder: "Rechercher des destinations, services...",
      searchButton: "Rechercher",
      searchResults: "Résultats de recherche",
      searchResultsCount: "Nombre de résultats de recherche",
      searchResultsEmpty: "Aucun résultat de recherche",
      searchResultsError: "Erreur de recherche",
      searchFilters: "Filtres de recherche",
      searchSort: "Trier les résultats",
      searchView: "Affichage des résultats",
      searchGrid: "Grille de recherche",
      searchList: "Liste de recherche",
      searchMap: "Carte de recherche",
      searchCalendar: "Calendrier de recherche",
      searchTimeline: "Chronologie de recherche",
      searchGallery: "Galerie de recherche",
      searchSlideshow: "Diaporama de recherche",
      searchCarousel: "Carrousel de recherche",
      searchTabs: "Onglets de recherche",
      searchAccordion: "Accordéon de recherche",
      searchModal: "Modale de recherche",
      searchDrawer: "Étrier de recherche",
      searchSidebar: "Barre latérale de recherche",
      searchHeader: "En-tête de recherche",
      searchFooter: "Pied de page de recherche",
      searchNavigation: "Navigation de recherche",
      searchBreadcrumb: "Fil d'ariane de recherche",
      searchPagination: "Pagination de recherche",
      searchInfinite: "Recherche infinie",
      searchLoadMore: "Charger plus",
      searchLoadAll: "Charger tout",
      searchLoadPrevious: "Charger précédent",
      searchLoadNext: "Charger suivant",
      searchFirst: "Rechercher le premier",
      searchLast: "Rechercher le dernier",
      searchPrevious: "Rechercher précédent",
      searchNext: "Rechercher suivant",
      searchPage: "Page de recherche",
      searchOf: "de la recherche",
      searchShowing: "Recherche affichée",
      searchTo: "Rechercher jusqu'à",
      searchFrom: "Rechercher à partir de",
      searchTotal: "Total de recherche",
      searchPerPage: "Rechercher par page",
      searchItems: "Rechercher par élément",
      searchItem: "Rechercher par élément",
      searchNoResults: "Aucun résultat de recherche",
      searchNoResultsMessage: "Aucun résultat de recherche",
      searchTryAgain: "Réessayez la recherche",
      searchTryDifferent: "Réessayez une recherche différente",
      searchTryBroader: "Réessayez une recherche plus large",
      searchTryNarrower: "Réessayez une recherche plus étroite",
      searchTrySynonyms: "Réessayez une recherche avec des synonymes",
      searchTryRelated: "Réessayez une recherche sur des sujets connexes",
      searchTryPopular: "Réessayez une recherche populaire",
      searchTryRecent: "Réessayez une recherche récente",
      searchTryTrending: "Réessayez une recherche tendante",
      searchTryFeatured: "Réessayez une recherche mise en avant",
      searchTryRecommended: "Réessayez une recherche recommandée",
      searchTrySuggested: "Réessayez une recherche suggérée",
      searchTrySimilar: "Réessayez une recherche similaire",
      searchTryMatching: "Réessayez une recherche correspondante",
      searchTryExact: "Réessayez une recherche exacte",
      searchTryPartial: "Réessayez une recherche partielle",
      searchTryFuzzy: "Réessayez une recherche floue",
      searchTryWildcard: "Réessayez une recherche avec des jokers",
      searchTryRegex: "Réessayez une recherche avec des expressions régulières",
      searchTryAdvanced: "Réessayez une recherche avancée",
      searchTryBasic: "Réessayez une recherche simple",
      searchTrySimple: "Réessayez une recherche simple",
      searchTryComplex: "Réessayez une recherche complexe",
      searchTryCustom: "Réessayez une recherche personnalisée",
      searchTrySaved: "Réessayez une recherche enregistrée",
      searchTryHistory: "Réessayez une recherche historique",
      searchTryFavorites: "Réessayez une recherche favorite",
      searchTryBookmarks: "Réessayez une recherche en favoris",
    },
    dashboard: {
      dashboard: "Tableau de bord",
      offers: "Offres",
      plans: "Plans",
      settings: "Paramètres",
      logout: "Se déconnecter",
      profile: "UTILISATEUR",
      profilePic: "Photo de profil",
      pic: "Profil",
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
      unauthorized: "Non autorisé",
      unauthorizedMessage: "Non autorisé pour accéder à cette ressource.",
      forbidden: "Interdit",
      forbiddenMessage: "Non autorisé pour accéder à cette ressource.",
      serverError: "Erreur de serveur",
      serverErrorMessage: "Erreur lors de la traitement de la demande.",
      networkError: "Erreur de réseau",
      networkErrorMessage: "Erreur de réseau lors de la traitement de la demande.",
      validationError: "Erreur de validation",
      validationErrorMessage: "Erreur de validation lors de la traitement de la demande.",
      invalidInput: "Entrée invalide",
      invalidInputMessage: "L'entrée fournie est invalide.",
      missingField: "Champ manquant",
      missingFieldMessage: "Champ requis manquant.",
      invalidFormat: "Format invalide",
      invalidFormatMessage: "Le format de l'entrée est invalide.",
      invalidEmail: "Email invalide",
      invalidEmailMessage: "L'email fourni est invalide.",
      invalidPassword: "Mot de passe invalide",
      invalidPasswordMessage: "Le mot de passe fourni est invalide.",
      invalidPhone: "Téléphone invalide",
      invalidPhoneMessage: "Le téléphone fourni est invalide.",
      invalidUrl: "URL invalide",
      invalidUrlMessage: "L'URL fournie est invalide.",
      invalidDate: "Date invalide",
      invalidDateMessage: "La date fournie est invalide.",
      invalidTime: "Temps invalide",
      invalidTimeMessage: "Le temps fourni est invalide.",
      invalidNumber: "Nombre invalide",
      invalidNumberMessage: "Le nombre fourni est invalide.",
      invalidInteger: "Entier invalide",
      invalidIntegerMessage: "L'entier fourni est invalide.",
      invalidDecimal: "Nombre décimal invalide",
      invalidDecimalMessage: "Le nombre décimal fourni est invalide.",
      invalidCurrency: "Devise invalide",
      invalidCurrencyMessage: "La devise fournie est invalide.",
      invalidPercentage: "Pourcentage invalide",
      invalidPercentageMessage: "Le pourcentage fourni est invalide.",
      invalidFile: "Fichier invalide",
      invalidFileMessage: "Le fichier fourni est invalide.",
      invalidImage: "Image invalide",
      invalidImageMessage: "L'image fournie est invalide.",
      invalidVideo: "Vidéo invalide",
      invalidVideoMessage: "La vidéo fournie est invalide.",
      invalidAudio: "Audio invalide",
      invalidAudioMessage: "L'audio fourni est invalide.",
      invalidDocument: "Document invalide",
      invalidDocumentMessage: "Le document fourni est invalide.",
      invalidArchive: "Archive invalide",
      invalidArchiveMessage: "L'archive fournie est invalide.",
      invalidSize: "Taille invalide",
      invalidSizeMessage: "La taille fournie est invalide.",
      invalidType: "Type invalide",
      invalidTypeMessage: "Le type fourni est invalide.",
      invalidExtension: "Extension invalide",
      invalidExtensionMessage: "L'extension fournie est invalide.",
      invalidMimeType: "Type MIME invalide",
      invalidMimeTypeMessage: "Le type MIME fourni est invalide.",
      invalidEncoding: "Encodage invalide",
      invalidEncodingMessage: "L'encodage fourni est invalide.",
      invalidCharset: "Jeux de caractères invalide",
      invalidCharsetMessage: "Le jeu de caractères fourni est invalide.",
      invalidLanguage: "Langue invalide",
      invalidLanguageMessage: "La langue fournie est invalide.",
      invalidCountry: "Pays invalide",
      invalidCountryMessage: "Le pays fourni est invalide.",
      invalidRegion: "Région invalide",
      invalidRegionMessage: "La région fournie est invalide.",
      invalidCity: "Ville invalide",
      invalidCityMessage: "La ville fournie est invalide.",
      invalidAddress: "Adresse invalide",
      invalidAddressMessage: "L'adresse fournie est invalide.",
      invalidPostalCode: "Code postal invalide",
      invalidPostalCodeMessage: "Le code postal fourni est invalide.",
      invalidPhoneCode: "Code de téléphone invalide",
      invalidPhoneCodeMessage: "Le code de téléphone fourni est invalide.",
      invalidCurrencyCode: "Devise invalide",
      invalidCurrencyCodeMessage: "La devise fournie est invalide.",
      invalidTimezone: "Fuseau horaire invalide",
      invalidTimezoneMessage: "Le fuseau horaire fourni est invalide.",
      invalidLocale: "Emplacement invalide",
      invalidLocaleMessage: "L'emplacement fourni est invalide.",
      invalidFormat: "Format invalide",
      invalidFormatMessage: "Le format fourni est invalide.",
    },
    features: {
      hotelBooking: "Réservation d'hôtel",
      hotelBookingDescription: "Trouvez et réservez les meilleurs hôtels en Syrie",
      carRental: "Location de voitures",
      carRentalDescription: "Louez des voitures pour votre voyage facilement",
      flightBooking: "Réservation de vols",
      flightBookingDescription: "Réservez des vols vers et depuis la Syrie",
      tourGuides: "Guides touristiques",
      tourGuidesDescription: "Guides touristiques professionnels pour vos aventures",
      educationalTours: "Visites éducatives",
      educationalToursDescription: "Découvrez la riche histoire et la culture de la Syrie",
      healthTourism: "Tourisme de santé",
      healthTourismDescription: "Services de tourisme médical en Syrie",
    },
    benefits: {
      qualityService: "Service de qualité",
      qualityServiceDescription: "Nous fournissons un service de premier ordre pour assurer votre satisfaction",
      secureBooking: "Réservation sécurisée",
      secureBookingDescription: "Vos réservations sont sécurisées grâce à nos mesures de sécurité avancées",
      fastBooking: "Réservation rapide",
      fastBookingDescription: "Réservez vos services rapidement et efficacement",
      support247: "Support 24/7",
      support247Description: "Obtenez de l'aide à tout moment avec notre support client 24/7",
    },
  },
}
 