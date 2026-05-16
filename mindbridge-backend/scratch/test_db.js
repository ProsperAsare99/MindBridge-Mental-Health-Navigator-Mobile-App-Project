const { PrismaClient } = require('@prisma/client');
require('dotenv').config();

const prisma = new PrismaClient();

async function test() {
  try {
    console.log('Testing DB connection...');
    const users = await prisma.user.findMany({ take: 1 });
    console.log('Users found:', users.length);
    
    if (users.length > 0) {
      const userId = users[0].id;
      console.log('Testing onboarding upsert for user:', userId);
      
      const onboarding = await prisma.onboarding.upsert({
        where: { userId },
        update: { firstName: 'TestKW' },
        create: { userId, firstName: 'TestKW', currentMood: 'Happy', sleepPattern: 'Good', stressLevel: 1 }
      });
      
      console.log('Onboarding saved:', onboarding.firstName);
    }
  } catch (error) {
    console.error('DB Test failed:', error);
  } finally {
    await prisma.$disconnect();
  }
}

test();
