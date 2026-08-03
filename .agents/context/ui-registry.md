## Baseline — Established 2026-07-29

[Note: This baseline was established via /imprint audit]

| Property         | Correct class/variable          |
| ---------------- | ------------------------------- |
| Card background  | `var(--bg-card)`                |
| Card border      | `1px solid var(--border-color)` |
| Card radius      | `var(--radius-xl)`              |
| Button primary   | `var(--accent)`                 |
| Button secondary | `var(--bg-secondary)`           |
| Text primary     | `var(--text-primary)`           |
| Text secondary   | `var(--text-secondary)`         |
| Text muted       | `var(--text-tertiary)`          |
| Input background | `var(--bg-card)`                |
| Input border     | `1px solid var(--border-color)` |
| Category Pills   | `border-radius: var(--radius-full)`, `border: 1px solid var(--border-color)`, `bg: var(--bg-card)` |
| Badge            | `position: absolute`, `background: rgba(...)` |
| Image Carousel   | `display: flex; overflow-x: scroll; snap-type: x mandatory` |
| Essential Grid   | `display: grid; grid-template-columns: repeat(3, 1fr); gap: var(--space-lg)` |

**Pattern notes:**
- Backgrounds must use semantic tokens like `--bg-primary`, `--bg-secondary`, `--bg-card` instead of hardcoded hex values (e.g. `#fff`, `#f8f9fa`).
- Border radii should strictly map to the `--radius-*` scale defined in `index.css`.
- Text colors must use `--text-primary`, `--text-secondary`, `--text-tertiary`, or theme colors like `--accent`, `--danger`.
- Spacing (padding/gap/margin) should map to the `--space-*` scale defined in `index.css`.
- No hardcoded pixel padding or margin unless absolutely necessary for micro-adjustments not covered by the scale.

---

### ActivityCard

File: `src/components/ActivityCard.tsx`
Last updated: 2026-08-03

| Property         | Class / Variable           |
| ---------------- | -------------------------- |
| Background       | `var(--bg-card)`           |
| Border           | `1px solid var(--border-color)` |
| Border radius    | `var(--radius-xl)`         |
| Text — primary   | `var(--text-primary)`      |
| Text — secondary | `var(--text-secondary)`    |
| Spacing          | `gap: var(--space-xs)`     |
| Hover state      | `transform: translateY(-4px)`, `box-shadow: var(--shadow-lg)` |

**Pattern notes:**
The Activity Card relies on CSS variables for borders and backgrounds. Hover states lift the card slightly using `transform: translateY(-4px)` with a smooth transition (`0.3s ease`). The favorite button uses an absolute positioned circle in the top right corner.

---

### ActivityDetail

File: `src/components/ActivityDetail.tsx`
Last updated: 2026-08-03

| Property         | Class / Variable           |
| ---------------- | -------------------------- |
| Background       | `var(--bg-card)`           |
| Border radius    | `var(--radius-xl)` (gallery images) |
| Text — primary   | `var(--text-primary)`      |
| Text — secondary | `var(--text-secondary)`    |
| Spacing          | `gap: var(--space-lg)`, `padding: var(--space-md)` |
| Buttons          | `border-radius: var(--radius-full)` |

**Pattern notes:**
Activity Details uses a two-column grid layout for desktop (`content-layout-grid`). The sidebar is styled as a booking card with a primary action button spanning full width (`btn-reserve-now`). Images in the gallery have a standard `12px` or `var(--radius-xl)` border radius.

---

### SearchPage (Filter Chips)

File: `src/components/SearchPage.tsx`
Last updated: 2026-08-03

| Property         | Class / Variable           |
| ---------------- | -------------------------- |
| Background       | `var(--bg-card)`           |
| Border           | `1px solid var(--border-color)` |
| Border radius    | `var(--radius-full)`       |
| Active state     | `border-color: #000`, `background-color: var(--bg-secondary)` |
| Spacing          | `padding: 0.5rem 1rem`     |

**Pattern notes:**
Filter chips (categories like Outdoors, Food, etc.) use a fully rounded border (`var(--radius-full)`) and change their border color to black on active/selected state, keeping consistency with the TripAdvisor-like design language.
