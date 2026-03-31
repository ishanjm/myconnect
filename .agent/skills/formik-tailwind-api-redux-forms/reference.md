# Complex Yup Validation — Reference

Use this when building multi-step forms, conditional fields, dynamic arrays, or cross-field refinements.

---

## Conditional validation with `when()`

```ts
Yup.object({
  hasAddress: Yup.boolean(),
  street: Yup.string().when("hasAddress", {
    is: true,
    then: (s) => s.required("Street is required"),
    otherwise: (s) => s.optional(),
  }),
  city: Yup.string().when("hasAddress", {
    is: true,
    then: (s) => s.required("City is required"),
    otherwise: (s) => s.optional(),
  }),
});
```

Multiple dependencies:

```ts
Yup.string().when(["fieldA", "fieldB"], {
  is: (a, b) => a === "x" && b > 0,
  then: (s) => s.required(),
  otherwise: (s) => s.optional(),
});
```

---

## Cross-field and `ref()`

```ts
Yup.object({
  password: Yup.string().min(8).required(),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref("password")], "Passwords must match")
    .required(),
});
```

---

## Nested objects and arrays

```ts
Yup.object({
  billing: Yup.object().shape({
    name: Yup.string().required(),
    address: Yup.object().shape({
      line1: Yup.string().required(),
      city: Yup.string().required(),
      zip: Yup.string().matches(/^\d{5}(-\d{4})?$/).required(),
    }),
  }),
  items: Yup.array()
    .of(
      Yup.object().shape({
        productId: Yup.string().required(),
        quantity: Yup.number().min(1).required(),
      })
    )
    .min(1, "Add at least one item"),
});
```

---

## Custom tests and `test()`

```ts
Yup.string()
  .test("no-spaces", "Spaces not allowed", (value) => !value?.includes(" "))
  .test("unique", "Already exists", async (value) => {
    const exists = await checkExists(value);
    return !exists;
  });
```

---

## Refinements at object level

Validate the whole object after fields:

```ts
Yup.object({
  startDate: Yup.date().required(),
  endDate: Yup.date().required(),
}).refine((data) => data.endDate >= data.startDate, {
  message: "End date must be after start date",
  path: ["endDate"],
});
```

---

## Reusable schema pieces

In `common/validation.ts` or similar:

```ts
import * as Yup from "yup";

export const emailSchema = Yup.string()
  .trim()
  .email("Enter a valid email")
  .required("Email is required");

export const passwordSchema = Yup.string()
  .min(8, "At least 8 characters")
  .matches(
    /^(?=.*[A-Z])(?=.*[a-z])(?=.*[0-9])(?=.*[^0-9a-zA-Z]).*$/,
    "Include uppercase, lowercase, number, and special character"
  )
  .required("Password is required");

// Usage
Yup.object({
  email: emailSchema,
  password: passwordSchema,
  confirmPassword: Yup.string()
    .oneOf([Yup.ref("password")], "Passwords must match")
    .required(),
});
```

---

## Transform and normalize

```ts
Yup.string()
  .transform((value) => value?.trim() ?? "")
  .min(2, "At least 2 characters")
  .required();
```

---

## Lazy schema for circular or dynamic shape

```ts
const itemSchema: Yup.ObjectSchema<Item> = Yup.object().shape({
  id: Yup.string().required(),
  name: Yup.string().required(),
  children: Yup.array().of(Yup.lazy(() => itemSchema)).optional(),
});
```

Use when the shape of a field depends on itself (e.g. tree nodes).
