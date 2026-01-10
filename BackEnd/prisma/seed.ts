/// <reference types="node" />
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";
import "dotenv/config";

/* -----------------------------
   Prisma Client
   ✅ Use DATABASE_URL explicitly so it connects to Neon
------------------------------*/
const prisma = new PrismaClient({
  datasources: {
    db: {
      url: process.env.DATABASE_URL,
    },
  },
});

/* -----------------------------
   Seed Home Page
------------------------------*/
async function seedHomePage() {
  await prisma.page.upsert({
    where: { slug: "home" },
    update: {},
    create: {
      slug: "home",
      title: "Home",
      sections: {
        create: [
          {
            type: "hero",
            order: 1,
            content: {
              badge: "ACCA Certified Professionals",
              headlineBlack: "Beyond Compliance.",
              headlineBlue: "Forward With Confidence.",
              description:
                "At The Millions Chartered Certified Accountants, we go beyond compliance. Trusted financial partner helping you stay on top of numbers, minimize tax, improve cash flow, and make confident decisions.",
              ctas: [
                { label: "Book Free Consultation", action: "book_consultation" },
                { label: "WhatsApp Us Instantly", action: "whatsapp" },
              ],
              features: [
                "Fixed Fees",
                "Cloud Accounting Experts",
                "Jargon-Free Service",
                "Support across all stages",
              ],
            },
          },
          {
            type: "services",
            order: 2,
            content: {
              title: "Our Services at a Glance",
              subtitle: "Comprehensive financial services tailored to your needs.",
              cards: [
                {
                  id: "year_end_accounts",
                  icon: "tax",
                  title: "Year-End Accounts & Tax Returns",
                  description:
                    "Annual statutory accounts, corporation tax returns (CT600), and self-assessment tax returns.",
                },
                {
                  id: "payroll",
                  icon: "payroll",
                  title: "Payroll & Bookkeeping",
                  description:
                    "RTI-compliant payroll processing, auto-enrolment pension support, and cloud software setup.",
                },
                {
                  id: "vat",
                  icon: "vat",
                  title: "VAT & Making Tax Digital",
                  description:
                    "VAT returns and MTD compliance to keep your business fully compliant.",
                },
                {
                  id: "startup",
                  icon: "startup",
                  title: "Business Start-Up Support",
                  description: "Company formation, HMRC registration, business structure advice.",
                },
              ],
            },
          },
        ],
      },
    },
  });

  console.log("🌱 Home page seeded");
}

/* -----------------------------
   Seed Admin User
------------------------------*/
async function seedAdminUser() {
  const email = "admin@themillions.com";
  const password = "adminpassword123";

  const hashedPassword = await bcrypt.hash(password, 10);

  await prisma.user.upsert({
    where: { email },
    update: {},
    create: {
      email,
      password: hashedPassword,
    },
  });

  console.log("👤 Admin user seeded");
}

/* -----------------------------
   Run All Seeds
------------------------------*/
async function main() {
  await seedHomePage();
  await seedAdminUser();
}

main()
  .catch(console.error)
  .finally(async () => {
    await prisma.$disconnect();
  });
