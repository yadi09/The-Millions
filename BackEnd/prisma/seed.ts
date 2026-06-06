/// <reference types="node" />
import { PrismaClient, Prisma } from "@prisma/client";
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
/**
 * Sections that mirror FrontEnd/src/data/landingContent.ts — the canonical
 * fallback the marketing site uses when the API is unavailable. Keep these
 * in sync if landingContent changes. Section `type` strings match what
 * FrontEnd/src/pages/Landing.tsx looks for. Field names inside `content`
 * also match landingContent EXCEPT for "hero" and "services", where
 * Landing.tsx has a translation layer (see getSectionContent).
 */
const homeSections = [
  // 1. Hero — Landing.tsx translates: badge→label, headlineBlack→title,
  //    headlineBlue→titleEm, description→subText, ctas[0].label→primaryCta,
  //    ctas[1].label→ghostCta, stats→stats.
  {
    type: "hero",
    order: 1,
    content: {
      badge: "Setting You Up For Success",
      headlineBlack: "Professional Advisory & Learning.",
      headlineBlue: "Learning.",
      description:
        "A family-founded platform integrating accountancy, tax advisory, business consulting, and accredited professional learning — across the UK and East Africa.",
      ctas: [
        { label: "Our Services", action: "services" },
        { label: "Our Story", action: "story" },
      ],
      stats: [
        { num: "UK", label: "London Headquarters · Global Standards" },
        { num: "East Africa", label: "Strategic Regional Focus · Enterprise Growth" },
        { num: "4 Pillars", label: "Advisory · Learning · Ventures · Impact" },
      ],
    },
  },

  // 2. Philosophy — no translation; content keys match landingContent.philosophy
  {
    type: "philosophy",
    order: 2,
    content: {
      label: "Our Story",
      title: "Founding Philosophy",
      paragraphs: [
        "<p>At its core, THE MILLIONS was established on a simple yet powerful conviction: access to trusted professional guidance, high-quality learning, and ethical opportunity should never be constrained by geography, background, or circumstance.</p>",
        "<p>Across global markets, organisations at every stage of development require reliable expertise to navigate complexity, manage risk, and achieve sustainable growth. Professionals need structured pathways to build capability and advance their careers. Students require access to knowledge that translates into meaningful professional opportunities.</p>",
        "<p>Too often, these elements operate in isolation, creating a disconnect between learning, professional development, and enterprise creation. <strong>THE MILLIONS was founded to bridge this gap.</strong></p>",
        "<p>The name <strong>THE MILLIONS</strong> reflects scale, inclusion, and transformative reach. It represents an ambition to expand opportunity beyond individual organisations, impacting professions, institutions, economies, and communities. It signals a determination to empower millions of people through trusted advisory, accredited learning, and sustainable enterprise development, grounded in the belief that meaningful progress occurs when knowledge, capability, and opportunity are accessible to many, not just a privileged few.</p>",
      ],
      quote:
        "<p>THE MILLIONS was founded on the conviction that every level of enterprise requires trusted expert guidance and that professional knowledge carries a responsibility: to act with integrity, empower others, and create opportunities that endure far beyond ourselves.</p>",
      attr: "The Millions · Founding Principle",
    },
  },

  // 3. Overview
  {
    type: "overview",
    order: 3,
    content: {
      label: "Who We Are",
      title: "Company Overview",
      paragraphs: [
        "<p>THE MILLIONS is a family-founded professional services and learning organisation delivering accountancy, tax advisory, business consulting, and professional capability development.</p>",
        "<p>The organisation operates through an integrated institutional model combining professional advisory expertise, accredited learning and training, structured venture development, enterprise incubation and scaling support, digital enablement, and knowledge platforms—all underpinned by a strong commitment to social, economic, and community impact.</p>",
        "<p>With an operational presence in the United Kingdom and a strategic focus on East Africa, THE MILLIONS is uniquely positioned to support businesses, professionals, and institutions across multiple markets, sectors, and stages of development.</p>",
      ],
    },
  },

  // 4. Mission & Vision
  {
    type: "mission-vision",
    order: 4,
    content: {
      label: "Purpose",
      title: "Mission & Vision",
      mission: {
        label: "Our Mission",
        title: "Trusted Advisory. Accredited Learning.",
        text: "<p>To deliver trusted professional advisory services and accredited learning that strengthen organisations, develop highly skilled professionals, and enable the creation of resilient and sustainable enterprises.</p>",
      },
      vision: {
        label: "Our Vision",
        title: "A Global Professional Platform.",
        text: "<p>To become a globally respected professional platform that integrates advisory, learning, and venture development—expanding opportunity, strengthening institutions, and generating lasting economic and societal impact.</p>",
      },
    },
  },

  // 5. Values
  {
    type: "values",
    order: 5,
    content: {
      label: "What We Stand For",
      title: "Core Values",
      subTitle: "The MILLIONS Values Framework",
      items: [
        { name: "Meaningful Impact", text: "<p>We exist to create large-scale, lasting change—strengthening institutions, advancing professional capability, and expanding access to opportunity across communities and markets.</p>" },
        { name: "Integrity", text: "<p>We uphold rigorous ethical standards, professional independence, and responsible judgement in every engagement and decision.</p>" },
        { name: "Leadership through Excellence", text: "<p>We pursue technical rigour, innovation, and continuous improvement to deliver outstanding outcomes across advisory, learning, and venture development.</p>" },
        { name: "Inclusion and Opportunity", text: "<p>We believe progress should benefit many, not a few. We expand access to accredited knowledge, professional pathways, and enterprise development for diverse individuals and organisations.</p>" },
        { name: "Ownership and Accountability", text: "<p>We operate with transparency, strong governance, and measurable responsibility—earning trust through disciplined execution and clear outcomes.</p>" },
        { name: "Nurturing Growth", text: "<p>We develop people, organisations, and enterprises through practical expertise, structured support, and long-term partnership.</p>" },
        { name: "Sustainability", text: "<p>We prioritise solutions that are resilient, responsible, and designed to deliver enduring economic and societal value.</p>" },
      ],
    },
  },

  // 6. Impact Model
  {
    type: "impact-model",
    order: 6,
    content: {
      label: "Our Framework",
      title: "The MILLIONS Impact Model",
      subTitle:
        "<p>THE MILLIONS operates through an integrated institutional framework founded on four complementary pillars.</p>",
      pillars: [
        { num: "01", title: "Professional Advisory", text: "<p>Providing accountancy, tax advisory, and business consulting services in accordance with international professional standards, supporting organisations across all stages of development and complexity.</p>" },
        { num: "02", title: "Professional Learning", text: "<p>Delivering accredited learning programmes, professional certification preparation, and executive development designed to enhance technical capability, leadership capacity, and long-term career progression.</p>" },
        { num: "03", title: "Venture Development Platform", text: "<p>A structured ecosystem that nurtures independent yet aligned ventures under shared governance, professional standards, and quality assurance—building a sustainable network of professional enterprise.</p>" },
        { num: "04", title: "Social Impact Commitment", text: "<p>Through YeMillions Charity, THE MILLIONS invests in knowledge access, mentorship, and opportunity creation, ensuring measurable societal and economic impact beyond commercial success.</p>" },
      ],
    },
  },

  // 7. Services — Landing.tsx translates: title→title, cards|items→items,
  //    footerTitle→footer.title, footerText→footer.text. NOTE: dynamic
  //    services from /api/services override `items` at render time.
  {
    type: "services",
    order: 7,
    content: {
      label: "What We Do",
      title: "Our Services at a Glance",
      items: [
        { title: "Accountancy & Financial Advisory", text: "<p>Comprehensive financial reporting, bookkeeping, audit preparation, and advisory services in line with internationally recognised standards. We help organisations strengthen financial governance, enhance transparency, and make informed strategic decisions.</p>" },
        { title: "Tax Advisory & Compliance", text: "<p>Corporate and individual tax advisory, compliance management, and strategic planning. Our approach ensures regulatory alignment while supporting sustainable tax positions across jurisdictions.</p>" },
        { title: "Professional Education & Executive Development", text: "<p>Accredited certification preparation (including ACCA), technical masterclasses, executive leadership programmes, and digital learning platforms. These initiatives cultivate highly skilled professionals capable of meeting international standards and driving sustainable enterprise value.</p>" },
        { title: "Business & Governance Consulting", text: "<p>Strategic, operational, and governance advisory to optimise organisational performance, reinforce institutional frameworks, and enable resilient growth.</p>" },
      ],
      footerTitle: "Integrated Impact",
      footerText:
        "<p>By combining advisory, professional learning, and enterprise development within a single platform, THE MILLIONS bridges the gaps between professional development, organisational growth, and social impact.</p>",
    },
  },

  // 8. Geography
  {
    type: "geography",
    order: 8,
    content: {
      label: "Where We Operate",
      title: "Geographic Focus",
      subTitle:
        "<p>While The MILLIONS has a presence in the UK, its strategic focus is on East Africa, where demand for structured professional advisory and accredited training is rapidly expanding.</p>",
      regions: [
        {
          label: "Advisory & Training",
          title: "United Kingdom",
          subTitle: "London Headquarters",
          text: "<p>Delivering advanced professional services and education programmes to international benchmarks, with global standards and advanced expertise at the core of every engagement.</p>",
          tags: ["London Headquarters", "Global Standards", "Advanced Expertise"],
        },
        {
          label: "Economic Development",
          title: "East Africa",
          subTitle: "Strategic Regional Focus",
          text: "<p>Serving rapidly growing markets with tailored professional advisory, accredited learning, and enterprise development support for the region's most dynamic organisations and professionals.</p>",
          tags: ["Regional Focus", "Emerging Markets", "Enterprise Growth"],
        },
      ],
    },
  },

  // 9. Social Impact
  {
    type: "social-impact",
    order: 9,
    content: {
      label: "Social Responsibility",
      title: "Social Impact & Corporate Responsibility",
      subTitle: "YeMillions Charity: Three-Tier Impact Framework",
      tiers: [
        { badge: "Tier 1", title: "Access & Scholarships", text: "<p>Providing fully funded access to accredited professional learning, certification preparation, and structured mentorship programmes for high-potential individuals.</p>" },
        { badge: "Tier 2", title: "Institutional Capacity Development", text: "<p>Partnering with universities, training centres, and professional institutions to enhance curriculum delivery, provide faculty expertise, and improve access to high-quality learning resources and international professional standards.</p>" },
        { badge: "Tier 3", title: "Venture Incubation Pathway", text: "<p>Identifying high-performing scholars and professionals for structured enterprise incubation within THE MILLIONS ecosystem, supporting independent yet aligned ventures under shared governance, ethical standards, and sustainable business practices.</p>" },
      ],
      governance: {
        title: "Impact Governance & Oversight",
        paragraphs: [
          "<p>YeMillions Charity operates under independent governance in accordance with UK regulatory standards, maintaining clear operational and financial separation from commercial activities.</p>",
          "<p>All scholarship awards, institutional partnerships, and venture incubation selections are conducted through:</p>",
        ],
        list: [
          "Transparent eligibility criteria",
          "Documented evaluation processes",
          "Independent oversight mechanisms",
        ],
        footer:
          "<p>Progression from scholarship programmes into venture incubation is strictly merit-based, with formal governance safeguards to prevent conflicts of interest and uphold the charity's public-benefit mandate.</p>",
      },
    },
  },

  // 10. Leadership
  {
    type: "leadership",
    order: 10,
    content: {
      label: "Our Team",
      title: "Leadership & Governance",
      subTitle:
        "<p>The MILLIONS is led by a team of seasoned professionals with extensive experience in finance, education, and business consulting — united by a shared vision for creating ventures that generate both financial and societal value.</p>",
      commitments: [
        "Upholding rigorous professional standards",
        "Driving the integrated advisory and education model",
        "Nurturing aligned ventures under shared ethical and governance frameworks",
        "Delivering both commercial and social impact consistently",
      ],
      leaders: [
        { name: "Mark MILLION", creds: "BA, MBA, FCCA, ATT (Fellow)", role: "Principal", initials: "M" },
        { name: "Seleshi MILLION", creds: "", role: "Business Growth Consultant", initials: "S" },
      ],
    },
  },

  // 11. Future Vision
  {
    type: "future-vision",
    order: 11,
    content: {
      label: "Looking Ahead",
      title: "Future Platform Vision",
      subTitle:
        "<p>The MILLIONS is designed to evolve into a platform ecosystem for independent ventures aligned under its brand values.</p>",
      points: [
        "<p>Ventures operate with shared governance and accountability</p>",
        "<p>Talent developed through The MILLIONS' training programmes can expand into new business opportunities</p>",
        "<p>The brand's reputation and long-term impact are consistently strengthened</p>",
      ],
      footer:
        "<p>This strategic vision positions The MILLIONS as a lasting professional and social institution, capable of inspiring and empowering communities across generations.</p>",
    },
  },
];

async function seedHomePage() {
  // Authoritative seed: wipes existing sections and re-creates from landingContent.
  // Any admin edits to the home page will be overwritten on each `prisma db seed` run.
  await prisma.$transaction(async (tx) => {
    const page = await tx.page.upsert({
      where: { slug: "home" },
      update: { title: "Home" },
      create: { slug: "home", title: "Home" },
    });

    await tx.section.deleteMany({ where: { pageId: page.id } });

    await tx.section.createMany({
      data: homeSections.map((s) => ({ ...s, pageId: page.id })),
    });
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
      name: "Yadamzer Terefe",
      email: "yadamzer@example.com",
      company: "Yadamzer Business Group",
      role: "CEO & Founder",
      content:
        "The Millions completely transformed how we manage our property portfolio accounting. Their cloud-based system and proactive tax planning saved us over £15,000 in the first year alone.",
      image: "https://res.cloudinary.com/dwuyfw7mf/image/upload/v1771922334/pages/testimonials/yadamzer.jpg",
      rating: 5,
      category: "Accountancy & Financial Advisory",
      results: "£15,000+ tax savings in year one",
      location: "Ethiopia",
      status: "APPROVED" as const,
      order: 100, // featured
    },
    {
      id: "testimonial-2",
      name: "Mark Zuckerberg",
      email: "mark@example.com",
      company: "Meta Platforms Inc.",
      role: "CEO",
      content:
        "Their business advisory services helped us secure £500K in funding by presenting our financials professionally to investors. They're not just accountants — they're strategic partners.",
      image: "https://res.cloudinary.com/dwuyfw7mf/image/upload/v1771922388/pages/testimonials/mark.jpg",
      rating: 5,
      category: "Business & Governance Consulting",
      results: "£500K funding secured",
      location: "United States",
      status: "APPROVED" as const,
      order: 90,
    },
    {
      id: "testimonial-3",
      name: "Elon Musk",
      email: "elon@example.com",
      company: "Tesla Inc.",
      role: "CEO",
      content:
        "After years of struggling with self-assessment, finding The Millions was a game-changer. They explained everything in plain English and their fixed-fee approach meant no surprise bills.",
      image: "https://res.cloudinary.com/dwuyfw7mf/image/upload/v1771922422/pages/testimonials/elon.jpg",
      rating: 5,
      category: "Tax Advisory & Compliance",
      results: "Self-assessment streamlined",
      location: "United States",
      status: "APPROVED" as const,
      order: 80,
    },
    {
      id: "testimonial-4",
      name: "Jack Ma",
      email: "jack@example.com",
      company: "Alibaba Group",
      role: "Founder",
      content:
        "Their proactive approach to international tax planning saved our business significant costs while ensuring full compliance across multiple jurisdictions.",
      image: "https://res.cloudinary.com/dwuyfw7mf/image/upload/v1771922456/pages/testimonials/jack.jpg",
      rating: 5,
      category: "Tax Advisory & Compliance",
      results: "Multi-jurisdiction compliance",
      location: "Hong Kong",
      status: "APPROVED" as const,
      order: 0,
    },
    {
      id: "testimonial-5",
      name: "Priya Patel",
      email: "priya@example.com",
      company: "Patel Consulting Ltd",
      role: "Managing Director",
      content:
        "Working with The Millions on our ACCA training programme for our junior consultants has been outstanding. The structured learning paths and mentor support have accelerated our team's professional development noticeably.",
      image: null,
      rating: 5,
      category: "Professional Education & Executive Development",
      results: "3 ACCA passes in first cohort",
      location: "London, United Kingdom",
      status: "APPROVED" as const,
      order: 75,
    },
    {
      id: "testimonial-6",
      name: "Samuel Okello",
      email: "samuel@example.com",
      company: "Okello Agribusiness Group",
      role: "Founder & CEO",
      content:
        "When we expanded operations from Kampala into Kenya, The Millions navigated the cross-border tax and regulatory complexity we didn't even know we had. Their East Africa specialists understand both the local realities and the international standards investors want to see.",
      image: null,
      rating: 5,
      category: "Business & Governance Consulting",
      results: "Successful Kenya entry",
      location: "Kampala, Uganda",
      status: "APPROVED" as const,
      order: 70,
    },
    {
      id: "testimonial-7",
      name: "Rachel Thompson",
      email: "rachel@thompsonproperty.example",
      company: "Thompson Property Partners",
      role: "Finance Director",
      content:
        "We switched to The Millions after years of being just another file at a large firm. The difference is striking — proactive advice, fixed transparent fees, and an actual relationship with the partners. Our quarterly close is now finished within 5 working days instead of 3 weeks.",
      image: null,
      rating: 5,
      category: "Accountancy & Financial Advisory",
      results: "Month-end cut from 3 weeks to 5 days",
      location: "Manchester, United Kingdom",
      status: "APPROVED" as const,
      order: 60,
    },
    {
      id: "testimonial-8",
      name: "Dr. Amina Hassan",
      email: "amina@hassan-medical.example",
      company: "Hassan Medical Group",
      role: "Group CFO",
      content:
        "Running a healthcare group across three countries means VAT compliance gets very complicated very quickly. The Millions' partial exemption work alone saved us roughly £42,000 in reclaim we'd been leaving on the table. Their tax team is exceptional.",
      image: null,
      rating: 5,
      category: "Tax Advisory & Compliance",
      results: "£42,000 in recovered VAT",
      location: "Nairobi, Kenya",
      status: "APPROVED" as const,
      order: 55,
    },
    {
      id: "testimonial-9",
      name: "James O'Connor",
      email: "james.oconnor@example.com",
      company: "Connor Coastal Hotels",
      role: "Owner",
      content:
        "I'd been doing my own books for fifteen years and getting steadily more anxious about HMRC. Switched to The Millions and within three months they'd cleaned up the historical record, restructured my VAT scheme, and explained everything in plain English. I sleep at night now.",
      image: null,
      rating: 5,
      category: "Tax Advisory & Compliance",
      results: "Peace of mind, finally",
      location: "Cornwall, United Kingdom",
      status: "APPROVED" as const,
      order: 50,
    },
    {
      id: "testimonial-10",
      name: "Fatima Al-Rashid",
      email: "fatima@alrashid-ventures.example",
      company: "Al-Rashid Ventures",
      role: "Investment Director",
      content:
        "We use The Millions for due diligence on every African portfolio acquisition. Their cross-jurisdiction expertise across the UK, East Africa, and the GCC has identified material risks on two recent deals that would have cost us substantially. Genuinely indispensable.",
      image: null,
      rating: 5,
      category: "Business & Governance Consulting",
      results: "Material risks caught pre-deal",
      location: "Dubai, UAE",
      status: "APPROVED" as const,
      order: 45,
    },
    {
      id: "testimonial-11",
      name: "Daniel Mwangi",
      email: "daniel@mwangi-tech.example",
      company: "Mwangi Technologies",
      role: "Co-Founder",
      content:
        "As an early-stage tech company in Nairobi raising from international VCs, having UK-quality financials was non-negotiable. The Millions built the entire reporting stack from scratch and prepped us through two due diligence rounds. We closed our Series A in March.",
      image: null,
      rating: 5,
      category: "Accountancy & Financial Advisory",
      results: "Series A closed",
      location: "Nairobi, Kenya",
      status: "APPROVED" as const,
      order: 40,
    },
    {
      id: "testimonial-12",
      name: "Helen Stewart",
      email: "helen@stewartdesign.example",
      company: "Stewart Design Studio",
      role: "Director",
      content:
        "Small creative studios are usually badly served by accountants — either we're too small for proper attention, or the advice doesn't fit how a project-based business actually runs. The Millions got us from the first meeting. They've become my second-favourite phone call after my children.",
      image: null,
      rating: 4,
      category: "Accountancy & Financial Advisory",
      results: "Cash flow visibility, finally",
      location: "Edinburgh, United Kingdom",
      status: "APPROVED" as const,
      order: 0,
    },
    // ─── Pending — show the moderation queue is real ───
    {
      id: "testimonial-13-pending",
      name: "Thomas Müller",
      email: "thomas@muller-imports.example",
      company: "Müller Imports Ltd",
      role: "Managing Director",
      content:
        "Excellent service throughout our post-Brexit VAT restructuring. They turned what could have been a six-month nightmare into a clean three-month transition with zero surprises from HMRC. Highly recommend to any UK importer rethinking their post-Brexit position.",
      image: null,
      rating: 5,
      category: "Tax Advisory & Compliance",
      results: "Clean Brexit VAT transition",
      location: "Birmingham, United Kingdom",
      status: "PENDING" as const,
      order: 0,
    },
    {
      id: "testimonial-14-pending",
      name: "Grace Wanjiku",
      email: "grace@wanjikufoods.example",
      company: "Wanjiku Foods Co-operative",
      role: "Chairperson",
      content:
        "The team supported our women-led co-operative through our first audited financial year — patiently explaining each step. Now we have the documentation to qualify for grant funding we couldn't access before.",
      image: null,
      rating: 5,
      category: "Accountancy & Financial Advisory",
      results: "Grant eligibility unlocked",
      location: "Kisumu, Kenya",
      status: "PENDING" as const,
      order: 0,
    },
    // ─── Rejected — demonstrates that status exists. Spammy/low-quality. ───
    {
      id: "testimonial-15-rejected",
      name: "spam tester",
      email: "spam@example.com",
      company: "asdf",
      role: "ceo lol",
      content:
        "very good service buy my crypto coin at link below — looking for partnership opportunities please contact me",
      image: null,
      rating: 5,
      category: "Other",
      results: null,
      location: null,
      status: "REJECTED" as const,
      order: 0,
    },
  ];

  for (const t of testimonials) {
    await prisma.testimonial.upsert({
      where: { id: t.id },
      update: {
        name: t.name,
        email: t.email,
        company: t.company,
        role: t.role,
        content: t.content,
        image: t.image,
        rating: t.rating,
        category: t.category,
        results: t.results,
        location: t.location,
        status: t.status,
        order: t.order,
      },
      create: t,
    });
  }

  console.log("💬 Testimonial records seeded");
}

/* -----------------------------
   Seed Services
   Authoritative — the seed owns the 4 canonical services. Existing services
   are reconciled by name (update if present, create if missing). Anything
   else gets removed so the public landing always shows exactly these 4.
   Contact messages tied to soon-to-be-removed services are reassigned to
   the first canonical service to preserve foreign keys.
------------------------------*/
const CANONICAL_SERVICES = [
  {
    name: "Accountancy & Financial Advisory",
    description:
      "Comprehensive financial reporting, bookkeeping, audit preparation, and advisory services in line with internationally recognised standards. We help organisations strengthen financial governance, enhance transparency, and make informed strategic decisions.",
  },
  {
    name: "Tax Advisory & Compliance",
    description:
      "Corporate and individual tax advisory, compliance management, and strategic planning. Our approach ensures regulatory alignment while supporting sustainable tax positions across jurisdictions.",
  },
  {
    name: "Professional Education & Executive Development",
    description:
      "Accredited certification preparation (including ACCA), technical masterclasses, executive leadership programmes, and digital learning platforms. These initiatives cultivate highly skilled professionals capable of meeting international standards and driving sustainable enterprise value.",
  },
  {
    name: "Business & Governance Consulting",
    description:
      "Strategic, operational, and governance advisory to optimise organisational performance, reinforce institutional frameworks, and enable resilient growth.",
  },
];

async function seedServices() {
  // Reconcile canonical services
  const canonicalNames = new Set(CANONICAL_SERVICES.map((s) => s.name));
  const created: { id: string; name: string }[] = [];
  for (const svc of CANONICAL_SERVICES) {
    const existing = await prisma.service.findFirst({ where: { name: svc.name } });
    if (existing) {
      await prisma.service.update({
        where: { id: existing.id },
        data: { description: svc.description },
      });
      created.push({ id: existing.id, name: svc.name });
    } else {
      const row = await prisma.service.create({ data: svc });
      created.push({ id: row.id, name: svc.name });
    }
  }

  // Reassign any contact messages on non-canonical services to the first canonical one,
  // then delete the non-canonical services.
  const stale = await prisma.service.findMany({
    where: { name: { notIn: Array.from(canonicalNames) } },
  });
  if (stale.length > 0) {
    const firstCanonicalId = created[0].id;
    for (const s of stale) {
      await prisma.contactMessage.updateMany({
        where: { serviceId: s.id },
        data: { serviceId: firstCanonicalId },
      });
    }
    await prisma.service.deleteMany({
      where: { id: { in: stale.map((s) => s.id) } },
    });
  }

  console.log(`🛠️  Services seeded (${created.length} canonical, ${stale.length} stale removed)`);
}

/* -----------------------------
   Seed Contact Messages
------------------------------*/
/* -----------------------------
   Seed Contact Messages — demo data spanning all sources, statuses, and
   metadata richness so the admin inbox has something realistic to render
   when the brothers (or you) demo the site.

   Idempotent: each row keyed by a deterministic `demo-msg-NNN` id, upsert
   with empty update so re-running this seed is a no-op for existing rows.
   Dates use `daysAgo(N)` so they stay relatively fresh on each seed run.
------------------------------*/
async function seedContactMessages() {
  // Look up the four canonical services by name. AI-agent leads have
  // serviceId = null (the agent knows the category as text, not a UUID).
  const services = await prisma.service.findMany({
    where: { name: { in: CANONICAL_SERVICES.map((s) => s.name) } },
    select: { id: true, name: true },
  });
  const serviceIdByName = new Map(services.map((s) => [s.name, s.id]));
  const sid = (name: string) => serviceIdByName.get(name) ?? null;

  // Helper: a date N days (or hours) ago, ISO format. Stable enough for
  // demo and re-runs while keeping the inbox visually "fresh".
  const now = Date.now();
  const daysAgo = (n: number) => new Date(now - n * 24 * 60 * 60 * 1000);
  const hoursAgo = (n: number) => new Date(now - n * 60 * 60 * 1000);

  const demoMessages: Array<{
    id: string;
    fullName: string;
    email: string;
    phone?: string;
    message: string;
    serviceId: string | null;
    status: "NEW" | "READ" | "REPLIED" | "PENDING_REVIEW";
    source: "WEB_FORM" | "AI_AGENT" | "MANUAL";
    metadata?: Record<string, unknown>;
    createdAt: Date;
  }> = [
      // ====================== WEB FORM (6) ======================
      {
        id: "demo-msg-001",
        fullName: "Sarah Mitchell",
        email: "sarah.mitchell@freelancedesign.co.uk",
        phone: "+44 7700 900101",
        message:
          "Hi, I'm a freelance designer (sole trader) and my self-assessment is getting too complicated for me to keep doing on my own. Looking for someone to take over the annual return and ideally help me with quarterly bookkeeping. I use FreeAgent currently.",
        serviceId: sid("Accountancy & Financial Advisory"),
        status: "NEW",
        source: "WEB_FORM",
        createdAt: daysAgo(2),
      },
      {
        id: "demo-msg-002",
        fullName: "David Chen",
        email: "david@artisan-coffee-co.com",
        phone: "+44 7700 900102",
        message:
          "We're a limited company doing about £200K/year in ecommerce (specialty coffee). Looking to switch accountants — current one is unresponsive and we feel like we're paying for compliance not advice. Want a partner who will help us plan, not just file. Happy to jump on a call.",
        serviceId: sid("Accountancy & Financial Advisory"),
        status: "READ",
        source: "WEB_FORM",
        createdAt: daysAgo(4),
      },
      {
        id: "demo-msg-003",
        fullName: "Emma Thompson",
        email: "emma@thompson-consulting.co.uk",
        message:
          "Hi — I run a small consultancy that just crossed the VAT threshold last quarter. I need to register and want to make sure I'm doing it correctly the first time. Do you offer a one-off engagement for this or is it ongoing only?",
        serviceId: sid("Tax Advisory & Compliance"),
        status: "REPLIED",
        source: "WEB_FORM",
        createdAt: daysAgo(7),
      },
      {
        id: "demo-msg-004",
        fullName: "Mohammed Ali",
        email: "mohammed.ali@outlook.com",
        phone: "+44 7700 900104",
        message:
          "I have 3 buy-to-let properties in Southampton and one in Portsmouth. Self-managing all of them. Need help with rental income reporting and want to discuss CGT planning ahead of a potential sale next year. Are you familiar with property tax specifically?",
        serviceId: sid("Tax Advisory & Compliance"),
        status: "NEW",
        source: "WEB_FORM",
        createdAt: daysAgo(1),
      },
      {
        id: "demo-msg-005",
        fullName: "Lucy Patterson",
        email: "lucy@pattersonpilates.co.uk",
        phone: "+44 7700 900105",
        message:
          "My pilates studio (limited co) has outgrown spreadsheets. Need ongoing bookkeeping support and ideally a migration to Xero. We do classes + memberships + retail, so transactions are getting messy. About 5 employees on payroll.",
        serviceId: sid("Accountancy & Financial Advisory"),
        status: "REPLIED",
        source: "WEB_FORM",
        createdAt: daysAgo(14),
      },
      {
        id: "demo-msg-006",
        fullName: "James Wilson",
        email: "jwilson@wilsondev.io",
        message:
          "Just registered a limited company for my software consultancy last week (Wilson Dev Ltd). New to all this — what taxes do I need to pay, when, and what's the cleanest way to take money out? Mix of UK and Irish clients if that matters.",
        serviceId: sid("Business & Governance Consulting"),
        status: "READ",
        source: "WEB_FORM",
        createdAt: daysAgo(5),
      },

      // ====================== AI AGENT (5) ======================
      {
        id: "demo-msg-007",
        fullName: "Olivia Park",
        email: "olivia@parksupplements.co.uk",
        phone: "+44 7700 900107",
        message:
          "Limited co in supplements/ecommerce, 18 months trading, ~£350K turnover. Struggling with quarterly VAT returns under MTD and current accountant takes 5+ days to respond. Wants to move within the next month. Mentioned looking at fixed-fee firms specifically.",
        serviceId: null,
        status: "PENDING_REVIEW",
        source: "AI_AGENT",
        metadata: {
          whatsappNumber: "+44 7700 900107",
          serviceCategory: "VAT & Making Tax Digital",
          businessName: "Park Supplements Ltd",
          businessType: "limited company",
          urgency: "this_month",
          preferredContactMethod: "whatsapp",
          conversationRef:
            "https://openclaw.app/conversations/c-9f2e8a1b-park",
          agentConfidence: 0.92,
        },
        createdAt: hoursAgo(1),
      },
      {
        id: "demo-msg-008",
        fullName: "Ahmed Hassan",
        email: "ahmed@noor-restaurant.co.uk",
        phone: "+44 7700 900108",
        message:
          "Opening a new restaurant in Southampton in 6 weeks. Needs to set up payroll for 8 staff, register for VAT, and get bookkeeping in place. Says he wants someone he can call rather than email.",
        serviceId: null,
        status: "PENDING_REVIEW",
        source: "AI_AGENT",
        metadata: {
          whatsappNumber: "+44 7700 900108",
          serviceCategory: "Payroll & Bookkeeping",
          businessName: "Noor Restaurant",
          businessType: "limited company",
          urgency: "this_month",
          preferredContactMethod: "phone",
          conversationRef:
            "https://openclaw.app/conversations/c-3d1f2e9c-hassan",
          agentConfidence: 0.88,
        },
        createdAt: hoursAgo(3),
      },
      {
        id: "demo-msg-009",
        fullName: "Chloe Williams",
        email: "chloe.writes@gmail.com",
        message:
          "Freelance copywriter, sole trader, ~£45K turnover last year. Asked about pricing for self-assessment + ongoing quarterly bookkeeping. Open to a fixed-fee package. No current accountant, has been doing it herself with help from her mum.",
        serviceId: null,
        status: "PENDING_REVIEW",
        source: "AI_AGENT",
        metadata: {
          whatsappNumber: "+44 7700 900109",
          serviceCategory: "Accountancy & Financial Advisory",
          businessType: "sole trader",
          urgency: "exploring",
          preferredContactMethod: "email",
          conversationRef:
            "https://openclaw.app/conversations/c-7a4b5c8d-williams",
          agentConfidence: 0.78,
        },
        createdAt: daysAgo(1),
      },
      {
        id: "demo-msg-010",
        fullName: "Raj Patel",
        email: "raj@patel-construction.co.uk",
        phone: "+44 7700 900110",
        message:
          "URGENT — received an HMRC enquiry letter regarding 2023/24 corporation tax return. Has 30 days to respond. Wants help drafting the response and reviewing what triggered it. Construction company, limited, ~£800K turnover. Very stressed on the call.",
        serviceId: null,
        status: "PENDING_REVIEW",
        source: "AI_AGENT",
        metadata: {
          whatsappNumber: "+44 7700 900110",
          serviceCategory: "Tax Advisory & Compliance",
          businessName: "Patel Construction Ltd",
          businessType: "limited company",
          urgency: "immediate",
          preferredContactMethod: "phone",
          conversationRef:
            "https://openclaw.app/conversations/c-1e8d6f2a-raj",
          agentConfidence: 0.95,
          flags: ["URGENT", "HMRC_ENQUIRY"],
        },
        createdAt: hoursAgo(0.5),
      },
      {
        id: "demo-msg-011",
        fullName: "Sophie Brown",
        email: "sophie@bakehouse-southampton.co.uk",
        phone: "+44 7700 900111",
        message:
          "Newly opened artisan bakery in Bedford Place. Sole trader currently. Asked about whether to incorporate, VAT registration timing, and getting cloud accounting set up. Conversion of an old workshop, so some startup capital allowance questions too.",
        serviceId: null,
        status: "NEW",
        source: "AI_AGENT",
        metadata: {
          whatsappNumber: "+44 7700 900111",
          serviceCategory: "Business & Governance Consulting",
          businessName: "Bakehouse Southampton",
          businessType: "sole trader",
          urgency: "this_month",
          preferredContactMethod: "whatsapp",
          conversationRef:
            "https://openclaw.app/conversations/c-5c2e8b9d-sophie",
          agentConfidence: 0.86,
          approvedBy: "Mark MILLION",
          approvedAt: daysAgo(3).toISOString(),
        },
        createdAt: daysAgo(4),
      },

      // ====================== MANUAL (2) ======================
      {
        id: "demo-msg-012",
        fullName: "Catherine Foster",
        email: "catherine@foster-design-studio.com",
        phone: "+44 7700 900112",
        message:
          "Met Catherine at the Hampshire Chamber networking event last week. She runs an interior design studio (limited co, ~£180K), looking for a more proactive accountant. I told her we'd reach out — please follow up by end of week.",
        serviceId: sid("Accountancy & Financial Advisory"),
        status: "REPLIED",
        source: "MANUAL",
        metadata: {
          addedBy: "Sleshi MILLION",
          referralSource: "Hampshire Chamber networking event",
        },
        createdAt: daysAgo(10),
      },
      {
        id: "demo-msg-013",
        fullName: "George Roberts",
        email: "g.roberts@robertsfamily.co.uk",
        phone: "+44 7700 900113",
        message:
          "Referred by Smith & Co solicitors. George is executor of his late father's estate. Need help with the deceased's outstanding tax affairs (self-assessment + IHT planning for the estate). Sensitive — handle with care.",
        serviceId: sid("Tax Advisory & Compliance"),
        status: "NEW",
        source: "MANUAL",
        metadata: {
          addedBy: "Mark MILLION",
          referralSource: "Smith & Co solicitors",
          sensitivity: "high",
        },
        createdAt: daysAgo(2),
      },

      // ====================== ORIGINAL SAMPLE (1) ======================
      {
        id: "sample-contact-message-1",
        fullName: "John Doe",
        email: "john.doe@example.com",
        phone: "+1234567890",
        message:
          "This is the original sample contact message — kept here for backward compatibility with earlier seed runs and tests.",
        serviceId: sid("Accountancy & Financial Advisory"),
        status: "NEW",
        source: "WEB_FORM",
        createdAt: daysAgo(30),
      },
    ];

  let created = 0;
  let skipped = 0;
  for (const m of demoMessages) {
    const result = await prisma.contactMessage.upsert({
      where: { id: m.id },
      update: {}, // idempotent — don't churn existing rows on re-seed
      create: {
        id: m.id,
        fullName: m.fullName,
        email: m.email,
        phone: m.phone,
        message: m.message,
        serviceId: m.serviceId,
        status: m.status,
        source: m.source,
        ...(m.metadata !== undefined && {
          metadata: m.metadata as Prisma.InputJsonValue,
        }),
        createdAt: m.createdAt,
      },
    });
    if (result.createdAt.getTime() === m.createdAt.getTime()) created++;
    else skipped++;
  }

  console.log(
    `📧 Contact messages seeded — ${created} new, ${skipped} already existed (${demoMessages.length} total)`
  );
}

/* -----------------------------
   Seed Blog Posts
   Idempotent by slug — re-running updates content but doesn't duplicate.
------------------------------*/
const BLOG_POSTS = [
  {
    slug: "year-end-tax-planning-strategies-uk-smes-2026",
    title: "Year-End Tax Planning: 7 Strategies UK SMEs Should Action Before 5 April",
    category: "Tax Advisory",
    author: "Mark MILLION",
    excerpt: "Seven concrete tax-planning levers we put in front of every UK SME client before the 5 April deadline — most worth thousands in deferred or avoided tax.",
    coverImage: "https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=1200&q=80&auto=format",
    publishedAt: "2026-05-15T09:00:00.000Z",
    status: "PUBLISHED" as const,
    tags: ["Tax Planning", "UK", "SME", "Corporation Tax"],
    content: `<p>The clock is ticking. With 5 April approaching, UK SME owners have a narrow window to take meaningful action on their tax position — and the difference between acting now and waiting can be measured in tens of thousands of pounds.</p><h3>1. Maximise Pension Contributions</h3><p>Employer pension contributions reduce corporation tax and don't attract national insurance. The 2025/26 annual allowance is <strong>£60,000</strong>. If cash flow allows, this remains one of the cleanest ways to extract value from a profitable company.</p><h3>2. Review the Dividend vs Salary Mix</h3><p>The optimum split shifts each year as thresholds change. For 2025/26, most owner-managers benefit from a salary up to the secondary NI threshold, supplemented by dividends taxed at the lower bands where personal allowance permits.</p><h3>3. Capital Allowances and Full Expensing</h3><p>Plant and machinery purchases qualify for 100% first-year relief under full expensing. If an asset purchase is on the horizon, accelerating it before year-end shifts the deduction forward.</p><h3>4. R&D Tax Relief Claims</h3><p>Many SMEs underclaim or miss this entirely. If your business has developed new products, processes, or significantly improved software, you may qualify. The post-April 2024 merged scheme rates favour profitable claimants.</p><h3>5. Trading Losses</h3><p>Losses don't always need to wait for future profits. Strategic carry-back can unlock immediate refunds; group relief can offset against profitable group companies.</p><h3>6. Director's Loan Account Position</h3><p>Overdrawn director's loans crystallise a 33.75% S455 charge if not repaid within nine months of year-end. Review the balance now and plan repayment.</p><h3>7. Annual Investment Allowance Timing</h3><p>For straddling year-ends, the timing of asset purchases can materially affect available AIA. Speak to your accountant <em>before</em> signing the purchase order.</p><p><strong>None of these are exotic — they're the everyday levers.</strong> The mistake is leaving them on the table by acting too late.</p>`,
  },
  {
    slug: "mtd-for-itsa-2026-compliance-roadmap",
    title: "Making Tax Digital for Income Tax: Your 2026 Compliance Roadmap",
    category: "Compliance",
    author: "Mark MILLION",
    excerpt: "MTD for ITSA is now mandatory for self-employed professionals and landlords with qualifying income above £50,000. Here's exactly what compliance looks like in practice.",
    coverImage: "https://images.unsplash.com/photo-1554224154-22dec7ec8818?w=1200&q=80&auto=format",
    publishedAt: "2026-04-22T09:00:00.000Z",
    status: "PUBLISHED" as const,
    tags: ["MTD", "HMRC", "Self-Assessment", "Compliance"],
    content: `<p>The first cohort under Making Tax Digital for Income Tax Self-Assessment (MTD for ITSA) is live as of April 2026. If you're self-employed or earn income from property and your qualifying income exceeds <strong>£50,000</strong>, you're now legally required to keep digital records and submit quarterly updates to HMRC.</p><h3>What Changes in Practice</h3><p>Three things are new:</p><ul><li><strong>Digital record-keeping</strong> — paper ledgers and spreadsheets without MTD-compatible bridging software no longer satisfy compliance.</li><li><strong>Quarterly updates</strong> — submissions of cumulative income and expenses every three months, replacing the single year-end return.</li><li><strong>End-of-period statement</strong> — an annual reconciliation that finalises the year and adds adjustments (capital allowances, private use, etc.).</li></ul><h3>The Practical Roadmap</h3><p>For most clients, our recommended sequence is:</p><ol><li>Audit current bookkeeping — identify the gap between today's process and MTD-compliant.</li><li>Select compatible software — Xero, QuickBooks, FreeAgent, and Sage all have MTD-ready offerings.</li><li>Migrate opening balances and the trailing 12 months of transactions.</li><li>Run a parallel quarter — submit informally to catch process issues before the first mandatory submission.</li><li>Establish a quarterly close cadence with your accountant.</li></ol><p>The penalty regime under MTD is points-based and accumulates fast for repeat infractions. Getting the process right in the first quarter is dramatically cheaper than fixing it after a £200 penalty letter arrives.</p><p>If you'd like a compliance audit before your first quarterly submission, we offer a fixed-fee MTD Readiness Assessment.</p>`,
  },
  {
    slug: "cloud-accounting-roi-real-numbers",
    title: "The True ROI of Cloud Accounting: Numbers from Real Client Engagements",
    category: "Technology",
    author: "Seleshi MILLION",
    excerpt: "We've migrated dozens of clients from desktop bookkeeping or spreadsheets onto cloud platforms. Here's what the average return actually looks like in pounds, hours, and risk reduction.",
    coverImage: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=1200&q=80&auto=format",
    publishedAt: "2026-04-02T09:00:00.000Z",
    status: "PUBLISHED" as const,
    tags: ["Cloud Accounting", "Xero", "QuickBooks", "Efficiency"],
    content: `<p>"Cloud accounting" used to be a value-add. It's now table-stakes — and not just for compliance. The operational case has caught up.</p><p>Across roughly thirty migrations we've handled in the past 24 months, the average client saw the following in their first 12 months on a cloud platform:</p><ul><li><strong>~22 hours/month</strong> of bookkeeping time recovered through bank feed automation and rule-based categorisation</li><li><strong>£1,800–£3,200</strong> in reduced accounting fees, primarily because year-end prep collapses when records are already reconciled monthly</li><li><strong>4–6 working days</strong> faster month-end close, enabling actual management reporting instead of three-month-old historical accounts</li></ul><h3>Where the ROI Comes From</h3><p>Three sources, in roughly this order of magnitude:</p><p><strong>1. Bank feeds and rules.</strong> The single biggest time-saver. Once feeds are connected and 20-30 recurring transactions have rules attached, 70–80% of categorisation becomes one-click confirmation.</p><p><strong>2. Multi-currency and FX handling.</strong> Manual currency reconciliation in Excel is brutal. Cloud platforms handle revaluation, realised/unrealised gains, and reporting in functional currency without intervention.</p><p><strong>3. App ecosystem.</strong> Receipt capture (Dext, Hubdoc), payroll integration, expense management — connectable in minutes, eliminating data re-entry.</p><h3>Where the ROI Doesn't Materialise</h3><p>It's worth being honest: not every business benefits proportionally. Sole traders with under 50 transactions a month, or businesses with deeply non-standard processes (custom job costing, complex POS) sometimes find migration costs exceed savings for 18+ months.</p><p>The right call is workflow-led, not technology-led. We assess each client's transaction profile and only recommend migration where the payback window is under 12 months.</p>`,
  },
  {
    slug: "beyond-compliance-strategic-reporting",
    title: "Beyond Compliance: How Strategic Reporting Transforms Decision-Making",
    category: "Advisory",
    author: "Mark MILLION",
    excerpt: "Statutory accounts tell you what happened. Strategic reporting tells you what to do next. The gap between them is where most SME decisions are made — and most are made badly.",
    coverImage: "https://images.unsplash.com/photo-1551836022-deb4988cc6c0?w=1200&q=80&auto=format",
    publishedAt: "2026-03-18T09:00:00.000Z",
    status: "PUBLISHED" as const,
    tags: ["Financial Reporting", "Strategy", "KPIs", "Management Accounts"],
    content: `<p>Most SME owners receive their statutory accounts ten months after the period they describe. By the time the numbers arrive, the decisions they should have informed have already been made — often poorly.</p><p>The gap between compliance reporting and strategic reporting is where business success is decided. Closing that gap is one of the highest-leverage investments a growing firm can make.</p><h3>What Strategic Reporting Looks Like</h3><p>It's not just management accounts with extra graphs. It's a deliberately chosen set of indicators tied to your business model — typically 8 to 12 metrics, refreshed monthly, that answer specific operational questions.</p><p>For a professional services firm, that might be:</p><ul><li>Utilisation rate by fee-earner</li><li>Realisation rate (billed vs WIP)</li><li>Client concentration (top 5 as % of revenue)</li><li>Pipeline coverage ratio</li></ul><p>For a manufacturer:</p><ul><li>Gross margin by product line</li><li>Inventory days on hand</li><li>OEE (overall equipment effectiveness)</li><li>Quote-to-order conversion rate</li></ul><h3>The Cadence Matters More Than the Format</h3><p>Monthly is the floor. Quarterly is too slow to course-correct within a financial year. The reports should land within <strong>10 working days of month-end</strong>, with commentary, not just numbers.</p><p>If your current reporting arrives 6 weeks after period end without analysis, it's compliance documentation — useful for the bank, useless for decisions.</p><h3>Where to Start</h3><p>Pick five indicators. Get them produced monthly with one paragraph of commentary each. Review them as a leadership team for 30 minutes. Iterate on which indicators are actually driving decisions versus which are vanity.</p><p>The maturity comes from the discipline, not the dashboards.</p>`,
  },
  {
    slug: "acca-cima-icaew-career-comparison",
    title: "Choosing Between ACCA, CIMA, and ICAEW: A Career-Path Guide",
    category: "Professional Development",
    author: "Seleshi MILLION",
    excerpt: "Three of the most respected accountancy qualifications in the UK, and they're not interchangeable. We break down what each one signals to employers and where each shines.",
    coverImage: "https://images.unsplash.com/photo-1450101499163-c8848c66ca85?w=1200&q=80&auto=format",
    publishedAt: "2026-02-28T09:00:00.000Z",
    status: "PUBLISHED" as const,
    tags: ["ACCA", "CIMA", "ICAEW", "Career", "Education"],
    content: `<p>If you're early in your accountancy career — or supporting a team member who is — choosing the right professional qualification has long-term consequences. The three big UK qualifications (ACCA, CIMA, ICAEW) sound similar to outsiders, but they signal different things to employers and lead to different career paths.</p><h3>ACCA — Association of Chartered Certified Accountants</h3><p>The most internationally portable of the three. ACCA's syllabus emphasises financial reporting, audit, taxation, and ethics, with a broad professional foundation. <strong>Best fit:</strong> aspiring auditors, tax specialists, finance roles with cross-border exposure, and anyone planning to work outside the UK at some point.</p><p>Strong recognition across the EU, Middle East, Africa, and Asia. The qualification structure (13 exams, ethics module, 36 months of practical experience) is challenging but flexible — can be done part-time alongside work.</p><h3>CIMA — Chartered Institute of Management Accountants</h3><p>The management accounting specialist. CIMA's syllabus is heavier on cost management, strategic planning, performance management, and decision support. <strong>Best fit:</strong> people who want to work inside businesses (industry-side finance) rather than in accounting practice. FP&A, finance business partnering, commercial finance roles.</p><p>Less suitable if you want to sign off accounts as a registered auditor or work in tax practice.</p><h3>ICAEW — Institute of Chartered Accountants in England and Wales</h3><p>The traditional route into top-tier UK accounting practice. ICAEW's ACA qualification is the standard for Big 4 audit trainees and historically the most prestigious within the UK profession. <strong>Best fit:</strong> Big 4 audit trainees, UK-focused careers, future partners at major firms.</p><p>The training contract structure is more rigid (typically 3 years with an authorised employer), but the brand recognition inside the UK is unmatched.</p><h3>The Honest Recommendation</h3><p>For most professionals in our network — particularly those planning to work across the UK and East Africa — <strong>ACCA</strong> is the right answer. Its breadth, portability, and flexibility align with cross-jurisdiction careers. For aspiring management accountants staying UK-based, CIMA wins. For Big 4 audit ambitions, ICAEW.</p>`,
  },
  {
    slug: "five-vat-errors-costing-businesses",
    title: "Five VAT Errors That Cost UK Businesses an Average £8,400 Per Year",
    category: "Tax Advisory",
    author: "Mark MILLION",
    excerpt: "We analysed two years of VAT reviews across our client base. These five mistakes appear in almost every engagement — and they're each worth thousands.",
    coverImage: "https://images.unsplash.com/photo-1554224312-3753c1aabe11?w=1200&q=80&auto=format",
    publishedAt: "2026-02-10T09:00:00.000Z",
    status: "PUBLISHED" as const,
    tags: ["VAT", "Compliance", "HMRC", "Common Mistakes"],
    content: `<p>VAT looks simple. It isn't. The cost of getting it wrong compounds quietly across hundreds of small transactions and only surfaces during an HMRC inspection — by which point penalties and interest have been accruing for years.</p><p>From two years of reviews across our client portfolio, here are the five errors we see most often.</p><h3>1. Reclaiming VAT on Pre-Registration Purchases Incorrectly</h3><p>You <em>can</em> reclaim VAT on goods purchased up to 4 years before registration (if you still hold them) and services up to 6 months before. Most businesses either miss this entirely or overclaim by including ineligible items.</p><h3>2. Treating Partial Exemption as an Afterthought</h3><p>If you make both taxable and exempt supplies (rentals, financial services, education), partial exemption calculations apply. The standard method often produces a worse result than a sector-specific special method — and getting it wrong means either overpaying or underclaiming.</p><h3>3. Misclassifying Construction and Property Transactions</h3><p>Domestic Reverse Charge, option to tax, transfer of going concern, new-build vs renovation — property and construction VAT has more landmines than any other area. A single misclassification can be a £50,000+ exposure.</p><h3>4. Ignoring the Annual Adjustment</h3><p>If you're partially exempt or use approximation methods, an annual adjustment is required at year-end. We see this skipped in roughly 40% of reviews — usually resulting in HMRC clawing back the difference at audit.</p><h3>5. Failing to Maintain Adequate VAT Records</h3><p>HMRC can refuse reclaim if records are inadequate, even where the underlying transaction is clearly legitimate. Digital records under MTD have helped, but the standard for supporting evidence (especially for partial business-use claims) is higher than most realise.</p><p><strong>The average remediation across our reviews comes to £8,400 per year</strong> — and that's net of the cost of the review itself. If you haven't had your VAT position independently reviewed in the past three years, it's almost certainly worth a conversation.</p>`,
  },
  {
    slug: "funding-east-african-businesses-framework",
    title: "Funding a Growing Business in East Africa: A Practical Framework",
    category: "Advisory",
    author: "Seleshi MILLION",
    excerpt: "From angel and family capital through DFI debt to international equity — a sequenced framework for how high-potential East African enterprises actually raise capital today.",
    coverImage: "https://images.unsplash.com/photo-1453928582365-b6ad33cbcf64?w=1200&q=80&auto=format",
    publishedAt: "2026-01-25T09:00:00.000Z",
    status: "PUBLISHED" as const,
    tags: ["East Africa", "Funding", "Business Strategy", "Capital"],
    content: `<p>The funding landscape for East African businesses has changed materially in the past five years. International venture capital has discovered the region, development finance institutions have scaled their commitments, and regional debt markets have deepened. But the playbook for raising successfully isn't well understood outside a small circle.</p><p>Here's the sequenced framework we use with clients across Kenya, Uganda, Tanzania, Rwanda, and Ethiopia.</p><h3>Stage 1 — Founder & Family Capital (Under $250k)</h3><p>Almost universal. The mistake is treating it casually: family capital should still come with documented terms, even if relationships make formality feel awkward. The downside of informality only surfaces when the business grows enough to need outside investment.</p><h3>Stage 2 — Angel Networks & Local VC ($250k–$2M)</h3><p>Networks like ABAN (African Business Angel Network) and regional groups are increasingly active. Local VC funds — particularly Kenya-based — are willing to lead at this stage. Expect significant due diligence on governance, financial controls, and tax compliance. <strong>This is where most businesses get rejected for things their accountants should have fixed years earlier.</strong></p><h3>Stage 3 — DFI Debt & Blended Finance ($2M–$10M)</h3><p>FMO, CDC (BII), Proparco, IFC, AfDB. DFI debt is often the most overlooked path. Cheaper than equity, longer tenor than commercial banks, and DFIs are explicitly mandated to take risks others won't. Requirements: audited accounts (typically 3 years), ESG framework, and a robust financial model.</p><h3>Stage 4 — International Growth Equity ($10M+)</h3><p>By this stage, the business is on the radar of pan-African and emerging-market funds. The work shifts to fundraising mechanics, governance preparation, and ensuring the company can absorb capital effectively.</p><h3>The Constant Across All Stages</h3><p>Investors at every stage want the same three things: <strong>credible numbers, defensible governance, and a coherent story</strong>. Two of those three are accounting work. The firms that raise efficiently invest in financial discipline before they need to — not after.</p>`,
  },
  {
    slug: "audit-ready-quarterly-checklist",
    title: "Audit-Ready Accounts: The Quarterly Checklist We Give Every Client",
    category: "Compliance",
    author: "Mark MILLION",
    excerpt: "Audit doesn't have to be painful. The firms that breeze through audit do the same 12 things every quarter. Here's the full checklist.",
    coverImage: "https://images.unsplash.com/photo-1556761175-5973dc0f32e7?w=1200&q=80&auto=format",
    publishedAt: null,
    status: "DRAFT" as const,
    tags: ["Audit", "Accounting", "Best Practices", "Internal Controls"],
    content: `<p>This post is in draft. It will publish a 12-point quarterly checklist covering bank reconciliations, sales cut-off, payroll reconciliation, fixed asset register maintenance, intercompany agreement, and more.</p><p>The premise: clients who do these 12 things every quarter pay roughly half the audit fee of those who try to assemble everything at year-end — and they sleep better.</p>`,
  },
];

async function seedBlogPosts() {
  for (const post of BLOG_POSTS) {
    await prisma.blogPost.upsert({
      where: { slug: post.slug },
      update: {
        title: post.title,
        category: post.category,
        author: post.author,
        excerpt: post.excerpt,
        coverImage: post.coverImage,
        publishedAt: post.publishedAt ? new Date(post.publishedAt) : null,
        status: post.status,
        tags: post.tags,
        content: post.content,
      },
      create: {
        slug: post.slug,
        title: post.title,
        category: post.category,
        author: post.author,
        excerpt: post.excerpt,
        coverImage: post.coverImage,
        publishedAt: post.publishedAt ? new Date(post.publishedAt) : null,
        status: post.status,
        tags: post.tags,
        content: post.content,
      },
    });
  }
  const published = BLOG_POSTS.filter((p) => p.status === "PUBLISHED").length;
  const draft = BLOG_POSTS.filter((p) => p.status === "DRAFT").length;
  console.log(`📝 Blog posts seeded (${published} published, ${draft} draft)`);
}

/* -----------------------------
   Seed Global Footer (SINGLETON - RUN ONCE)
------------------------------*/
async function seedGlobalFooter() {
  const footerData = {
    phone: ["+44 7951 7965 92", "+44 7960 412 427"],
    email: "info@themillions.com",
    address: ["Terminus Terrace, Southampton", "SO14 3FD, United Kingdom"],
    websiteUrl: "www.themillions.co.uk",
    socialMedia: {
      whatsapp: "https://wa.me/447951796592"
    },
    copyright: "The MILLIONS. Setting You Up For Success. All rights reserved.",
    showContactBlock: true,
    contactLabel: "Get In Touch",
    contactTitle: "Ready to Work Together?",
    contactSubTitle:
      "Reach out to discuss how The MILLIONS can support your organisation, your team, or your ambitions.",
    buttonText: "Send Us a Message",
    logoText: "the MILLIONS.",
    location: "Southampton, United Kingdom"
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
  await seedServices();        // must run before seedContactMessages (FK)
  await seedContactMessages();
  await seedBlogPosts();

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
export { };