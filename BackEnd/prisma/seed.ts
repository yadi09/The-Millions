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
   Seed Home Page (FULLY DYNAMIC WITH IMAGES)
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
          // 1. Hero Section (with background + badge images)
          {
            type: "hero",
            order: 1,
            content: {
              badge: "ACCA Certified Professionals",
              badgeImageUrl: "https://via.placeholder.com/150x60/1e40af/ffffff?text=ACCA+Certified",
              headlineBlack: "Beyond Compliance.",
              headlineBlue: "Forward With Confidence.",
              description:
                "At The Millions Chartered Certified Accountants, we go beyond compliance. We're your trusted financial partner committed to helping you stay on top of your numbers, minimise tax, improve cash flow, and make confident decisions. Whether you're a startup, contractor, landlord, or established business, we tailor our services to meet your goals.",
              backgroundImageUrl: "https://via.placeholder.com/1920x800/0f172a/ffffff?text=Hero+Background",
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
          
          // 2. Services Section (8 cards with images)
          {
            type: "services",
            order: 2,
            content: {
              title: "Our Services at a Glance",
              subtitle: "Comprehensive financial services tailored to your needs, from individuals to growing businesses.",
              cards: [
                {
                  id: "year_end_accounts",
                  icon: "tax",
                  imageUrl: "https://via.placeholder.com/400x300/ef4444/ffffff?text=Tax+Returns",
                  title: "Year-End Accounts & Tax Returns",
                  description:
                    "Annual statutory accounts, corporation tax returns (CT600), and self-assessment tax returns.",
                },
                {
                  id: "payroll",
                  icon: "payroll",
                  imageUrl: "https://via.placeholder.com/400x300/10b981/ffffff?text=Payroll",
                  title: "Payroll & Bookkeeping",
                  description:
                    "RTI-compliant payroll processing, auto-enrolment pension support, and cloud software setup.",
                },
                {
                  id: "vat",
                  icon: "vat",
                  imageUrl: "https://via.placeholder.com/400x300/3b82f6/ffffff?text=VAT+MTD",
                  title: "VAT & Making Tax Digital",
                  description:
                    "VAT returns and MTD compliance to keep your business fully compliant with HMRC requirements.",
                },
                {
                  id: "startup",
                  icon: "startup",
                  imageUrl: "https://via.placeholder.com/400x300/f59e0b/ffffff?text=Startup",
                  title: "Business Start-Up Support",
                  description: "Company formation, HMRC registration (PAYE, VAT), business structure advice, and funding guidance.",
                },
                {
                  id: "strategic_growth",
                  icon: "growth",
                  imageUrl: "https://via.placeholder.com/400x300/8b5cf6/ffffff?text=Growth",
                  title: "Strategic Growth & Advisory",
                  description: "Management accounts, budgeting, forecasting, cash flow management, and business growth strategy.",
                },
                {
                  id: "landlord",
                  icon: "property",
                  imageUrl: "https://via.placeholder.com/400x300/ec4899/ffffff?text=Property",
                  title: "Landlord & Property Tax",
                  description: "Specialized accounting for property investors and landlords with comprehensive tax optimization.",
                },
                {
                  id: "cis_contractor",
                  icon: "construction",
                  imageUrl: "https://via.placeholder.com/400x300/64748b/ffffff?text=CIS",
                  title: "CIS & Contractor Accounting",
                  description: "Contractor and freelancer accounting with CIS tax support for construction industry professionals.",
                },
                {
                  id: "charities",
                  icon: "nonprofit",
                  imageUrl: "https://via.placeholder.com/400x300/14b8a6/ffffff?text=Charities",
                  title: "Charities & Not-for-Profits",
                  description: "Specialized accounting services for charities, CICs, and community organizations.",
                },
              ],
            },
          },
          
          // 3. Stats Section (with icons)
          {
            type: "stats",
            order: 3,
            content: {
              title: "Why Choose Millions?",
              description: "We combine professional expertise with personal service to deliver exceptional results.",
              stats: [
                {
                  value: "ACCA",
                  label: "Certified",
                  iconUrl: "https://via.placeholder.com/80x80/1e40af/ffffff?text=ACCA"
                },
                {
                  value: "500+",
                  label: "Happy Clients",
                  iconUrl: "https://via.placeholder.com/80x80/059669/ffffff?text=✓"
                },
                {
                  value: "10+",
                  label: "Years Experience",
                  iconUrl: "https://via.placeholder.com/80x80/9333ea/ffffff?text=10+"
                },
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
                  imageUrl: "https://via.placeholder.com/400x400/3b82f6/ffffff?text=YT",
                  results: "£15,000+ tax savings",
                  location: "Ethiopia"
                },
                {
                  name: "Mark Zuckerberg",
                  role: "Advisor",
                  company: "Meta Platforms Inc.",
                  specialty: "Funding Strategy",
                  bio: "Their business advisory services helped us secure £500K in funding by presenting our financials professionally to investors. They're not just accountants - they're strategic partners.",
                  imageUrl: "https://via.placeholder.com/400x400/8b5cf6/ffffff?text=MZ",
                  results: "£500K funding secured",
                  location: "USA"
                },
                {
                  name: "Elon Musk",
                  role: "Strategic Partner",
                  company: "Tesla Inc.",
                  specialty: "Tax Compliance",
                  bio: "After years of struggling with self-assessment, finding The Millions was a game-changer. They explained everything in plain English and their fixed-fee approach meant no surprise bills.",
                  imageUrl: "https://via.placeholder.com/400x400/ef4444/ffffff?text=EM",
                  results: "Stress-free tax compliance",
                  location: "USA"
                },
                {
                  name: "Jack Ma",
                  role: "Business Advisor",
                  company: "Alibaba Group",
                  specialty: "International Tax",
                  bio: "Their proactive approach to international tax planning saved our business significant costs while ensuring full compliance across multiple jurisdictions.",
                  imageUrl: "https://via.placeholder.com/400x400/10b981/ffffff?text=JM",
                  results: "Global tax optimization",
                  location: "China"
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
                clients: "500+"
              },
              testimonials: [
                {
                  clientName: "Yadamzer Terefe",
                  company: "Yadamzer Business Group",
                  role: "CEO & Founder",
                  text: "The Millions completely transformed how we manage our property portfolio accounting. Their cloud-based system and proactive tax planning saved us over £15,000 in the first year alone.",
                  imageUrl: "https://via.placeholder.com/120x120/3b82f6/ffffff?text=YT",
                  rating: 5
                },
                {
                  clientName: "Mark Zuckerberg",
                  company: "Meta Platforms Inc.",
                  role: "CEO",
                  text: "Their business advisory services helped us secure £500K in funding by presenting our financials professionally to investors. They're not just accountants - they're strategic partners.",
                  imageUrl: "https://via.placeholder.com/120x120/8b5cf6/ffffff?text=MZ",
                  rating: 5
                },
                {
                  clientName: "Elon Musk",
                  company: "Tesla Inc.",
                  role: "CEO",
                  text: "After years of struggling with self-assessment, finding The Millions was a game-changer. They explained everything in plain English and their fixed-fee approach meant no surprise bills.",
                  imageUrl: "https://via.placeholder.com/120x120/ef4444/ffffff?text=EM",
                  rating: 5
                },
                {
                  clientName: "Jack Ma",
                  company: "Alibaba Group",
                  role: "Founder",
                  text: "Their proactive approach to international tax planning saved our business significant costs while ensuring full compliance across multiple jurisdictions.",
                  imageUrl: "https://via.placeholder.com/120x120/10b981/ffffff?text=JM",
                  rating: 5
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
                { 
                  label: "Book a Free Consultation", 
                  action: "book_consultation",
                  description: "30-minute consultation to discuss your needs and how we can help."
                },
                { 
                  label: "WhatsApp Us Instantly", 
                  action: "whatsapp",
                  description: "Get immediate answers to your questions via WhatsApp chat."
                },
              ],
              contact: {
                phone: "+44 20 1234 5678",
                email: "hello@themillions.co.uk"
              }
            },
          },
        ],
      },
    },
  });

  console.log("🌱 Home page seeded with dynamic images");
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
   Seed About Page (FULLY DYNAMIC WITH IMAGES)
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
              description:
                "A client-first, future-focused accountancy firm dedicated to helping individuals and businesses navigate the complexities of finance with confidence.",
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
                "https://via.placeholder.com/300x400/8b5cf6/ffffff?text=Sleshi"
              ]
            },
          },
          
          // 3. Stats
          {
            type: "stats",
            order: 3,
            content: {
              stats: [
                { 
                  value: "2014", 
                  label: "Founded",
                  iconUrl: "https://via.placeholder.com/60x60/1e40af/ffffff?text=2014"
                },
                { 
                  value: "500+", 
                  label: "Clients Served",
                  iconUrl: "https://via.placeholder.com/60x60/059669/ffffff?text=500+"
                },
                { 
                  value: "15+", 
                  label: "Team Members",
                  iconUrl: "https://via.placeholder.com/60x60/9333ea/ffffff?text=15+"
                },
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
                  iconUrl: "https://via.placeholder.com/80x80/1e40af/ffffff?text=✓"
                },
                {
                  title: "Clarity",
                  description:
                    "We simplify the complex and speak your language, making finance accessible to all.",
                  iconUrl: "https://via.placeholder.com/80x80/059669/ffffff?text=✓"
                },
                {
                  title: "Proactivity",
                  description:
                    "We anticipate, advise, and act—before the deadline, keeping you ahead of the curve.",
                  iconUrl: "https://via.placeholder.com/80x80/f59e0b/ffffff?text=✓"
                },
                {
                  title: "Partnership",
                  description:
                    "We work with you, not just for you, building lasting relationships based on trust.",
                  iconUrl: "https://via.placeholder.com/80x80/8b5cf6/ffffff?text=✓"
                },
                {
                  title: "Excellence",
                  description:
                    "We stay current, qualified, and committed to your growth and success.",
                  iconUrl: "https://via.placeholder.com/80x80/ec4899/ffffff?text=✓"
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
                  bio: "Sleshi is a Certified Accountant who helps clients with their financial needs and is also a tax expert.",
                  imageUrl: "https://via.placeholder.com/400x400/3b82f6/ffffff?text=Sleshi"
                },
                {
                  name: "Mark Million",
                  role: "Accountant",
                  qualifications: "ACCA, MBA",
                  bio: "Mark provides strategic business advice and growth planning, helping entrepreneurs and established businesses achieve their goals.",
                  imageUrl: "https://via.placeholder.com/400x400/8b5cf6/ffffff?text=Mark"
                },
                {
                  name: "Sarah Abera",
                  role: "Social Media Manager",
                  qualifications: "Certified Social Media Manager",
                  bio: "Sarah is a Social Media Manager who helps the company with their social media presence and is also a graphic designer.",
                  imageUrl: "https://via.placeholder.com/400x400/10b981/ffffff?text=Sarah"
                },
                {
                  name: "Yadamzer Terefe",
                  role: "Software Engineer",
                  qualifications: "Certified Software Engineer",
                  bio: "Yadamzer is a Software Engineer who helps the company with their software development needs.",
                  imageUrl: "https://via.placeholder.com/400x400/ef4444/ffffff?text=Yadamzer"
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

  console.log("🌱 About page seeded with dynamic images");
}

/* -----------------------------
   Run All Seeds
------------------------------*/
async function main() {
  console.log("🌱 Starting database seeding...");
  await seedHomePage();
  await seedAboutPage();
  await seedAdminUser();
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