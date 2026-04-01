"use client";

import React from "react";
import { useFormik, FormikProvider, FieldArray, getIn } from "formik";
import * as Yup from "yup";
import { FormikTextField } from "../inputs/FormikTextField";

interface PollModalContentProps {
  onSuccess: () => void;
}

const validationSchema = Yup.object().shape({
  question: Yup.string().required("Please ask a question").max(100, "Question too long"),
  options: Yup.array()
    .of(Yup.string().required("Option cannot be empty"))
    .min(2, "At least 2 options are required")
    .max(5, "Maximum 5 options allowed"),
});

export const PollModalContent: React.FC<PollModalContentProps> = ({ onSuccess }) => {
  const formik = useFormik({
    initialValues: {
      question: "",
      options: ["", ""],
    },
    validationSchema,
    onSubmit: (values) => {
      console.log("Poll submitted:", values);
      onSuccess();
    },
  });

  return (
    <FormikProvider value={formik}>
      <form
        id="post-creator-poll-form"
        onSubmit={formik.handleSubmit}
        className="space-y-6"
      >
        {/* Question */}
        <div id="poll-form-question-section">
          <FormikTextField
            id="poll-form-question-input"
            name="question"
            label="What's your question?"
            placeholder="Ask me anything..."
          />
        </div>

        {/* Options */}
        <div id="poll-form-options-section">
          <label className="block text-sm font-bold mb-3 text-[var(--color-fg)]">
            Response Options
          </label>
          <FieldArray
            name="options"
            render={(arrayHelpers) => (
              <div className="space-y-4">
                {formik.values.options.map((option, index) => (
                  <div key={index} className="flex items-center gap-2 group">
                    <div className="flex-1">
                      <input
                        id={`poll-option-${index}`}
                        name={`options.${index}`}
                        value={option}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        placeholder={`Option ${index + 1}`}
                        className={`w-full p-3 rounded-2xl border bg-[var(--color-bg)] text-sm text-[var(--color-fg)] transition-all ${
                          getIn(formik.touched, `options.${index}`) && 
                          getIn(formik.errors, `options.${index}`)
                            ? "border-red-500"
                            : "border-[var(--color-border)] focus:border-accent"
                        }`}
                      />
                      {getIn(formik.touched, `options.${index}`) && 
                       getIn(formik.errors, `options.${index}`) && (
                        <p className="mt-1 text-[10px] text-red-500 pl-2">
                          {getIn(formik.errors, `options.${index}`)}
                        </p>
                      )}
                    </div>
                    {formik.values.options.length > 2 && (
                      <button
                        type="button"
                        id={`remove-poll-option-${index}`}
                        onClick={() => arrayHelpers.remove(index)}
                        className="p-2 text-red-500 opacity-20 hover:opacity-100 group-hover:opacity-100 rounded-full hover:bg-red-50/10 transition-all cursor-pointer"
                      >
                        <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </button>
                    )}
                  </div>
                ))}

                {formik.values.options.length < 5 && (
                  <button
                    type="button"
                    id="add-poll-option-btn"
                    onClick={() => arrayHelpers.push("")}
                    className="flex items-center gap-2 text-accent text-sm font-bold pl-2 hover:underline cursor-pointer"
                  >
                    <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M11 11V5h2v6h6v2h-6v6h-2v-6H5v-2h6z" />
                    </svg>
                    Add Option
                  </button>
                )}
              </div>
            )}
          />
        </div>

        {/* Actions */}
        <div className="flex gap-4 pt-4 sticky bottom-0 bg-[var(--color-surface)]">
          <button
            id="poll-form-submit-btn"
            type="submit"
            className="flex-1 bg-accent text-white py-3 rounded-2xl font-bold shadow-lg shadow-accent/20 hover:opacity-90 active:scale-[0.98] transition-all"
          >
            Create Poll
          </button>
        </div>
      </form>
    </FormikProvider>
  );
};
