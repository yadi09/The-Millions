import { createContext, useContext, useMemo, useState, type ReactNode } from "react";
import { useSearchParams } from "react-router-dom";
import { hasValidToken } from "../../utils/authUtils";

export type SaveStatus = "idle" | "saving" | "saved" | "error";

interface EditModeContextValue {
  isEditing: boolean;
  selectedSection: string | null;
  saveStatus: SaveStatus;
  lastSavedAt: number | null;
  selectSection: (type: string | null) => void;
  setSaveStatus: (status: SaveStatus) => void;
  exitEditMode: () => void;
}

const EditModeContext = createContext<EditModeContextValue | null>(null);

interface EditModeProviderProps {
  children: ReactNode;
}

export function EditModeProvider({ children }: EditModeProviderProps) {
  const [searchParams, setSearchParams] = useSearchParams();
  const [selectedSection, selectSection] = useState<string | null>(null);
  const [saveStatus, setSaveStatus] = useState<SaveStatus>("idle");
  const [lastSavedAt, setLastSavedAt] = useState<number | null>(null);

  // Edit mode is active only when ?edit=1 is in the URL AND the user has a
  // non-expired admin token. An expired token (or none) falls through to the
  // normal public view — no broken edit chrome, no failed saves.
  const isEditing = searchParams.get("edit") === "1" && hasValidToken();

  const exitEditMode = () => {
    const next = new URLSearchParams(searchParams);
    next.delete("edit");
    setSearchParams(next, { replace: true });
    selectSection(null);
  };

  const setStatus = (status: SaveStatus) => {
    setSaveStatus(status);
    if (status === "saved") setLastSavedAt(Date.now());
  };

  const value = useMemo<EditModeContextValue>(
    () => ({
      isEditing,
      selectedSection,
      saveStatus,
      lastSavedAt,
      selectSection,
      setSaveStatus: setStatus,
      exitEditMode,
    }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [isEditing, selectedSection, saveStatus, lastSavedAt]
  );

  return <EditModeContext.Provider value={value}>{children}</EditModeContext.Provider>;
}

export function useEditMode(): EditModeContextValue {
  const ctx = useContext(EditModeContext);
  if (!ctx) throw new Error("useEditMode must be used inside <EditModeProvider>");
  return ctx;
}