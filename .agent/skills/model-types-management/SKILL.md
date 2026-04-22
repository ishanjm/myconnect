---
name: model-types-management
description: Skill for defining, organizing, and reusing TypeScript types/interfaces in the model folder. Ensures single source of truth and prevents duplication.
---

# Model Types Management Skill

Follow this guide whenever you need to create, modify, or reference types and interfaces in this project.

## 1. The Golden Rule

> **Every shared type/interface is defined ONCE in `model/` and imported everywhere else.**

Never define an `interface` or `type` with field declarations in `services/`, `components/`, `store/`, or `app/` directories.

## 2. Creating a New Type

### Step 1 — Check if it exists
Search the `model/` folder first. If the type already exists, import it.

### Step 2 — Define in the right file
- If the type is related to a Sequelize model → add it to that model's file (e.g., `model/Quiz.ts`)
- If the type is a standalone data contract → create a new file in `model/` (e.g., `model/Report.ts`)
- If the type is an enum or constant → put it in `common/*.constants.ts`

### Step 3 — Export it
```typescript
// model/Quiz.ts
export interface QuizAttributes { ... }
export type CreateQuizPayload = { ... };
```

## 3. Using Types in Services

Services should **never** define their own interfaces. Instead:

```typescript
// ✅ GOOD — Import + alias
import { QuizAttributes, CreateQuizPayload } from "@/model/Quiz";

export type QuizItem = QuizAttributes;
export type CreateQuizInput = CreateQuizPayload;
```

```typescript
// ✅ GOOD — Derived type using Omit/Pick
import { QuizAttemptAttributes } from "@/model/QuizAttempt";

export type SaveQuizAttemptInput = Omit<QuizAttemptAttributes, 'id' | 'userId' | 'createdAt' | 'updatedAt'>;
```

```typescript
// ❌ BAD — Duplicated interface
export interface QuizItem {
  id: number;
  title: string;
  // ... copy-pasted fields
}
```

## 4. Using Types in Components / Pages

```typescript
// ✅ GOOD — Import from model or re-exported from service
import { QuizItem } from "@/services/quizzesService";
// or directly:
import { QuizAttributes } from "@/model/Quiz";
```

## 5. Re-exporting for Convenience

Services may re-export model types so consumers don't need to know where the source is:

```typescript
// services/quizzesService.ts
export type { QuizAttemptAnswer, QuizQuestion };
```

This allows `import { QuizAttemptAnswer } from "@/services/quizzesService"` to work without breaking the single-source rule.

## 6. Checklist Before Every Change

- [ ] Is the type already in `model/`? → Import it
- [ ] Does the service define its own `interface`? → Replace with import + alias
- [ ] Are there field-level duplicates between files? → Consolidate to `model/`
- [ ] Does the new type belong to an existing model file? → Add it there
- [ ] Is the type truly standalone? → Create a new file in `model/`
