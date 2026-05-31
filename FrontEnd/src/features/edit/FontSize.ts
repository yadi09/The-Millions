import { Mark } from "@tiptap/core";

/**
 * FontSize — a Tiptap mark that wraps selected text in
 * `<span data-size="sm|lg">`. Three discrete sizes are exposed in the
 * toolbar: S (sm), M (default — no mark), L (lg). The actual visual size
 * lives in src/index.css under the `[data-size]` selectors so the same
 * spans render correctly on the public site after sanitisation.
 */

export type FontSizeKey = "sm" | "lg";

declare module "@tiptap/core" {
  interface Commands<ReturnType> {
    fontSize: {
      setFontSize: (size: FontSizeKey) => ReturnType;
      unsetFontSize: () => ReturnType;
    };
  }
}

export const FontSize = Mark.create({
  name: "fontSize",

  addAttributes() {
    return {
      size: {
        default: null,
        parseHTML: (el: HTMLElement) => el.getAttribute("data-size"),
        renderHTML: (attrs: { size?: string | null }) => {
          if (!attrs.size) return {};
          return { "data-size": attrs.size };
        },
      },
    };
  },

  parseHTML() {
    return [{ tag: "span[data-size]" }];
  },

  renderHTML({ HTMLAttributes }) {
    return ["span", HTMLAttributes, 0];
  },

  addCommands() {
    return {
      setFontSize:
        (size: FontSizeKey) =>
        ({ chain }) =>
          chain().setMark(this.name, { size }).run(),
      unsetFontSize:
        () =>
        ({ chain }) =>
          chain().unsetMark(this.name).run(),
    };
  },
});
