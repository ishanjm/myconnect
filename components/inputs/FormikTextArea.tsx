import { useField } from "formik";
import React from 'react';

type FormikTextAreaProps = React.TextareaHTMLAttributes<HTMLTextAreaElement> & {
  name: string;
  label: string;
};

export const FormikTextArea: React.FC<FormikTextAreaProps> = ({ name, id, label, className = "", ...props }) => {
  const [field, meta] = useField(name);
  const inputId = id ?? `form-textarea-${name}`;
  const hasError = meta.touched && Boolean(meta.error);

  return (
    <div className={`flex flex-col space-y-1.5 mb-4 ${className}`}>
      <label 
        htmlFor={inputId} 
        className="text-[11px] font-black uppercase tracking-widest text-[var(--color-fg)] opacity-50"
      >
        {label}
      </label>
      <textarea
        id={inputId}
        className={`w-full min-h-[100px] p-3.5 rounded-2xl bg-[var(--color-bg)] text-[var(--color-fg)] border-2 transition-all outline-none resize-none text-sm placeholder:text-[var(--color-fg)]/20 ${
          hasError 
            ? 'border-red-500 bg-red-500/5 focus:ring-4 focus:ring-red-500/10' 
            : 'border-transparent focus:border-accent focus:ring-4 focus:ring-accent/10 hover:border-[var(--color-border)] shadow-sm'
        }`}
        {...field}
        {...props}
      />
      {hasError && (
        <div className="flex items-center gap-1.5 px-1 pt-1 animate-in fade-in slide-in-from-top-1">
          <svg className="h-3 w-3 text-red-500" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
          </svg>
          <span className="text-red-500 text-[10px] font-bold">{meta.error}</span>
        </div>
      )}
    </div>
  );
};
