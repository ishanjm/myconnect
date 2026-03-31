---
name: tailwind-component-ui
description: Skill for building and styling common UI components (Cards, Modals, Navbars) with Tailwind CSS v4, supporting dark mode.
---

# Tailwind CSS Component UI

Use this skill to build modern, accessible, and responsive UI components using Tailwind CSS v4 and the project's design system.

## 1. Project Design System
The project uses semantic CSS variables for consistency. Always prefer these over hardcoded Tailwind colors.

| Semantic Token | Purpose |
|----------------|---------|
| `bg-bg` / `bg-[var(--color-bg)]` | Main page background |
| `text-fg` / `text-[var(--color-fg)]` | Default text color |
| `bg-surface` / `bg-[var(--color-surface)]` | Cards, modals, sidebars |
| `border-border` / `border-[var(--color-border)]` | Borders and dividers |
| `text-accent` / `bg-accent` | Primary theme color |

## 2. Common Patterns

### Card Component
A standard card with subtle borders and surface background.

```tsx
<div id="domain-screen-card" className="bg-surface border border-border p-6 rounded-lg shadow-sm">
  <h2 className="text-xl font-semibold mb-4 text-fg">Card Title</h2>
  <div className="text-fg opacity-80">
    Card content goes here...
  </div>
</div>
```

### Flexbox Layout (Header/Footer)
```tsx
<header id="common-topbar" className="flex items-center justify-between px-6 py-4 bg-surface border-b border-border sticky top-0 z-50">
  <div className="flex items-center gap-4">
    <Logo id="common-topbar-logo" />
    <span className="font-bold text-lg">MyConnect</span>
  </div>
  <nav className="hidden md:flex items-center gap-8">
    <a href="#" className="hover:text-accent transition-colors">Dashboard</a>
    <a href="#" className="hover:text-accent transition-colors">Reports</a>
  </nav>
</header>
```

### Grid-based List
```tsx
<div id="product-list-grid" className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
  {products.map(p => (
    <ProductCard key={p.id} product={p} />
  ))}
</div>
```

### Primary Button (with Hover & Active states)
```tsx
<button
  id="domain-action-btn"
  className="bg-accent text-white px-4 py-2 rounded-lg font-medium hover:opacity-90 active:scale-95 transition-all disabled:opacity-50"
>
  Action
</button>
```

## 3. Dark Mode Compliance
The project uses `data-theme="dark"` on the `html` element. Because we use semantic variables (like `--color-bg`), the UI should switch automatically.

- **Check**: Ensure no hardcoded `bg-white` or `text-black` is used unless explicitly intended for both themes.
- **Example**: Use `bg-bg` instead of `bg-white`.

## 4. Checklist
- [ ] Uses Tailwind utility classes exclusively.
- [ ] References semantic `--color-*` variables.
- [ ] Mobile-first responsive prefixes applied.
- [ ] Interactive elements have hover/active states.
- [ ] IDs follow `{domain}-{screen}-{element}` pattern.
