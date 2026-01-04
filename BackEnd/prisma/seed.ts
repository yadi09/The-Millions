import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function seedHomePage() {
  // 1️⃣ Optional: remove old home page to avoid conflicts
  await prisma.page.deleteMany({
    where: { slug: "home" }
  });

  // 2️⃣ Upsert ensures the page is always created
  const home = await prisma.page.upsert({
    where: { slug: "home" },
    update: {},
    create: {
      slug: "home", // ✅ always lowercase, no spaces
      title: "Home",
      sections: {
        create: [
          // HERO
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
                { label: "WhatsApp Us Instantly", action: "whatsapp" }
              ],
              features: [
                "Fixed Fees",
                "Cloud Accounting Experts",
                "Jargon-Free Service",
                "Support across all stages"
              ]
            }
          },

          // SERVICES
          {
            type: "services",
            order: 2,
            content: {
              title: "Our Services at a Glance",
              subtitle: "Comprehensive financial services tailored to your needs.",
              cards: [
                { id: "year_end_accounts", icon: "tax", title: "Year-End Accounts & Tax Returns", description: "Annual statutory accounts, corporation tax returns (CT600), and self-assessment tax returns." },
                { id: "payroll", icon: "payroll", title: "Payroll & Bookkeeping", description: "RTI-compliant payroll processing, auto-enrolment pension support, and cloud software setup." },
                { id: "vat", icon: "vat", title: "VAT & Making Tax Digital", description: "VAT returns and MTD compliance to keep your business fully compliant with HMRC requirements." },
                { id: "startup", icon: "startup", title: "Business Start-Up Support", description: "Company formation, HMRC registration (PAYE, VAT), business structure advice, and funding guidance." }
              ],
              viewAllAction: "services_page"
            }
          },

          // ABOUT
          {
            type: "about",
            order: 3,
            content: {
              title: "Who We Are",
              description: [
                "The Millions Chartered Certified Accountants is client-first, future-focused, helping individuals and businesses navigate finance with confidence.",
                "We blend traditional accountancy with modern tools, delivering insights — not just reports."
              ],
              action: { label: "Read More About Us", link: "/about" }
            }
          },

          // STATS
          {
            type: "stats",
            order: 4,
            content: {
              items: [
                { label: "ACCA Certified", value: "ACCA" },
                { label: "Happy Clients", value: "500+" },
                { label: "Years Experience", value: "10+" }
              ]
            }
          },

          // WHY CHOOSE US
          {
            type: "why-choose-us",
            order: 5,
            content: {
              title: "Why Choose Millions?",
              subtitle: "Professional expertise with personal service to deliver exceptional results.",
              reasons: [
                { icon: "acca", title: "Fully Qualified ACCA", description: "Chartered Certified Accountants you can trust." },
                { icon: "cloud", title: "Cloud-Based Accounting", description: "Real-time financial insights through modern cloud solutions." },
                { icon: "fixed_fees", title: "Fixed Fees, No Surprises", description: "Transparent pricing with no hidden costs." },
                { icon: "friendly", title: "Friendly & Jargon-Free", description: "Plain-English advice for complex financial matters." }
              ]
            }
          },

          // CTA
          {
            type: "cta",
            order: 6,
            content: {
              title: "Ready to Take Your Finances to the Next Level?",
              subtitle: "Get expert advice from our certified accountants today.",
              actions: [
                { label: "Book a Free Consultation", action: "book_consultation" },
                { label: "WhatsApp Us Instantly", action: "whatsapp" }
              ]
            }
          }
        ]
      }
    }
  });

  console.log("🌱 Homepage seeded:", home.slug);
}

async function main() {
  await seedHomePage();
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
