# Theme Optimization Skill

Guidelines and techniques for building professional dark and light theme-compliant UIs using a semantic token-based approach.

## 1. Using Semantic Variables
Always map your UI components to the project's semantic variables rather than hardcoded hex values or standard Tailwind colors.

| Component | Variable | Purpose |
| --- | --- | --- |
| Page Body / Backdrop | `--color-bg` | The base backgound layer. |
| Text / Primary Content | `--color-fg` | The primary text color. |
| Cards / Modals / Sidebars | `--color-surface` | Creates a lifted, higher-elevation surface. |
| Dividers / Outlines | `--color-border` | Subtle separation of elements. |
| Buttons / Links / Active States | `--color-accent` | Primary brand/action color. |

## 2. Advanced Techniques

### A. Surface Elevation
In dark mode, "closer" elements should be lighter.
- **Background**: `--color-bg` (Darkest)
- **Cards/Popups**: `--color-surface` (Slightly lighter)
- **Active Overlay**: Use `bg-white/[0.05]` or similar low-opacity overlays on top of the surface.

### B. Opacity-Based Hierarchy
Instead of using different shades of gray (which break theme consistency), use the foreground color with varying opacity:
- **Primary Text**: `text-[var(--color-fg)]` (100% opacity)
- **Secondary Text (Description)**: `text-[var(--color-fg)]/60` (60% opacity)
- **Muted Text (Metadata)**: `text-[var(--color-fg)]/30` (30% opacity)

### C. Image Theming
Handle images that don't look good in both modes:
- **Logo/Icons**: Use SVGs with `currentColor` or the semantic token variables.
- **Themed Filters**: For certain images/icons that only exist in one version, use `dark:invert` or similar filters if appropriate.

## 3. Reference Implementation
```tsx
<div className="bg-[var(--color-surface)] border border-[var(--color-border)] rounded-xl p-4 shadow-md">
  <h2 className="text-[var(--color-fg)] font-bold mb-2">
    Themed Component
  </h2>
  <p className="text-[var(--color-fg)]/60 text-sm">
    This component adapts automatically to dark and light modes.
  </p>
  <button className="mt-4 px-4 py-2 bg-accent text-white rounded-lg hover:brightness-110">
    Action
  </button>
</div>
```
