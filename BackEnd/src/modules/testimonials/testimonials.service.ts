import { prisma } from "../../lib/prisma.js";

export async function getTestimonialsData() {
  // Find the home page and its testimonials section
  const page = await prisma.page.findUnique({
    where: { slug: "home" },
    include: {
      sections: {
        where: { type: "testimonials" }
      }
    }
  });

  if (!page || page.sections.length === 0) {
    return null;
  }

  return page.sections[0].content;
}
