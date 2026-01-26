import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function check() {
    if (prisma.user) {
        console.log("✅ Prisma Client has User model");
        try {
            console.log("Connecting to database...");
            await prisma.$connect();
            console.log("✅ Successfully connected to database");
            const count = await prisma.user.count();
            console.log(`✅ User count: ${count}`);
        } catch (e) {
            console.error("❌ Failed to connect to database:", e);
        } finally {
            await prisma.$disconnect();
        }
    } else {
        console.log("❌ Prisma Client DOES NOT have User model");
    }
}

check();
