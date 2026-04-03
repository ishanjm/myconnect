# API Documentation Standards

All backend API routes in the `app/api/` directory must be documented using **Swagger JSDoc** to ensure the interactive documentation remains accurate and professional.

## 1. JSDoc Block Requirement
Every exposed API method (`GET`, `POST`, `PUT`, `DELETE`) must be preceded by a Swagger JSDoc comment block.

```tsx
/**
 * @swagger
 * /api/your-endpoint:
 *   post:
 *     summary: Brief description of the action
 *     tags: [DomainName]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/YourModel'
 *     responses:
 *       201:
 *         description: Success message
 *       401:
 *         description: Unauthorized
 */
```

## 2. Common Standards
- **Tags**: Use stable, high-level tags (e.g., `Locations`, `Auth`, `Documents`) to group related endpoints.
- **Errors**: Document common error responses (400, 401, 404, 500) so frontend developers know what to expect.
- **Security**: Ensure that authentication requirements (e.g., JWT cookies) are clearly noted if the UI generator supports it.

## 3. Schemas in JSDoc
If possible, define shared components/schemas in a central location or at the top of the route file to avoid repetition.

```tsx
/**
 * @swagger
 * components:
 *   schemas:
 *     Location:
 *       type: object
 *       properties:
 *         id: { type: integer }
 *         name: { type: string }
 */
```

## 4. Updates
When modifying an API's logic or payload structure, you **must** update the corresponding JSDoc block in the same commit.
