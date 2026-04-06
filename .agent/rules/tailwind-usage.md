---
trigger: always_on
description: Tailwind CSS v4 standards — utility-first, theme variables, spacing, and layout consistency.
---

# Tailwind CSS Usage Standards

Follow these guidelines for all UI development using Tailwind CSS.

## 1. Utility-First Approach
Prefer Tailwind utility classes over custom CSS in separate files whenever possible. Only use separate CSS modules for complex animations or legacy styling compatibility.

- **✅ GOOD**: `<div className="flex flex-col items-center justify-between p-4 bg-surface rounded-lg border border-border">`
- **❌ BAD**: `<div className="custom-container">` (with styles in a .css file for standard layouts)

## 2. Using Project Theme Variables
Tailwind v4 is integrated with CSS variables. Always use the project's semantic color variables instead of hardcoded hex values or generic Tailwind colors when possible to ensure dark mode compatibility.

| Variable | Tailwind Class Equivalent | Purpose |
|----------|--------------------------|---------|
| `--color-bg` | `bg-[var(--color-bg)]` | Application background |
| `--color-fg` | `text-[var(--color-fg)]` | Main text color |
| `--color-surface` | `bg-[var(--color-surface)]` | Cards, modals, sidebars |
| `--color-border` | `border-[var(--color-border)]` | Dividers, borders |
| `--color-accent` | `text-accent`, `bg-accent` | Primary action color |

*Note: In Tailwind v4, variables defined in `@theme` are accessible via standard class names if configured.*

## 3. Responsive Design
Always design for mobile first. Use Tailwind's responsive prefixes (`sm:`, `md:`, `lg:`, `xl:`) to handle different screen sizes.

- **Mobile**: Default classes (e.g., `w-full`)
- **Tablet**: `md:` prefix (e.g., `md:w-1/2`)
- **Desktop**: `lg:` prefix (e.g., `lg:w-1/3`)

## 4. Consistent Spacing and Sizing
- Use the standard spacing scale (e.g., `p-2`, `m-4`, `gap-6`).
- For rounded corners, prefer `rounded-lg` for cards/modals and `rounded-full` for pills/buttons.
- For shadows, use `shadow-sm` or `shadow-md` for interactive elements.

## 5. Layout Patterns
- **Flexbox**: Use `flex`, `items-center`, `justify-between`, `gap-x-y`.
- **Grid**: Use `grid`, `grid-cols-N`, `gap-N`.
- For centering content: `flex items-center justify-center`.

## 6. Theme Optimization (Dark & Light)
The project uses `data-theme="dark"` on the `html` element. Styles should automatically adapt via semantic variables. Follow these rules for professional theme support:

- **Avoid Hardcoded Colors**: Never use `bg-white` or `text-black`. Use `bg-[var(--color-bg)]` and `text-[var(--color-fg)]`.
- **Surface Elevation**: In dark mode, use `--color-surface` for cards and modals to create visual depth and "elevation" against the background.
- **Subtle Borders**: Use `border-[var(--color-border)]` for dividers. It automatically adjusts opacity based on the active theme.
- **Opacity for Hierarchy**: Instead of multiple shades of gray, use opacity on the primary foreground color for secondary text (e.g., `text-[var(--color-fg)]/60`).
- **Accent Consistency**: Use `text-accent` for primary actions. The accent color is automatically tuned for optimal contrast in both themes.

---

**Summary**
- Prioritize utility classes and **semantic CSS variables**.
- Use `--color-surface` for secondary containers to maintain depth in dark mode.
- Mobile-first responsive design.
- Stick to the standard scale for spacing and rounding.
- Avoid `dark:` prefix unless semantic tokens are insufficient.
