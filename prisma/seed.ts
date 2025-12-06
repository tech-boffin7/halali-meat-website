import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";
import dotenv from "dotenv";
import { additionalQuotes } from "../src/data/additional-quotes";
import { mockData } from "../src/data/mock-seed-data";

dotenv.config({ path: ".env.local" });

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Starting database seeding...\n");

  try {
    // ==================== CLEANUP ====================
    console.log("🧹 Clearing existing data...");
    await prisma.settings.deleteMany();
    await prisma.attachment.deleteMany();
    await prisma.message.deleteMany();
    await prisma.reply.deleteMany();
    await prisma.quote.deleteMany();
    await prisma.product.deleteMany();
    await prisma.user.deleteMany();
    await prisma.quoteTemplate.deleteMany();
    console.log("   ✓ Database cleared\n");

    // ==================== USERS (ADMINS) ====================
    console.log("👥 Seeding users...");
    for (const admin of mockData.admins) {
      const hashed = await bcrypt.hash(admin.password, 10);
      await prisma.user.upsert({
        where: { email: admin.email },
        update: {},
        create: { ...admin, password: hashed },
      });
    }
    console.log(`   ✓ Created ${mockData.admins.length} admin user(s)\n`);

    // ==================== PRODUCTS ====================
    console.log("📦 Seeding products...");
    await prisma.product.createMany({
      data: mockData.products,
    });
    console.log(`   ✓ Created ${mockData.products.length} products\n`);

    // ==================== QUOTES ====================
    console.log("💬 Seeding quotes...");

    // Initial quotes from mock data
    await prisma.quote.createMany({
      data: mockData.quotes,
    });
    console.log(`   ✓ Created ${mockData.quotes.length} initial quotes`);

    // Additional realistic quotes
    await prisma.quote.createMany({
      data: additionalQuotes,
    });
    console.log(`   ✓ Created ${additionalQuotes.length} additional quotes`);

    const totalQuotes = mockData.quotes.length + additionalQuotes.length;
    console.log(`   📊 Total quotes: ${totalQuotes}\n`);

    // ==================== MESSAGES ====================
    console.log("✉️  Seeding messages...");

    const adminUser = await prisma.user.findFirst({
      where: { role: "ADMIN" }
    });

    if (!adminUser) {
      console.error("   ❌ No admin user found to associate sent messages with.");
      process.exit(1);
    }

    const sentMessagesWithUserId = mockData.sentMessages.map((msg) => ({
      ...msg,
      userId: adminUser.id,
    }));

    await prisma.message.createMany({
      data: [
        ...mockData.messages,
        ...sentMessagesWithUserId,
        ...mockData.archivedMessages,
        ...mockData.trashMessages,
      ],
    });

    const totalMessages =
      mockData.messages.length +
      mockData.sentMessages.length +
      mockData.archivedMessages.length +
      mockData.trashMessages.length;

    console.log(`   ✓ Created ${totalMessages} messages`);
    console.log(`   📊 Breakdown:`);
    console.log(`      - Inbox: ${mockData.messages.length}`);
    console.log(`      - Sent: ${mockData.sentMessages.length}`);
    console.log(`      - Archived: ${mockData.archivedMessages.length}`);
    console.log(`      - Trash: ${mockData.trashMessages.length}\n`);

    // ==================== SUMMARY ====================
    console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
    console.log("✅ Database seeding completed successfully!");
    console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
    console.log(`📊 Summary:`);
    console.log(`   • Users: ${mockData.admins.length}`);
    console.log(`   • Products: ${mockData.products.length}`);
    console.log(`   • Quotes: ${totalQuotes}`);
    console.log(`   • Messages: ${totalMessages}`);
    console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n");

  } catch (error) {
    console.error("\n❌ Seeding failed:", error);
    throw error;
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
