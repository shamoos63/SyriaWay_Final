# SyriaWay Web Application

A comprehensive Next.js web application for Syria tourism services, featuring hotel bookings, car rentals, guided tours, and Umrah programs.

## Features

### 🏨 **Hotel Booking**
- Browse and book hotels across Syria
- Filter by location, price, and amenities
- Real-time availability checking
- Secure payment processing

### 🚗 **Car Rental**
- Wide selection of vehicles
- Flexible rental periods
- Owner dashboard for car management
- Booking management system

### 🗺️ **Guided Tours**
- Historical site tours
- Cultural experiences
- Professional tour guides
- Customizable itineraries

### 🕌 **Umrah Programs**
- Complete Umrah packages
- Visa assistance
- Accommodation in Makkah & Madinah
- Transportation services

### 🎯 **Additional Features**
- Multi-language support (English, Arabic)
- Dark/Light theme modes
- User authentication with Google OAuth
- Admin control panel
- User dashboards
- Booking management
- Payment integration

## Tech Stack

- **Framework**: Next.js 14 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **UI Components**: shadcn/ui
- **Authentication**: NextAuth.js
- **Database**: Prisma with SQLite
- **State Management**: React Context API
- **Icons**: Lucide React

## Installation

### Prerequisites
- Node.js (v18 or higher)
- npm, yarn, or pnpm

### Setup Instructions

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd SyriaWay_Withoutdata\ base
   ```

2. **Install dependencies**
   ```bash
   npm install
   # or
   yarn install
   # or
   pnpm install
   ```

3. **Set up environment variables**
   ```bash
   cp env.example .env.local
   ```
   
   Then edit `.env.local` and add your actual values:
   ```env
   NEXTAUTH_URL=http://localhost:3000
   NEXTAUTH_SECRET=your-secret-key-here
   GOOGLE_CLIENT_ID=your-google-client-id
   GOOGLE_CLIENT_SECRET=your-google-client-secret
   ```

4. **Set up the database**
   ```bash
   npx prisma generate
   npx prisma db push
   npx prisma db seed
   ```

5. **Start the development server**
   ```bash
   npm run dev
   # or
   yarn dev
   # or
   pnpm dev
   ```

6. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## Environment Variables

Create a `.env.local` file in the root directory with the following variables:

### Required for OAuth Authentication
- `NEXTAUTH_URL`: Your application URL (e.g., http://localhost:3000)
- `NEXTAUTH_SECRET`: A random string for JWT encryption
- `GOOGLE_CLIENT_ID`: Google OAuth client ID
- `GOOGLE_CLIENT_SECRET`: Google OAuth client secret

### Optional
- `GOOGLE_AI_API_KEY`: For chat functionality
- `DATABASE_URL`: Database connection string (defaults to SQLite)

## Getting Google OAuth Credentials

1. Go to the [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select an existing one
3. Enable the Google+ API
4. Go to "Credentials" and create an OAuth 2.0 Client ID
5. Add your domain to authorized origins
6. Add your callback URL: `http://localhost:3000/api/auth/callback/google`
7. Copy the Client ID and Client Secret to your `.env.local` file

## Project Structure

```
├── app/                    # Next.js App Router pages
│   ├── api/               # API routes
│   ├── auth/              # Authentication pages
│   ├── dashboard/         # User dashboards
│   └── control-panel/     # Admin panel
├── components/            # Reusable UI components
├── lib/                   # Utility functions and configurations
├── prisma/               # Database schema and migrations
├── public/               # Static assets
└── styles/               # Global styles
```

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint
- `npm run db:push` - Push database schema
- `npm run db:seed` - Seed database with sample data

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

This project is licensed under the MIT License.

## Support

For support and questions:
- Email: support@syriaway.com
- Website: https://syriaway.com
- Documentation: https://docs.syriaway.com 