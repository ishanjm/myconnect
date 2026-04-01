"use client";

import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/store/store";
import { 
  fetchLocationsRequest, 
  createLocationRequest, 
  updateLocationRequest, 
  deleteLocationRequest,
  clearError
} from "@/store/slices/locations";
import { LocationForm } from "@/components/MasterData/LocationForm";
import { Modal } from "@/components/common/Modal";
import { ILocation as Location } from "@/model/Location";

export default function LocationsPage() {
  const dispatch = useDispatch();
  const { items, isLoading, error, isSaving } = useSelector((state: RootState) => state.locations);
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingLocation, setEditingLocation] = useState<Location | null>(null);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    dispatch(fetchLocationsRequest());
  }, [dispatch]);

  const handleOpenModal = (location?: Location) => {
    if (location) {
      setEditingLocation(location);
    } else {
      setEditingLocation(null);
    }
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingLocation(null);
    dispatch(clearError());
  };

  const handleSubmit = (values: any) => {
    if (editingLocation) {
      dispatch(updateLocationRequest({ ...values, id: editingLocation.id }));
    } else {
      dispatch(createLocationRequest(values));
    }
  };

  // Close modal only on success (when isSaving turns false and no error)
  useEffect(() => {
    if (!isSaving && !error && isModalOpen) {
      setIsModalOpen(false);
      setEditingLocation(null);
    }
  }, [isSaving, error, isModalOpen]);

  const handleDelete = (id: number) => {
    if (window.confirm("Are you sure you want to delete this location?")) {
      dispatch(deleteLocationRequest(id));
    }
  };

  const filteredItems = items.filter(item => 
    item.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    item.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.city?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div id="locations-page" className="min-h-screen bg-[var(--color-bg)] p-4 md:p-8">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 id="locations-title" className="text-2xl font-bold text-[var(--color-fg)]">
              Locations Management
            </h1>
            <p className="text-sm text-[var(--color-fg)] opacity-60">
              Maintain your company's physical and virtual branch locations.
            </p>
          </div>
          <button
            id="locations-add-btn"
            onClick={() => handleOpenModal()}
            className="px-6 py-2.5 bg-accent text-white rounded-lg font-bold shadow-lg hover:opacity-90 transition-all flex items-center justify-center gap-2"
          >
            <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Add Location
          </button>
        </div>

        {/* Filters and Table Card */}
        <div id="locations-table-card" className="bg-[var(--color-surface)] rounded-2xl border border-[var(--color-border)] shadow-sm overflow-hidden">
          <div className="p-4 border-b border-[var(--color-border)] bg-[var(--color-surface)]/50">
            <div className="relative max-w-sm">
              <input
                id="locations-search-input"
                type="text"
                placeholder="Search by name, code, or city..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-[var(--color-bg)] border border-[var(--color-border)] rounded-xl text-sm focus:ring-2 focus:ring-accent outline-none"
              />
              <svg className="absolute left-3 top-2.5 h-4 w-4 text-[var(--color-fg)] opacity-40" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table id="locations-table" className="w-full text-left">
              <thead>
                <tr className="bg-[var(--color-bg)] text-[10px] uppercase tracking-widest font-black text-[var(--color-fg)] opacity-60">
                  <th className="px-6 py-4">Code</th>
                  <th className="px-6 py-4">Location Name</th>
                  <th className="px-6 py-4">City</th>
                  <th className="px-6 py-4 text-center">Status</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[var(--color-border)]">
                {isLoading ? (
                  Array.from({ length: 5 }).map((_, i) => (
                    <tr key={i} className="animate-pulse">
                      <td colSpan={5} className="px-6 py-4">
                        <div className="h-8 bg-[var(--color-border)] rounded-lg w-full"></div>
                      </td>
                    </tr>
                  ))
                ) : filteredItems.length > 0 ? (
                  filteredItems.map((location) => (
                    <tr key={location.id} className="hover:bg-[var(--color-bg)]/50 transition-colors group">
                      <td className="px-6 py-4">
                        <span className="text-xs font-mono font-bold text-accent bg-accent/10 px-2 py-1 rounded">
                          {location.code}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex flex-col">
                          <span className="text-sm font-bold text-[var(--color-fg)]">{location.name}</span>
                          <span className="text-xs text-[var(--color-fg)] opacity-40">{location.address}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-sm text-[var(--color-fg)]">{location.city || "—"}</span>
                      </td>
                      <td className="px-6 py-4 text-center">
                        <span className={`text-[10px] font-black uppercase tracking-widest px-2.5 py-0.5 rounded-full ${
                          location.status === 'active' 
                            ? 'text-emerald-500 bg-emerald-500/10' 
                            : 'text-red-500 bg-red-500/10'
                        }`}>
                          {location.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                          <button
                            id={`locations-edit-btn-${location.id}`}
                            onClick={() => handleOpenModal(location)}
                            className="p-2 text-blue-500 hover:bg-blue-500/10 rounded-lg transition-colors"
                          >
                            <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                            </svg>
                          </button>
                          <button
                            id={`locations-delete-btn-${location.id}`}
                            onClick={() => handleDelete(location.id)}
                            className="p-2 text-red-500 hover:bg-red-500/10 rounded-lg transition-colors"
                          >
                            <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={5} className="px-6 py-20 text-center">
                      <div className="flex flex-col items-center gap-2 opacity-40">
                        <svg className="h-12 w-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                        <span className="text-sm font-medium">No locations found.</span>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <Modal
        id="location-form-modal"
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        title={editingLocation ? "Edit Location" : "Add New Location"}
      >
        <div className="space-y-4">
          {error && (
            <div className="p-3 bg-red-500/10 border border-red-500/20 text-red-500 text-sm rounded-lg">
              {error}
            </div>
          )}
          <LocationForm
            id="location-modal-form"
            initialValues={editingLocation || undefined}
            onSubmit={handleSubmit}
            isLoading={isSaving}
          />
        </div>
      </Modal>
    </div>
  );
}
