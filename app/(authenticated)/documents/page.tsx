"use client";

import React, { useState, useMemo, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "@/store/store";
import { IDocument, DocumentFileType } from "@/model/Document";
import { IDocumentCategory as Category, CreateDocumentCategoryPayload } from "@/model/DocumentCategory";
import { DocumentCard } from "@/components/Documents/DocumentCard";
import { CategoryForm } from "@/components/Documents/CategoryForm";
import { Modal } from "@/components/common/Modal";
import { fetchCategoriesRequest, createCategoryRequest } from "@/store/slices/documentCategories";
import { fetchLocationsRequest } from "@/store/slices/locations";

const MOCK_DOCUMENTS: IDocument[] = [];

// Categories are now managed via Redux

export default function DocumentsPage() {
  const dispatch = useDispatch();
  const { items: locations } = useSelector((state: RootState) => state.locations);
  const { items: categories, isSaving: isSavingCategory } = useSelector((state: RootState) => state.documentCategories);
  
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategoryId, setSelectedCategoryId] = useState<number | "all">("all");
  const [selectedLocationId, setSelectedLocationId] = useState<number | "all">("all");
  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);
  const [hasStartedSaving, setHasStartedSaving] = useState(false);

  useEffect(() => {
    dispatch(fetchCategoriesRequest());
    dispatch(fetchLocationsRequest());
  }, [dispatch]);

  // Close modal after successful save
  useEffect(() => {
    if (hasStartedSaving && !isSavingCategory) {
      setIsCategoryModalOpen(false);
      setHasStartedSaving(false);
    }
  }, [isSavingCategory, hasStartedSaving]);

  const filteredDocuments = useMemo(() => {
    return MOCK_DOCUMENTS.filter((doc) => {
      const matchesSearch = 
        doc.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        doc.description.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory = selectedCategoryId === "all" || doc.categoryId === selectedCategoryId;
      const matchesLocation = selectedLocationId === "all" || 
                             doc.locationIds?.length === 0 || 
                             doc.locationIds?.includes(selectedLocationId);
      return matchesSearch && matchesCategory && matchesLocation;
    });
  }, [searchTerm, selectedCategoryId, selectedLocationId]);

  const handleCreateCategory = (values: CreateDocumentCategoryPayload) => {
    setHasStartedSaving(true);
    dispatch(createCategoryRequest(values));
  };

  return (
    <div id="documents-page" className="min-h-screen bg-[var(--color-bg)] p-4 md:p-8">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="space-y-2">
            <h1 id="documents-title" className="text-3xl font-black text-[var(--color-fg)] tracking-tight">
              Documents
            </h1>
            <p className="text-sm text-[var(--color-fg)] opacity-50 max-w-lg leading-relaxed">
              Access all company policies, guides, and templates in one place.
            </p>
          </div>

          <div className="relative max-w-sm w-full">
            <input
              id="documents-search-input"
              type="text"
              placeholder="Search documents..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 bg-[var(--color-surface)] border border-[var(--color-border)] rounded-2xl text-sm focus:ring-2 focus:ring-accent outline-none transition-all shadow-sm"
            />
            <svg className="absolute left-3.5 top-3.5 h-4 w-4 text-[var(--color-fg)] opacity-30" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
        </div>

        {/* Filters Section */}
        <div className="flex flex-col gap-4">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex flex-wrap items-center gap-2">
              <button
                id="documents-category-filter-all"
                onClick={() => setSelectedCategoryId("all")}
                className={`px-5 py-2.5 rounded-xl text-xs font-bold tracking-wide transition-all border-2 ${
                  selectedCategoryId === "all"
                    ? "bg-accent border-accent text-white shadow-lg shadow-accent/20 scale-105"
                    : "bg-[var(--color-surface)] border-transparent text-[var(--color-fg)] opacity-60 hover:opacity-100 hover:border-[var(--color-border)]"
                }`}
              >
                All Docs
              </button>
              {categories.map((cat) => (
                <button
                  key={cat.id}
                  id={`documents-category-filter-${cat.id}`}
                  onClick={() => setSelectedCategoryId(cat.id)}
                  className={`px-5 py-2.5 rounded-xl text-xs font-bold tracking-wide transition-all border-2 ${
                    selectedCategoryId === cat.id
                      ? "bg-accent border-accent text-white shadow-lg shadow-accent/20 scale-105"
                      : "bg-[var(--color-surface)] border-transparent text-[var(--color-fg)] opacity-60 hover:opacity-100 hover:border-[var(--color-border)]"
                  }`}
                  title={cat.description}
                >
                  {cat.name}
                </button>
              ))}
              
              <button
                id="documents-add-category-btn"
                onClick={() => setIsCategoryModalOpen(true)}
                className="p-2.5 rounded-xl border-2 border-dashed border-[var(--color-border)] text-blue-500 hover:bg-blue-500/5 transition-colors"
                title="Create New Category"
              >
                <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
              </button>
            </div>

            <div className="h-8 w-px bg-[var(--color-border)] hidden md:block" />

            <div className="flex items-center gap-3">
              <span className="text-xs font-bold text-[var(--color-fg)] opacity-40 uppercase tracking-widest">Branch:</span>
              <select
                id="documents-location-filter"
                value={selectedLocationId}
                onChange={(e) => setSelectedLocationId(e.target.value === "all" ? "all" : Number(e.target.value))}
                className="bg-[var(--color-surface)] border border-[var(--color-border)] rounded-xl px-4 py-2.5 text-xs font-bold text-[var(--color-fg)] outline-none focus:ring-2 focus:ring-accent transition-all cursor-pointer"
              >
                <option value="all">All Locations</option>
                {locations.map((loc) => (
                  <option key={loc.id} value={loc.id}>{loc.name}</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Documents Grid */}
        <div 
          id="documents-grid"
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {filteredDocuments.length > 0 ? (
            filteredDocuments.map((doc) => (
              <DocumentCard 
                key={doc.id} 
                document={doc} 
                allLocations={locations} 
                allCategories={categories}
              />
            ))
          ) : (
            <div className="col-span-full py-20 flex flex-col items-center gap-4 opacity-30">
              <svg className="h-16 w-16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              <h3 className="text-lg font-bold">No documents found matching your criteria.</h3>
              <button 
                onClick={() => { setSearchTerm(""); setSelectedCategoryId("all"); setSelectedLocationId("all"); }}
                className="text-accent hover:underline font-bold"
              >
                Clear all filters
              </button>
            </div>
          )}
        </div>
      </div>

      <Modal
        id="create-category-modal"
        isOpen={isCategoryModalOpen}
        onClose={() => setIsCategoryModalOpen(false)}
        title="Create Document Category"
      >
        <CategoryForm 
          id="category-modal-form"
          onSubmit={handleCreateCategory}
          isLoading={isSavingCategory}
        />
      </Modal>
    </div>
  );
}
