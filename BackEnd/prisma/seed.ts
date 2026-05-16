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
   Seed Home Page (NO FOOTER NESTED)
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
          // 1. Hero Section
          {
            type: "hero",
            order: 1,
            content: {
              badge: "ACCA Certified Professionals",
              badgeImageUrl: "https://via.placeholder.com/150x60/1e40af/ffffff?text=ACCA+Certified",
              headlineBlack: "Beyond Compliance.",
              headlineBlue: "Forward With Confidence.",
              description:
                "At The Millions Chartered Certified Accountants, we go beyond compliance. Trusted financial partner helping you stay on top of numbers, minimize tax, improve cash flow, and make confident decisions.",
              backgroundImageUrl: "https://res.cloudinary.com/dwuyfw7mf/image/upload/v1771921814/pages/home/hero/photo_2026-02-24_09-46-15.jpg",
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
          // 2. Services Section
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
                  description: "Annual statutory accounts, corporation tax returns (CT600), and self-assessment tax returns.",
                },
                {
                  id: "payroll",
                  icon: "payroll",
                  title: "Payroll & Bookkeeping",
                  description: "RTI-compliant payroll processing, auto-enrolment pension support, and cloud software setup.",
                },
                {
                  id: "vat",
                  icon: "vat",
                  title: "VAT & Making Tax Digital",
                  description: "VAT returns and MTD compliance to keep your business fully compliant.",
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
          // 3. Stats Section
          {
            type: "stats",
            order: 3,
            content: {
              title: "Why Choose Millions?",
              description: "We combine professional expertise with personal service to deliver exceptional results.",
              stats: [
                { value: "500+", label: "Clients Served", iconUrl: "https://via.placeholder.com/60x60/059669/ffffff?text=500+" },
                { value: "98%", label: "Client Satisfaction", iconUrl: "https://via.placeholder.com/60x60/1e40af/ffffff?text=98%" },
                { value: "5+ Yrs", label: "Avg. Relationship", iconUrl: "https://via.placeholder.com/60x60/9333ea/ffffff?text=5+" },
              ],
            },
          },
          // 4. Team Section
          {
            type: "team",
            order: 4,
            content: {
              title: "The Millions Accountants Team",
              subtitle: "Available for consultation",
              members: [
                {
                  name: "Yadamzer Terefe",
                  role: "CEO & Founder",
                  company: "Yadamzer Business Group",
                  specialty: "Property Accounting",
                  bio: "The Millions completely transformed how we manage our property portfolio accounting. Their cloud-based system and proactive tax planning saved us over £15,000 in the first year alone.",
                  imageUrl: "https://res.cloudinary.com/dwuyfw7mf/image/upload/v1771922081/pages/home/team/photo_2026-02-24_09-46-45.jpg",
                  results: "£15,000+ tax savings",
                  location: "Ethiopia",
                },
                {
                  name: "Mark Zuckerberg",
                  role: "Advisor",
                  company: "Meta Platforms Inc.",
                  specialty: "Funding Strategy",
                  bio: "Their business advisory services helped us secure £500K in funding by presenting our financials professionally to investors. They're not just accountants - they're strategic partners.",
                  imageUrl: "https://res.cloudinary.com/dwuyfw7mf/image/upload/v1771922126/pages/home/team/photo_2026-02-24_09-46-27.jpg",
                  results: "£500K funding secured",
                  location: "USA",
                },
              ],
            },
          },
          // 5. Testimonials Section
          {
            type: "testimonials",
            order: 5,
            content: {
              title: "What Our Clients Say",
              subtitle: "Don't just take our word for it. Here's what our satisfied clients have to say about working with us.",
              stats: {
                satisfaction: "98%",
                relationship: "5+ Years",
                clients: "500+",
              },
              testimonials: [
                {
                  clientName: "Yadamzer Terefe",
                  company: "Yadamzer Business Group",
                  role: "CEO & Founder",
                  text: "The Millions completely transformed how we manage our property portfolio accounting. Their cloud-based system and proactive tax planning saved us over £15,000 in the first year alone.",
                  imageUrl: "https://res.cloudinary.com/dwuyfw7mf/image/upload/v1771922334/pages/home/testimonials/photo_2026-02-24_09-46-45.jpg",
                  rating: 5,
                },
                {
                  clientName: "Mark Zuckerberg",
                  company: "Meta Platforms Inc.",
                  role: "CEO",
                  text: "Their business advisory services helped us secure £500K in funding by presenting our financials professionally to investors. They're not just accountants - they're strategic partners.",
                  imageUrl: "https://res.cloudinary.com/dwuyfw7mf/image/upload/v1771922388/pages/home/testimonials/photo_2026-02-24_09-46-27.jpg",
                  rating: 5,
                },
              ],
            },
          },
          // 6. CTA Section
          {
            type: "cta",
            order: 6,
            content: {
              title: "Book Free Consultation",
              description: "Get Expert Advice Today. Ready to take your finances to the next level? Our team of certified accountants is here to help you succeed.",
              actions: [
                { label: "Book a Free Consultation", action: "book_consultation", description: "30-minute consultation to discuss your needs and how we can help." },
                { label: "WhatsApp Us Instantly", action: "whatsapp", description: "Get immediate answers to your questions via WhatsApp chat." },
              ],
              contact: {
                phone: "+44 20 1234 5678",
                email: "hello@themillions.co.uk",
              },
            },
          },
        ],
      },
      // ❌ REMOVED: footer: { create: {...} }
    },
  });

  console.log("🌱 Home page seeded");
}

/* -----------------------------
   Seed Admin User
------------------------------*/
async function seedAdminUser() {
  const email = process.env.ADMIN_EMAIL ?? "admin@themillions.com";
  const password = process.env.ADMIN_PASSWORD ?? "adminpassword123";

  if (!process.env.ADMIN_PASSWORD && process.env.NODE_ENV === "production") {
    console.error(
      "❌ ADMIN_PASSWORD env var is required when seeding in production. " +
        "Refusing to seed the default 'adminpassword123' into a production database."
    );
    process.exit(1);
  }
  if (!process.env.ADMIN_PASSWORD) {
    console.warn(
      "⚠️  ADMIN_PASSWORD not set — seeding the dev default. Do NOT run this in production."
    );
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  await prisma.user.upsert({
    where: { email },
    update: {},
    create: {
      email,
      password: hashedPassword,
    },
  });

  console.log(`👤 Admin user seeded (${email})`);
}

/* -----------------------------
   Seed About Page (NO FOOTER NESTED)
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
              badgeImageUrl: "https://via.placeholder.com/150x60/1e40af/ffffff?text=About+Us",
              headlineBlack: "Building Trust",
              headlineBlue: "Through Excellence.",
              description: "A client-first, future-focused accountancy firm dedicated to helping individuals and businesses navigate the complexities of finance with confidence.",
              backgroundImageUrl: "https://via.placeholder.com/1920x800/1e293b/ffffff?text=About+Background",
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
              founderImageUrls: [
                "https://via.placeholder.com/300x400/3b82f6/ffffff?text=Mark",
                "https://via.placeholder.com/300x400/8b5cf6/ffffff?text=Sleshi",
              ],
            },
          },
          // 3. Stats
          {
            type: "stats",
            order: 3,
            content: {
              stats: [
                { value: "2014", label: "Founded", iconUrl: "https://via.placeholder.com/60x60/1e40af/ffffff?text=2014" },
                { value: "500+", label: "Clients Served", iconUrl: "https://via.placeholder.com/60x60/059669/ffffff?text=500+" },
                { value: "15+", label: "Team Members", iconUrl: "https://via.placeholder.com/60x60/9333ea/ffffff?text=15+" },
              ],
            },
          },
          // 4. Values (Vision, Mission, Values)
          {
            type: "values",
            order: 4,
            content: {
              vision: "To be recognised as a trusted financial partner that empowers our clients through clarity, compliance, and strategic advice.",
              mission: "To deliver personalised, professional, and proactive accountancy services that support long-term success and financial peace of mind.",
              values: [
                { title: "Integrity", description: "We act with honesty, transparency, and professionalism in everything we do.", iconUrl: "https://via.placeholder.com/80x80/1e40af/ffffff?text=✓" },
                { title: "Clarity", description: "We simplify the complex and speak your language, making finance accessible to all.", iconUrl: "https://via.placeholder.com/80x80/059669/ffffff?text=✓" },
                { title: "Proactivity", description: "We anticipate, advise, and act—before the deadline, keeping you ahead of the curve.", iconUrl: "https://via.placeholder.com/80x80/f59e0b/ffffff?text=✓" },
                { title: "Partnership", description: "We work with you, not just for you, building lasting relationships based on trust.", iconUrl: "https://via.placeholder.com/80x80/8b5cf6/ffffff?text=✓" },
                { title: "Excellence", description: "We stay current, qualified, and committed to your growth and success.", iconUrl: "https://via.placeholder.com/80x80/ec4899/ffffff?text=✓" },
              ],
            },
          },
          // 5. Team
          {
            type: "team",
            order: 5,
            content: {
              title: "Meet Our Team",
              subtitle: "Our experienced team of ACCA certified professionals combines expertise with a personal touch, showcasing both our credentials and our human side.",
              members: [
                { name: "Sleshi Million", role: "Accountant", qualifications: "ACCA, MBA", bio: "Sleshi is a Certified Accountant who helps clients with their financial needs and is also a tax expert.", imageUrl: "https://via.placeholder.com/400x400/3b82f6/ffffff?text=Sleshi" },
                { name: "Mark Million", role: "Accountant", qualifications: "ACCA, MBA", bio: "Mark provides strategic business advice and growth planning, helping entrepreneurs and established businesses achieve their goals.", imageUrl: "https://via.placeholder.com/400x400/8b5cf6/ffffff?text=Mark" },
                { name: "Sarah Abera", role: "Social Media Manager", qualifications: "Certified Social Media Manager", bio: "Sarah is a Social Media Manager who helps the company with their social media presence and is also a graphic designer.", imageUrl: "https://via.placeholder.com/400x400/10b981/ffffff?text=Sarah" },
                { name: "Yadamzer Terefe", role: "Software Engineer", qualifications: "Certified Software Engineer", bio: "Yadamzer is a Software Engineer who helps the company with their software development needs.", imageUrl: "https://via.placeholder.com/400x400/ef4444/ffffff?text=Yadamzer" },
              ],
            },
          },
          // 6. CTA
          {
            type: "cta",
            order: 6,
            content: {
              title: "Ready to Work Together?",
              description: "Let's discuss how our team can help you achieve your financial goals with confidence and clarity.",
              actions: [
                { label: "Book Free Consultation", action: "book_consultation" },
                { label: "View Our Services", action: "services" },
              ],
            },
          },
        ],
      },
      // ❌ REMOVED: footer: { create: {...} }
    },
  });

  console.log("🌱 About page seeded");
}

/* -----------------------------
   Seed Blog Page (NO FOOTER NESTED)
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
              backgroundImageUrl: "https://via.placeholder.com/1920x800/1e293b/ffffff?text=Blog+Hero",
            },
          },
          {
            type: "featured-posts",
            order: 2,
            content: {
              title: "Editor's Pick",
              featuredPostId: "",
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
      // ❌ REMOVED: footer: { create: {...} }
    },
  });

  console.log("🌱 Blog page seeded");
}

/* -----------------------------
   Seed Testimonials Page (NO FOOTER NESTED)
------------------------------*/
async function seedTestimonialsPage() {
  await prisma.page.upsert({
    where: { slug: "testimonials" },
    update: {},
    create: {
      slug: "testimonials",
      title: "Client Success Stories",
      sections: {
        create: [
          // 1. Hero Section
          {
            type: "hero",
            order: 1,
            content: {
              badge: "Success Stories",
              badgeImageUrl: "https://via.placeholder.com/150x60/1e40af/ffffff?text=Testimonials",
              headlineBlack: "Client",
              headlineBlue: "Success Stories.",
              description: "Discover how we've helped businesses achieve their financial goals through expert accounting and strategic advisory.",
              backgroundImageUrl: "https://res.cloudinary.com/dwuyfw7mf/image/upload/v1771921814/pages/testimonials/hero/bg.jpg",
              ctas: [{ label: "Share Your Story", action: "/submit-testimonial" }],
              features: ["Real Results", "Trusted Partners", "Proven Expertise"],
            },
          },
          // 2. Stats Section
          {
            type: "stats",
            order: 2,
            content: {
              title: "Why Clients Trust Us",
              description: "We combine professional expertise with personal service to deliver exceptional results.",
              stats: [
                { value: "98%", label: "Client Satisfaction", iconUrl: "https://via.placeholder.com/60x60/1e40af/ffffff?text=98%" },
                { value: "500+", label: "Businesses Served", iconUrl: "https://via.placeholder.com/60x60/059669/ffffff?text=500+" },
                { value: "5+ Yrs", label: "Avg. Relationship", iconUrl: "https://via.placeholder.com/60x60/9333ea/ffffff?text=5+" },
              ],
            },
          },
          // 3. CTA Section
          {
            type: "cta",
            order: 3,
            content: {
              title: "Ready to define your own success story?",
              description: "Secure your free consultation today and start your journey with The Millions.",
              actions: [{ label: "Secure Free Consultation", action: "/contact" }],
              contact: {
                phone: "+44 20 1234 5678",
                email: "hello@themillions.co.uk",
              },
            },
          },
        ],
      },
      // ❌ REMOVED: footer: { create: {...} }
    },
  });

  console.log("🌱 Testimonials page seeded");
}

/* -----------------------------
   Seed Sample Testimonial Records (for /api/testimonials endpoint)
------------------------------*/
async function seedTestimonialRecords() {
  const testimonials = [
    {
      id: "testimonial-1",
      clientName: "Yadamzer Terefe",
      company: "Yadamzer Business Group",
      role: "CEO & Founder",
      text: "The Millions completely transformed how we manage our property portfolio accounting. Their cloud-based system and proactive tax planning saved us over £15,000 in the first year alone.",
      imageUrl: "https://res.cloudinary.com/dwuyfw7mf/image/upload/v1771922334/pages/testimonials/yadamzer.jpg",
      rating: 5,
      serviceUsed: "Property Accounting",
      location: "Ethiopia",
    },
    {
      id: "testimonial-2",
      clientName: "Mark Zuckerberg",
      company: "Meta Platforms Inc.",
      role: "CEO",
      text: "Their business advisory services helped us secure £500K in funding by presenting our financials professionally to investors. They're not just accountants - they're strategic partners.",
      imageUrl: "https://res.cloudinary.com/dwuyfw7mf/image/upload/v1771922388/pages/testimonials/mark.jpg",
      rating: 5,
      serviceUsed: "Business Advisory",
      location: "USA",
    },
    {
      id: "testimonial-3",
      clientName: "Elon Musk",
      company: "Tesla Inc.",
      role: "CEO",
      text: "After years of struggling with self-assessment, finding The Millions was a game-changer. They explained everything in plain English and their fixed-fee approach meant no surprise bills.",
      imageUrl: "https://res.cloudinary.com/dwuyfw7mf/image/upload/v1771922422/pages/testimonials/elon.jpg",
      rating: 5,
      serviceUsed: "Tax Compliance",
      location: "USA",
    },
    {
      id: "testimonial-4",
      clientName: "Jack Ma",
      company: "Alibaba Group",
      role: "Founder",
      text: "Their proactive approach to international tax planning saved our business significant costs while ensuring full compliance across multiple jurisdictions.",
      imageUrl: "https://res.cloudinary.com/dwuyfw7mf/image/upload/v1771922456/pages/testimonials/jack.jpg",
      rating: 5,
      serviceUsed: "International Tax",
      location: "China",
    },
  ];

  for (const t of testimonials) {
    await prisma.testimonial.upsert({
      where: { id: t.id },
      update: {},
      create: {
        id: t.id,
        clientName: t.clientName,
        company: t.company,
        role: t.role,
        text: t.text,
        imageUrl: t.imageUrl,
        rating: t.rating,
        serviceUsed: t.serviceUsed,
        location: t.location,
      },
    });
  }

  console.log("💬 Testimonial records seeded");
}

/* -----------------------------
   Seed Contact Messages
------------------------------*/
async function seedContactMessages() {
  let service = await prisma.service.findFirst();
  if (!service) {
    service = await prisma.service.create({
      data: {
        name: "General Inquiry",
        description: "General contact form submission",
      },
    });
  }

  const generalService = await prisma.service.findFirst({
    where: { name: "General Inquiry" },
  });

  await prisma.contactMessage.upsert({
    where: { id: "sample-contact-message-1" },
    update: {},
    create: {
      id: "sample-contact-message-1",
      fullName: "John Doe",
      email: "john.doe@example.com",
      phone: "+1234567890",
      message: "This is a sample contact message for testing purposes.",
      serviceId: generalService!.id,
      status: "NEW",
    },
  });

  console.log("📧 Contact messages seeded");
}

/* -----------------------------
   Seed Global Footer (SINGLETON - RUN ONCE)
------------------------------*/
async function seedGlobalFooter() {
  const footerData = {
    phone: "+44 7951 7965 92, +44 7960 412 427",
    email: "info@themillions.com",
    address: "Terminus Terrace, Southampton, SO14 3FD, United Kingdom",
    socialMedia: {
      whatsapp: "https://wa.me/447951796592"
    },
    copyright: "© 2026 The MILLIONS. Setting You Up For Success. All rights reserved.",
    showContactBlock: true
  };

  const existing = await prisma.footer.findFirst();
  
  if (existing) {
    await prisma.footer.update({
      where: { id: existing.id },
      data: footerData
    });
    console.log("🦶 Global footer updated");
  } else {
    await prisma.footer.create({
      data: footerData
    });
    console.log("🦶 Global footer seeded");
  }
}

/* -----------------------------
   Run All Seeds
------------------------------*/
async function main() {
  console.log("🌱 Starting database seeding...");
  
  // Seed pages first (without nested footer)
  await seedHomePage();
  await seedAboutPage();
  await seedBlogPage();
  await seedTestimonialsPage();
  await seedTestimonialRecords();
  
  // Seed global data
  await seedGlobalFooter(); // ✅ NEW: Seed footer separately
  await seedAdminUser();
  await seedContactMessages();
  
  console.log("✅ Database seeding completed successfully!");
}

main()
  .catch((error) => {
    console.error("❌ Seeding failed with error:", error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

// ✅ ADD THIS EMPTY EXPORT STATEMENT TO MAKE FILE A MODULE
export {};