import { useField } from "formik";
import React from 'react';

type FormikTextFieldProps = React.InputHTMLAttributes<HTMLInputElement> & {
  name: string;
  label: string;
};

export const FormikTextField: React.FC<FormikTextFieldProps> = ({ name, id, label, ...props }) => {
  const [field, meta] = useField(name);
  const inputId = id ?? `form-${name}`;
  const hasError = meta.touched && Boolean(meta.error);

  return (
    <div className="flex flex-col space-y-1 mb-4">
      <label htmlFor={inputId} className="text-sm font-medium text-gray-700 dark:text-gray-300">
        {label}
      </label>
      <input
        id={inputId}
        className={`border p-2 rounded w-full bg-white dark:bg-gray-800 text-gray-900 dark:text-white outline-none transition-shadow ${
          hasError 
            ? 'border-red-500 focus:ring-2 focus:ring-red-500' 
            : 'border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-blue-500'
        }`}
        {...field}
        {...props}
      />
      {hasError && (
        <span className="text-red-500 text-xs mt-1">{meta.error}</span>
      )}
    </div>
  );
};
