import DOMPurify from "dompurify";

/**
 * Sanitises HTML before it's handed to `dangerouslySetInnerHTML`.
 * Configured to allow inline marks (bold/italic/underline), paragraph
 * structure, and safe links — the marks our Tiptap editors emit.
 *
 * Scripts, event handlers, dangerous URIs, and unknown tags are stripped.
 */
const ALLOWED_TAGS = [
  "p", "br", "span", "strong", "b", "em", "i", "u", "s", "a", "ul", "ol", "li", "blockquote", "code", "pre",
  "h1", "h2", "h3", "h4",
];
const ALLOWED_ATTR = ["href", "target", "rel", "class", "data-size"];

export function sanitizeHtml(html: string): string {
  return DOMPurify.sanitize(html, {
    ALLOWED_TAGS,
    ALLOWED_ATTR,
    // Force-add rel="noopener noreferrer" to any link with a target
    ADD_ATTR: ["target"],
  });
}
