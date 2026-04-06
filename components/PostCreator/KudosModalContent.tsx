"use client";

import React from "react";
import { useFormik, FormikProvider } from "formik";
import * as Yup from "yup";
import { FormikTextField } from "../inputs/FormikTextField";
import { FormikTextArea } from "../inputs/FormikTextArea";

interface KudosModalContentProps {
  onSuccess: () => void;
}

const validationSchema = Yup.object().shape({
  recipient: Yup.string().required("Please select someone to recognize"),
  message: Yup.string().required("Please add a note").min(5, "Message too short"),
  type: Yup.string().required("Please select a kudos type"),
});

const KUDOS_TYPES = [
  { id: "star", icon: "⭐", label: "Star" },
  { id: "heart", icon: "❤️", label: "Heart" },
  { id: "rocket", icon: "🚀", label: "Rocket" },
  { id: "badge", icon: "🏆", label: "Winner" },
  { id: "handshake", icon: "🤝", label: "Teamwork" },
];

const MOCK_TEAM = ["Amara", "Dev", "Nisha", "Kamal", "Priya", "Saman"];

export const KudosModalContent: React.FC<KudosModalContentProps> = ({ onSuccess }) => {
  const formik = useFormik({
    initialValues: {
      recipient: "",
      message: "",
      type: "star",
    },
    validationSchema,
    onSubmit: (values) => {
      console.log("Kudos submitted:", values);
      onSuccess();
    },
  });

  return (
    <FormikProvider value={formik}>
      <form
        id="post-creator-kudos-form"
        onSubmit={formik.handleSubmit}
        className="space-y-6"
      >
        {/* Recipient Selection */}
        <div id="kudos-form-recipient-section">
          <label className="block text-sm font-bold mb-3 text-[var(--color-fg)]">
            Who are you recognizing?
          </label>
          <div className="flex flex-wrap gap-2">
            {MOCK_TEAM.map((name) => (
              <button
                key={name}
                type="button"
                id={`kudos-form-recipient-${name.toLowerCase()}`}
                onClick={() => formik.setFieldValue("recipient", name)}
                className={`px-4 py-2 rounded-full text-xs font-bold transition-all cursor-pointer ${
                  formik.values.recipient === name
                    ? "bg-accent text-white shadow-md scale-105"
                    : "bg-[var(--color-bg)] text-[var(--color-fg)] opacity-70 hover:opacity-100 hover:bg-accent/10"
                }`}
              >
                {name}
              </button>
            ))}
          </div>
          {formik.touched.recipient && formik.errors.recipient && (
            <p className="mt-2 text-xs text-red-500">{formik.errors.recipient}</p>
          )}
        </div>

        {/* Kudos Type Selection */}
        <div id="kudos-form-type-section">
          <label className="block text-sm font-bold mb-3 text-[var(--color-fg)]">
            Choose a Kudos Type
          </label>
          <div className="grid grid-cols-5 gap-3">
            {KUDOS_TYPES.map((type) => (
              <button
                key={type.id}
                type="button"
                id={`kudos-form-type-${type.id}`}
                onClick={() => formik.setFieldValue("type", type.id)}
                className={`flex flex-col items-center justify-center p-3 rounded-2xl border-2 transition-all cursor-pointer ${
                  formik.values.type === type.id
                    ? "border-accent bg-accent/5"
                    : "border-transparent bg-[var(--color-bg)] hover:border-[var(--color-border)]"
                }`}
              >
                <span className="text-2xl mb-1">{type.icon}</span>
                <span className="text-[10px] font-bold text-[var(--color-fg)] opacity-60">
                  {type.label}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Message */}
        <div id="kudos-form-message-section">
          <FormikTextArea
            id="kudos-form-message-input"
            name="message"
            label="What's the achievement?"
            placeholder="e.g. Thanks for going above and beyond on the project launch!"
            rows={4}
          />
        </div>

        {/* Actions */}
        <div className="flex gap-4 pt-4 sticky bottom-0 bg-[var(--color-surface)]">
          <button
            id="kudos-form-submit-btn"
            type="submit"
            className="flex-1 bg-accent text-white py-3 rounded-2xl font-bold shadow-lg shadow-accent/20 hover:opacity-90 active:scale-[0.98] transition-all"
          >
            Send Kudos
          </button>
        </div>
      </form>
    </FormikProvider>
  );
};
