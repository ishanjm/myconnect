---
description: Project standards — function components only (no classes), MUI, styles in separate files, component IDs, Redux, loading, model types, common utils, Formik/Yup, reusable components
alwaysApply: true
---

# Project Standards

Follow these conventions in all frontend work.

## 1. Component IDs for QA Automation

Every component (and key interactive elements) must have an `id` that reflects its **domain** so QA can target them in automation.

- Use a consistent pattern: `{domain}-{screen}-{element}` (e.g. `checkout-cart-submit-button`, `product-list-filter-by-price`).
- Prefer kebab-case. Keep IDs stable and predictable.

```tsx
// ✅ GOOD — domain-scoped, QA-friendly
<Box id="order-summary-totals-section">...</Box>
<Button id="checkout-confirm-order-btn" ... />

// ❌ BAD — no id or random id
<Box><Button>Confirm</Button></Box>
```

## 2. Redux for Data Communication

- Use **Redux** for all cross-component or app-wide data (state, API results, user context).
- Avoid prop drilling for shared data; read from the store or dispatch actions.
- Keep local UI state in component state only when it is truly local.

## 3. Loading Screens While Data Loading

- Whenever data is fetched (API, Redux async flows), show a **loading screen** (or skeleton) until the data is ready.
- Do not render main content until loading is complete; avoid flashing empty or partial UI.

```tsx
// ✅ GOOD
if (isLoading) return <LoadingScreen id="product-detail-loading" />;
return <ProductDetail id="product-detail" ... />;
```

## 4. Types and Interfaces in Model Folder

- Put all **types and interfaces** in the **model** folder (e.g. `model/` or `models/`).
- Import types from there instead of defining them inline in components or pages.
- Keeps contracts in one place and reusable across the app.

## 5. Common Folder for Shared Methods

- Put **commonly used methods** (formatters, validators, API helpers, constants) in the **common** folder.
- Reuse from common instead of duplicating logic across components.

## 6. Formik and Yup for Forms

- Use **Formik** for form state and submission.
- Use **Yup** for validation schemas.
- Do not implement custom form state or validation when Formik + Yup can be used.

```tsx
// ✅ GOOD — Formik + Yup
const validationSchema = yup.object({ email: yup.string().email().required() });
<Formik validationSchema={validationSchema} ... />
```

## 7. Reusable Components

- Prefer **reusable components** from the components folder (e.g. shared buttons, inputs, cards).
- Use them instead of one-off inline elements (e.g. use a shared `<AppButton />` rather than raw MUI `<Button>` everywhere).
- Ensures consistency and easier QA (IDs can be set once on the reusable component).

## 8. Function Components Only (No Class Components)

- Use **function components** and hooks for all React components. Do not use class components (`class X extends React.Component`) or class-based services.
- For API/services: export plain **async functions** from service modules (e.g. `export async function createUser(...)`) instead of class instances.

## 9. MUI for UI

- Always use **Material-UI (MUI)** for UI components (e.g. `Box`, `Button`, `TextField`, `Dialog`, `Table`).
- Do not introduce other UI libraries for standard components; keep the UI layer consistent with MUI.

## 10. Styles in Separate Files

- Define styles in **separate files** (e.g. `ComponentName.styles.ts` or colocated style modules).
- Do not define styles inline in the component file (e.g. avoid large `sx` objects or style objects in the same file as JSX).
- Import styles from the dedicated file to keep components focused on structure and logic.

---

**Summary**

| Rule | Action |
|---|-----|
| IDs | Add domain-based `id` on components and key elements for QA |
| Data | Use Redux for data communication |
| Loading | Show loading screen/skeleton while data is loading |
| Types | Put types/interfaces in the **model** folder |
| Methods | Put shared logic in the **common** folder |
| Forms | Use Formik + Yup for all forms |
| UI | Use reusable components from the components folder |
| Components | **Function components only**; no class components; services as plain async functions |
| Framework | Always use **MUI** for UI components |
| Styles | Define styles in **separate files**; import into components |
