const { db } = require('../lib/db')
const { users } = require('../drizzle/schema')
const { eq, or } = require('drizzle-orm')

async function checkAdminUsers() {
  try {
    console.log('🔍 Checking admin users in database...')
    
    const adminUsers = await db
      .select({
        id: users.id,
        email: users.email,
        name: users.name,
        role: users.role,
        createdAt: users.createdAt
      })
      .from(users)
      .where(or(eq(users.role, 'ADMIN'), eq(users.role, 'SUPER_ADMIN')))
    
    console.log(`\n📊 Found ${adminUsers.length} admin users:`)
    
    if (adminUsers.length === 0) {
      console.log('❌ No admin users found!')
      console.log('\n💡 To create an admin user, you can:')
      console.log('1. Sign up normally')
      console.log('2. Update the user role in the database:')
      console.log('   UPDATE users SET role = "ADMIN" WHERE email = "your-email@example.com";')
    } else {
      adminUsers.forEach((user, index) => {
        console.log(`\n${index + 1}. ${user.name} (${user.email})`)
        console.log(`   Role: ${user.role}`)
        console.log(`   ID: ${user.id}`)
        console.log(`   Created: ${user.createdAt}`)
      })
    }
    
    // Also check total users
    const totalUsers = await db.select({ count: users.id }).from(users)
    console.log(`\n📈 Total users in database: ${totalUsers.length}`)
    
  } catch (error) {
    console.error('❌ Error checking admin users:', error)
  } finally {
    process.exit(0)
  }
}

checkAdminUsers() 