const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const userId = 'local-user';
  
  // Create default user and portfolio if they don't exist
  const user = await prisma.user.upsert({
    where: { email: 'local@use.only' },
    update: {},
    create: {
      id: userId,
      email: 'local@use.only',
      password: 'not-needed',
      name: 'Local Trader',
      portfolios: {
        create: {
          id: 'default-portfolio',
          balance: 100000.0
        }
      }
    }
  });

  console.log('✅ Local environment ready.');
  console.log('Default User ID:', user.id);
  console.log('Default Portfolio ID: default-portfolio');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
