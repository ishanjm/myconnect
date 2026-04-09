---
name: sequelize-model-management
description: Skill for defining, registering, and managing Sequelize ORM models to ensure database consistency.
---

# Sequelize Model Management Skill

Follow this guide to professionally add and register new database models in the project.

## 1. Defining the Model
Create a new file in `model/YourModel.ts`. Use the functional `define` pattern (No Classes).

```typescript
import { DataTypes, Model, Optional } from "sequelize";
import { sequelize } from "../utils/db";

export interface YourModelAttributes {
  id: number;
  name: string;
  // ...
  createdAt?: Date;
  updatedAt?: Date;
}

export type YourModelCreationAttributes = Optional<YourModelAttributes, "id">;

export const YourModel = sequelize.define<Model<YourModelAttributes, YourModelCreationAttributes>>(
  "your_model_table_name",
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    // ...
  }
);
```

## 2. Mandatory Registration (Crucial)
After defining your model, you **MUST** register it in `utils/db.ts` within the `syncDB` function. This ensures that the model is loaded into memory before the database syncs.

1. Open `utils/db.ts`.
2. Find the `syncDB` function.
3. Add a dynamic import for your new model:

```typescript
// utils/db.ts
export const syncDB = async (force = false) => {
  // ...
  syncPromise = (async () => {
    try {
      await import("../model/User");
      await import("../model/Post");
      await import("../model/YourNewModel"); // <--- Add this!
      // ...
```

## 3. Handling Schema Changes
By default, `alter` is set to `false` in `syncDB` to prevent index bloat. If you add a new column or table:

1. Temporarily change `alter: false` to `alter: true` in `utils/db.ts`.
2. Start the dev server once to apply the change.
3. Change it back to `alter: false` to protect the database.

## 4. Troubleshooting
If you see "Table 'table_name' doesn't exist", double check that:
- The model is imported in `syncDB`.
- `syncDB()` or `ensureDbInitialized()` is called at the top of your API route or service.
