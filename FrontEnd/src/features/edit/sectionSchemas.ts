// Field metadata per section type. The EditPanel reads this to render the
// correct form inputs for the currently-selected section.
//
// IMPORTANT: `key` is a dot-path into the section's `content` object using the
// SAME field names the backend (and the admin HomeForms editor) uses.
// Landing.tsx has a translation layer that maps these to component props, so
// staying on backend names keeps the inline editor and the admin form pointed
// at the same source of truth. Using a different name here creates a phantom
// key in the DB that the public site never reads.

export type FieldType = "text" | "long-text" | "rich-text" | "list" | "string-list" | "image";

export interface FieldSchema {
  key: string;            // dot-path into content, e.g. "badge" or "ctas.0.label"
  label: string;          // human label shown in the panel
  type: FieldType;
  placeholder?: string;
  disabled?: boolean;     // when true, the input is read-only
  disabledReason?: string; // tooltip explaining why

  // For type === "list" only: declares an array of objects where each item
  // has the fields described in `itemFields`. `itemLabel` is the singular
  // noun used in the panel ("+ Add Stat"). itemFields[].key is relative to
  // each item (e.g. "num" or "label", not "stats.0.num").
  itemLabel?: string;
  itemFields?: FieldSchema[];

  // For type === "string-list" only: declares an array of plain values
  // (strings). Each item is one input of `itemType`. Defaults to "text".
  itemType?: "text" | "long-text" | "rich-text";
}

export interface SectionSchema {
  type: string;         // backend `Section.type` value (or a synthetic id like "global-footer")
  displayName: string;  // human-readable section label shown in chrome
  helper?: string;      // optional info text shown at the top of the panel
  fields: FieldSchema[];

  // For schemas that target a non-section resource (e.g. the global footer).
  // The EditPanel switches its read/save data path based on `kind`.
  kind?: "section" | "global";
  globalResource?: "footer";
}

// Schemas declare the editable surface for each section. Field keys are
// dot-paths into the section's `content` object. List fields (paragraphs,
// items, leaders, regions, etc.) are intentionally omitted from inline
// editing for now — they need add/remove/reorder UI and live in the admin
// page editor instead.
export const SECTION_SCHEMAS: Record<string, SectionSchema> = {
  hero: {
    type: "hero",
    displayName: "Hero",
    fields: [
      { key: "badge",         label: "Eyebrow Label",    type: "text",      placeholder: "Setting You Up For Success" },
      { key: "headlineBlack", label: "Main Title",       type: "text",      placeholder: "Professional Advisory & Learning." },
      { key: "headlineBlue",  label: "Italicised Word",  type: "text",      placeholder: "Learning." },
      { key: "description",   label: "Subtitle / Lead",  type: "rich-text", placeholder: "Short paragraph under the title" },
      {
        key: "ctas.0.label",
        label: "Primary CTA",
        type: "text",
        placeholder: "Our Services",
        disabled: true,
        disabledReason: "CTAs are managed in the admin panel — the label and its action (navigation target) must be edited together.",
      },
      {
        key: "ctas.1.label",
        label: "Secondary CTA",
        type: "text",
        placeholder: "Our Story",
        disabled: true,
        disabledReason: "CTAs are managed in the admin panel — the label and its action (navigation target) must be edited together.",
      },
      {
        key: "stats",
        label: "Stat Cards",
        type: "list",
        itemLabel: "Stat",
        itemFields: [
          { key: "num",   label: "Headline",    type: "text", placeholder: "UK" },
          { key: "label", label: "Description", type: "text", placeholder: "London Headquarters · Global Standards" },
        ],
      },
    ],
  },

  philosophy: {
    type: "philosophy",
    displayName: "Philosophy",
    fields: [
      { key: "label", label: "Eyebrow Label", type: "text" },
      { key: "title", label: "Heading",       type: "text" },
      {
        key: "paragraphs",
        label: "Body Paragraphs",
        type: "string-list",
        itemLabel: "Paragraph",
        itemType: "rich-text",
      },
      { key: "quote", label: "Pull Quote",    type: "rich-text" },
      { key: "attr",  label: "Citation",      type: "text" },
    ],
  },

  overview: {
    type: "overview",
    displayName: "Overview",
    fields: [
      { key: "label", label: "Eyebrow Label", type: "text" },
      { key: "title", label: "Heading",       type: "text" },
      {
        key: "paragraphs",
        label: "Body Paragraphs",
        type: "string-list",
        itemLabel: "Paragraph",
        itemType: "rich-text",
      },
    ],
  },

  "mission-vision": {
    type: "mission-vision",
    displayName: "Mission & Vision",
    fields: [
      { key: "label",          label: "Eyebrow Label",   type: "text" },
      { key: "title",          label: "Heading",         type: "text" },
      { key: "mission.label",  label: "Mission Label",   type: "text" },
      { key: "mission.title",  label: "Mission Title",   type: "text" },
      { key: "mission.text",   label: "Mission Text",    type: "rich-text" },
      { key: "vision.label",   label: "Vision Label",    type: "text" },
      { key: "vision.title",   label: "Vision Title",    type: "text" },
      { key: "vision.text",    label: "Vision Text",     type: "rich-text" },
    ],
  },

  values: {
    type: "values",
    displayName: "Values",
    fields: [
      { key: "label",    label: "Eyebrow Label", type: "text" },
      { key: "title",    label: "Heading",       type: "text" },
      { key: "subTitle", label: "Subtitle",      type: "text" },
      {
        key: "items",
        label: "Value Cards",
        type: "list",
        itemLabel: "Value",
        itemFields: [
          { key: "name", label: "Name",        type: "text" },
          { key: "text", label: "Description", type: "rich-text" },
        ],
      },
    ],
  },

  "impact-model": {
    type: "impact-model",
    displayName: "Impact Model",
    fields: [
      { key: "label",    label: "Eyebrow Label", type: "text" },
      { key: "title",    label: "Heading",       type: "text" },
      { key: "subTitle", label: "Subtitle",      type: "rich-text" },
      {
        key: "pillars",
        label: "Pillar Cards",
        type: "list",
        itemLabel: "Pillar",
        itemFields: [
          { key: "num",   label: "Number",      type: "text", placeholder: "01" },
          { key: "title", label: "Title",       type: "text" },
          { key: "text",  label: "Description", type: "rich-text" },
        ],
      },
    ],
  },

  services: {
    type: "services",
    displayName: "Services",
    fields: [
      { key: "label",       label: "Eyebrow Label",         type: "text" },
      { key: "title",       label: "Heading",               type: "text" },
      {
        key: "items",
        label: "Service Cards",
        type: "list",
        itemLabel: "Service",
        itemFields: [
          { key: "title", label: "Title",       type: "text" },
          { key: "text",  label: "Description", type: "rich-text" },
        ],
      },
      { key: "footerTitle", label: "Closing Block Title",   type: "text" },
      { key: "footerText",  label: "Closing Block Body",    type: "rich-text" },
    ],
  },

  geography: {
    type: "geography",
    displayName: "Geography",
    fields: [
      { key: "label",    label: "Eyebrow Label", type: "text" },
      { key: "title",    label: "Heading",       type: "text" },
      { key: "subTitle", label: "Subtitle",      type: "rich-text" },
      {
        key: "regions",
        label: "Region Cards",
        type: "list",
        itemLabel: "Region",
        itemFields: [
          { key: "label",    label: "Eyebrow",     type: "text" },
          { key: "title",    label: "Region Name", type: "text" },
          { key: "subTitle", label: "Subtitle",    type: "text" },
          { key: "text",     label: "Description", type: "rich-text" },
          {
            key: "tags",
            label: "Tags",
            type: "string-list",
            itemLabel: "Tag",
            itemType: "text",
          },
        ],
      },
    ],
  },

  "social-impact": {
    type: "social-impact",
    displayName: "Social Impact",
    fields: [
      { key: "label",    label: "Eyebrow Label", type: "text" },
      { key: "title",    label: "Heading",       type: "text" },
      { key: "subTitle", label: "Subtitle",      type: "text" },
      {
        key: "tiers",
        label: "Tier Cards",
        type: "list",
        itemLabel: "Tier",
        itemFields: [
          { key: "badge", label: "Badge",       type: "text", placeholder: "Tier 1" },
          { key: "title", label: "Title",       type: "text" },
          { key: "text",  label: "Description", type: "rich-text" },
        ],
      },
      { key: "governance.title", label: "Governance Heading", type: "text" },
      {
        key: "governance.paragraphs",
        label: "Governance Paragraphs",
        type: "string-list",
        itemLabel: "Paragraph",
        itemType: "rich-text",
      },
      {
        key: "governance.list",
        label: "Governance Checklist",
        type: "string-list",
        itemLabel: "Item",
        itemType: "text",
      },
      { key: "governance.footer", label: "Governance Footer", type: "rich-text" },
    ],
  },

  leadership: {
    type: "leadership",
    displayName: "Leadership",
    fields: [
      { key: "label",    label: "Eyebrow Label", type: "text" },
      { key: "title",    label: "Heading",       type: "text" },
      { key: "subTitle", label: "Subtitle",      type: "rich-text" },
      {
        key: "commitments",
        label: "Commitments",
        type: "string-list",
        itemLabel: "Commitment",
        itemType: "text",
      },
      {
        key: "leaders",
        label: "Leaders",
        type: "list",
        itemLabel: "Leader",
        itemFields: [
          { key: "image",    label: "Photo",       type: "image" },
          { key: "name",     label: "Name",        type: "text" },
          { key: "creds",    label: "Credentials", type: "text", placeholder: "BA, MBA, FCCA" },
          { key: "role",     label: "Role",        type: "text" },
          { key: "initials", label: "Initials",    type: "text", placeholder: "M" },
        ],
      },
    ],
  },

  "future-vision": {
    type: "future-vision",
    displayName: "Future Vision",
    fields: [
      { key: "label",    label: "Eyebrow Label", type: "text" },
      { key: "title",    label: "Heading",       type: "text" },
      { key: "subTitle", label: "Subtitle",      type: "rich-text" },
      {
        key: "points",
        label: "Vision Points",
        type: "string-list",
        itemLabel: "Point",
        itemType: "rich-text",
      },
      { key: "footer",   label: "Closing Line",  type: "rich-text" },
    ],
  },

  // Global footer (singleton row, not a page section). Field keys are the
  // backend's raw column names — see prisma/schema.prisma `Footer` model.
  "global-footer": {
    type: "global-footer",
    displayName: "Global Footer",
    kind: "global",
    globalResource: "footer",
    fields: [
      { key: "contactLabel",    label: "Section Eyebrow", type: "text",      placeholder: "Get In Touch" },
      { key: "contactTitle",    label: "Section Title",   type: "text",      placeholder: "Ready to Work Together?" },
      { key: "contactSubTitle", label: "Section Body",    type: "rich-text" },
      { key: "buttonText",      label: "Button Text",     type: "text",      placeholder: "Send Us a Message" },
      {
        key: "phone",
        label: "Phone Numbers",
        type: "string-list",
        itemLabel: "Phone",
        itemType: "text",
      },
      { key: "email",   label: "Email",       type: "text" },
      { key: "websiteUrl", label: "Website URL", type: "text" },
      {
        key: "address",
        label: "Address Lines",
        type: "string-list",
        itemLabel: "Line",
        itemType: "text",
      },
      { key: "socialMedia.whatsapp", label: "WhatsApp URL", type: "text", placeholder: "https://wa.me/..." },
      { key: "logoText",  label: "Logo Text",   type: "text" },
      { key: "copyright", label: "Copyright",   type: "text" },
      { key: "location",  label: "Location",    type: "text" },
    ],
  },
};

export function getSchemaForType(type: string): SectionSchema | undefined {
  return SECTION_SCHEMAS[type];
}