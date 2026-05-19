import * as React from "react";
import { X } from "lucide-react";

export interface ConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
}

export function ConfirmModal({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmText = "Delete",
  cancelText = "Cancel",
}: ConfirmModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-millions-dark/80 backdrop-blur-sm animate-fade-in">
      <div className="bg-millions-dark border border-white/10 w-full max-w-md p-6 shadow-2xl relative">
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 text-white/50 hover:text-white transition-colors"
        >
          <X size={20} />
        </button>

        <h3 className="font-cormorant text-2xl font-semibold text-white mb-2">
          {title}
        </h3>
        <p className="font-jost text-[0.85rem] leading-relaxed text-white/60 mb-8">
          {message}
        </p>

        <div className="flex items-center justify-end gap-4">
          <button
            onClick={onClose}
            className="font-jost text-[0.75rem] uppercase tracking-widest text-white/60 hover:text-white transition-colors px-4 py-2"
          >
            {cancelText}
          </button>
          <button
            onClick={() => {
              onConfirm();
              onClose();
            }}
            className="font-jost text-[0.75rem] uppercase tracking-widest text-millions-dark bg-millions-accent px-6 py-2 font-bold hover:-translate-y-0.5 hover:bg-[#e0bb60] transition-all"
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
}
