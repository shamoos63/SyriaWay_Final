# Deployment Guide for Render.com

## Prerequisites
- Render.com account
- Database (PostgreSQL recommended for production)
- Google OAuth credentials
- Google AI API key

## Environment Variables
Set these in your Render.com dashboard:

```
NODE_ENV=production
DATABASE_URL=your_database_connection_string
GOOGLE_AI_API_KEY=your_google_ai_api_key
GOOGLE_CLIENT_ID=your_google_oauth_client_id
GOOGLE_CLIENT_SECRET=your_google_oauth_client_secret
NEXTAUTH_URL=https://your-app-name.onrender.com
NEXTAUTH_SECRET=your_nextauth_secret
```

## Build Configuration
The project includes:
- `render.yaml` - Render.com configuration
- `.npmrc` - pnpm configuration for deployment

## Build Command
```bash
pnpm install && pnpm run build
```

## Start Command
```bash
pnpm start
```

## Troubleshooting

### Lockfile Issues
If you get lockfile errors:
1. The `.npmrc` file disables `--frozen-lockfile`
2. Run `pnpm install` locally and commit the updated `pnpm-lock.yaml`

### Database Issues
1. Ensure your `DATABASE_URL` is correct
2. Run database migrations: `npx prisma db push`
3. Seed the database: `npx prisma db seed`

### Next.js Not Found
1. Ensure `next` is in dependencies (not devDependencies)
2. Check that `pnpm install` completes successfully

### Environment Variables
1. All environment variables must be set in Render dashboard
2. `NEXTAUTH_URL` should match your Render app URL
3. `DATABASE_URL` should be a valid PostgreSQL connection string

## Post-Deployment
1. Check the logs for any errors
2. Test the chat functionality
3. Verify OAuth login works
4. Test database operations

## Support
If you encounter issues:
1. Check Render.com logs
2. Verify all environment variables are set
3. Ensure database is accessible from Render
4. Test locally with production environment variables 