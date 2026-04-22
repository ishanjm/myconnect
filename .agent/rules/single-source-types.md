

# Single Source of Truth for Types & Interfaces

All types, interfaces, and data contracts **must** be defined in the `model/` folder and imported from there. **Never** duplicate or redefine an interface in another location (services, components, pages, etc.).

## 1. The Rule

- **Define once in `model/`**: Every shared type, interface, or enum lives in the `model/` directory.
- **Import everywhere else**: Services, components, store slices, and API routes import from `model/`.
- **Aliases are acceptable**: If a service needs a friendlier name (e.g., `QuizItem` instead of `QuizAttributes`), use `export type QuizItem = QuizAttributes;` — **never** re-declare the fields.
- **Derived types are acceptable**: Use `Omit`, `Pick`, or `Partial` to create variants — **never** copy-paste fields into a new interface.

## 2. Where Types Go

| Type Category | Location | Example |
|---|---|---|
| Sequelize model attributes | `model/ModelName.ts` | `QuizAttributes` in `model/Quiz.ts` |
| API payloads / creation types | `model/ModelName.ts` | `CreateQuizPayload` in `model/Quiz.ts` |
| Shared sub-types (e.g. nested JSON) | `model/ModelName.ts` | `QuizAttemptAnswer` in `model/QuizAttempt.ts` |
| Auth / session types | `model/auth.ts` | `AuthUser`, `LoginCredentials` |
| Constants / enums | `common/*.constants.ts` | `SubscriptionType` in `common/auth.constants.ts` |

## 3. What Services Should Look Like

```typescript
// ✅ GOOD — types imported from model, aliased if needed
import { QuizAttributes, CreateQuizPayload } from "@/model/Quiz";

export type QuizItem = QuizAttributes;
export type CreateQuizInput = CreateQuizPayload;

export const quizzesService = { ... };
```

```typescript
// ❌ BAD — duplicated interface in service
export interface QuizItem {
  id: number;
  title: string;
  // ... same fields as QuizAttributes
}
```

## 4. Enforcement Checklist

Before submitting any code:
1. Search the `model/` folder — does the type already exist?
2. If yes → import it. If no → create it in `model/`.
3. Never define `interface` or `type` blocks with field declarations inside `services/`, `components/`, `store/`, or `app/` directories for shared data contracts.
