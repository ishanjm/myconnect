# API Authentication Standard

Standard methodology for securing Next.js Route Handlers using centralized JWT validation.

## Context
To ensure consistent authentication and avoid security vulnerabilities caused by divergent implementations, all authenticated API routes must use the shared `validateToken` utility.

## Implementation Pattern

### 1. Centralized Utility
The core logic resides in `common/apiAuth.ts`. It handles cookie extraction and JWT verification.

```typescript
import { validateToken } from '@/common/apiAuth';
```

### 2. Standard Usage in Route Handlers
Every GET, POST, PUT, or DELETE handler that requires an authenticated user MUST follow this pattern:

```typescript
import { NextResponse } from 'next/server';
import { validateToken } from '@/common/apiAuth';

export async function GET(req: Request) {
  // 1. Validate the token
  const payload = await validateToken(req);
  
  // 2. Immediate 401 response if invalid
  if (!payload) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  // 3. User Payload is now available (payload.id, etc.)
  try {
    // ... logic
  } catch (error) {
    // ... error handling
  }
}
```

## Why This Matters
- **DRY (Don't Repeat Yourself)**: Changes to cookie names or verification logic only need to happen in one place.
- **Security**: Ensures no route accidentally skips the validation step.
- **Maintainability**: New developers can quickly adopt the project's security standards.
