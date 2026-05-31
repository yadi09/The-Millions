import { useEffect, type ReactNode } from "react";
import { useEditMode } from "./EditModeContext";
import { EditChrome } from "./EditChrome";
import { EditPanel } from "./EditPanel";

/**
 * Wraps the public app. When edit mode is active, installs a global click
 * delegate that selects the nearest [data-editable-section="X"] ancestor on
 * click and opens the panel. Also injects hover-outline styling for any
 * data-editable-section descendant.
 */
export function EditOverlay({ children }: { children: ReactNode }) {
  const { isEditing, selectSection } = useEditMode();

  useEffect(() => {
    if (!isEditing) return;

    const onClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement | null;
      if (!target) return;

      // Ignore clicks inside the panel itself (it has its own stopPropagation,
      // but defense in depth).
      if (target.closest("[data-edit-panel]")) return;

      const editable = target.closest<HTMLElement>("[data-editable-section]");
      if (editable) {
        e.preventDefault();
        e.stopPropagation();
        const type = editable.dataset.editableSection;
        if (type) selectSection(type);
      }
    };

    document.addEventListener("click", onClick, true);
    return () => document.removeEventListener("click", onClick, true);
  }, [isEditing, selectSection]);

  return (
    <>
      {isEditing && (
        <style>{`
          [data-editable-section] {
            position: relative;
            cursor: pointer;
            outline: 1px dashed rgba(201, 168, 76, 0);
            outline-offset: -2px;
            transition: outline-color 150ms ease;
          }
          [data-editable-section]:hover {
            outline-color: rgba(201, 168, 76, 0.55);
          }
          [data-editable-section] a, [data-editable-section] button {
            pointer-events: none;
          }
        `}</style>
      )}
      {children}
      <EditChrome />
      <div data-edit-panel>
        <EditPanel />
      </div>
    </>
  );
}