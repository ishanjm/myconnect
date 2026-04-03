"use client";

import React, { useRef } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { IDocumentCategory } from "@/model/DocumentCategory";
import { ILocation } from "@/model/Location";

interface DocumentFormProps {
  id: string;
  categories: IDocumentCategory[];
  locations: ILocation[];
  onSubmit: (formData: FormData) => void;
  isLoading?: boolean;
}

const validationSchema = Yup.object().shape({
  title: Yup.string().required("Title is required"),
  description: Yup.string().required("Description is required"),
  categoryId: Yup.number().required("Category is required").min(1, "Please select a category"),
  file: Yup.mixed().required("Document file is required"),
});

export const DocumentForm: React.FC<DocumentFormProps> = ({
  id,
  categories,
  locations,
  onSubmit,
  isLoading,
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  return (
    <Formik
      initialValues={{
        title: "",
        description: "",
        categoryId: 0,
        locationIds: [] as number[],
        file: null as File | null,
      }}
      validationSchema={validationSchema}
      onSubmit={(values) => {
        const formData = new FormData();
        formData.append("title", values.title);
        formData.append("description", values.description);
        formData.append("categoryId", String(values.categoryId));
        formData.append("locationIds", JSON.stringify(values.locationIds));
        if (values.file) {
          formData.append("file", values.file);
        }
        onSubmit(formData);
      }}
    >
      {({ values, setFieldValue }) => (
        <Form id={id} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-[var(--color-fg)] opacity-40 uppercase tracking-widest ml-1">Title</label>
              <Field
                name="title"
                className="w-full bg-[var(--color-surface)] border border-[var(--color-border)] rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-accent outline-none transition-all"
                placeholder="Document Title"
              />
              <ErrorMessage name="title" component="div" className="text-red-500 text-[10px] font-bold ml-1" />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-[var(--color-fg)] opacity-40 uppercase tracking-widest ml-1">Category</label>
              <Field
                as="select"
                name="categoryId"
                className="w-full bg-[var(--color-surface)] border border-[var(--color-border)] rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-accent outline-none transition-all"
              >
                <option value="">Select Category</option>
                {categories.map((cat) => (
                  <option key={cat.id} value={cat.id}>{cat.name}</option>
                ))}
              </Field>
              <ErrorMessage name="categoryId" component="div" className="text-red-500 text-[10px] font-bold ml-1" />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-bold text-[var(--color-fg)] opacity-40 uppercase tracking-widest ml-1">Description</label>
            <Field
              as="textarea"
              name="description"
              rows={3}
              className="w-full bg-[var(--color-surface)] border border-[var(--color-border)] rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-accent outline-none transition-all resize-none"
              placeholder="Provide a brief overview of the document..."
            />
            <ErrorMessage name="description" component="div" className="text-red-500 text-[10px] font-bold ml-1" />
          </div>

          {/* File Upload Zone */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-[var(--color-fg)] opacity-40 uppercase tracking-widest ml-1">Attach Document</label>
            <div 
              onClick={() => fileInputRef.current?.click()}
              className={`border-2 border-dashed rounded-2xl p-8 flex flex-col items-center justify-center gap-3 transition-all cursor-pointer ${
                values.file 
                  ? "border-green-500 bg-green-500/5 shadow-inner" 
                  : "border-[var(--color-border)] hover:border-accent hover:bg-accent/5"
              }`}
            >
              <input
                type="file"
                ref={fileInputRef}
                style={{ display: "none" }}
                onChange={(e) => {
                  const file = e.currentTarget.files?.[0];
                  if (file) setFieldValue("file", file);
                }}
              />
              <div className={`p-4 rounded-full ${values.file ? "bg-green-500/20 text-green-500" : "bg-[var(--color-surface)] text-[var(--color-fg)] opacity-40"}`}>
                <svg className="h-8 w-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  {values.file ? (
                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  ) : (
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 11-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                  )}
                </svg>
              </div>
              <div className="text-center">
                <p className="text-sm font-bold text-[var(--color-fg)]">
                  {values.file ? values.file.name : "Click or drag to upload asset"}
                </p>
                <p className="text-xs font-medium text-[var(--color-fg)] opacity-40 mt-1">
                  {values.file ? `${(values.file.size / 1024 / 1024).toFixed(2)} MB` : "Support for PDF, DOCX, XLSX, PPTX"}
                </p>
              </div>
            </div>
            <ErrorMessage name="file" component="div" className="text-red-500 text-[10px] font-bold ml-1" />
          </div>

          <div className="space-y-3">
            <label className="text-xs font-bold text-[var(--color-fg)] opacity-40 uppercase tracking-widest ml-1">Applicable Branches (Mapping)</label>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3 p-4 bg-[var(--color-bg)] rounded-2xl border border-[var(--color-border)]">
              {locations.map((loc) => (
                <label key={loc.id} className="flex items-center gap-3 cursor-pointer group p-2 hover:bg-[var(--color-surface)] rounded-lg transition-colors">
                  <input
                    type="checkbox"
                    checked={values.locationIds.includes(loc.id)}
                    onChange={(e) => {
                      if (e.target.checked) {
                        setFieldValue("locationIds", [...values.locationIds, loc.id]);
                      } else {
                        setFieldValue("locationIds", values.locationIds.filter((id) => id !== loc.id));
                      }
                    }}
                    className="w-4 h-4 rounded-md border-[var(--color-border)] text-accent focus:ring-accent bg-[var(--color-surface)] outline-none"
                  />
                  <span className="text-xs font-bold text-[var(--color-fg)] opacity-60 group-hover:opacity-100 transition-opacity">
                    {loc.name}
                  </span>
                </label>
              ))}
              {locations.length === 0 && (
                <div className="col-span-full py-4 text-center">
                  <p className="text-[10px] font-bold text-[var(--color-fg)] opacity-30 uppercase tracking-widest">No branches available</p>
                </div>
              )}
            </div>
          </div>

          <button
            id={`${id}-submit-btn`}
            type="submit"
            disabled={isLoading}
            className="w-full bg-accent hover:opacity-90 text-white font-black py-4 rounded-2xl transition-all shadow-lg shadow-accent/20 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {isLoading ? (
              <>
                <svg className="animate-spin h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Processing Upload...
              </>
            ) : (
              "Save Document Asset"
            )}
          </button>
        </Form>
      )}
    </Formik>
  );
};
