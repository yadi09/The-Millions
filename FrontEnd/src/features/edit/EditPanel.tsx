import { useEffect, useRef, useState } from "react";
import { X, Lock, Plus, Trash2, GripVertical, Upload, Loader2, ImageOff } from "lucide-react";
import { useEditMode } from "./EditModeContext";
import { getSchemaForType, type FieldSchema } from "./sectionSchemas";
import { getPath, setPath } from "./pathUtils";
import { RichTextEditor } from "./RichTextEditor";
import {
  useGetPageQuery,
  useUpdatePageMutation,
  useUploadImageMutation,
  useGetFooterQuery,
  useUpdateFooterMutation,
} from "../api/apiSlice";
import type { Page, Section } from "../../types";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

const AUTOSAVE_DEBOUNCE_MS = 800;
// The page slug being edited. Phase 1 only covers the home page; in Phase 2
// this should come from the route or selected page context.
const ACTIVE_PAGE_SLUG = "home";

// Reverse the GlobalFooter GET response (transformed shape with `contact` and
// `footer` nested objects) back into the raw row shape that updateFooter
// expects. Kept here so schema field keys can match the backend columns.
function footerResponseToRaw(footerData: any): Record<string, unknown> {
  if (!footerData) return {};
  const c = footerData.contact ?? {};
  const f = footerData.footer ?? {};
  return {
    contactLabel: c.label ?? "",
    contactTitle: c.title ?? "",
    contactSubTitle: c.subTitle ?? "",
    buttonText: c.buttonText ?? "",
    phone: Array.isArray(c.phones) ? c.phones : [],
    email: c.email ?? "",
    websiteUrl: c.website ?? "",
    address: Array.isArray(c.address) ? c.address : [],
    socialMedia: { whatsapp: c.whatsapp ?? "" },
    logoText: f.logo ?? "",
    copyright: f.copyright ?? "",
    location: f.location ?? "",
    showContactBlock: footerData.showContactBlock ?? true,
  };
}

export function EditPanel() {
  const { isEditing, selectedSection, selectSection, setSaveStatus } = useEditMode();
  // Inline editor (admin-only) — fetch with preview so hidden sections
  // stay editable from the live site without flipping them on first.
  const { data: pageData } = useGetPageQuery({ slug: ACTIVE_PAGE_SLUG, preview: true });
  const [updatePage] = useUpdatePageMutation();

  const schema = selectedSection ? getSchemaForType(selectedSection) : undefined;
  const isGlobalFooter = schema?.kind === "global" && schema?.globalResource === "footer";

  const { data: footerData } = useGetFooterQuery(undefined, { skip: !isGlobalFooter });
  const [updateFooter] = useUpdateFooterMutation();

  const section = !isGlobalFooter ? findSection(pageData, selectedSection) : undefined;

  // The draft is the FULL content (deep clone), edited by path.
  const [draft, setDraft] = useState<Record<string, unknown>>({});
  const debounceTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  // Mirrors the most recently hydrated/saved state — used as the comparison
  // baseline for the unchanged check, so post-save cache refetches don't
  // trigger phantom saves.
  const sourceRef = useRef<Record<string, unknown> | null>(null);

  // Hydration: when section or footer changes, copy into draft.
  useEffect(() => {
    if (isGlobalFooter) {
      if (footerData) {
        const raw = footerResponseToRaw(footerData);
        sourceRef.current = raw;
        setDraft(raw);
      } else {
        sourceRef.current = null;
        setDraft({});
      }
    } else if (section) {
      sourceRef.current = section.content;
      setDraft({ ...section.content });
    } else {
      sourceRef.current = null;
      setDraft({});
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [section?.id, isGlobalFooter, footerData]);

  // Auto-save: every draft change schedules a debounced PUT.
  useEffect(() => {
    if (!schema) return;
    if (Object.keys(draft).length === 0) return;
    const source = sourceRef.current;
    if (!source) return;

    const unchanged = schema.fields.every(
      (f) => getPath(source, f.key) === getPath(draft, f.key)
    );
    if (unchanged) return;

    if (debounceTimer.current) clearTimeout(debounceTimer.current);
    debounceTimer.current = setTimeout(async () => {
      setSaveStatus("saving");
      try {
        if (isGlobalFooter) {
          await updateFooter(draft).unwrap();
        } else if (section && pageData) {
          const nextSections: Section[] = pageData.sections.map((s) =>
            s.id === section.id ? { ...s, content: draft } : s
          );
          await updatePage({ id: pageData.id, data: { sections: nextSections } }).unwrap();
        }
        // Update the baseline so the next compare reflects what's now persisted.
        sourceRef.current = draft;
        setSaveStatus("saved");
      } catch {
        setSaveStatus("error");
      }
    }, AUTOSAVE_DEBOUNCE_MS);

    return () => {
      if (debounceTimer.current) clearTimeout(debounceTimer.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [draft]);

  if (!isEditing || !selectedSection) return null;

  if (!schema) {
    return (
      <PanelShell onClose={() => selectSection(null)} title="Not editable yet">
        <p className="text-white/50 text-sm">
          This section type (<code className="text-millions-accent">{selectedSection}</code>) doesn't have an editor yet.
          Add an entry to <code>sectionSchemas.ts</code> to enable inline editing.
        </p>
      </PanelShell>
    );
  }

  // Global resources (footer) don't have a `section` — they pull their data
  // from a different endpoint. Section-kind schemas still need a section.
  if (!isGlobalFooter && !section) {
    return (
      <PanelShell onClose={() => selectSection(null)} title={schema.displayName}>
        <p className="text-white/50 text-sm">Section not found in current page data.</p>
      </PanelShell>
    );
  }

  return (
    <PanelShell onClose={() => selectSection(null)} title={schema.displayName}>
      {schema.helper && (
        <div className="mb-6 px-4 py-3 bg-millions-accent/10 border-l-2 border-millions-accent text-white/60 text-[0.7rem] font-jost leading-relaxed">
          {schema.helper}
        </div>
      )}
      <div className="space-y-6">
        {schema.fields.map((field) => (
          <FieldDispatcher
            key={field.key}
            field={field}
            keyPath={field.key}
            draft={draft}
            setDraft={setDraft}
          />
        ))}
      </div>
    </PanelShell>
  );
}

// ---------------------------------------------------------------------------
// Scalar (single-value) field — text / long-text / rich-text.
// ---------------------------------------------------------------------------
function ScalarFieldEditor({
  field,
  value,
  onChange,
}: {
  field: FieldSchema;
  value: string;
  onChange: (v: string) => void;
}) {
  const disabledTitle = field.disabled
    ? field.disabledReason ?? "This field is not editable from inline editing."
    : undefined;
  const inputClass = `w-full bg-white/5 border border-white/10 px-3 py-2 text-white text-sm font-jost focus:outline-none focus:border-millions-accent/60 transition-colors ${
    field.disabled ? "opacity-40 cursor-not-allowed" : ""
  }`;

  return (
    <div title={disabledTitle}>
      {field.label && (
        <label className="flex items-center gap-2 text-[0.6rem] font-jost uppercase tracking-[0.2em] text-white/40 mb-2">
          <span>{field.label}</span>
          {field.disabled && (
            <Lock size={10} className="text-white/30" aria-label="Locked field" />
          )}
        </label>
      )}
      {field.type === "rich-text" ? (
        <RichTextEditor
          value={value}
          onChange={onChange}
          placeholder={field.placeholder}
          disabled={field.disabled}
        />
      ) : field.type === "long-text" ? (
        <textarea
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={field.placeholder}
          rows={4}
          disabled={field.disabled}
          title={disabledTitle}
          className={inputClass}
        />
      ) : (
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={field.placeholder}
          disabled={field.disabled}
          title={disabledTitle}
          className={inputClass}
        />
      )}
      {field.disabled && field.disabledReason && (
        <p className="mt-1.5 text-[0.6rem] text-white/30 font-jost leading-relaxed">
          {field.disabledReason}
        </p>
      )}
    </div>
  );
}

// ---------------------------------------------------------------------------
// Field dispatcher — routes each field to its specialised editor based on
// `type`. Used at every level (top-level panel, inside list items, etc.) so
// nested types compose naturally.
// ---------------------------------------------------------------------------
function FieldDispatcher({
  field,
  keyPath,
  draft,
  setDraft,
}: {
  field: FieldSchema;
  keyPath: string;
  draft: Record<string, unknown>;
  setDraft: React.Dispatch<React.SetStateAction<Record<string, unknown>>>;
}) {
  if (field.type === "list") {
    return <ListFieldEditor field={field} keyPath={keyPath} draft={draft} setDraft={setDraft} />;
  }
  if (field.type === "string-list") {
    return <StringListFieldEditor field={field} keyPath={keyPath} draft={draft} setDraft={setDraft} />;
  }
  if (field.type === "image") {
    return (
      <ImageFieldEditor
        field={field}
        value={(getPath(draft, keyPath) as string) ?? ""}
        onChange={(v) => setDraft((prev) => setPath(prev, keyPath, v))}
      />
    );
  }
  return (
    <ScalarFieldEditor
      field={field}
      value={(getPath(draft, keyPath) as string) ?? ""}
      onChange={(v) => setDraft((prev) => setPath(prev, keyPath, v))}
    />
  );
}

// Picks a sensible blank value for a freshly-added list item's sub-field.
function defaultForFieldType(type: FieldSchema["type"]): unknown {
  if (type === "list" || type === "string-list") return [];
  return "";
}

// ---------------------------------------------------------------------------
// List field — array of objects, each rendered as a card with sub-form.
// ---------------------------------------------------------------------------
function ListFieldEditor({
  field,
  keyPath,
  draft,
  setDraft,
}: {
  field: FieldSchema;
  keyPath: string;
  draft: Record<string, unknown>;
  setDraft: React.Dispatch<React.SetStateAction<Record<string, unknown>>>;
}) {
  const items = (getPath(draft, keyPath) as Array<Record<string, unknown>>) ?? [];
  const itemFields = field.itemFields ?? [];
  const singular = field.itemLabel ?? "Item";

  // Index-based ids are fine for sortable: during a drag the array doesn't
  // mutate (only visual transforms apply); ids settle into the new positions
  // on the post-drop render.
  const itemIds = items.map((_, i) => `item-${i}`);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 4 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates }),
  );

  const addItem = () => {
    const blank: Record<string, unknown> = {};
    for (const f of itemFields) {
      Object.assign(blank, setPath(blank, f.key, defaultForFieldType(f.type)));
    }
    setDraft((prev) => setPath(prev, keyPath, [...items, blank]));
  };

  const removeItem = (index: number) => {
    const next = items.filter((_, i) => i !== index);
    setDraft((prev) => setPath(prev, keyPath, next));
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;
    const oldIndex = itemIds.indexOf(String(active.id));
    const newIndex = itemIds.indexOf(String(over.id));
    if (oldIndex < 0 || newIndex < 0) return;
    const reordered = arrayMove(items, oldIndex, newIndex);
    setDraft((prev) => setPath(prev, keyPath, reordered));
  };

  return (
    <div>
      <label className="block text-[0.6rem] font-jost uppercase tracking-[0.2em] text-white/40 mb-3">
        {field.label}
      </label>

      {items.length === 0 ? (
        <p className="text-white/30 text-xs font-jost italic px-3 py-4 border border-dashed border-white/10">
          No {singular.toLowerCase()}s yet. Add one below.
        </p>
      ) : (
        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragEnd={handleDragEnd}
        >
          <SortableContext items={itemIds} strategy={verticalListSortingStrategy}>
            <div className="space-y-3">
              {items.map((_, index) => (
                <SortableItem
                  key={itemIds[index]}
                  id={itemIds[index]}
                  singular={singular}
                  index={index}
                  onRemove={() => removeItem(index)}
                >
                  {itemFields.map((subField) => (
                    <FieldDispatcher
                      key={subField.key}
                      field={subField}
                      keyPath={`${keyPath}.${index}.${subField.key}`}
                      draft={draft}
                      setDraft={setDraft}
                    />
                  ))}
                </SortableItem>
              ))}
            </div>
          </SortableContext>
        </DndContext>
      )}

      <button
        type="button"
        onClick={addItem}
        className="mt-3 flex items-center gap-2 px-3 py-2 border border-millions-accent/30 text-millions-accent hover:bg-millions-accent/10 transition-colors text-[0.65rem] font-jost uppercase tracking-[0.2em] w-full justify-center"
      >
        <Plus size={12} />
        Add {singular}
      </button>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Image field — uploads to /api/admin/upload (Cloudinary) and stores the
// returned URL on the field. Renders a preview when set, with Replace and
// Remove actions; otherwise an upload dropper.
// ---------------------------------------------------------------------------
function ImageFieldEditor({
  field,
  value,
  onChange,
}: {
  field: FieldSchema;
  value: string;
  onChange: (v: string) => void;
}) {
  const [upload, { isLoading }] = useUploadImageMutation();
  const [error, setError] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFile = async (file: File) => {
    setError(null);
    if (!file.type.startsWith("image/")) {
      setError("Please choose an image file.");
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      setError("Image must be under 5MB.");
      return;
    }
    const formData = new FormData();
    formData.append("image", file);
    try {
      const result = await upload(formData).unwrap();
      onChange(result.url);
    } catch (err: any) {
      setError(err?.data?.error || "Upload failed.");
    }
  };

  const pickFile = () => inputRef.current?.click();

  return (
    <div>
      <label className="block text-[0.6rem] font-jost uppercase tracking-[0.2em] text-white/40 mb-2">
        {field.label}
      </label>

      <input
        type="file"
        accept="image/*"
        ref={inputRef}
        className="hidden"
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) handleFile(file);
          e.target.value = ""; // reset so re-picking same file fires onChange again
        }}
      />

      {value ? (
        <div className="relative group">
          <img
            src={value}
            alt=""
            className="w-full h-48 object-cover bg-white/5 border border-white/10"
          />
          <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3">
            <button
              type="button"
              onClick={pickFile}
              disabled={isLoading}
              className="flex items-center gap-2 px-3 py-2 bg-millions-accent text-millions-dark text-[0.6rem] font-jost uppercase tracking-[0.2em] font-medium hover:bg-white transition-colors disabled:opacity-50"
            >
              {isLoading ? <Loader2 size={12} className="animate-spin" /> : <Upload size={12} />}
              Replace
            </button>
            <button
              type="button"
              onClick={() => onChange("")}
              disabled={isLoading}
              className="flex items-center gap-2 px-3 py-2 bg-white/10 text-white text-[0.6rem] font-jost uppercase tracking-[0.2em] font-medium hover:bg-red-400/30 transition-colors disabled:opacity-50"
            >
              <ImageOff size={12} />
              Remove
            </button>
          </div>
        </div>
      ) : (
        <button
          type="button"
          onClick={pickFile}
          disabled={isLoading}
          className="w-full h-32 border border-dashed border-white/10 bg-white/[0.02] hover:bg-white/5 hover:border-millions-accent/40 transition-colors flex flex-col items-center justify-center gap-2 text-white/40 hover:text-white/70 disabled:opacity-50"
        >
          {isLoading ? <Loader2 size={18} className="animate-spin" /> : <Upload size={18} />}
          <span className="text-[0.65rem] font-jost uppercase tracking-[0.2em]">
            {isLoading ? "Uploading…" : "Upload image"}
          </span>
        </button>
      )}

      {error && (
        <p className="mt-2 text-[0.65rem] text-red-400 font-jost">{error}</p>
      )}
    </div>
  );
}

// ---------------------------------------------------------------------------
// String-list field — array of plain values (strings). Each item renders as
// a single input of `field.itemType` (defaults to "text"). Same drag/remove/
// add UX as the object-list editor.
// ---------------------------------------------------------------------------
function StringListFieldEditor({
  field,
  keyPath,
  draft,
  setDraft,
}: {
  field: FieldSchema;
  keyPath: string;
  draft: Record<string, unknown>;
  setDraft: React.Dispatch<React.SetStateAction<Record<string, unknown>>>;
}) {
  const items = (getPath(draft, keyPath) as string[]) ?? [];
  const singular = field.itemLabel ?? "Item";
  const itemType = field.itemType ?? "text";

  const itemIds = items.map((_, i) => `item-${i}`);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 4 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates }),
  );

  const updateItem = (index: number, value: string) => {
    setDraft((prev) => setPath(prev, `${keyPath}.${index}`, value));
  };

  const addItem = () => {
    setDraft((prev) => setPath(prev, keyPath, [...items, ""]));
  };

  const removeItem = (index: number) => {
    const next = items.filter((_, i) => i !== index);
    setDraft((prev) => setPath(prev, keyPath, next));
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;
    const oldIndex = itemIds.indexOf(String(active.id));
    const newIndex = itemIds.indexOf(String(over.id));
    if (oldIndex < 0 || newIndex < 0) return;
    const reordered = arrayMove(items, oldIndex, newIndex);
    setDraft((prev) => setPath(prev, keyPath, reordered));
  };

  // Synthesise a FieldSchema for the inner input so we can reuse
  // ScalarFieldEditor without duplicating render logic.
  const itemFieldShape = (): FieldSchema => ({
    key: "_value",
    label: "",  // header on SortableItem already shows "Paragraph N"
    type: itemType,
    placeholder: field.placeholder,
  });

  return (
    <div>
      <label className="block text-[0.6rem] font-jost uppercase tracking-[0.2em] text-white/40 mb-3">
        {field.label}
      </label>

      {items.length === 0 ? (
        <p className="text-white/30 text-xs font-jost italic px-3 py-4 border border-dashed border-white/10">
          No {singular.toLowerCase()}s yet. Add one below.
        </p>
      ) : (
        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragEnd={handleDragEnd}
        >
          <SortableContext items={itemIds} strategy={verticalListSortingStrategy}>
            <div className="space-y-3">
              {items.map((value, index) => (
                <SortableItem
                  key={itemIds[index]}
                  id={itemIds[index]}
                  singular={singular}
                  index={index}
                  onRemove={() => removeItem(index)}
                >
                  <ScalarFieldEditor
                    field={itemFieldShape()}
                    value={value ?? ""}
                    onChange={(v) => updateItem(index, v)}
                  />
                </SortableItem>
              ))}
            </div>
          </SortableContext>
        </DndContext>
      )}

      <button
        type="button"
        onClick={addItem}
        className="mt-3 flex items-center gap-2 px-3 py-2 border border-millions-accent/30 text-millions-accent hover:bg-millions-accent/10 transition-colors text-[0.65rem] font-jost uppercase tracking-[0.2em] w-full justify-center"
      >
        <Plus size={12} />
        Add {singular}
      </button>
    </div>
  );
}

// ---------------------------------------------------------------------------
// SortableItem — one list-item card with a drag handle on the left.
// The drag handle owns the dnd-kit listeners, so dragging only starts from
// the handle. Inputs inside the card receive clicks/typing normally.
// ---------------------------------------------------------------------------
function SortableItem({
  id,
  singular,
  index,
  onRemove,
  children,
}: {
  id: string;
  singular: string;
  index: number;
  onRemove: () => void;
  children: React.ReactNode;
}) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id });

  const style: React.CSSProperties = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.4 : 1,
    zIndex: isDragging ? 10 : "auto",
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="flex border border-white/10 bg-white/[0.02]"
    >
      <button
        type="button"
        {...attributes}
        {...listeners}
        className="flex items-center justify-center px-2 text-white/20 hover:text-white/60 cursor-grab active:cursor-grabbing touch-none border-r border-white/5"
        aria-label={`Drag to reorder ${singular.toLowerCase()} ${index + 1}`}
        title="Drag to reorder"
      >
        <GripVertical size={14} />
      </button>

      <div className="flex-1 p-4 space-y-3">
        <div className="flex items-center justify-between mb-1">
          <span className="text-[0.6rem] font-jost uppercase tracking-[0.2em] text-millions-accent">
            {singular} {index + 1}
          </span>
          <button
            type="button"
            onClick={onRemove}
            className="text-white/30 hover:text-red-400 transition-colors p-1"
            title={`Remove ${singular.toLowerCase()}`}
            aria-label={`Remove ${singular.toLowerCase()} ${index + 1}`}
          >
            <Trash2 size={12} />
          </button>
        </div>
        {children}
      </div>
    </div>
  );
}

function findSection(page: Page | undefined, type: string | null): Section | undefined {
  if (!page || !type) return undefined;
  return page.sections.find((s) => s.type === type);
}

function PanelShell({
  title,
  onClose,
  children,
}: {
  title: string;
  onClose: () => void;
  children: React.ReactNode;
}) {
  return (
    <aside
      className="fixed top-0 right-0 bottom-0 z-[105] w-full max-w-md bg-millions-dark border-l border-white/10 shadow-2xl flex flex-col animate-fade-in"
      onClick={(e) => e.stopPropagation()}
    >
      <header className="flex items-center justify-between px-6 py-5 border-b border-white/10">
        <div>
          <p className="text-[0.55rem] font-jost uppercase tracking-[0.25em] text-millions-accent mb-1">Editing</p>
          <h2 className="font-cormorant text-2xl font-light text-white">{title}</h2>
        </div>
        <button
          onClick={onClose}
          className="text-white/40 hover:text-white transition-colors p-1"
          aria-label="Close panel"
        >
          <X size={18} />
        </button>
      </header>
      <div className="flex-1 overflow-y-auto p-6">{children}</div>
    </aside>
  );
}
