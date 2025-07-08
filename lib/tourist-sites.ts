// Define the tourist site type
interface TouristSite {
  id: string
  name: string
  nameAr: string
  nameFr: string
  city: string
  cityAr: string
  cityFr: string
  description: string
  descriptionAr: string
  descriptionFr: string
  image: string
  coordinates: {
    x: number
    y: number
  }
}

// Export the type for use in other files
export type { TouristSite }

// Tourist sites data
export const touristSites: TouristSite[] = [
  {
    id: "aleppo-castle",
    name: "Aleppo Castle",
    nameAr: "قلعة حلب",
    nameFr: "Citadelle d'Alep",
    city: "Aleppo",
    cityAr: "حلب",
    cityFr: "Alep",
    description:
      "A large medieval fortified palace in the center of the old city of Aleppo. It is one of the oldest and largest castles in the world.",
    descriptionAr: "قصر محصن من العصور الوسطى في وسط مدينة حلب القديمة. وهي واحدة من أقدم وأكبر القلاع في العالم.",
    descriptionFr:
      "Un grand palais fortifié médiéval au centre de la vieille ville d'Alep. C'est l'un des plus anciens et des plus grands châteaux du monde.",
    image: "/aleppo-castle.png",
    coordinates: {
      x: 400,
      y: 150,
    },
  },
  {
    id: "umayyad-mosque",
    name: "Umayyad Mosque",
    nameAr: "الجامع الأموي",
    nameFr: "Mosquée des Omeyyades",
    city: "Damascus",
    cityAr: "دمشق",
    cityFr: "Damas",
    description:
      "One of the largest and oldest mosques in the world, located in the old city of Damascus. It is considered by some Muslims to be the fourth-holiest place in Islam.",
    descriptionAr:
      "واحد من أكبر وأقدم المساجد في العالم، يقع في مدينة دمشق القديمة. يعتبره بعض المسلمين رابع أقدس مكان في الإسلام.",
    descriptionFr:
      "L'une des plus grandes et des plus anciennes mosquées du monde, située dans la vieille ville de Damas. Elle est considérée par certains musulmans comme le quatrième lieu le plus saint de l'Islam.",
    image: "/umayyad-mosque-damascus.png",
    coordinates: {
      x: 500,
      y: 350,
    },
  },
  {
    id: "hama-waterwheels",
    name: "Hama's Waterwheels",
    nameAr: "نواعير حماة",
    nameFr: "Norias de Hama",
    city: "Hama",
    cityAr: "حماة",
    cityFr: "Hama",
    description:
      "The famous wooden waterwheels (norias) of Hama are a unique feature of the city. These historic waterwheels were used to transfer water from the Orontes River to aqueducts.",
    descriptionAr:
      "النواعير الخشبية الشهيرة في حماة هي ميزة فريدة للمدينة. استخدمت هذه النواعير التاريخية لنقل المياه من نهر العاصي إلى القنوات المائية.",
    descriptionFr:
      "Les célèbres roues à eau en bois (norias) de Hama sont une caractéristique unique de la ville. Ces roues à eau historiques étaient utilisées pour transférer l'eau du fleuve Oronte vers les aqueducs.",
    image: "/hama-waterwheels.png",
    coordinates: {
      x: 350,
      y: 250,
    },
  },
  {
    id: "latakia-sea",
    name: "Latakia Beach",
    nameAr: "شاطئ اللاذقية",
    nameFr: "Plage de Lattaquié",
    city: "Latakia",
    cityAr: "اللاذقية",
    cityFr: "Lattaquié",
    description:
      "Beautiful Mediterranean beaches with crystal clear waters. Latakia is Syria's principal port city and a popular tourist destination known for its seafront and historic sites.",
    descriptionAr:
      "شواطئ البحر الأبيض المتوسط الجميلة ذات المياه الصافية. اللاذقية هي المدينة الرئيسية للموانئ في سوريا ووجهة سياحية شهيرة معروفة بواجهتها البحرية ومواقعها التاريخية.",
    descriptionFr:
      "De belles plages méditerranéennes aux eaux cristallines. Lattaquié est la principale ville portuaire de la Syrie et une destination touristique populaire connue pour son front de mer et ses sites historiques.",
    image: "/latakia-beach-syria.png",
    coordinates: {
      x: 200,
      y: 200,
    },
  },
  {
    id: "homs-mosque",
    name: "Khalid ibn al-Walid Mosque",
    nameAr: "مسجد خالد بن الوليد",
    nameFr: "Mosquée Khalid ibn al-Walid",
    city: "Homs",
    cityAr: "حمص",
    cityFr: "Homs",
    description:
      "An iconic mosque in Homs with distinctive Ottoman architecture. It is named after the famous Muslim general Khalid ibn al-Walid, whose tomb is located within the mosque.",
    descriptionAr:
      "مسجد أيقوني في حمص ذو هندسة معمارية عثمانية مميزة. سمي على اسم القائد المسلم الشهير خالد بن الوليد، الذي يقع ضريحه داخل المسجد.",
    descriptionFr:
      "Une mosquée emblématique à Homs avec une architecture ottomane distinctive. Elle porte le nom du célèbre général musulman Khalid ibn al-Walid, dont le tombeau se trouve dans la mosquée.",
    image: "/khalid-ibn-al-walid-mosque-homs.png",
    coordinates: {
      x: 400,
      y: 300,
    },
  },
  {
    id: "palmyra",
    name: "Palmyra",
    nameAr: "تدمر",
    nameFr: "Palmyre",
    city: "Palmyra",
    cityAr: "تدمر",
    cityFr: "Palmyre",
    description:
      "An ancient Semitic city in present-day Homs Governorate. Dating back to the Neolithic period, it was an important city of the Roman Empire and UNESCO World Heritage site.",
    descriptionAr:
      "مدينة سامية قديمة في محافظة حمص الحالية. يعود تاريخها إلى العصر الحجري الحديث، وكانت مدينة مهمة في الإمبراطورية الرومانية وموقع تراث عالمي لليونسكو.",
    descriptionFr:
      "Une ancienne cité sémitique dans l'actuel gouvernorat de Homs. Datant de la période néolithique, c'était une ville importante de l'Empire romain et un site du patrimoine mondial de l'UNESCO.",
    image: "/placeholder.svg?height=300&width=500&query=Palmyra ruins",
    coordinates: {
      x: 600,
      y: 400,
    },
  },
  {
    id: "krak-des-chevaliers",
    name: "Krak des Chevaliers",
    nameAr: "قلعة الحصن",
    nameFr: "Krak des Chevaliers",
    city: "Homs Governorate",
    cityAr: "محافظة حمص",
    cityFr: "Gouvernorat de Homs",
    description:
      "A Crusader castle in Syria and one of the most important preserved medieval castles in the world. The site was first inhabited in the 11th century by Kurdish troops.",
    descriptionAr:
      "قلعة صليبية في سوريا وواحدة من أهم القلاع القروسطية المحفوظة في العالم. سكن الموقع لأول مرة في القرن الحادي عشر من قبل القوات الكردية.",
    descriptionFr:
      "Un château croisé en Syrie et l'un des châteaux médiévaux préservés les plus importants au monde. Le site a été habité pour la première fois au 11ème siècle par des troupes kurdes.",
    image: "/placeholder.svg?height=300&width=500&query=Krak des Chevaliers",
    coordinates: {
      x: 300,
      y: 350,
    },
  },
  {
    id: "bosra",
    name: "Bosra",
    nameAr: "بصرى",
    nameFr: "Bosra",
    city: "Daraa Governorate",
    cityAr: "محافظة درعا",
    cityFr: "Gouvernorat de Deraa",
    description:
      "An ancient Roman city in southern Syria that contains ruins from Roman, Byzantine, and early Islamic times. The city is famous for its 2nd-century Roman theater.",
    descriptionAr:
      "مدينة رومانية قديمة في جنوب سوريا تحتوي على آثار من العصور الرومانية والبيزنطية والإسلامية المبكرة. تشتهر المدينة بمسرحها الروماني من القرن الثاني.",
    descriptionFr:
      "Une ancienne ville romaine dans le sud de la Syrie qui contient des ruines des époques romaine, byzantine et islamique primitive. La ville est célèbre pour son théâtre romain du 2ème siècle.",
    image: "/placeholder.svg?height=300&width=500&query=Bosra Roman Theater",
    coordinates: {
      x: 500,
      y: 450,
    },
  },
]
