"use client";

import React, { useState, useRef, useEffect } from "react";
import { ILocation } from "@/model/Location";
import { dropdownStyles as s } from "./LocationDropdown.styles";

interface LocationDropdownProps {
  id: string;
  locations: ILocation[];
  selectedLocationId: number | "all";
  onSelect: (id: number | "all") => void;
}

export function LocationDropdown({ 
  id, 
  locations, 
  selectedLocationId, 
  onSelect 
}: LocationDropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const selectedLocation = locations.find(loc => loc.id === selectedLocationId);
  const label = selectedLocationId === "all" ? "Global (All Branches)" : selectedLocation?.name || "Select Branch";

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSelect = (val: number | "all") => {
    onSelect(val);
    setIsOpen(false);
  };

  return (
    <div id={`${id}-container`} className={s.container} ref={dropdownRef}>
      <span className={s.triggerLabel}>Filter By Branch</span>
      <button
        id={`${id}-trigger`}
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className={s.trigger}
        aria-haspopup="listbox"
        aria-expanded={isOpen}
      >
        <span className={s.triggerText}>{label}</span>
        <svg 
          className={`${s.icon} ${isOpen ? "rotate-180" : ""}`} 
          fill="none" 
          stroke="currentColor" 
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {isOpen && (
        <>
          <div className={s.menu} id={`${id}-menu`} role="listbox">
            <div className={s.menuContent}>
              {/* Global Option */}
              <div
                id={`${id}-option-all`}
                role="option"
                aria-selected={selectedLocationId === "all"}
                className={`${s.option} ${selectedLocationId === "all" ? s.optionActive : ""}`}
                onClick={() => handleSelect("all")}
              >
                <div className={s.optionText}>
                   <span className={s.optionLabel}>Global Access</span>
                   <span className={s.optionDescription}>All available company branches</span>
                </div>
                {selectedLocationId === "all" && (
                  <svg className={s.checkIcon} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                )}
              </div>

              {/* Individual Branches */}
              {locations.map((loc) => (
                <div
                  key={loc.id}
                  id={`${id}-option-${loc.id}`}
                  role="option"
                  aria-selected={selectedLocationId === loc.id}
                  className={`${s.option} ${selectedLocationId === loc.id ? s.optionActive : ""}`}
                  onClick={() => handleSelect(loc.id)}
                >
                  <div className={s.optionText}>
                    <span className={s.optionLabel}>{loc.name}</span>
                    <span className={s.optionDescription}>{loc.code}</span>
                  </div>
                  {selectedLocationId === loc.id && (
                    <svg className={s.checkIcon} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  )}
                </div>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
