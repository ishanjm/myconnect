---
name: formik-mui-api-redux-forms
description: >-
  Generates validated forms with Formik, Yup, and MUI; reusable Axios API
  services with error handling; Formik-to-API wiring via Redux; reusable
  Formik+MUI input components; and complex Yup validation schemas. Use when
  creating forms, API services, form submission with Redux, or validation
  logic.
---

# Formik, MUI, API & Redux Forms

Follow project standards: IDs for QA (`{domain}-{screen}-{element}`), types in `model/` or `types/`, shared logic in `common/`, MUI for UI, styles in separate files.

---

## 1. Validated form (Formik + Yup + MUI)

- Use **Formik** for form state and submission; **Yup** for validation; **MUI** for inputs and layout.
- Put validation schema in the same file or in a shared validation module; keep types/interfaces in `model/` or `types/`.
- Show a loading state while submitting; show API errors via `formik.setStatus()` and render with MUI `Alert`.

**Pattern:**

```tsx
import { useFormik } from "formik";
import * as Yup from "yup";
// MUI: Box, TextField, Button, etc.

const validationSchema = Yup.object({
  fieldName: Yup.string().trim().required("Required"),
  // add more fields
});

const formik = useFormik<FormValues>({
  initialValues: { ... },
  validationSchema,
  onSubmit: async (values, helpers) => {
    helpers.setStatus(undefined);
    try {
      await onSubmit(values); // or dispatch Redux action
    } catch (error) {
      helpers.setStatus(error instanceof Error ? error.message : "Request failed");
    } finally {
      helpers.setSubmitting(false);
    },
  },
});

return (
  <form id="domain-screen-form" onSubmit={formik.handleSubmit} noValidate>
    {formik.status && <Alert severity="error">{formik.status}</Alert>}
    <TextField
      id="domain-screen-fieldName"
      name="fieldName"
      value={formik.values.fieldName}
      onChange={formik.handleChange}
      onBlur={formik.handleBlur}
      error={formik.touched.fieldName && Boolean(formik.errors.fieldName)}
      helperText={formik.touched.fieldName && formik.errors.fieldName}
    />
    <Button type="submit" disabled={formik.isSubmitting}>Submit</Button>
  </form>
);
```

- Use `enableReinitialize: true` when initial values come from async data (e.g. edit mode). Reset form when modal closes or route changes.

---

## 2. Reusable API service (Axios + error handling)

- Use the project’s configured **Axios** client (`apiClient` or `authApiClient` from `utils/axiosConfig`). Do not create ad-hoc axios instances for the same API.
- Put services in a `services/` folder; one module per domain (e.g. `userService.ts`). Export **plain async functions** (no class components or class-based services). Export typed request/response interfaces from the same file.
- Let interceptors handle auth and global error handling (e.g. 401 redirect). In service functions, throw or return typed data; let callers (or Redux thunks) handle user-facing messages.

**Pattern (function-based, no classes):**

```ts
// services/exampleService.ts
import { apiClient } from "../utils/axiosConfig";

export interface CreateExampleRequest {
  name: string;
  // ...
}

export interface CreateExampleResponse {
  id: string;
  // ...
}

export interface ExampleResponse {
  id: string;
  name: string;
  // ...
}

export async function createExample(payload: CreateExampleRequest): Promise<CreateExampleResponse> {
  const response = await apiClient.post<CreateExampleResponse>("/examples", payload);
  return response.data;
}

export async function getExampleById(id: string): Promise<ExampleResponse> {
  const response = await apiClient.get<ExampleResponse>(`/examples/${id}`);
  return response.data;
}
```

- For error handling: either let the error propagate (so Redux thunk or component can catch and set status/message), or wrap in a small helper that maps Axios errors to a consistent shape and rethrows. Do not swallow errors.

---

## 3. Connect Formik form to API via Redux

- Use **Redux** for app-wide data and side effects. Form state stays in Formik; submission triggers a Redux async action (thunk) that calls the Axios service.
- Put thunks in the same slice or a dedicated thunk file; dispatch from the form’s `onSubmit` (or pass a callback that dispatches).
- Show loading from Redux (e.g. `isSubmitting` or a slice `isLoading`) and show errors from Redux or from the thunk result (e.g. set into `formik.setStatus` in the component).

**Pattern:**

- **Component:** Formik `onSubmit` calls a prop like `onSubmit(values)`; the parent (or container) dispatches the thunk and handles success/error (e.g. close modal, show toast, set form status).
- **Thunk:** Call the service (e.g. `createExample(payload)` from the service module); on success dispatch a success action and optionally normalize data into the store; on failure either throw (so the component can catch and set status) or dispatch an error action and return so the component can read error state.

```ts
// In component or container
const handleSubmit = async (values: FormValues) => {
  await dispatch(createExampleThunk(values)).unwrap();
  onSuccess();
};

<FormikForm initialValues={...} onSubmit={handleSubmit} />
```

- Keep request/response types in `types/` or in the service file and import into the slice/thunk.

---

## 4. Reusable Formik + MUI input component

- Create a single reusable component that wires Formik’s `field` and `meta` to a MUI input (e.g. `TextField`), so every form doesn’t repeat `value`, `onChange`, `onBlur`, `error`, `helperText`.
- Use Formik’s `useField` or render `<Field>` and pass through MUI props. Support a clear `id` for QA (e.g. `id={id}` or `id={`${formId}-${name}`}`).

**Pattern:**

```tsx
// components/inputs/FormikTextField.tsx
import { useField } from "formik";
import { TextField, TextFieldProps } from "@mui/material";

type FormikTextFieldProps = TextFieldProps & {
  name: string;
};

export const FormikTextField: React.FC<FormikTextFieldProps> = ({ name, id, ...textFieldProps }) => {
  const [field, meta] = useField(name);
  return (
    <TextField
      id={id ?? `form-${name}`}
      name={name}
      value={field.value}
      onChange={field.onChange}
      onBlur={field.onBlur}
      error={meta.touched && Boolean(meta.error)}
      helperText={meta.touched && meta.error}
      {...textFieldProps}
    />
  );
};
```

- Use this (and similar components for select, checkbox, etc.) in forms so validation and touch state stay consistent. Prefer components from the project’s `components/` folder and extend only when needed.

---

## 5. Complex Yup validation schema

- Use Yup’s `object().shape()` for nested objects; `when()` for conditionals; `ref()` for cross-field rules; `test()` or `matches()` for custom rules; `transform()` for normalizing before validation.
- Keep schemas readable: extract shared rules (e.g. `emailSchema`, `passwordSchema`) into constants or a small validation module in `common/` and reuse.

**Common patterns:**

- **Conditional required:** `when('otherField', { is: value, then: (s) => s.required(), otherwise: (s) => s.optional() })`.
- **Match another field:** `Yup.string().oneOf([Yup.ref('password')], 'Passwords must match')`.
- **Async or custom rule:** `test('unique', async (value) => { ... })` or `test('custom', (value) => ...)`.
- **Nested object:** `Yup.object().shape({ inner: Yup.object().shape({ ... }) })`.
- **Array of objects:** `Yup.array().of(Yup.object().shape({ ... })).min(1)`.

For more examples (multi-step, dynamic fields, refinements), see [reference.md](reference.md).

---

## Checklist

- [ ] Form uses Formik + Yup + MUI; IDs follow `{domain}-{screen}-{element}`.
- [ ] Loading/error state shown during submit; errors from API surfaced (e.g. Alert).
- [ ] API calls go through project Axios client; service is typed and in `services/`.
- [ ] Form submission dispatches Redux thunk that uses the service; success/error handled in UI.
- [ ] Reusable Formik+MUI input used where it reduces duplication.
- [ ] Types in `model/` or `types/`; shared validation in `common/` if reused.
