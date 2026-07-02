# Dictater Design System

> The visual language for **Dictater** — a PWA for K–6 English listening, dictation, and spelling practice (Cambridge American Standard).
> Aesthetic: **bright learning-studio** — warm paper neutrals, meadow-green CTAs, calm workbook surfaces, subtle motion.

**Source of truth:** semantic direction in [`DESIGN.md`](DESIGN.md); implementation tokens live in the `:root` block of [`index.css`](index.css). This document explains what they mean and how to use them. If a value isn't a token, it shouldn't be in a component.

---

## 1. Principles

1. **Consistency over creativity** — reuse a token or an existing component class before inventing a new value. The system exists so every screen feels like one app.
2. **Tokens, not literals** — a raw `px`, `rem`, hex, or `rgba()` in a component is a smell. If you need a value the tokens don't name, add the token first.
3. **Calm, legible, kid-friendly** — the audience is 5–12 year olds doing focused listening work. Favor large tap targets, high contrast text, and motion that guides (waveform, toast) rather than distracts.
4. **Accessible by default** — every interactive element has a visible `:focus-visible` ring, an ARIA role/label, and works from the keyboard.
5. **Document everything** — if a component isn't here, it doesn't officially exist. Add it when you build it.

---

## 2. Design Tokens

### 2.1 Color — Brand

| Token | Value | Use |
|-------|-------|-----|
| `--primary` | `#6366f1` (indigo) | Primary actions, active states, focus rings |
| `--primary-hover` | `#4f46e5` | Hover end of primary gradients |
| `--primary-glow` | `rgba(99,102,241,0.15)` | Soft glow behind active/focused primary elements |
| `--accent` | `#f59e0b` (amber) | "Check answer", submit, reward/dashboard CTAs |
| `--accent-hover` | `#d97706` | Hover end of accent gradients |

### 2.2 Color — Backgrounds & Surfaces

| Token | Value | Use |
|-------|-------|-----|
| `--bg-app` | radial indigo→navy gradient | Page background |
| `--bg-deep` | `#0f172a` | Solid dark base (e.g. `<select>` menus) |
| `--bg-card` | `rgba(30,41,59,0.7)` | Glass cards |
| `--bg-elevated` | `rgba(30,41,59,0.95)` | Modals, dropdowns, toasts (more opaque = "above") |
| `--surface-1 … 4` | white @ 2% → 8% | Nested fills *on* glass (list items, control hub, pills) |
| `--surface-hover` | white @ 10% | Hover fill for surface elements |
| `--well-1 … 4` | navy @ 30% → 60% | Recessed areas — inputs, control hub, diff panels |

**Mental model:** lighter translucent white = *raised* surface; darker translucent navy = *recessed* well. Opacity is the elevation language.

### 2.3 Color — Borders & Text

| Token | Value | Use |
|-------|-------|-----|
| `--border-subtle` | white @ 5% | Hairline dividers, quiet separators |
| `--border-card` | white @ 8% | Default card / control borders |
| `--border-default` | white @ 10% | Inputs, secondary buttons |
| `--border-strong` | white @ 20% | Hover/emphasis borders |
| `--border-focus` | `#6366f1` | Focused input border |
| `--text-primary` | `#f8fafc` | Headings, body, input text |
| `--text-secondary` | `#94a3b8` | Supporting copy, labels, meta |
| `--text-muted` | `#7c8da4` | Placeholders, timestamps, fine print |
| `--text-on-accent` | `#0f172a` | Dark text on amber/light fills |

### 2.4 Color — Semantic State

| Token | Text | Background | Use |
|-------|------|-----------|-----|
| Success | `--success` `#10b981` | `--success-bg` | Correct words, high scores, success toasts |
| Error | `--error` `#ef4444` | `--error-bg` | Incorrect words, low scores, delete, error toasts |
| Warning | `--warning` `#f59e0b` | `--warning-bg` | Medium scores, cautions, warning toasts |

### 2.5 Color — Grade Accents

`--grade-k` purple · `--grade-1` cyan · `--grade-2` rose · `--grade-3` amber · `--grade-4` emerald · `--grade-5` blue · `--grade-6` pink. Used by `.badge-grade-*` chips at 10% opacity background + full-color text.

### 2.6 Typography

**Families:** `--font-heading` (Outfit) for titles/scores/headings; `--font-body` (Inter) for everything else.

| Token | Size | Typical use |
|-------|------|-------------|
| `--text-2xs` | 0.7rem | Badge meta, fine print |
| `--text-xs` | 0.75rem | Badges, footnotes |
| `--text-sm` | 0.85rem | Labels, secondary UI text |
| `--text-base` | 1rem | Body default |
| `--text-md` | 1.05rem | Input text, reading passages |
| `--text-lg` | 1.1rem | Section titles |
| `--text-xl` | 1.4rem | Card headings (h2) |
| `--text-2xl` | 1.5rem | Scores, stat figures |
| `--text-3xl` | 2.2rem | Page title (h1) |

**Weights:** `--weight-normal` 400 · `--weight-medium` 500 · `--weight-semibold` 600 · `--weight-bold` 700 · `--weight-extrabold` 800.

### 2.7 Spacing (4px base)

`--space-1` 4px · `--space-2` 8px · `--space-3` 12px · `--space-4` 16px · `--space-5` 20px · `--space-6` 24px · `--space-8` 32px.

Use for `padding`, `gap`, and `margin`. Card padding = `--space-6`; card internal gap = `--space-5`; tight inline gaps = `--space-2`.

### 2.8 Radius

`--radius-xs` 6px (chips, small controls) · `--radius-sm` 8px (list items, wells) · `--radius-md` 16px (inputs, buttons, control hub) · `--radius-lg` 24px (cards) · `--radius-pill` 9999px (pill buttons, waveform bars).

### 2.9 Elevation — Shadows & Glows

| Token | Value | Use |
|-------|-------|-----|
| `--shadow-sm` | `0 4px 12px rgba(0,0,0,.15)` | Buttons, low lift |
| `--shadow-md` | `0 8px 32px rgba(0,0,0,.2)` | Cards (rest) |
| `--shadow-lg` | `0 12px 40px rgba(0,0,0,.3)` | Cards (hover), popovers |
| `--shadow-modal` | `0 20px 50px rgba(0,0,0,.5)` | Modals, confirm dialogs |
| `--glow-primary` | `0 0 20px rgba(99,102,241,.4)` | Playing/active primary control |
| `--glow-primary-soft` | `0 0 12px var(--primary-glow)` | Active pills, focused inputs |
| `--glow-accent` | `0 4px 12px rgba(245,158,11,.25)` | Accent buttons |

### 2.10 Motion

`--transition-fast` `0.15s ease` (hovers, color/border) · `--transition-normal` `0.25s cubic-bezier(.4,0,.2,1)` (transforms, shadows, play state) · `--ease-emphasis` shared easing curve.

Named keyframes: `fadeIn`, `bounce` (waveform), `float` (badges), `toastIn` / `toastOut`.

### 2.11 Z-index (layering contract)

`--z-mask` 999 → `--z-dropdown` 1000 → `--z-modal` 1001 → `--z-toast` 2000 → `--z-confirm` 2001. Never hardcode a stacking value — pick the layer.

---

## 3. Components

Documented in the order a student meets them. Each is a CSS class in `index.css`.

### 3.1 Button

The system has **six** button roles. Pick by *intent*, not by color.

| Class | Role / Use when | Visual |
|-------|-----------------|--------|
| `.btn-primary` | Main action in a context (Load, Try Again, Dashboard) | Indigo gradient, white text, `--shadow-sm` |
| `.btn-accent` | The single most important "commit" action (Check Answer, Submit, Save) | Amber gradient, dark text, `--glow-accent` |
| `.btn-secondary` | Supporting / low-stakes (Clear, Show Original) | Translucent white fill, subtle border |
| `.pill-btn` | Toggle / filter selection (Mode, Grade, Difficulty, Speed nav) | Pill, `.active` fills indigo |
| `.btn-circle` | The dominant transport control (Play/Pause) | 54px circle; `.playing` turns indigo + glow |
| `.btn-secondary-circle` | Secondary transport / icon (Replay, Speaker) | 44px circle, outline style |

**States** (all buttons): default → hover (lift `translateY(-1px)` or `scale`, stronger shadow) → `:focus-visible` (2px `--primary` outline, 2px offset) → `.active`/`.playing` where applicable. No explicit disabled style exists yet — see §6.

**Accessibility:** every icon-only button (`.btn-circle`, `.btn-secondary-circle`) **must** have `title` + `aria-label`. Speed/grade pills use `role="radio"`/`radiogroup` with `aria-checked`.

| ✅ Do | ❌ Don't |
|------|---------|
| Use exactly one `.btn-accent` per task as the commit action | Stack two accent buttons competing for attention |
| Reuse the class and let tokens style it | Re-declare the gradient inline (the Dashboard button currently does — see §5 audit) |
| Keep icon buttons ≥ 44px for small fingers | Shrink transport controls below the tap-target floor |

### 3.2 Glass Card (`.glass-card`)

The primary surface. Frosted `--bg-card`, `blur(12px)`, `--border-card`, `--radius-lg`, `--shadow-md` (→ `--shadow-lg` on hover), `--space-6` padding, `--space-5` internal gap. The whole app is two glass cards side-by-side at ≥768px (sidebar `360px` + workspace `1fr`).

### 3.3 Pill Group & Filters (`.pill-group` + `.pill-btn`)

Wrapping flex row of toggle pills. `.active` = indigo fill + `--glow-primary-soft`. Used for Mode, Type, Grade, Difficulty, and phrase nav. Pattern: exactly one active per group (single-select).

### 3.4 Exercise List Item (`.exercise-item`)

Selectable row in a scrolling list (`.exercise-list`, `role="listbox"`). States: default (`--surface-1`) → hover (`--surface-3`) → `.active` (indigo tint + border). Carries an `.exercise-badge` (grade or difficulty).

### 3.5 Badges

- **Grade badges** `.badge-grade-K … 6` — grade color @ 10% bg + full-color text, uppercase, `--radius-xs`.
- **Difficulty badges** `.badge-diff-beginner|intermediate|advanced` — success/warning/error palette.
- **Achievement badges** `.badge-card` — dashboard collectibles; `.locked` = 30% opacity + grayscale; unlocked icons `float`.

### 3.6 Text Input (`.dictation-input`)

Textarea/input for writing area, spelling box, and custom text. Recessed `--well-2`, `--border-default`, `--radius-md`. Focus: `--border-focus` + `--well-4` bg + `--glow-primary-soft`. Placeholder uses `--text-muted`. The spelling variant centers text at `--text-2xl`.

### 3.7 Control Hub (`.control-hub`)

Recessed `--well-1` container that groups the Play/Pause circle, Replay, the **waveform visualizer** (`.waveform` — 8 bars that `bounce` when `.active`), and the speed picker. Also reused as a stat tile in the dashboard.

### 3.8 Result Card & Diff (`.result-card`, `.diff-container`, `.diff-word`)

Scoring panel. `.result-card.success` (emerald tint) / `.feedback` (neutral). Score uses `.score-high|medium|low` → success/warning/error. The **diff** marks each word `.correct` (green underline), `.incorrect` (red strikethrough), or `.missing` (dashed italic) — the core feedback mechanic.

### 3.9 Modal / Dropdown (`.settings-dropdown`)

One class powers the Settings dropdown, Lesson Creator, and Dashboard. `--bg-elevated`, `--border-strong`, `--radius-md`, `--shadow-modal`. Paired with `.modal-open-mask` (`--z-mask`, blurred backdrop). `role="dialog"` + `aria-label` required. **Known debt:** position/size are set with inline styles per instance (see §6).

### 3.10 Toast (`.toast`)

Transient feedback in `#toast-container` (`aria-live="polite"`). Variants: `.toast-success|error|warning|achievement`. Enters with `toastIn`, exits with `.toast-exit` → `toastOut`. Achievement toast uses an indigo→amber gradient.

---

## 4. Patterns

- **Two-pane workspace** — sidebar (select/configure) + workspace (practice/feedback) as sibling `.glass-card`s; collapses to one column < 768px.
- **Progressive disclosure** — `.hidden` toggles swap workspaces (passage vs word), reveal filters, peeks, and results. The system uses `display:none` via `.hidden` plus explicit `:not(.hidden){display:flex}` overrides for flex containers.
- **Listen → write → check → diff** — the core loop: transport control → input → `.btn-accent` commit → `.result-card` with word diff.
- **Reward loop** — scores log to the dashboard; streaks, accuracy, and `.badge-card` collectibles reinforce practice (kid-motivation pattern).

---

## 5. Audit

### Summary
**Components reviewed:** 10 · **Token categories:** 11 (was 5) · **Score: 72 / 100**

The system has a strong, coherent visual identity and good a11y fundamentals (focus-visible, ARIA roles, semantic landmarks). The gap is **enforcement**: tokens existed for color/font/radius/motion but not spacing, type, shadows, or z-index, so those leaked into hardcoded values — heavily via inline styles.

### Token Coverage

| Category | Tokenized? | Hardcoded instances found |
|----------|-----------|---------------------------|
| Colors | ✅ (now incl. grades, surfaces, wells) | 18 distinct hex + an 11-step `rgba(255,255,255,…)` ladder repeated ~40× across `index.css` |
| Typography (scale) | ⚠️ Added — not yet adopted | ~15 distinct `rem` font-sizes scattered inline |
| Spacing | ⚠️ Added — not yet adopted | Dozens of raw `rem` paddings/gaps, mostly inline |
| Radius | ✅ | `4 / 6 / 10 / 12 / 20px` used off-scale alongside the 8/16/24 tokens |
| Shadows | ✅ Added | 18 `box-shadow` declarations, several one-off |
| Z-index | ✅ Added | 5 raw values (999–2001) now named |

### Top issue: inline styles
**82 `style="…"` attributes** in [`index.html`](index.html) and **27 inline-style writes** in [`app.js`](app.js). These bypass the system entirely and are where most off-scale values live (e.g. the Dashboard button re-declares the `.btn-accent` gradient inline instead of using the class).

### Priority Actions
1. **Move inline styles into classes** — biggest consistency win. Each repeated inline pattern (modal sizing, stat tiles, icon-button sizing) should become a utility or component class consuming tokens.
2. **Adopt the new scales** — replace raw `rem`/`px`/`rgba` in `index.css` with `--space-*`, `--text-*`, `--surface-*`, `--shadow-*`. Values are identical, so it's a visual no-op (the `.glass-card` is already migrated as the reference example).
3. **Normalize off-scale radii** — fold `10px`/`20px` into `--radius-md`, `4px`→`--radius-xs`.
4. **Add a disabled button state** — no token/style exists; needed for "Check" before audio plays, empty inputs, etc.

---

## 6. Migration Roadmap

The foundation (§2) is in place and backward-compatible. Adopt incrementally — each step is low-risk because token values equal the literals they replace:

1. **CSS sweep (no-op):** in `index.css`, replace literal `rgba(255,255,255,x)` → `--surface-*`/`--border-*`, raw shadows → `--shadow-*`, raw radii → `--radius-*`, raw spacing → `--space-*`. ✅ `.glass-card` done as the template.
2. **Inline-style extraction:** create utility classes for the recurring inline patterns — `.modal--md`/`.modal--lg` (sizing), `.stat-tile`, `.icon-btn-sm` — and delete the `style="…"` attributes. Tackle highest-frequency patterns first.
3. **JS styling:** route the 27 `.style.x =` writes in `app.js` through class toggles (most already have a class equivalent, e.g. `.speaker-playing`).
4. **Add disabled state** to the button system and wire it to gated actions.

---

## 7. Open Questions

- Should there be a **light theme**? Tokens are structured to support one, but copy/contrast for kids needs design review.
- **Reduced-motion**: waveform/float/toast animations should respect `prefers-reduced-motion` — not yet handled.
- Do grade colors need a **WCAG contrast pass** at the 10%-bg + full-color-text combination used in badges?
