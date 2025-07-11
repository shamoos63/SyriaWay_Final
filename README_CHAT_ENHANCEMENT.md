# Enhanced AI Chat with Database Integration

## Overview

The Syria Ways AI chat system has been enhanced to provide more accurate and relevant responses by integrating with your database. The AI assistant (Reem) now searches your database first before falling back to general web knowledge.

## How It Works

### 1. Enhanced Natural Language Understanding
The system now understands natural language queries in multiple languages:

1. **Language Detection**: Automatically detects Arabic, English, or French
2. **Intent Recognition**: Uses comprehensive keyword matching to understand user intent
3. **Database Search**: Searches for relevant information based on detected intent
4. **Page Redirection**: Provides automatic navigation to relevant pages
5. **Context Building**: Formats database results for AI processing
6. **AI Response**: Generates responses using database context as primary source
7. **Automatic Navigation**: Redirects users to appropriate pages after response

### 2. Intelligent Page Redirection
The system automatically redirects users to relevant pages:
- **Cars**: `/cars-rental` - Car rental page
- **Hotels**: `/booking-hotels` - Hotel booking page  
- **Tours**: `/tours` - Tours page
- **Tourism Sites**: `/tourism-sites` - Tourist attractions page
- **Offers**: `/offers` - Special offers page
- **Umrah**: `/umrah` - Umrah services page
- **Flights**: `/booking-flights` - Flight booking page

### 2. Supported Database Searches

The system can search for:

#### Cars
- **Keywords**: car, vehicle, rent, rental, hire, drive, transport, automobile, motor, wheels, سيارة, مركبة, استئجار, تأجير, سيارات, عربة, نقل, قيادة, voiture, louer, location, véhicule, automobile, conduire, transport
- **Data Retrieved**: Available cars with make, model, year, price, location, owner
- **Example Queries**: 
  - "I need a car for rent in Damascus"
  - "What cars do you have for rental?"
  - "Do you have vehicles available?"
  - "شو عندك سيارات للاستئجار؟"
  - "Avez-vous des voitures à louer?"

#### Hotels
- **Keywords**: hotel, accommodation, stay, lodging, room, bed, sleep, residence, guesthouse, inn, hostel, فندق, اقامة, سكن, غرفة, نوم, مبيت, استضافة, بيت ضيافة, نزل, hôtel, hébergement, logement, chambre, dormir, résidence, auberge, pension
- **Data Retrieved**: Available hotels with name, rating, location, price, amenities
- **Example Queries**: 
  - "Show me hotels in Aleppo"
  - "I need accommodation in Damascus"
  - "Where can I stay in Syria?"
  - "شو عندك فنادق؟"
  - "Avez-vous des hôtels disponibles?"

#### Tours
- **Keywords**: tour, guide, excursion, trip, visit, sightseeing, explore, journey, adventure, experience, جولة, مرشد, رحلة, زيارة, استكشاف, مغامرة, تجربة, سياحة, سفر, visite, guide, excursion, voyage, découverte, aventure, expérience, tourisme
- **Data Retrieved**: Available tours with name, category, duration, price, guide, ratings
- **Example Queries**: 
  - "What tours are available?"
  - "I want to explore Syria with a guide"
  - "Show me sightseeing options"
  - "شو عندك جولات سياحية؟"
  - "Avez-vous des visites guidées?"

#### Tourism Sites
- **Keywords**: site, attraction, visit, see, place, monument, landmark, historical, cultural, religious, موقع, معلم, زيارة, مشاهدة, مكان, أثر, تاريخي, ثقافي, ديني, سياحي, attraction, visiter, voir, lieu, monument, historique, culturel, religieux, site
- **Data Retrieved**: Tourism sites with name, category, location, description
- **Example Queries**: 
  - "What historical sites can I visit?"
  - "Show me tourist attractions"
  - "I want to see cultural sites"
  - "شو عندك معالم سياحية؟"
  - "Quels sites touristiques avez-vous?"

#### Special Offers
- **Keywords**: offer, deal, discount, special, promotion, sale, bargain, save, cheap, affordable, عرض, صفقة, خكم, خاص, تخفيض, توفير, رخيص, ميسور, offre, réduction, promotion, solde, bonne affaire, économiser, pas cher, abordable
- **Data Retrieved**: Active special offers with title, discount, validity period
- **Example Queries**: 
  - "Are there any special offers?"
  - "Do you have any deals?"
  - "Show me discounted packages"
  - "شو عندك عروض خاصة؟"
  - "Avez-vous des offres spéciales?"

#### Umrah Services
- **Keywords**: umrah, hajj, pilgrimage, mecca, medina, holy, religious, islamic, عمرة, حج, حجاج, مكة, المدينة, ديني, إسلامي, طواف, omra, hadj, pèlerinage, la mecque, médine, saint, religieux, islamique
- **Data Retrieved**: Redirects to Umrah services page
- **Example Queries**: 
  - "I want to perform Umrah"
  - "Do you offer Hajj packages?"
  - "شو عندك حزم عمرة؟"
  - "Avez-vous des services pour l'Omra?"

#### Flight Booking
- **Keywords**: flight, airplane, plane, airport, fly, booking, ticket, airline, طيران, طائرة, مطار, حجز, تذكرة, شركة طيران, سفر جوي, vol, avion, aéroport, voler, réservation, billet, compagnie aérienne
- **Data Retrieved**: Redirects to flight booking page
- **Example Queries**: 
  - "I need to book a flight"
  - "Do you have airline tickets?"
  - "شو عندك تذاكر طيران؟"
  - "Avez-vous des billets d'avion?"

### 3. Multi-Language Support

The system supports:
- **English**: Primary language
- **Arabic**: Full Arabic support with RTL formatting
- **French**: Complete French language support

### 4. Response Format

The AI provides:
- **Concise answers** (3-4 paragraphs maximum)
- **Structured information** with proper bullet points
- **Database-prioritized content** when available
- **Friendly, enthusiastic tone** appropriate for tourism

### 5. Automatic Page Redirection

The system automatically redirects users to relevant pages:
- **2-second delay** after showing the response to allow reading
- **Seamless navigation** to the appropriate service page
- **Enhanced user experience** with guided navigation
- **Increased conversion** by directing users to booking pages

## Technical Implementation

### Database Integration
- Uses Prisma ORM to query the database
- Searches across multiple tables (cars, hotels, tours, tourism_sites, offers)
- Filters for active, verified, and available items only
- Limits results to prevent overwhelming responses

### AI Integration
- Uses Google's Gemini 1.5 Flash model
- Provides database context in the prompt
- Instructs AI to prioritize database information
- Falls back to rule-based responses if AI fails

### Error Handling
- Graceful degradation if database queries fail
- Fallback to general knowledge responses
- Comprehensive error logging for debugging

## Example Interactions

### Car Rental Query
**User**: "I need a car for rent in Damascus"

**System Response**:
```
Hello! I'd be happy to help you find a car in Damascus. Here are some available options from our database:

- Toyota Camry (2022) - $45/day
  Location: Damascus
  Owner: Ahmed Hassan

- Mercedes C-Class (2021) - $65/day  
  Location: Damascus
  Owner: Sarah Al-Masri

- Honda Civic (2023) - $35/day
  Location: Damascus
  Owner: Omar Khalil

All cars are verified and currently available. You can book directly through our website or contact the owners for more details!
```

### Hotel Query
**User**: "Show me hotels in Aleppo"

**System Response**:
```
Great choice! Aleppo has some wonderful accommodation options. Here's what I found in our database:

- Aleppo Citadel Hotel (4 stars)
  Location: Aleppo
  Address: Near the Citadel
  Starting from: $80/night
  Amenities: WiFi, Restaurant, Parking

- Old City Guesthouse (3 stars)
  Location: Aleppo
  Address: Historic District
  Starting from: $45/night
  Amenities: Traditional courtyard, Breakfast

These hotels are verified and have excellent reviews from our guests!
```

## Benefits

1. **Accurate Information**: Users get real, current data from your database
2. **Better User Experience**: Relevant, specific answers instead of generic responses
3. **Increased Bookings**: Direct promotion of available services
4. **Multilingual Support**: Serves users in their preferred language
5. **Scalable**: Easy to add new database tables and search categories

## Future Enhancements

Potential improvements could include:
- **Real-time availability checking**
- **Personalized recommendations** based on user history
- **Integration with booking system** for direct reservations
- **Image and media support** in responses
- **Advanced filtering** (price range, location, etc.)
- **Analytics tracking** for popular queries

## Configuration

The system uses environment variables:
- `GOOGLE_AI_API_KEY`: Your Google AI API key for Gemini access

Make sure your database is properly configured and the Prisma client is generated.

## Testing

To test the enhanced chat:
1. Add some sample data to your database (cars, hotels, tours, etc.)
2. Ask questions using the supported keywords
3. Verify that database information appears in responses
4. Test in different languages

The system will automatically detect the language and respond appropriately. 