---
trigger: always_on
description: Project standards — function components only (no classes), Tailwind, styles in separate files, component IDs, Redux, loading, model types, common utils, Formik/Yup, reusable components
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

## 4. Types and Interfaces in Model Folder (Single Source of Truth)

- Put all **types and interfaces** in the **model** folder (e.g. `model/`).
- **Never duplicate** an interface in services, components, store, or pages. Define once in `model/`, import everywhere.
- Services may use `type` aliases (`export type QuizItem = QuizAttributes;`) or derived types (`Omit`, `Pick`, `Partial`) but must **never** re-declare fields.
- Refer to [single-source-types.md](file:///c:/Ishan/developments/myconnect/.agent/rules/single-source-types.md) for detailed rules.

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
- Use them instead of one-off inline elements (e.g. use a shared `<AppButton />` rather than raw HTML `<button>` styled everywhere).
- Ensures consistency and easier QA (IDs can be set once on the reusable component).

## 8. Function-Based Architecture (No Classes)

- Use **function components** and hooks for all React components. Do not use class components (`class X extends React.Component`). 
- Do not define any **classes** (`class X { ... }`) for internal logic, services, or models.
- For API/services: export plain **async functions** from service modules (e.g. `export async function createUser(...)`) instead of class instances.
- For Sequelize models: Use **functional definitions** (e.g., `sequelize.define`) instead of class-based inheritance.

## 9. tailwind for UI

- Always use **Tailwind css** for UI components.
- Do not introduce other UI libraries for standard components.
- Refer to [tailwind-usage.md](file:///c:/Ishan/developments/myconnect/.agent/rules/tailwind-usage.md) for detailed implementation standards.

## 10. Styles in Separate Files

- Define styles in **separate files** (e.g. `ComponentName.styles.ts` or colocated style modules).
- Do not define styles inline in the component file (e.g. avoid large `sx` objects or style objects in the same file as JSX).
- Import styles from the dedicated file to keep components focused on structure and logic.

## 11. Use Next.js Link for Internal Navigation

- Always use the **`Link`** component from `next/link` for internal navigation instead of raw `<a>` tags.
- `<a>` tags cause full page reloads; `Link` provides client-side navigation for faster transitions.
- Only use `<a>` for external URLs (e.g. `https://...`).

```tsx
// ✅ GOOD — uses Link for internal routes
import Link from "next/link";
<Link href="/profile" className="...">My Profile</Link>

// ❌ BAD — raw anchor causes full page reload
<a href="/profile">My Profile</a>
```

## 13. No Class Definitions Allowed

- To ensure consistent, functional patterns across the codebase, **do not use the `class` keyword** to define objects, services, or models.
- Use plain objects, interfaces, and function-based patterns for all logic.
- Classes lead to hidden state and boilerplate; functional patterns are more testable and easier to reason about.

## 14. Backend Services Pattern

- Keep Next.js API Routes (`app/api/**/route.ts`) thin. They should act strictly as Request/Response controllers.
- Extract complex database operations, file cleaning, and business logic into dedicated service files inside the root `services/` directory.
- To prevent naming collisions with frontend services (e.g., `postsService.ts`), all backend business logic files MUST use the `ServerService.ts` suffix (e.g., `postsServerService.ts`).
- Refer to [backend-services-pattern.md](file:///c:/Ishan/developments/myconnect/.agent/rules/backend-services-pattern.md) for structural rules.

## 15. Mandatory Sequelize Model Registration

- All Sequelize models must be explicitly imported in the `syncDB` function within `utils/db.ts`.
- This ensures models are registered before `sequelize.sync()` is called, preventing table missing errors.
- Refer to [sequelize-model-registration.md](file:///c:/Ishan/developments/myconnect/.agent/rules/sequelize-model-registration.md) for details.

---

**Summary**

| Rule | Action |
|---|-----|
| IDs | Add domain-based `id` on components and key elements for QA |
| Data | Use Redux for data communication |
| Loading | Show loading screen/skeleton while data is loading |
| Types | **Single source of truth**: define in `model/`, never duplicate in services/components |
| Methods | Put shared logic in the **common** folder |
| Forms | Use Formik + Yup for all forms |
| UI | Use reusable components from the components folder |
| Functionality | **Strictly no classes**; function components and async functions only |
| Framework | Always use **Tailwind CSS** for UI components |
| Styles | Define styles in **separate files**; import into components |
| Navigation | Use **`Link`** from `next/link` for all internal links |
| API Auth | Use `validateToken` from `common/apiAuth` for all authenticated routes |
| Architecture | **No `class` keyword allowed anywhere** (Models, Services, Components) |
| Backend | Extract business logic from API Routes to `services/*ServerService.ts` |
| Models | **MUST** register all new models in `utils/db.ts:syncDB` |