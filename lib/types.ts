export interface TouristSite {
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
  image?: string
  coordinates?: {
    x: number
    y: number
  }
}
