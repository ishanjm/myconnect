"use client";

import React, { useEffect } from "react";
import { createPortal } from "react-dom";
import { modalStyles } from "./Modal.styles";

interface ModalProps {
  id: string;
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
}

export const Modal: React.FC<ModalProps> = ({ id, isOpen, onClose, title, children }) => {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };

    if (isOpen) {
      document.body.style.overflow = "hidden";
      window.addEventListener("keydown", handleKeyDown);
    }

    return () => {
      document.body.style.overflow = "auto";
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return createPortal(
    <div
      id={`${id}-backdrop`}
      className={modalStyles.backdrop}
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div id={`${id}-container`} className={modalStyles.container}>
        {/* Header */}
        <div id={`${id}-header`} className={modalStyles.header}>
          <h2 id={`${id}-title`} className={modalStyles.title}>
            {title}
          </h2>
          <button
            id={`${id}-close-btn`}
            onClick={onClose}
            className={modalStyles.closeBtn}
            aria-label="Close modal"
          >
            <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Content */}
        <div id={`${id}-content`} className={modalStyles.content}>
          {children}
        </div>
      </div>
    </div>,
    document.body
  );
};
