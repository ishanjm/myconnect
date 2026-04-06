---
trigger: always_on
description: Backend Services Pattern — Separate Next.js API Route Handlers (controllers) from business logic (Server Services)
---

# Backend Services Pattern

As of modern updates to this repository, we enforce a strict separation between **API Route Handlers (Controllers)** and **Backend Business Logic (Services)**. 

## 1. The Separation of Concerns

- **API Route (`app/api/**/route.ts`)**: Acts purely as a controller. It should:
  1. Authenticate the user (e.g., via `validateToken`).
  2. Parse and validate the incoming request (body, params, formData).
  3. Call the appropriate method on a **Server Service**.
  4. Return the appropriate HTTP Response (e.g., `NextResponse.json`).
  5. Intercept standard errors and map them to HTTP status codes.

- **Server Service (`services/*ServerService.ts`)**: Contains all business logic, database queries, external API calls, and validation rules. It should:
  1. Have no knowledge of `Request` or `NextResponse` objects.
  2. Accept typed arguments.
  3. Perform database operations using Sequelize models.
  4. Throw standard Node errors or custom Error classes with explicit messages so the API Route can catch them.

## 2. Directory Structure

Frontend (client) services are located in `/services/`.
Backend (server) services must be placed in `/services/`. To avoid naming collisions, backend services MUST be suffixed with `ServerService` (e.g., `postsServerService.ts`).

## 3. Creating a Server Service

When writing complex business logic (like deleting a post with associated Cloudinary images, or generating standard reports), do not bloat the `route.ts`. Instead:

```typescript
// services/exampleServerService.ts
export const exampleServerService = {
  processBusinessLogic: async (userId: number, dataId: number) => {
    // Database calls, Cloudinary cleanup, etc.
    if (!isValid) throw new Error("Validation Failed");
  }
}
```

```typescript
// app/api/example/route.ts
import { exampleServerService } from '@/services/exampleServerService';

export async function POST(req: Request) {
  // Parsing and Authentication...
  try {
    await exampleServerService.processBusinessLogic(userId, dataId);
    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
}
```

Always use this pattern when adding multi-step implementations to backend APIs!
