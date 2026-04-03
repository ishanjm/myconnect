"use client";

import React, { useEffect } from "react";
import { createPortal } from "react-dom";
import { confirmModalStyles } from "./ConfirmModal.styles";

interface ConfirmModalProps {
  id: string;
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  variant?: "danger" | "info";
  isLoading?: boolean;
}

export const ConfirmModal: React.FC<ConfirmModalProps> = ({
  id,
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmText = "Confirm",
  cancelText = "Cancel",
  variant = "info",
  isLoading = false,
}) => {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && !isLoading) onClose();
    };

    if (isOpen) {
      document.body.style.overflow = "hidden";
      window.addEventListener("keydown", handleKeyDown);
    }

    return () => {
      document.body.style.overflow = "auto";
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen, onClose, isLoading]);

  if (!isOpen) return null;

  return createPortal(
    <div
      id={`${id}-backdrop`}
      className={confirmModalStyles.backdrop}
      onClick={(e) => {
        if (e.target === e.currentTarget && !isLoading) onClose();
      }}
    >
      <div id={`${id}-container`} className={confirmModalStyles.container}>
        {/* Icon */}
        <div id={`${id}-icon`} className={confirmModalStyles.iconWrapper[variant]}>
          {variant === "danger" ? (
            <svg className="h-8 w-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
          ) : (
            <svg className="h-8 w-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          )}
        </div>

        <h2 id={`${id}-title`} className={confirmModalStyles.title}>
          {title}
        </h2>
        <p id={`${id}-message`} className={confirmModalStyles.message}>
          {message}
        </p>

        <div id={`${id}-actions`} className={confirmModalStyles.actions}>
          <button
            id={`${id}-confirm-btn`}
            onClick={onConfirm}
            disabled={isLoading}
            className={confirmModalStyles.confirmBtn[variant]}
          >
            {isLoading ? "Processing..." : confirmText}
          </button>
          <button
            id={`${id}-cancel-btn`}
            onClick={onClose}
            disabled={isLoading}
            className={confirmModalStyles.cancelBtn}
          >
            {cancelText}
          </button>
        </div>
      </div>
    </div>,
    document.body
  );
};
