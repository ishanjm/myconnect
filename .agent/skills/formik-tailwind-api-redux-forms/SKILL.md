---
name: formik-tailwind-api-redux-forms
description: >-
  Generates validated forms with Formik, Yup, and Tailwind CSS; reusable Axios API
  services with error handling; Formik-to-API wiring via Redux Observable; reusable
  Formik+Tailwind input components; and complex Yup validation schemas. Use when
  creating forms, API services, form submission with Redux Observable, or validation
  logic.
---

# Formik, Tailwind, API & Redux Observable Forms

Follow project standards: IDs for QA (`{domain}-{screen}-{element}`), types in `model/` or `types/`, shared logic in `common/`, Tailwind CSS for UI, styles in separate files.

---

## 1. Validated form (Formik + Yup + Tailwind)

- Use **Formik** for form state and submission; **Yup** for validation; **Tailwind CSS** for inputs and layout.
- Put validation schema in the same file or in a shared validation module; keep types/interfaces in `model/` or `types/`.
- Show a loading state while submitting; show API errors via Redux state or local state styled with Tailwind.

**Pattern:**

```tsx
import { useFormik } from "formik";
import * as Yup from "yup";

const validationSchema = Yup.object({
  fieldName: Yup.string().trim().required("Required"),
});

const formik = useFormik<FormValues>({
  initialValues: { ... },
  validationSchema,
  onSubmit: (values) => {
    // Dispatch Redux action for Redux Observable epic to handle
    dispatch(submitFormAction(values));
  },
});

return (
  <form id="domain-screen-form" onSubmit={formik.handleSubmit} noValidate className="space-y-4">
    {/* Display error from state if any */}
    <div className="flex flex-col">
      <input
        id="domain-screen-fieldName"
        name="fieldName"
        className="border p-2 rounded"
        value={formik.values.fieldName}
        onChange={formik.handleChange}
        onBlur={formik.handleBlur}
      />
      {formik.touched.fieldName && formik.errors.fieldName && (
        <span className="text-red-500 text-sm">{formik.errors.fieldName}</span>
      )}
    </div>
    <button type="submit" disabled={formik.isSubmitting} className="bg-blue-500 text-white p-2 rounded">
      Submit
    </button>
  </form>
);
```

---

## 2. Reusable API service (Axios + error handling)

- Use the project’s configured **Axios** client (`apiClient` or `authApiClient` from `utils/axiosConfig`).
- Put services in a `services/` folder. Export **plain async functions** or functions returning Observables if using RxJS wrappers.
- Let interceptors handle auth and global error handling (e.g. 401 redirect).

**Pattern:**

```ts
// services/exampleService.ts
import { apiClient } from "../utils/axiosConfig";
import { from } from "rxjs";

export function createExample(payload: CreateExampleRequest) {
  return from(apiClient.post<CreateExampleResponse>("/examples", payload).then(res => res.data));
}
```

---

## 3. Connect Formik form to API via Redux Observable

- Use **Redux Observable** for side effects instead of thunks.
- Dispatch a standard action from `onSubmit` in Formik. Keep Formik state for UI but let Epics handle the async flow.
- Show loading from Redux state.

**Pattern:**

- **Component:** Formik `onSubmit` dispatches an action `dispatch(submitForm(values))`.
- **Epic:** Listens for `submitForm`, switches to the API observable, and maps to success/failure actions.

```ts
import { ofType } from 'redux-observable';
import { mergeMap, map, catchError } from 'rxjs/operators';
import { of } from 'rxjs';
import { submitForm, submitSuccess, submitFailure } from './actions';
import { createExample } from '../services/exampleService';

export const submitFormEpic = (action$) => action$.pipe(
  ofType(submitForm.type),
  mergeMap(action =>
    createExample(action.payload).pipe(
      map(response => submitSuccess(response)),
      catchError(error => of(submitFailure(error.message)))
    )
  )
);
```

---

## 4. Reusable Formik + Tailwind input component

- Create a single reusable component that wires Formik’s `field` and `meta` to a Tailwind-styled input.

**Pattern:**

```tsx
// components/inputs/FormikTextField.tsx
import { useField } from "formik";

type FormikTextFieldProps = React.InputHTMLAttributes<HTMLInputElement> & {
  name: string;
};

export const FormikTextField: React.FC<FormikTextFieldProps> = ({ name, id, ...props }) => {
  const [field, meta] = useField(name);
  return (
    <div className="flex flex-col space-y-1">
      <input
        id={id ?? `form-${name}`}
        className="border p-2 rounded w-full"
        {...field}
        {...props}
      />
      {meta.touched && meta.error ? (
        <span className="text-red-500 text-sm">{meta.error}</span>
      ) : null}
    </div>
  );
};
```

---

## 5. Complex Yup validation schema

- Use Yup’s `object().shape()` for nested objects; `when()` for conditionals; `ref()` for cross-field rules.

---

## Checklist

- [ ] Form uses Formik + Yup + Tailwind CSS; IDs follow `{domain}-{screen}-{element}`.
- [ ] API calls go through project Axios client.
- [ ] Form submission dispatches action for Redux Observable epic.
- [ ] Reusable Formik+Tailwind input used where it reduces duplication.
