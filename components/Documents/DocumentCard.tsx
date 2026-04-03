"use client";

import React, { useMemo, useState } from "react";
import { IDocument } from "@/model/Document";
import { ILocation as Location } from "@/model/Location";
import { IDocumentCategory as Category } from "@/model/DocumentCategory";
import { getDocumentPreviewUrl } from "@/common/documentUtils";

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
  const [isDownloading, setIsDownloading] = useState(false);

  const categoryName = useMemo(() => {
    return allCategories.find(c => c.id === document.categoryId)?.name || "Uncategorized";
  }, [document.categoryId, allCategories]);

  const mappedLocationNames = useMemo(() => {
    if (!document.locationIds || document.locationIds.length === 0) return ["Global"];
    return document.locationIds
      .map(id => allLocations.find(loc => loc.id === id)?.name)
      .filter(Boolean) as string[];
  }, [document.locationIds, allLocations]);

  const previewUrl = useMemo(() => {
    return getDocumentPreviewUrl(document.downloadUrl, document.fileType);
  }, [document.downloadUrl, document.fileType]);

  const handleDownload = () => {
    if (isDownloading) return;
    setIsDownloading(true);
    const filename = `${document.title}.${document.fileType}`;

    const xhr = new XMLHttpRequest();
    xhr.open("GET", document.downloadUrl, true);
    xhr.responseType = "blob";

    xhr.onload = () => {
      if (xhr.status === 200) {
        // Force the content type to octet-stream so browser treats it as download
        const blob = new Blob([xhr.response], { type: "application/octet-stream" });
        const blobUrl = window.URL.createObjectURL(blob);
        const link = window.document.createElement("a");
        link.href = blobUrl;
        link.download = filename;
        window.document.body.appendChild(link);
        link.click();
        window.document.body.removeChild(link);
        window.URL.revokeObjectURL(blobUrl);
      } else {
        // Fallback: open in new tab
        window.open(document.downloadUrl, "_blank");
      }
      setIsDownloading(false);
    };

    xhr.onerror = () => {
      // Fallback: open in new tab
      window.open(document.downloadUrl, "_blank");
      setIsDownloading(false);
    };

    xhr.send();
  };

  return (
    <div 
      id={`document-card-${document.id}`}
      className="group bg-[var(--color-surface)] border border-[var(--color-border)] rounded-2xl p-3.5 hover:shadow-2xl hover:scale-[1.01] transition-all duration-500 flex flex-col h-full"
    >
      <div className="relative aspect-video rounded-xl overflow-hidden bg-[var(--color-bg)] border border-[var(--color-border)] group-hover:border-accent/30 transition-all mb-3">
        {previewUrl ? (
          <img 
            src={previewUrl} 
            alt={document.title} 
            className="w-full h-full object-cover group-hover:scale-105 transition-all duration-700 select-none"
            loading="lazy"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-accent/5 opacity-40 group-hover:opacity-100 transition-all">
            {getFileTypeIcon(document.fileType)}
          </div>
        )}
        
        {/* Category Badge Over Preview */}
        <div className="absolute top-3 right-3 z-10">
          <span className="text-[9px] font-black uppercase tracking-widest px-3 py-1 rounded-full bg-[var(--color-surface)]/80 backdrop-blur-md shadow-sm border border-[var(--color-border)] text-[var(--color-fg)]">
            {categoryName}
          </span>
        </div>
      </div>

      <div className="flex-1">
        <h3 className="text-sm font-black text-[var(--color-fg)] mb-0.5 line-clamp-1">
          {document.title}
        </h3>
        <p className="text-[11px] text-[var(--color-fg)] opacity-40 line-clamp-1 leading-relaxed mb-2">
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

      <div className="mt-4 pt-3 border-t border-[var(--color-border)] flex items-center justify-between">
        <span className="text-[10px] font-mono font-black text-[var(--color-fg)] opacity-30">
          {document.fileSize}
        </span>
        <button 
          id={`document-download-${document.id}`}
          onClick={handleDownload}
          disabled={isDownloading}
          className="flex items-center gap-1.5 px-3 py-1.5 bg-accent/10 text-accent rounded-lg text-[10px] font-black uppercase tracking-wider hover:bg-accent hover:text-white transition-all shadow-sm shadow-accent/5 disabled:opacity-50 disabled:cursor-wait"
        >
          {isDownloading ? (
            <svg className="h-3.5 w-3.5 animate-spin" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
            </svg>
          ) : (
            <svg className="h-3.5 w-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M4 16v1a2 2 0 002 2h12a2 2 0 002-2v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
            </svg>
          )}
          {isDownloading ? "Saving..." : "Get File"}
        </button>
      </div>
    </div>
  );
};
