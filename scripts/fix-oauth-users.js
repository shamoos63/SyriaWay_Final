const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient()

async function fixOAuthUsers() {
  try {
    console.log('Checking for users with email: shamoos63@gmail.com')
    
    // Find user with this email
    const user = await prisma.user.findUnique({
      where: { email: 'shamoos63@gmail.com' },
      include: { accounts: true }
    })

    if (user) {
      console.log('Found user:', {
        id: user.id,
        email: user.email,
        name: user.name,
        accounts: user.accounts.map(acc => ({
          provider: acc.provider,
          providerAccountId: acc.providerAccountId
        }))
      })

      // Check if user has Google account
      const hasGoogleAccount = user.accounts.some(acc => acc.provider === 'google')
      
      if (!hasGoogleAccount) {
        console.log('User exists but has no Google account linked')
        console.log('You can either:')
        console.log('1. Delete this user to allow Google OAuth to create a new one')
        console.log('2. Or the updated NextAuth config should now link the Google account')
        
        // Option 1: Delete the user (uncomment if you want to do this)
        // await prisma.user.delete({ where: { id: user.id } })
        // console.log('User deleted successfully')
      } else {
        console.log('User already has Google account linked')
      }
    } else {
      console.log('No user found with this email')
    }

  } catch (error) {
    console.error('Error:', error)
  } finally {
    await prisma.$disconnect()
  }
}

fixOAuthUsers() 