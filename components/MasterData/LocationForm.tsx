"use client";

import React from "react";
import { Formik, Form } from "formik";
import * as Yup from "yup";
import { FormikTextField } from "../inputs/FormikTextField";
import { FormikSelect } from "../inputs/FormikSelect";
import { CreateLocationPayload, UpdateLocationPayload, ILocation as Location } from "@/model/Location";

interface LocationFormProps {
  id: string;
  initialValues?: Location;
  onSubmit: (values: CreateLocationPayload | UpdateLocationPayload) => void;
  isLoading?: boolean;
}

const validationSchema = Yup.object().shape({
  name: Yup.string().required("Location name is required"),
  code: Yup.string().required("Location code is required"),
  address: Yup.string().nullable(),
  city: Yup.string().nullable(),
  zipCode: Yup.string().nullable(),
  status: Yup.string().oneOf(["active", "inactive"]).required("Status is required"),
});

export const LocationForm: React.FC<LocationFormProps> = ({ id, initialValues, onSubmit, isLoading }) => {
  const formInitialValues: CreateLocationPayload | UpdateLocationPayload = initialValues 
    ? { ...initialValues } 
    : {
        name: "",
        code: "",
        address: "",
        city: "",
        zipCode: "",
        status: "active",
      };

  return (
    <Formik
      initialValues={formInitialValues}
      validationSchema={validationSchema}
      onSubmit={onSubmit}
      enableReinitialize
    >
      {({ isValid, dirty }) => (
        <Form id={id} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormikTextField 
              name="name" 
              label="Location Name" 
              placeholder="e.g. Head Office" 
              id={`${id}-name`}
            />
            <FormikTextField 
              name="code" 
              label="Location Code" 
              placeholder="e.g. L001" 
              id={`${id}-code`}
              disabled={!!initialValues} // Don't allow changing code if editing
            />
          </div>
          
          <FormikTextField 
            name="address" 
            label="Address" 
            placeholder="No 12, Street Name..." 
            id={`${id}-address`}
          />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormikTextField 
              name="city" 
              label="City" 
              placeholder="e.g. Colombo" 
              id={`${id}-city`}
            />
            <FormikTextField 
              name="zipCode" 
              label="Zip Code" 
              placeholder="e.g. 10000" 
              id={`${id}-zipCode`}
            />
          </div>

          <FormikSelect
            name="status"
            label="Status"
            id={`${id}-status`}
            options={[
              { label: "Active", value: "active" },
              { label: "Inactive", value: "inactive" },
            ]}
          />

          <div className="flex justify-end gap-3 pt-4">
            <button
              id={`${id}-submit-btn`}
              type="submit"
              disabled={isLoading || !isValid || !dirty}
              className={`px-6 py-2 rounded-lg font-bold text-white shadow-md transition-all ${
                isLoading || !isValid || !dirty
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-accent hover:opacity-90"
              }`}
            >
              {isLoading ? "Saving..." : initialValues ? "Update Location" : "Add Location"}
            </button>
          </div>
        </Form>
      )}
    </Formik>
  );
};
