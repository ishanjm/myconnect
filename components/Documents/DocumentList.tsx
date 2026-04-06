"use client";

import React from "react";
import { IDocument } from "@/model/Document";
import { ILocation as Location } from "@/model/Location";
import { IDocumentCategory as Category } from "@/model/DocumentCategory";
import { DocumentRow } from "./DocumentRow";

interface DocumentListProps {
  documents: IDocument[];
  viewType: "list" | "details";
  allLocations?: Location[];
  allCategories?: Category[];
}

export const DocumentList: React.FC<DocumentListProps> = ({ 
  documents, 
  viewType, 
  allLocations = [], 
  allCategories = [] 
}) => {
  if (viewType === "list") {
    return (
      <div id="document-list-view" className="flex flex-col gap-3 pb-12">
        {documents.map((doc) => (
          <DocumentRow 
            key={doc.id} 
            document={doc} 
            allLocations={allLocations} 
            allCategories={allCategories} 
            viewType="list" 
          />
        ))}
      </div>
    );
  }

  // Details View (Table)
  return (
    <div id="document-details-view" className="bg-[var(--color-surface)] border border-[var(--color-border)] rounded-2xl overflow-hidden shadow-sm mb-12">
      <div className="overflow-x-auto scrollbar-none">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-accent/5 border-b border-[var(--color-border)]">
              <th className="py-4 px-4 text-[11px] font-black uppercase tracking-widest text-[var(--color-fg)] opacity-40">
                Document Name
              </th>
              <th className="py-4 px-4 text-[11px] font-black uppercase tracking-widest text-[var(--color-fg)] opacity-40">
                Category
              </th>
              <th className="py-4 px-4 text-[11px] font-black uppercase tracking-widest text-[var(--color-fg)] opacity-40">
                Type
              </th>
              <th className="py-4 px-4 text-right text-[11px] font-black uppercase tracking-widest text-[var(--color-fg)] opacity-40">
                Size
              </th>
              <th className="py-4 px-4 text-right text-[11px] font-black uppercase tracking-widest text-[var(--color-fg)] opacity-40">
                Uploaded
              </th>
              <th className="py-4 px-4 text-right text-[11px] font-black uppercase tracking-widest text-[var(--color-fg)] opacity-40">
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {documents.map((doc) => (
              <DocumentRow 
                key={doc.id} 
                document={doc} 
                allLocations={allLocations} 
                allCategories={allCategories} 
                viewType="details" 
              />
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
