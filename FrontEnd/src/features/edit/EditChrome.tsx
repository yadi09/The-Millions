import { Pencil, Check, Loader2, AlertCircle, X } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import { useEditMode } from "./EditModeContext";

export function EditChrome() {
  const { isEditing, selectedSection, saveStatus, lastSavedAt, exitEditMode, selectSection } = useEditMode();
  const { pathname } = useLocation();

  if (!isEditing) return null;

  return (
    <>
      {/* Pinstripe border framing the canvas */}
      <div className="pointer-events-none fixed inset-0 z-[60] border-2 border-millions-accent/40" />

      {/* Bottom-center floating capsule — kept out of the header's path so it
          never collides with site nav (logo, links, CTA button). */}
      <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-[110] flex items-center gap-3 bg-millions-dark/95 backdrop-blur-md border border-millions-accent/30 px-4 py-3 shadow-2xl">
        <Pencil size={14} className="text-millions-accent" />
        <span className="font-jost text-[0.7rem] uppercase tracking-[0.2em] text-white/80">
          Editing
          {selectedSection ? (
            <>
              <span className="text-white/30 mx-2">/</span>
              <span className="text-millions-accent">{selectedSection}</span>
            </>
          ) : (
            <span className="text-white/40 ml-2">— click a section</span>
          )}
        </span>

        <SaveStatusIndicator status={saveStatus} lastSavedAt={lastSavedAt} />

        {/* Page switcher — keeps ?edit=1 so admins stay in edit mode. The
            contact page holds the editable opening hours. */}
        <nav className="flex items-center gap-2 ml-2 pl-3 border-l border-white/10" aria-label="Edit another page">
          {EDITABLE_PAGES.map((p) => (
            <Link
              key={p.to}
              to={`${p.to}?edit=1`}
              onClick={() => selectSection(null)}
              className={`font-jost text-[0.65rem] uppercase tracking-[0.2em] transition-colors ${
                pathname === p.to ? "text-millions-accent" : "text-white/40 hover:text-white"
              }`}
            >
              {p.label}
            </Link>
          ))}
        </nav>

        <button
          onClick={exitEditMode}
          className="flex items-center gap-2 ml-2 pl-3 border-l border-white/10 text-white/50 hover:text-white transition-colors"
          aria-label="Exit edit mode"
        >
          <X size={12} />
          <span className="font-jost text-[0.65rem] uppercase tracking-[0.2em]">Done</span>
        </button>
      </div>
    </>
  );
}

const EDITABLE_PAGES = [
  { to: "/", label: "Home" },
  { to: "/contact", label: "Contact" },
  { to: "/privacy", label: "Privacy" },
  { to: "/cookies", label: "Cookies" },
  { to: "/terms", label: "Terms" },
];

function SaveStatusIndicator({ status, lastSavedAt }: { status: ReturnType<typeof useEditMode>["saveStatus"]; lastSavedAt: number | null }) {
  if (status === "saving") {
    return (
      <span className="flex items-center gap-1.5 text-millions-accent text-[0.65rem] font-jost uppercase tracking-[0.15em]">
        <Loader2 size={11} className="animate-spin" />
        Saving
      </span>
    );
  }

  if (status === "error") {
    return (
      <span className="flex items-center gap-1.5 text-red-400 text-[0.65rem] font-jost uppercase tracking-[0.15em]">
        <AlertCircle size={11} />
        Failed
      </span>
    );
  }

  if (status === "saved" && lastSavedAt) {
    return (
      <span className="flex items-center gap-1.5 text-white/40 text-[0.65rem] font-jost uppercase tracking-[0.15em]">
        <Check size={11} className="text-green-400/80" />
        Saved
      </span>
    );
  }

  return null;
}