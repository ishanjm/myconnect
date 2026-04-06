"use client";

import React, { useMemo, useState } from "react";
import { IDocument } from "@/model/Document";
import { ILocation as Location } from "@/model/Location";
import { IDocumentCategory as Category } from "@/model/DocumentCategory";
import { getDocumentPreviewUrl } from "@/common/documentUtils";

interface DocumentRowProps {
  document: IDocument;
  allLocations?: Location[];
  allCategories?: Category[];
  viewType: "list" | "details";
}

const getFileTypeIcon = (type: string) => {
  switch (type) {
    case "pdf":
      return (
        <svg className="h-5 w-5 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
        </svg>
      );
    case "docx":
      return (
        <svg className="h-5 w-5 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 11l2 2m0 0l2-2m-2 2v-4" />
        </svg>
      );
    default:
      return (
        <svg className="h-5 w-5 text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
        </svg>
      );
  }
};

export const DocumentRow: React.FC<DocumentRowProps> = ({ 
  document, 
  allCategories = [], 
  viewType 
}) => {
  const [isDownloading, setIsDownloading] = useState(false);

  const categoryName = useMemo(() => {
    return allCategories.find(c => c.id === document.categoryId)?.name || "Uncategorized";
  }, [document.categoryId, allCategories]);

  const handleDownload = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (isDownloading) return;
    setIsDownloading(true);
    
    // Using simple approach for demonstration, similar to DocumentCard
    const xhr = new XMLHttpRequest();
    xhr.open("GET", document.downloadUrl, true);
    xhr.responseType = "blob";
    xhr.onload = () => {
      if (xhr.status === 200) {
        const blob = new Blob([xhr.response], { type: "application/octet-stream" });
        const blobUrl = window.URL.createObjectURL(blob);
        const link = window.document.createElement("a");
        link.href = blobUrl;
        link.download = `${document.title}.${document.fileType}`;
        window.document.body.appendChild(link);
        link.click();
        window.document.body.removeChild(link);
        window.URL.revokeObjectURL(blobUrl);
      } else {
        window.open(document.downloadUrl, "_blank");
      }
      setIsDownloading(false);
    };
    xhr.onerror = () => {
      window.open(document.downloadUrl, "_blank");
      setIsDownloading(false);
    };
    xhr.send();
  };

  if (viewType === "list") {
    return (
      <div 
        id={`document-row-list-${document.id}`}
        className="group flex items-center gap-4 p-3 bg-[var(--color-surface)] border border-[var(--color-border)] rounded-xl hover:border-accent/40 hover:shadow-md transition-all cursor-default"
      >
        <div className="p-2 bg-accent/5 rounded-lg">
          {getFileTypeIcon(document.fileType)}
        </div>
        
        <div className="flex-1 min-w-0">
          <h3 className="text-sm font-bold text-[var(--color-fg)] truncate">
            {document.title}
          </h3>
          <p className="text-[11px] text-[var(--color-fg)] opacity-40 truncate">
            {categoryName} • {document.fileSize}
          </p>
        </div>

        <button
          onClick={handleDownload}
          disabled={isDownloading}
          className="p-2 text-accent hover:bg-accent hover:text-white rounded-lg transition-all disabled:opacity-50"
          title="Download"
        >
          {isDownloading ? (
             <svg className="h-4 w-4 animate-spin" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4" />
             </svg>
          ) : (
            <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M4 16v1a2 2 0 002 2h12a2 2 0 002-2v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
            </svg>
          )}
        </button>
      </div>
    );
  }

  // Details View (Table Row)
  return (
    <tr 
      id={`document-row-details-${document.id}`}
      className="group hover:bg-accent/5 transition-colors border-b border-[var(--color-border)] last:border-0"
    >
      <td className="py-4 px-4">
        <div className="flex items-center gap-3">
          <div className="p-1.5 bg-accent/5 rounded-md">
            {getFileTypeIcon(document.fileType)}
          </div>
          <span className="text-sm font-bold text-[var(--color-fg)] truncate max-w-[200px]">
            {document.title}
          </span>
        </div>
      </td>
      <td className="py-4 px-4">
        <span className="text-xs font-medium text-[var(--color-fg)] opacity-60">
          {categoryName}
        </span>
      </td>
      <td className="py-4 px-4">
        <span className="text-xs font-mono text-[var(--color-fg)] opacity-40 uppercase">
          {document.fileType}
        </span>
      </td>
      <td className="py-4 px-4 text-right">
        <span className="text-xs font-mono text-[var(--color-fg)] opacity-40">
          {document.fileSize}
        </span>
      </td>
      <td className="py-4 px-4 text-right">
        <span className="text-xs font-medium text-[var(--color-fg)] opacity-40">
          {document.createdAt ? new Date(document.createdAt).toLocaleDateString() : "—"}
        </span>
      </td>
      <td className="py-4 px-4 text-right">
        <button
          onClick={handleDownload}
          disabled={isDownloading}
          className="inline-flex items-center gap-2 px-3 py-1.5 bg-accent/10 text-accent rounded-lg text-[10px] font-black uppercase tracking-wider hover:bg-accent hover:text-white transition-all disabled:opacity-50"
        >
          {isDownloading ? "..." : "Download"}
        </button>
      </td>
    </tr>
  );
};
