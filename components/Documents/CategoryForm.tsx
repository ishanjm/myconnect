"use client";

import React from "react";
import { Formik, Form } from "formik";
import * as Yup from "yup";
import { FormikTextField } from "../inputs/FormikTextField";
import { CreateDocumentCategoryPayload } from "@/model/DocumentCategory";

interface CategoryFormProps {
  id: string;
  onSubmit: (values: CreateDocumentCategoryPayload) => void;
  isLoading?: boolean;
}

const validationSchema = Yup.object().shape({
  name: Yup.string()
    .required("Category name is required")
    .min(2, "Name too short")
    .max(50, "Name too long"),
  description: Yup.string()
    .max(200, "Description too long"),
});

export const CategoryForm: React.FC<CategoryFormProps> = ({ id, onSubmit, isLoading }) => {
  return (
    <Formik
      initialValues={{ name: "", description: "" }}
      validationSchema={validationSchema}
      onSubmit={onSubmit}
    >
      {({ isValid, dirty }) => (
        <Form id={id} className="space-y-4">
          <FormikTextField
            name="name"
            label="Category Name"
            placeholder="e.g. Health & Safety"
            id={`${id}-name`}
          />
          <FormikTextField
            name="description"
            label="Description"
            placeholder="Briefly describe what this category covers..."
            id={`${id}-description`}
          />

          <div className="flex justify-end gap-3 pt-4">
            <button
              id={`${id}-submit-btn`}
              type="submit"
              disabled={isLoading || !isValid || !dirty}
              className={`px-6 py-2.5 rounded-xl font-bold text-white shadow-lg transition-all ${
                isLoading || !isValid || !dirty
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-accent hover:opacity-90 shadow-accent/20"
              }`}
            >
              {isLoading ? "Creating..." : "Create Category"}
            </button>
          </div>
        </Form>
      )}
    </Formik>
  );
};
