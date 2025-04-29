    // prisma/seed.ts
    import { PrismaClient, Role } from '@prisma/client';
    import bcrypt from 'bcryptjs';

    // Initialize Prisma Client
    const prisma = new PrismaClient();

    async function main() {
      console.log(`Start seeding ...`);

      // Get registry credentials from environment variables
      const registryEmail = process.env.SEED_REGISTRY_EMAIL;
      const registryPassword = process.env.SEED_REGISTRY_PASSWORD;

      if (!registryEmail || !registryPassword) {
        console.error(
          'Error: SEED_REGISTRY_EMAIL and SEED_REGISTRY_PASSWORD must be set in your .env file.'
        );
        process.exit(1); // Exit if variables are not set
      }

      // Check if the registry user already exists
      const existingRegistryUser = await prisma.user.findUnique({
        where: { email: registryEmail },
      });

      if (existingRegistryUser) {
        console.log(`Registry user with email ${registryEmail} already exists. Skipping creation.`);
      } else {
        // Hash the password
        const hashedPassword = await bcrypt.hash(registryPassword, 10);

        // Create the registry user
        const registryUser = await prisma.user.create({
          data: {
            email: registryEmail,
            password: hashedPassword,
            name: 'Registry Admin', // You can change this name
            role: Role.REGISTRY, // Assign the REGISTRY role
            // No center or department assignment needed for Registry
          },
        });
        console.log(`Created registry user: ${registryUser.email} (ID: ${registryUser.id})`);
      }

      // --- You can add seeding for other roles or data here if needed ---
      // Example: Create a default Coordinator user
      // const coordinatorEmail = 'coordinator@example.com';
      // const coordinatorPassword = 'coordPassword123';
      // const existingCoord = await prisma.user.findUnique({ where: { email: coordinatorEmail } });
      // if (!existingCoord) {
      //   const hashedCoordPass = await bcrypt.hash(coordinatorPassword, 10);
      //   await prisma.user.create({
      //     data: {
      //       email: coordinatorEmail,
      //       password: hashedCoordPass,
      //       name: 'Default Coordinator',
      //       role: Role.COORDINATOR,
      //     },
      //   });
      //   console.log(`Created default coordinator user: ${coordinatorEmail}`);
      // }

      console.log(`Seeding finished.`);
    }

    main()
      .catch(async (e) => {
        console.error('Error during seeding:', e);
        await prisma.$disconnect();
        process.exit(1);
      })
      .finally(async () => {
        // Disconnect Prisma Client when done
        await prisma.$disconnect();
      });
    