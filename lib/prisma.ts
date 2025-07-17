import { PrismaClient } from './generated/prisma';
import { createClient } from '@libsql/client';
import { LibSQLAdapter } from '@prisma/adapter-libsql';

const globalForPrisma = global as unknown as { prisma: PrismaClient };

let prisma: PrismaClient;

if (process.env.DATABASE_URL?.startsWith('libsql://')) {
  const turso = createClient({
    url: process.env.DATABASE_URL!,
    authToken: process.env.TURSO_AUTH_TOKEN,
  });
  const adapter = new LibSQLAdapter(turso);
  prisma = globalForPrisma.prisma || new PrismaClient({ adapter });
} else {
  prisma = globalForPrisma.prisma || new PrismaClient();
}

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;

export { prisma }; 