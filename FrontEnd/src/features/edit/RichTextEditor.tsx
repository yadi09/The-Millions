import { useEditor, EditorContent, type Editor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Underline from "@tiptap/extension-underline";
import { Bold, Italic, Underline as UnderlineIcon } from "lucide-react";
import { useEffect } from "react";
import { FontSize } from "./FontSize";

interface RichTextEditorProps {
  value: string;        // current HTML
  onChange: (html: string) => void;
  placeholder?: string;
  disabled?: boolean;
}

/**
 * Slim inline rich-text editor for the EditPanel. Allows inline marks only
 * (bold/italic/underline/link). For richer text (lists, headings) inside
 * specific fields, we'd expand the toolbar there — the rich-text vs plain-text
 * distinction lives in sectionSchemas.ts.
 */
export function RichTextEditor({ value, onChange, placeholder, disabled }: RichTextEditorProps) {
  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        // We don't want block-level distractions for short inline copy.
        heading: false,
        bulletList: false,
        orderedList: false,
        blockquote: false,
        codeBlock: false,
        horizontalRule: false,
      }),
      Underline,
      FontSize,
    ],
    content: value || "",
    editable: !disabled,
    editorProps: {
      attributes: {
        class: "min-h-[100px] w-full bg-white/5 border border-white/10 px-3 py-2 text-white text-sm font-jost focus:outline-none focus:border-millions-accent/60 transition-colors prose prose-invert prose-sm max-w-none [&_p]:my-0 [&_p+p]:mt-2",
        "data-placeholder": placeholder ?? "",
      },
    },
    onUpdate: ({ editor }) => onChange(editor.getHTML()),
  });

  // Sync external value changes back to the editor (e.g. when the user
  // switches sections, the draft hydrates and we need the editor to follow).
  useEffect(() => {
    if (!editor) return;
    if (editor.getHTML() !== value) {
      editor.commands.setContent(value || "", { emitUpdate: false });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value]);

  if (!editor) return null;

  return (
    <div className="space-y-2">
      <Toolbar editor={editor} disabled={disabled} />
      <EditorContent editor={editor} />
    </div>
  );
}

function Toolbar({ editor, disabled }: { editor: Editor; disabled?: boolean }) {
  const btnBase = "p-1.5 text-white/60 hover:text-white hover:bg-white/5 transition-colors disabled:opacity-30 disabled:cursor-not-allowed";
  const activeClass = "text-millions-accent bg-white/5";

  const isSm = editor.isActive("fontSize", { size: "sm" });
  const isLg = editor.isActive("fontSize", { size: "lg" });
  const isMd = !isSm && !isLg;

  const toggleSize = (size: "sm" | "lg") => {
    const isActive = editor.isActive("fontSize", { size });
    if (isActive) {
      editor.chain().focus().unsetFontSize().run();
    } else {
      editor.chain().focus().setFontSize(size).run();
    }
  };

  return (
    <div className="flex items-center gap-1 border border-white/10 px-2 py-1 bg-white/5">
      <button
        type="button"
        onClick={() => editor.chain().focus().toggleBold().run()}
        className={`${btnBase} ${editor.isActive("bold") ? activeClass : ""}`}
        disabled={disabled}
        aria-label="Bold"
        title="Bold"
      >
        <Bold size={13} />
      </button>
      <button
        type="button"
        onClick={() => editor.chain().focus().toggleItalic().run()}
        className={`${btnBase} ${editor.isActive("italic") ? activeClass : ""}`}
        disabled={disabled}
        aria-label="Italic"
        title="Italic"
      >
        <Italic size={13} />
      </button>
      <button
        type="button"
        onClick={() => editor.chain().focus().toggleUnderline().run()}
        className={`${btnBase} ${editor.isActive("underline") ? activeClass : ""}`}
        disabled={disabled}
        aria-label="Underline"
        title="Underline"
      >
        <UnderlineIcon size={13} />
      </button>

      <span className="w-px h-4 bg-white/10 mx-1" aria-hidden />

      <button
        type="button"
        onClick={() => toggleSize("sm")}
        className={`${btnBase} ${isSm ? activeClass : ""} font-jost text-[0.6rem] uppercase tracking-wider px-2 leading-none`}
        disabled={disabled}
        aria-label="Small text"
        title="Small text"
      >
        S
      </button>
      <button
        type="button"
        onClick={() => editor.chain().focus().unsetFontSize().run()}
        className={`${btnBase} ${isMd ? activeClass : ""} font-jost text-[0.7rem] uppercase tracking-wider px-2 leading-none`}
        disabled={disabled}
        aria-label="Medium text (default)"
        title="Medium text (default)"
      >
        M
      </button>
      <button
        type="button"
        onClick={() => toggleSize("lg")}
        className={`${btnBase} ${isLg ? activeClass : ""} font-jost text-[0.85rem] uppercase tracking-wider px-2 leading-none`}
        disabled={disabled}
        aria-label="Large text"
        title="Large text"
      >
        L
      </button>
    </div>
  );
}
