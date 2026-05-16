
import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
  const users = await prisma.user.findMany({
    select: { email: true, name: true }
  });
  console.log('Registered Users:', users);
  process.exit(0);
}

main();
