"use client";

import React, { useState, useMemo, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "@/store/store";
import { CreateDocumentCategoryPayload } from "@/model/DocumentCategory";
import { DocumentCard } from "@/components/Documents/DocumentCard";
import { DocumentList } from "@/components/Documents/DocumentList";
import { CategoryForm } from "@/components/Documents/CategoryForm";
import { DocumentForm } from "@/components/Documents/DocumentForm";
import { LocationDropdown } from "@/components/Documents/LocationDropdown";
import { Modal } from "@/components/common/Modal";
import { fetchCategoriesRequest, createCategoryRequest } from "@/store/slices/documentCategories";
import { fetchLocationsRequest } from "@/store/slices/locations";
import { fetchDocumentsRequest, createDocumentRequest } from "@/store/slices/documents";

interface DocumentHubProps {
  id?: string;
  isTabPage?: boolean;
}

export const DocumentHub: React.FC<DocumentHubProps> = ({ id = "document-hub", isTabPage = false }) => {
  const dispatch = useDispatch();
  const { items: locations } = useSelector((state: RootState) => state.locations);
  const { items: categories, isSaving: isSavingCategory } = useSelector((state: RootState) => state.documentCategories);
  const { items: documents, isLoading: isLoadingDocs, isSaving: isSavingDoc } = useSelector((state: RootState) => state.documents);
  
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategoryId, setSelectedCategoryId] = useState<number | "all">("all");
  const [selectedLocationId, setSelectedLocationId] = useState<number | "all">("all");
  const [viewType, setViewType] = useState<"grid" | "list" | "details">("grid");
  
  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);
  const [isDocumentModalOpen, setIsDocumentModalOpen] = useState(false);
  
  const [hasStartedSavingCategory, setHasStartedSavingCategory] = useState(false);
  const [hasStartedSavingDoc, setHasStartedSavingDoc] = useState(false);

  useEffect(() => {
    dispatch(fetchCategoriesRequest());
    dispatch(fetchLocationsRequest());
    dispatch(fetchDocumentsRequest());
  }, [dispatch]);

  // Close modals after successful save
  useEffect(() => {
    if (hasStartedSavingCategory && !isSavingCategory) {
      setIsCategoryModalOpen(false);
      setHasStartedSavingCategory(false);
    }
    if (hasStartedSavingDoc && !isSavingDoc) {
      setIsDocumentModalOpen(false);
      setHasStartedSavingDoc(false);
    }
  }, [isSavingCategory, isSavingDoc, hasStartedSavingCategory, hasStartedSavingDoc]);

  const filteredDocuments = useMemo(() => {
    return documents.filter((doc) => {
      const matchesSearch = 
        doc.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        doc.description.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory = selectedCategoryId === "all" || doc.categoryId === selectedCategoryId;
      const matchesLocation = selectedLocationId === "all" || 
                             doc.locationIds?.length === 0 || 
                             doc.locationIds?.includes(selectedLocationId);
      return matchesSearch && matchesCategory && matchesLocation;
    });
  }, [documents, searchTerm, selectedCategoryId, selectedLocationId]);

  const handleCreateCategory = (values: CreateDocumentCategoryPayload) => {
    setHasStartedSavingCategory(true);
    dispatch(createCategoryRequest(values));
  };

  const handleCreateDocument = (values: FormData) => {
    setHasStartedSavingDoc(true);
    dispatch(createDocumentRequest(values));
  };

  return (
    <div id={id} className={`${isTabPage ? "pt-2" : "min-h-screen bg-[var(--color-bg)] p-4 md:p-8"}`}>
      <div className={`${isTabPage ? "space-y-6" : "max-w-7xl mx-auto space-y-8"}`}>
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="space-y-1 flex-1">
            <h1 id={`${id}-title`} className={`${isTabPage ? "text-3xl" : "text-4xl"} font-black text-[var(--color-fg)] tracking-tight`}>
              Document Hub
            </h1>
            <p className="text-sm font-medium text-[var(--color-fg)] opacity-40 max-w-lg leading-relaxed">
              Your central repository for all corporate assets, operational guidelines, and shared business documentation.
            </p>
          </div>

          <div className="flex flex-col items-end gap-4 w-full md:w-auto">
            <button
              id={`${id}-add-document-btn`}
              onClick={() => setIsDocumentModalOpen(true)}
              className="px-6 py-3 bg-accent text-white rounded-2xl font-black text-xs uppercase tracking-widest shadow-lg shadow-accent/20 hover:scale-[1.02] transition-all flex items-center gap-2 w-full md:w-auto justify-center"
            >
              <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M12 4v16m8-8H4" />
              </svg>
              Upload Document
            </button>

            <div className="flex items-center gap-4 w-full">
              <div className="flex items-center gap-1 bg-[var(--color-surface)] border border-[var(--color-border)] p-1 rounded-xl shadow-sm">
                {[
                  { id: "grid", icon: (
                    <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                    </svg>
                  ), label: "Grid View" },
                  { id: "list", icon: (
                    <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 10h16M4 14h16M4 18h16" />
                    </svg>
                  ), label: "List View" },
                  { id: "details", icon: (
                    <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17v-2m3 2v-4m3 2v-6m-8-4h8a2 2 0 012 2v11a2 2 0 01-2 2H7a2 2 0 01-2-2V5a2 2 0 012-2z" />
                    </svg>
                  ), label: "Details View" },
                ].map((v) => (
                  <button
                    key={v.id}
                    onClick={() => setViewType(v.id as any)}
                    className={`p-2 rounded-lg transition-all ${
                      viewType === v.id
                        ? "bg-accent text-white shadow-md scale-105"
                        : "text-[var(--color-fg)] opacity-40 hover:opacity-100 hover:bg-accent/10"
                    }`}
                    title={v.label}
                  >
                    {v.icon}
                  </button>
                ))}
              </div>

              <div className="relative flex-1 md:max-w-xs">
                <input
                  id={`${id}-search-input`}
                  type="text"
                  placeholder="Search..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 bg-[var(--color-surface)] border border-[var(--color-border)] rounded-xl text-sm font-bold focus:ring-2 focus:ring-accent outline-none transition-all shadow-sm"
                />
                <svg className="absolute left-3 top-3.5 h-4 w-4 text-[var(--color-fg)] opacity-30" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
            </div>
          </div>
        </div>

        {/* Filters Section */}
        <div className="flex flex-col gap-6 p-1">
          <div className="flex flex-wrap items-center justify-between gap-6">
            <div className="flex flex-wrap items-center gap-2">
              <button
                id={`${id}-category-filter-all`}
                onClick={() => setSelectedCategoryId("all")}
                className={`px-5 py-2.5 rounded-xl text-xs font-black tracking-widest uppercase transition-all border-2 ${
                  selectedCategoryId === "all"
                    ? "bg-accent border-accent text-white shadow-xl shadow-accent/20 scale-105"
                    : "bg-[var(--color-surface)] border-transparent text-[var(--color-fg)] opacity-40 hover:opacity-100 hover:border-[var(--color-border)]"
                }`}
              >
                All
              </button>
              {categories.map((cat) => (
                <button
                  key={cat.id}
                  id={`${id}-category-filter-${cat.id}`}
                  onClick={() => setSelectedCategoryId(cat.id)}
                  className={`px-5 py-2.5 rounded-xl text-xs font-black tracking-widest uppercase transition-all border-2 ${
                    selectedCategoryId === cat.id
                      ? "bg-accent border-accent text-white shadow-xl shadow-accent/20 scale-105"
                      : "bg-[var(--color-surface)] border-transparent text-[var(--color-fg)] opacity-40 hover:opacity-100 hover:border-[var(--color-border)]"
                  }`}
                  title={cat.description}
                >
                  {cat.name}
                </button>
              ))}
              
              <button
                id={`${id}-add-category-btn`}
                onClick={() => setIsCategoryModalOpen(true)}
                className="p-2.5 rounded-xl border-2 border-dashed border-[var(--color-border)] text-blue-500 hover:bg-blue-500/5 transition-colors group"
                title="Create New Category"
              >
                <svg className="h-5 w-5 group-hover:scale-110 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
              </button>
            </div>

            <LocationDropdown 
              id={`${id}-location-filter`}
              locations={locations}
              selectedLocationId={selectedLocationId}
              onSelect={(val) => setSelectedLocationId(val)}
            />
          </div>
        </div>

        {/* Documents Content */}
        {isLoadingDocs ? (
          <div className="py-20 flex flex-col items-center gap-6 animate-pulse">
            <div className="h-16 w-16 bg-[var(--color-surface)] rounded-full" />
            <div className="h-4 w-48 bg-[var(--color-surface)] rounded-lg" />
          </div>
        ) : filteredDocuments.length > 0 ? (
          viewType === "grid" ? (
            <div 
              id={`${id}-grid`}
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 md:gap-5 pb-12"
            >
              {filteredDocuments.map((doc) => (
                <DocumentCard 
                  key={doc.id} 
                  document={doc} 
                  allLocations={locations} 
                  allCategories={categories}
                />
              ))}
            </div>
          ) : (
            <DocumentList 
              documents={filteredDocuments}
              viewType={viewType}
              allLocations={locations}
              allCategories={categories}
            />
          )
        ) : (
          <div className="py-32 flex flex-col items-center gap-6 opacity-20 text-center">
            <svg className="h-20 w-20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            <div className="space-y-1">
              <h3 className="text-xl font-black">Archive Empty</h3>
              <p className="text-xs font-bold uppercase tracking-widest">Adjust filters or upload your first document</p>
            </div>
            <button 
              onClick={() => { setSearchTerm(""); setSelectedCategoryId("all"); setSelectedLocationId("all"); }}
              className="px-6 py-3 border border-[var(--color-fg)] rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-[var(--color-fg)] hover:text-[var(--color-bg)] transition-all"
            >
              Clear all active filters
            </button>
          </div>
        )}
      </div>

      <Modal
        id={`${id}-create-category-modal`}
        isOpen={isCategoryModalOpen}
        onClose={() => setIsCategoryModalOpen(false)}
        title="Create Document Category"
      >
        <CategoryForm 
          id={`${id}-category-modal-form`}
          onSubmit={handleCreateCategory}
          isLoading={isSavingCategory}
        />
      </Modal>

      <Modal
        id={`${id}-create-document-modal`}
        isOpen={isDocumentModalOpen}
        onClose={() => setIsDocumentModalOpen(false)}
        title="Upload New Document"
      >
        <DocumentForm 
          id={`${id}-document-modal-form`}
          categories={categories}
          locations={locations}
          onSubmit={handleCreateDocument}
          isLoading={isSavingDoc}
        />
      </Modal>
    </div>
  );
}
