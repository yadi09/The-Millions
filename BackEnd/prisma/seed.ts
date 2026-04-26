import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

declare const process: any;

async function seedGlobalFooter() {
  const existing = await prisma.footer.findFirst();
  if (existing) {
    console.log("ℹ️ Global footer already exists, skipping creation");
    return;
  }

  await prisma.footer.create({
    data: {
      phone: "+44 7951 7965 92, +44 7960 412 427",
      email: "info@themillions.com",
      address: "Terminus Terrace, Southampton, SO14 3FD, United Kingdom",
      socialMedia: { whatsapp: "https://wa.me/447951796592" },
      copyright: "© 2026 The MILLIONS. Setting You Up For Success. All rights reserved.",
      showContactBlock: true
    } as any
  });
  console.log("🌍 Global footer seeded");
}

async function seedServiceRecords() {
  const services = [
    { name: "Accountancy & Financial Advisory", description: "Comprehensive financial reporting and bookkeeping..." },
    { name: "Tax Advisory & Compliance", description: "Corporate and individual tax planning..." },
    { name: "Payroll & Bookkeeping", description: "Expertly managed financial records and efficient payroll solutions." },
    { name: "VAT & Making Tax Digital", description: "Stay compliant with HMRC's digital requirements and VAT regulations." },
    { name: "Business Start-Up Support", description: "Everything you need to get your new venture off to a flying start." },
    { name: "Strategic Growth & Advisory", description: "Insights and strategies to scale your business and increase profitability." },
    { name: "Landlord & Property Tax", description: "Specialist tax advice for property investors and buy-to-let owners." },
    { name: "CIS & Contractor Accounting", description: "Tailored accountancy for construction industry professionals and IR35 contractors." },
    { name: "Charities & Not-for-Profits", description: "Specialist accounting and compliance for the third sector." }
  ];

  for (const s of services) {
    const existing = await prisma.service.findFirst({ where: { name: s.name } });
    if (existing) {
      await prisma.service.update({
        where: { id: existing.id },
        data: { description: s.description }
      });
    } else {
      await prisma.service.create({
        data: { name: s.name, description: s.description }
      });
    }
  }
  console.log("💼 Service records seeded");
}

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

async function seedHomeGaps() {
  await prisma.page.upsert({
    where: { slug: "home" },
    update: {},
    create: {
      slug: "home",
      title: "The MILLIONS | Professional Advisory & Learning",
      sections: {
        create: [
          {
            type: "hero",
            order: 0,
            content: {
              badge: "Setting You Up For Success",
              headlineBlack: "Professional Advisory & ",
              headlineBlue: "Learning.",
              description: "A family-founded platform integrating accountancy, tax advisory, business consulting, and accredited professional learning — across the UK and East Africa.",
              backgroundImageUrl: "https://res.cloudinary.com/dwuyfw7mf/image/upload/v1714170000/pages/home/hero-bg.jpg",
              ctas: [
                { label: "Our Services", action: "/#services" },
                { label: "Our Story", action: "/#philosophy" }
              ],
              stats: [
                { num: "UK", label: "London Headquarters · Global Standards" },
                { num: "East Africa", label: "Strategic Regional Focus · Enterprise Growth" },
                { num: "4 Pillars", label: "Advisory · Learning · Ventures · Impact" }
              ]
            }
          },
          {
            type: "philosophy",
            order: 1,
            content: {
              label: "Our Story",
              title: "Founding Philosophy",
              paragraphs: [
                "At its core, THE MILLIONS was established on a simple yet powerful conviction: access to trusted professional guidance, high-quality learning, and ethical opportunity should never be constrained by geography, background, or circumstance.",
                "Across global markets, organisations at every stage of development require reliable expertise to navigate complexity, manage risk, and achieve sustainable growth...",
                "The name THE MILLIONS reflects scale, inclusion, and transformative reach. It represents an ambition to expand opportunity beyond individual organisations, impacting professions, institutions, economies, and communities."
              ],
              quote: "THE MILLIONS was founded on the conviction that every level of enterprise requires trusted expert guidance and that professional knowledge carries a responsibility: to act with integrity, empower others, and create opportunities that endure far beyond ourselves.",
              attr: "The Millions · Founding Principle"
            }
          },
          {
            type: "overview",
            order: 2,
            content: {
              label: "Who We Are",
              title: "Company Overview",
              paragraphs: [
                "THE MILLIONS is a family-founded professional services and learning organisation delivering accountancy, tax advisory, business consulting, and professional capability development.",
                "The organisation operates through an integrated institutional model combining professional advisory expertise, accredited learning and training, structured venture development, enterprise incubation and scaling support, digital enablement, and knowledge platforms..."
              ]
            }
          },
          {
            type: "missionVision",
            order: 3,
            content: {
              label: "Purpose",
              title: "Mission & Vision",
              mission: {
                label: "Our Mission",
                title: "Trusted Advisory. Accredited Learning.",
                text: "To deliver trusted professional advisory services and accredited learning that strengthen organisations, develop highly skilled professionals, and enable the creation of resilient and sustainable enterprises."
              },
              vision: {
                label: "Our Vision",
                title: "A Global Professional Platform.",
                text: "To become a globally respected professional platform that integrates advisory, learning, and venture development—expanding opportunity, strengthening institutions, and generating lasting economic and societal impact."
              }
            }
          },
          {
            type: "values",
            order: 4,
            content: {
              label: "What We Stand For",
              title: "Core Values",
              subTitle: "The MILLIONS Values Framework",
              items: [
                { name: "Meaningful Impact", text: "We exist to create large-scale, lasting change—strengthening institutions, advancing professional capability, and expanding access to opportunity across communities and markets." },
                { name: "Integrity", text: "We uphold rigorous ethical standards, professional independence, and responsible judgement in every engagement and decision." },
                { name: "Leadership through Excellence", text: "We pursue technical rigour, innovation, and continuous improvement." }
              ]
            }
          },
          {
            type: "impactModel",
            order: 5,
            content: {
              label: "Our Framework",
              title: "The MILLIONS Impact Model",
              subTitle: "THE MILLIONS operates through an integrated institutional framework founded on four complementary pillars.",
              pillars: [
                { num: "01", title: "Professional Advisory", text: "Providing accountancy, tax advisory, and business consulting services in accordance with international professional standards." },
                { num: "02", title: "Professional Learning", text: "Delivering accredited learning programmes and professional certification preparation." },
                { num: "03", title: "Venture Development Platform", text: "A structured ecosystem that nurtures independent yet aligned ventures." },
                { num: "04", title: "Social Impact Commitment", text: "Through YeMillions Charity, THE MILLIONS invests in knowledge access and mentorship." }
              ]
            }
          },
          {
            type: "geography",
            order: 6,
            content: {
              label: "Global Reach",
              title: "Strategy Across Borders",
              subTitle: "Bridging markets through localized expertise and global standards.",
              regions: [
                { 
                  label: "United Kingdom", 
                  title: "London Headquarters", 
                  subTitle: "Global Governance", 
                  text: "Our Southampton and London offices lead global strategy and professional compliance.", 
                  tags: ["Accountancy", "Tax Planning", "Institutional Strategy"] 
                },
                { 
                  label: "East Africa", 
                  title: "Strategic Regional Focus", 
                  subTitle: "Enterprise Growth", 
                  text: "Developing high-impact solutions for businesses and professionals across East Africa.", 
                  tags: ["Cross-border Advisory", "Certified Learning", "Venture Support"] 
                }
              ]
            }
          },
          {
            type: "socialImpact",
            order: 7,
            content: {
              label: "Our Responsibility",
              title: "Impact & Sustainability",
              subTitle: "Investing in the future of professions and communities.",
              tiers: [
                { badge: "Knowledge Access", title: "Educational Philanthropy", text: "Providing scholarship and mentorship to the next generation of professional leaders." },
                { badge: "Economic Resilience", title: "Enterprise Incubation", text: "Supporting local businesses through accessible advisory and capability building." }
              ],
              governance: {
                title: "Institutional Integrity",
                paragraphs: ["Governance is the foundation of our impact. We maintain strict professional standards across all regions."],
                list: ["Universal Ethical Practice", "Professional Independence", "Data Transparency"],
                footer: "Official Partner of Global Professional Bodies"
              }
            }
          },
          {
            type: "leadership",
            order: 8,
            content: {
              label: "Our People",
              title: "Leadership & Commitment",
              subTitle: "A team of experts dedicated to institutional excellence.",
              commitments: ["Technical Rugour", "Continuous Capability Development", "Strategic Integrity"],
              leaders: [
                { name: "Expert Leadership", creds: "ACCA, FCCA", role: "Founding Partner", initials: "EL" },
                { name: "Strategic Advisory", creds: "MBA, PhD", role: "Managing Director", initials: "SA" }
              ]
            }
          },
          {
            type: "futureVision",
            order: 9,
            content: {
              label: "Our Path",
              title: "The Future Vision",
              subTitle: "Scaling impact and innovation over the next decade.",
              points: [
                "Digital-First Advisory Evolution",
                "Pan-African Learning Expansion",
                "Global Knowledge Network Growth"
              ],
              footer: "Setting You Up For Success · 2026 and Beyond"
            }
          },
          {
            type: "testimonials",
            order: 10,
            content: {
              title: "Client Success Stories",
              subtitle: "We take pride in the success of our clients.",
              stats: {
                satisfaction: "99%",
                relationship: "8+ Years",
                clients: "1000+"
              },
              testimonials: [
                {
                  clientName: "Samuel Bekele",
                  company: "East Africa Tech Hub",
                  role: "Founder",
                  text: "The Millions helped us navigate the tax complexities of cross-border operations perfectly. Their advisory is world-class.",
                  imageUrl: "https://res.cloudinary.com/dwuyfw7mf/image/upload/v1771922334/testimonials/samuel.jpg",
                  rating: 5
                },
                {
                  clientName: "Sarah Jenkins",
                  company: "UK Logistics Ltd",
                  role: "Finance Director",
                  text: "Professional, timely, and insightful. They are more than just accountants; they are strategic partners.",
                  imageUrl: "https://res.cloudinary.com/dwuyfw7mf/image/upload/v1771922388/testimonials/sarah.jpg",
                  rating: 5
                }
              ]
            }
          }
        ]
      }
    }
  });
  console.log("🌱 Home page gaps seeded");
}

async function seedBlogPage() {
  await prisma.page.upsert({
    where: { slug: "blog" },
    update: {},
    create: {
      slug: "blog",
      title: "Blog | The MILLIONS",
      sections: {
        create: [
          {
            type: "hero",
            order: 0,
            content: {
              badge: "Knowledge Base",
              headlineBlack: "Insights & ",
              headlineBlue: "Resources.",
              description: "Professional insights, industry updates, and learning resources from The MILLIONS team.",
              backgroundImageUrl: "https://res.cloudinary.com/dwuyfw7mf/image/upload/v1714170000/pages/blog/hero-bg.jpg",
              ctas: [
                { label: "Browse Articles", action: "/blog" }
              ]
            }
          }
        ]
      }
    }
  });
  console.log("🌱 Blog page seeded");
}

async function seedContactPage() {
  await prisma.page.upsert({
    where: { slug: "contact" },
    update: {},
    create: {
      slug: "contact",
      title: "Contact Us | The MILLIONS",
      sections: {
        create: [
          {
            type: "hero",
            order: 0,
            content: {
              badge: "Ready to Start Your Journey?",
              headlineBlack: "Get In ",
              headlineBlue: "Touch.",
              description: "Our expert team is here to provide the professional advisory and learning services you need to succeed in global markets.",
              backgroundImageUrl: "https://res.cloudinary.com/dwuyfw7mf/image/upload/v1714170000/pages/contact/hero-bg.jpg"
            }
          }
        ]
      }
    }
  });
  console.log("🌱 Contact page seeded");
}

async function seedTestimonialsPage() {
  await prisma.page.upsert({
    where: { slug: "testimonials" },
    update: {},
    create: {
      slug: "testimonials",
      title: "Testimonials | The MILLIONS",
      sections: {
        create: [
          {
            type: "hero",
            order: 0,
            content: {
              badge: "Client Trust",
              headlineBlack: "What Our ",
              headlineBlue: "Clients Say.",
              description: "Real stories from businesses and professionals who have transformed their financial future with The Millions.",
              backgroundImageUrl: "https://res.cloudinary.com/dwuyfw7mf/image/upload/v1714170000/pages/testimonials/hero-bg.jpg"
            }
          }
        ]
      }
    }
  });
  console.log("🌱 Testimonials page seeded");
}

async function main() {
  console.log("🧹 Cleaning database...");
  await prisma.section.deleteMany();
  // await prisma.footer.deleteMany(); // Removed as per instructions
  await prisma.page.deleteMany();
  console.log("🌱 Starting database seeding...");
  await seedServiceRecords();
  await seedAdminUser();
  await seedGlobalFooter(); // Added after admin user
  await seedHomeGaps();
  await seedBlogPage();
  await seedContactPage();
  await seedTestimonialsPage();
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
