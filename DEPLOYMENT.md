# Deployment Guide

## Environment Variables Required

Make sure to set these environment variables in your deployment platform:

### Authentication (Required)
```env
# NextAuth Configuration
NEXTAUTH_URL=https://your-domain.com
NEXTAUTH_SECRET=your-super-secret-key-here

# Database
DATABASE_URL=your-database-connection-string

# OAuth Providers (if using)
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret

GITHUB_CLIENT_ID=your-github-client-id
GITHUB_CLIENT_SECRET=your-github-client-secret
```

### Optional Environment Variables
```env
# Email (if using email notifications)
EMAIL_SERVER_HOST=smtp.gmail.com
EMAIL_SERVER_PORT=587
EMAIL_SERVER_USER=your-email@gmail.com
EMAIL_SERVER_PASSWORD=your-app-password

# File Upload (if using cloud storage)
UPLOADTHING_SECRET=your-uploadthing-secret
UPLOADTHING_APP_ID=your-uploadthing-app-id

# Translation API (if using external translation)
LINGVA_TRANSLATE_API_URL=https://lingva.ml/api/v1
```

## Common Deployment Issues

### 1. Authentication Issues After Deployment

**Problem**: Users can't access protected routes after deployment.

**Solutions**:

1. **Check NEXTAUTH_SECRET**:
   - Ensure `NEXTAUTH_SECRET` is set in your deployment environment
   - Generate a new secret if needed: `openssl rand -base64 32`

2. **Check NEXTAUTH_URL**:
   - Set `NEXTAUTH_URL` to your production domain
   - Must match exactly: `https://your-domain.com` (no trailing slash)

3. **Database Connection**:
   - Ensure `DATABASE_URL` is correct and accessible
   - Run database migrations: `npm run db:migrate`

4. **Cookie Settings**:
   - In production, cookies should be secure
   - Check if your domain uses HTTPS

### 2. Admin Access Issues

**Problem**: Admin users can't access the control panel.

**Solutions**:

1. **Check User Role**:
   - Ensure admin users have `role: 'ADMIN'` or `role: 'SUPER_ADMIN'` in the database
   - Check the `users` table in your database

2. **Session Refresh**:
   - Clear browser cookies and cache
   - Sign out and sign back in

3. **Database Migration**:
   - Ensure all migrations are applied
   - Check if user roles are properly set

### 3. Environment Variable Debugging

Add this to your `app/api/debug-env/route.ts` (temporary):

```typescript
import { NextResponse } from 'next/server'

export async function GET() {
  return NextResponse.json({
    hasNextAuthSecret: !!process.env.NEXTAUTH_SECRET,
    hasNextAuthUrl: !!process.env.NEXTAUTH_URL,
    hasDatabaseUrl: !!process.env.DATABASE_URL,
    nodeEnv: process.env.NODE_ENV,
    // Don't expose actual secrets in production
  })
}
```

### 4. Database Issues

**Problem**: Database connection fails.

**Solutions**:

1. **Check Connection String**:
   - Ensure `DATABASE_URL` is correct
   - Test connection locally

2. **Run Migrations**:
   ```bash
   npm run db:migrate
   npm run db:generate
   ```

3. **Seed Data** (if needed):
   ```bash
   npm run db:seed
   ```

## Troubleshooting Steps

### Step 1: Check Environment Variables
1. Verify all required environment variables are set
2. Check for typos in variable names
3. Ensure values are correct

### Step 2: Check Database
1. Verify database connection
2. Run migrations
3. Check if admin users exist with correct roles

### Step 3: Check Authentication
1. Clear browser cookies
2. Sign out and sign back in
3. Check browser console for errors

### Step 4: Check Logs
1. Check deployment platform logs
2. Look for authentication errors
3. Check for database connection errors

## Platform-Specific Notes

### Vercel
- Environment variables are set in the Vercel dashboard
- Automatic deployments on git push
- Built-in analytics and monitoring

### Netlify
- Environment variables in site settings
- May need to configure redirects for SPA

### Railway
- Environment variables in project settings
- Automatic deployments from GitHub

### Render
- Environment variables in service settings
- Automatic deployments from GitHub

## Security Checklist

- [ ] `NEXTAUTH_SECRET` is set and secure
- [ ] `NEXTAUTH_URL` matches your domain exactly
- [ ] Database connection is secure
- [ ] HTTPS is enabled
- [ ] Environment variables are not exposed in client code
- [ ] Admin users have correct roles in database

## Support

If you're still experiencing issues:

1. Check the deployment platform logs
2. Verify all environment variables are set
3. Test the application locally with production environment variables
4. Check the browser console for client-side errors
5. Verify database connectivity and user roles 