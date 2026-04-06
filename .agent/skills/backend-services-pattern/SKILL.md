---
name: backend-services-pattern
description: Guides the implementation of the Backend Services Pattern separating Next.js API Routes from business logic.
---

# Backend Services Pattern Skill

When asked to implement backend functionality, follow this skill to structure the code correctly.

## 1. Directory Setup

Ensure business logic is placed in `services/`. To prevent confusion with frontend API clients (e.g., Axios calls from React components) that also live in `services/`, all backend business logic files MUST be suffixed with `ServerService` (e.g., `postsServerService.ts`).

## 2. API Route (Controller) Responsibilities
Location: `app/api/**/route.ts`

- **Do:**
  - Call `validateToken(req)` early to ensure authentication.
  - Parse request parameters (`await params`), body (`await req.json()`), or form data.
  - Safely extract types.
  - Invoke the corresponding method from `services/*ServerService.ts`.
  - Return `NextResponse.json()` on success.
  - Catch errors and return a `NextResponse` with an appropriate HTTP status code (typically 400 for bad input, 403 for forbidden, 500 for server errors).
- **Do NOT:**
  - Instantiate/Query Sequelize models directly in the API Route unless it's a simple CRUD operation that doesn't warrant a service. (Assume complex updates or multi-table/external API calls require a service).
  - Perform cloud operations (e.g., Cloudinary uploads/deletions) directly in the route.

## 3. Server Service Responsibilities
Location: `services/exampleServerService.ts`

- **Do:**
  - Export a constant object grouping related functions, e.g., `export const serverPostsService = { ... }`.
  - Accept typed arguments (e.g., `userId: number, requestBody: CreatePostParams`).
  - Implement ownership checks (e.g., throw error if `model.userId !== userId`).
  - Query Sequelize models.
  - Wrap database operations in transactions if multiple writes occur.
  - Throw explicit JavaScript `Error` objects so the controller can catch and format them.
- **Do NOT:**
  - Import or use Next.js `Request` or `NextResponse` objects.
  - Handle cookies or direct HTTP concerns.

## Example

```typescript
// services/userServerService.ts
import { User, UserAttributes } from '@/model/User';

export const serverUserService = {
  deleteAccount: async (userId: number) => {
    const user = await User.findByPk(userId) as unknown as UserAttributes & { destroy: () => Promise<void> } | null;
    if (!user) throw new Error("User not found");
    // Perform cleanup elsewhere...
    await user.destroy();
  }
};
```
