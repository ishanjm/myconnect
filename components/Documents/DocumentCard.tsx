"use client";

import React, { useMemo } from "react";
import { IDocument } from "@/model/Document";
import { ILocation as Location } from "@/model/Location";
import { IDocumentCategory as Category } from "@/model/DocumentCategory";

interface DocumentCardProps {
  document: IDocument;
  allLocations?: Location[];
  allCategories?: Category[];
}

const getFileTypeIcon = (type: IDocument["fileType"]) => {
  switch (type) {
    case "pdf":
      return (
        <svg className="h-8 w-8 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 15h6" />
        </svg>
      );
    case "docx":
      return (
        <svg className="h-8 w-8 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 13h6m-6 4h6m-6-8h2" />
        </svg>
      );
    default:
      return (
        <svg className="h-8 w-8 text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 11v4m0 0l-2-2m2 2l2-2" />
        </svg>
      );
  }
};

export const DocumentCard: React.FC<DocumentCardProps> = ({ document, allLocations = [], allCategories = [] }) => {
  const categoryName = useMemo(() => {
    return allCategories.find(c => c.id === document.categoryId)?.name || "Uncategorized";
  }, [document.categoryId, allCategories]);

  const mappedLocationNames = useMemo(() => {
    if (!document.locationIds || document.locationIds.length === 0) return ["Global"];
    return document.locationIds
      .map(id => allLocations.find(loc => loc.id === id)?.name)
      .filter(Boolean) as string[];
  }, [document.locationIds, allLocations]);

  return (
    <div 
      id={`document-card-${document.id}`}
      className="group bg-[var(--color-surface)] border border-[var(--color-border)] rounded-2xl p-5 hover:shadow-xl hover:scale-[1.02] transition-all duration-300 flex flex-col h-full"
    >
      <div className="flex items-start justify-between mb-4">
        <div className="p-3 bg-[var(--color-bg)] rounded-xl group-hover:bg-accent/5 transition-colors">
          {getFileTypeIcon(document.fileType)}
        </div>
        <span className="text-[10px] font-black uppercase tracking-widest px-2.5 py-0.5 rounded-full bg-[var(--color-bg)] text-[var(--color-fg)] opacity-60">
          {categoryName}
        </span>
      </div>

      <div className="flex-1">
        <h3 className="text-base font-bold text-[var(--color-fg)] mb-1 line-clamp-1">
          {document.title}
        </h3>
        <p className="text-xs text-[var(--color-fg)] opacity-40 line-clamp-2 leading-relaxed mb-3">
          {document.description}
        </p>
        <div className="flex flex-wrap gap-1.5">
          {mappedLocationNames.map((name, idx) => (
            <span key={idx} className="text-[9px] font-bold px-2 py-0.5 rounded bg-accent/5 text-accent border border-accent/10 uppercase tracking-tighter">
              {name}
            </span>
          ))}
        </div>
      </div>

      <div className="mt-6 pt-4 border-t border-[var(--color-border)] flex items-center justify-between">
        <div className="flex flex-col">
          <span className="text-[10px] font-bold text-[var(--color-fg)] opacity-30 uppercase tracking-tighter">Size</span>
          <span className="text-xs font-mono font-bold text-[var(--color-fg)] opacity-60">{document.fileSize}</span>
        </div>
        <a 
          href={document.downloadUrl}
          id={`document-download-${document.id}`}
          className="flex items-center gap-2 px-4 py-2 bg-accent/10 text-accent rounded-lg text-xs font-bold hover:bg-accent hover:text-white transition-all"
          download
        >
          <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a2 2 0 002 2h12a2 2 0 002-2v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
          </svg>
          Download
        </a>
      </div>
    </div>
  );
};
