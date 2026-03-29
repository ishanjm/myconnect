import { useField } from "formik";
import React from 'react';

type FormikSelectProps = React.SelectHTMLAttributes<HTMLSelectElement> & {
  name: string;
  label: string;
  options: { label: string; value: string }[];
};

export const FormikSelect: React.FC<FormikSelectProps> = ({ name, id, label, options, ...props }) => {
  const [field, meta] = useField(name);
  const selectId = id ?? `form-select-${name}`;
  const hasError = meta.touched && Boolean(meta.error);

  return (
    <div className="flex flex-col space-y-1 mb-4">
      <label htmlFor={selectId} className="text-sm font-medium text-gray-700 dark:text-gray-300">
        {label}
      </label>
      <select
        id={selectId}
        className={`border p-2 rounded w-full bg-white dark:bg-gray-800 text-gray-900 dark:text-white outline-none transition-shadow appearance-none ${
          hasError 
            ? 'border-red-500 focus:ring-2 focus:ring-red-500' 
            : 'border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-blue-500'
        }`}
        {...field}
        {...props}
      >
        <option value="" disabled>Select {label}</option>
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      {hasError && (
        <span className="text-red-500 text-xs mt-1">{meta.error}</span>
      )}
    </div>
  );
};
