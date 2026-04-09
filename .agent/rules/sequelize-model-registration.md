# Sequelize Model Registration Rule

All database models must be explicitly registered with the centralized synchronization system to ensure schema consistency and prevent runtime errors.

## The Rule

Whenever you create a new Sequelize model file in the `model/` directory, you **MUST** immediately add a dynamic import for it in the `syncDB` function located in `utils/db.ts`.

## Rationale
Sequelize requires models to be "registered" (defined) on the `sequelize` instance before `sequelize.sync()` is called. In a Next.js environment with hot-reloading and modular entry points, models may not be imported by the time a database operation is requested. Explicitly importing them in `syncDB` ensures:
1. The table is created if it's missing.
2. Relationships (Associations) between models are correctly established.
3. The application doesn't strike "Table not found" errors during the first API call.

## Implementation Pattern

```typescript
// utils/db.ts

export const syncDB = async (force = false) => {
  // ...
  syncPromise = (async () => {
    try {
      // ✅ ALWAYS ADD NEW MODELS HERE
      await import("../model/User");
      await import("../model/Post");
      await import("../model/YourNewModel"); // <-- Register here
      
      // ...
      await sequelize.sync({ force, alter: false });
    } catch (error) {
      // ...
    }
  })();
  // ...
};
```

## Related Standards
- See [project-standards.md](file:///c:/Ishan/developments/myconnect/.agent/rules/project-standards.md) for general Sequelize conventions.
- See [sequelize-model-management skill](file:///c:/Ishan/developments/myconnect/.agent/skills/sequelize-model-management/SKILL.md) for a guide on creating models.
