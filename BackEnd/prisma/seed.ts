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
   Seed About Page
------------------------------*/
async function seedAboutPage() {
  await prisma.page.upsert({
    where: { slug: "about" },
    update: {},
    create: {
      slug: "about",
      title: "About Us",
      sections: {
        create: [
          // 1. Hero
          {
            type: "hero",
            order: 1,
            content: {
              badge: "About The Millions",
              headlineBlack: "Building Trust",
              headlineBlue: "Through Excellence.",
              description:
                "A client-first, future-focused accountancy firm dedicated to helping individuals and businesses navigate the complexities of finance with confidence.",
              ctas: [
                { label: "Book Free Consultation", action: "book_consultation" },
                { label: "View Our Services", action: "services" },
              ],
            },
          },
          // 2. Who We Are
          {
            type: "who_we_are",
            order: 2,
            content: {
              title: "Who We Are",
              description:
                "The Millions Chartered Certified Accountants is the 2 brothers Mark and Sleshi Million who are dedicated to helping individuals and businesses navigate the complexities of finance with confidence. They are based in London, UK. and they are the founders of the company. They have been in the business for 10 years and they have a team of 10 people.\n\nThe company is dedicated to helping individuals and businesses navigate the complexities of finance with confidence. They have big dreams and they are working hard to achieve them. they are also working on a project to help people with their financial needs.",
            },
          },
          // 3. Stats
          {
            type: "stats",
            order: 3,
            content: {
              stats: [
                { value: "2014", label: "Founded" },
                { value: "500+", label: "Clients Served" },
                { value: "15+", label: "Team Members" },
              ],
            },
          },
          // 4. Values (Vision, Mission, Values)
          {
            type: "values",
            order: 4,
            content: {
              vision:
                "To be recognised as a trusted financial partner that empowers our clients through clarity, compliance, and strategic advice.",
              mission:
                "To deliver personalised, professional, and proactive accountancy services that support long-term success and financial peace of mind.",
              values: [
                {
                  title: "Integrity",
                  description:
                    "We act with honesty, transparency, and professionalism in everything we do.",
                },
                {
                  title: "Clarity",
                  description:
                    "We simplify the complex and speak your language, making finance accessible to all.",
                },
                {
                  title: "Proactivity",
                  description:
                    "We anticipate, advise, and act—before the deadline, keeping you ahead of the curve.",
                },
                {
                  title: "Partnership",
                  description:
                    "We work with you, not just for you, building lasting relationships based on trust.",
                },
                {
                  title: "Excellence",
                  description:
                    "We stay current, qualified, and committed to your growth and success.",
                },
              ],
            },
          },
          // 5. Team
          {
            type: "team",
            order: 5,
            content: {
              title: "Meet Our Team",
              subtitle:
                "Our experienced team of ACCA certified professionals combines expertise with a personal touch, showcasing both our credentials and our human side.",
              members: [
                {
                  name: "Sleshi Million",
                  role: "Accountant",
                  qualifications: "ACCA, MBA",
                  bio: "Sleshi is an Certified Accountant who helps clients with their financial needs. and also a tax expert.",
                },
                {
                  name: "Mark Million",
                  role: "Accountant",
                  qualifications: "ACCA, MBA",
                  bio: "Mark provides strategic business advice and growth planning, helping entrepreneurs and established businesses achieve their goals.",
                },
                {
                  name: "Sarah Abera",
                  role: "Social Media Manager",
                  qualifications: "Certified Social Media Manager",
                  bio: "Sarah is a Social Media Manager who helps the company with their social media presence. and also a graphic designer.",
                },
                {
                  name: "Yadamzer Terefe",
                  role: "Software Engineer",
                  qualifications: "Certified Software Engineer",
                  bio: "Yadamzer is a Software Engineer who helps the company with their software development needs.",
                },
              ],
            },
          },
          // 6. CTA
          {
            type: "cta",
            order: 6,
            content: {
              title: "Ready to Work Together?",
              description:
                "Let's discuss how our team can help you achieve your financial goals with confidence and clarity.",
              actions: [
                { label: "Book Free Consultation", action: "book_consultation" },
                { label: "View Our Services", action: "services" },
              ],
            },
          },
        ],
      },
    },
  });

  console.log("🌱 About page seeded");
}

/* -----------------------------
   Run All Seeds
------------------------------*/
async function seedBlogPage() {
  await prisma.page.upsert({
    where: { slug: "blog" },
    update: {},
    create: {
      slug: "blog",
      title: "Our Blog",
      sections: {
        create: [
          {
            type: "hero",
            order: 1,
            content: {
              badge: "Financial Insights",
              headlineBlack: "The Latest",
              headlineBlue: "Tips & News.",
              description: "Stay informed with expert financial advice, tax tips, and business growth strategies from our Chartered Accountants.",
            },
          },
          {
            type: "featured-posts",
            order: 2,
            content: {
              title: "Editor's Pick",
              featuredPostId: "", // Will default to most recent if empty
            },
          },
          {
            type: "popular-posts",
            order: 3,
            content: {
              title: "Popular This Month",
              show: true,
              mode: "auto",
            },
          },
        ],
      },
    },
  });

  console.log("🌱 Blog page seeded");
}

async function seedContactMessages() {
  // First, ensure we have at least one service to reference
  const service = await prisma.service.findFirst();
  if (!service) {
    // Create a default service if none exists
    await prisma.service.create({
      data: {
        name: "General Inquiry",
        description: "General contact form submission",
      },
    });
  }

  // Get the service to reference
  const generalService = await prisma.service.findFirst({
    where: { name: "General Inquiry" },
  });

  // Seed a sample contact message
  await prisma.contactMessage.upsert({
    where: { id: "sample-contact-message-1" },
    update: {},
    create: {
      id: "sample-contact-message-1",
      fullName: "John Doe",
      email: "john.doe@example.com",
      phone: "+1234567890",
      message: "This is a sample contact message for testing purposes.",
      serviceId: generalService.id,
      status: "NEW",
    },
  });

  console.log("📧 Contact messages seeded");
}

async function main() {
  await seedHomePage();
  await seedAboutPage();
  await seedBlogPage();
  await seedAdminUser();
  await seedContactMessages();
}

main()
  .catch(console.error)
  .finally(async () => {
    await prisma.$disconnect();
  });
