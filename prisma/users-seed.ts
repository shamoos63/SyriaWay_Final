import { PrismaClient } from '../lib/generated/prisma';
const prisma = new PrismaClient();

async function main() {
  await prisma.user.createMany({
    data: [
      {
        email: 'admin@syriaway.com',
        name: 'SyriaWay Admin',
        password: 'password123',
        role: 'SUPER_ADMIN',
        status: 'ACTIVE',
        preferredLang: 'ENGLISH',
        phone: '+963-11-1234567',
        image: '/images/admin-avatar.jpg',
      },
      {
        email: 'customer@syriaway.com',
        name: 'Sarah Johnson',
        password: 'password123',
        role: 'CUSTOMER',
        status: 'ACTIVE',
        preferredLang: 'ENGLISH',
        phone: '+1-555-1234567',
        image: '/images/customer.jpg',
      },
    ],
  });
  console.log('Seeded users!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  }); 