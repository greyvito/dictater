# Design System: Dictater UI/UX Revamp

## 1. Visual Theme & Atmosphere
A calm, bright learning-studio interface for primary school listening practice. The atmosphere should feel focused, warm, and capable rather than gamey or sci-fi: soft daylight surfaces, structured whitespace, tactile controls, and subtle motion that rewards progress without hijacking attention. Density sits at 5/10 so the product can show filters, playback tools, writing space, and feedback at once without feeling cramped. Variance sits at 6/10: the layout should be asymmetric and editorial, but still predictable enough for children and parents. Motion sits at 5/10: every interaction has soft spring feedback, staggered reveals, and tiny perpetual cues on active listening controls, but nothing flashy or noisy.

The first screen should not look like a generic dashboard. The hero should act like a teaching desk: left-aligned headline, one compact supporting paragraph, one primary action, and one inline visual chip or rounded photo embedded between headline words to make the brand memorable. No overlapping layers. No centered billboard hero. No decorative scroll prompts.

## 2. Color Palette & Roles
- **Paper Canvas** (`#F6F3EE`) — Primary app background, full-page canvas, large empty areas
- **Warm Chalk** (`#FFFCF7`) — Elevated panels, cards, modal fills, writing surfaces
- **Soft Linen** (`#EFE7DA`) — Secondary surfaces, segmented controls, recessed containers
- **Studio Ink** (`#1F2933`) — Primary text, icons, core UI strokes, off-black replacement
- **Slate Lesson** (`#667085`) — Secondary text, labels, helper copy, inactive metadata
- **Quiet Rule** (`rgba(31, 41, 51, 0.10)`) — Borders, dividers, table rules, structured separators
- **Meadow Signal** (`#5E8E63`) — Single accent for CTA buttons, focus rings, active playback, success emphasis
- **Warm Gold** (`#C9A45C`) — Non-primary highlight used only for achievements, streak moments, and small celebratory details
- **Rose Correction** (`#C46B5D`) — Inline error state, incorrect word markers, destructive actions

Palette rules:
- Use one true accent only: **Meadow Signal**. Gold is not a CTA color.
- Keep the whole app on warm neutrals. Do not mix cool grays into one section and warm creams into another.
- Never use pure black (`#000000`).
- Never use purple/blue neon gradients, glows, or cyberpunk contrast ramps.

## 3. Typography Rules
- **Display:** `Cabinet Grotesk`, `Geist`, `Arial`, `sans-serif` — Track-tight (`-0.03em`), controlled scale, used for page headlines, section anchors, and major score moments. The tone is smart and modern, not cartoonish.
- **Body:** `Geist`, `Arial`, `sans-serif` — Relaxed leading (`1.55` to `1.7`), max line length `65ch`, used for instructions, explanations, filters, and passage helper copy.
- **Mono:** `Geist Mono`, `JetBrains Mono`, `monospace` — Used for progress counters, word counts, streak numbers, phrase indexes, and timing/speed controls.

Scale guidance:
- Hero headline: `clamp(2.75rem, 6vw, 4.75rem)`
- Page title: `clamp(2rem, 4vw, 3rem)`
- Section heading: `1.125rem` to `1.25rem`
- Body: `1rem`
- Supporting meta: `0.925rem`
- Fine utility text: `0.825rem`

Banned:
- No `Inter`
- No generic serif fonts
- No giant gradient-filled headlines
- No all-caps overload for major sections

## 4. Hero Direction
The landing header should be left-aligned and asymmetric. Use a two-column composition on desktop:
- Left: headline, short promise, single CTA
- Right: a preview composition of the listening workspace with one rounded inline image or illustration fragment placed between headline words or inside a floating proof card

Hero headline direction:
- “Listen, write, and catch every word.”
- A tiny rounded classroom or notebook visual may sit inline between “write” and “and” at text height

Hero rules:
- Maximum one primary CTA
- No secondary “Learn more”
- No centered hero when desktop width is available
- No overlap between text and image blocks
- No filler copy like “scroll to explore”

## 5. Component Stylings
* **Buttons:** Rounded-rectangle buttons (`18px` radius) with gentle weight, not pills by default. Primary uses `#5E8E63` fill with `#FFFCF7` text. Active state translates `1px` down with slightly darker fill. Secondary buttons are chalk-fill with visible border and ink text. No outer glow, no neon shadows, no icon-only buttons under `44px`.
* **Segmented Controls / Filters:** Use quiet, tactile segmented rows instead of glowing pills. Active segment gets meadow fill or soft linen fill with strong border depending on context. Grade and difficulty chips can vary by subtle border tint, but not by rainbow fills.
* **Cards:** Large rounded panels (`28px` radius) with low-contrast warm shadow tinted toward the canvas (`0 12px 30px rgba(95, 74, 44, 0.08)`). Use cards for meaningful hierarchy only. In dense sub-areas, switch to border-top dividers and spacing instead of stacking many cards.
* **Writing Areas:** Writing boxes should resemble premium workbook paper: warm surface, visible border, generous inset padding (`20px` to `24px`), label above, helper text below. Focus state uses a 2px meadow ring and slight surface brightening.
* **Playback Controls:** The main play button should feel tactile and obvious, with a strong filled circular or rounded-square form. The waveform should be minimal and elegant, using four to six bars or dots, not a loud equalizer. Speed controls should read like tool toggles, not novelty badges.
* **Diff / Feedback Markers:** Correct words should use meadow underline or soft highlight. Incorrect words should use rose underline and helper correction note. Missing words should use muted dashed styling. Avoid harsh red/green full-background chips across large text blocks.
* **Dashboard / Progress Tiles:** Replace glossy stats cards with notebook-like metric tiles. Accuracy, streak, and completed sessions should use large mono numerals with quiet labels. Achievement states can use gold micro-accents, stamped icons, or tiny ribbon motifs instead of glowing badges.
* **Inputs / Forms:** Labels above input, helper text optional, error text below. No floating labels. Keep input groups vertical and predictable.
* **Loaders:** Use skeletal placeholders shaped like the actual lesson list, writing area, and dashboard tiles. No circular spinners.
* **Empty States:** Use composed empty states that show the next best action: for example, “Paste a short passage to start a custom lesson” paired with a sample card or tiny illustration.
* **Error States:** Inline, specific, and calm. Errors should explain how to recover without sounding punitive.

## 6. Layout Principles
Use a contained grid-first layout with `max-width: 1400px` and generous outer padding. Desktop should feel like a teaching workspace, not a generic two-pane admin dashboard.

Layout rules:
- Keep a left utility rail for mode, filters, and saved lessons, but soften it into a structured column rather than a dark sidebar slab
- Main lesson area should dominate width and include clear subzones: title/meta, listening controls, writing area, feedback/results
- Replace equal-weight card repetition with asymmetric grouping: larger lesson panel, smaller supporting tiles, occasional horizontal strips
- For the dashboard, avoid “3 equal cards in a row.” Use one wide progress summary, then a mixed grid or vertical rhythm for stats and achievements
- Use CSS Grid rather than flexbox percentage hacks
- Full-height sections must use `min-h-[100dvh]`, never `h-screen`
- No overlapping decorative layers, floating blobs, or absolute-positioned content that crowds the reading path

Spacing philosophy:
- Section gaps: `clamp(3rem, 7vw, 5.5rem)`
- Panel padding: `clamp(1.25rem, 2vw, 2rem)`
- Tight UI gaps: `0.5rem`
- Default component gap: `0.875rem` to `1rem`

## 7. Responsive Rules
- Below `768px`, all multi-column layouts collapse to one column with the lesson workspace first and filters/settings moved below or into collapsible drawers
- No horizontal scroll under any condition
- Hero inline image drops below headline on mobile
- Playback controls stack cleanly and keep every touch target at least `44px`
- Writing area should remain dominant on mobile; secondary stats and dashboard panels move lower in the flow
- Typography scales with `clamp()` and body text never drops below `1rem`
- Sticky or floating controls should be used sparingly and only if they preserve writing space

## 8. Motion & Interaction
Motion should feel soft, weighty, and instructional.

Defaults:
- Spring physics: `stiffness: 100`, `damping: 20`
- Transitions: `180ms` to `280ms`
- Animate only `transform` and `opacity`

Behavior rules:
- Stagger in exercise lists, saved lessons, and dashboard logs with short cascade delays
- Main play button gets a perpetual micro-pulse only when audio is active
- Waveform bars use subtle breathing motion during playback
- Success feedback can briefly lift and settle; do not burst, flash, or confetti-spam
- Dashboard counters can roll upward once on reveal, then rest
- Respect `prefers-reduced-motion` by disabling perpetual loops and reducing transforms

## 9. UX Revamp Priorities
1. Recast the first impression from “dark app dashboard” to “guided learning studio” with a left-aligned editorial hero and brighter working surfaces.
2. Simplify the decision path: mode, type, and level should feel like a short setup ritual rather than a wall of pills.
3. Make the writing area the clear center of gravity. It should be the largest and calmest surface on the page.
4. Turn feedback into a teaching aid, not a diagnostic wall: highlight mistakes inline, explain them simply, and surface next actions immediately.
5. Make the student dashboard feel like progress journaling rather than a gamified achievement vault.
6. Reduce visual noise from too many inline micro-styles, gradients, and badge colors. Standardize on a small set of component shapes and quiet dividers.

## 10. Anti-Patterns (Banned)
- No emojis anywhere
- No `Inter`
- No generic serif fonts
- No pure black (`#000000`)
- No neon or outer glow shadows
- No purple/blue futuristic gradients
- No oversaturated accents
- No giant gradient text headers
- No custom mouse cursors
- No overlapping elements
- No equal three-column feature or stats rows
- No generic placeholder names like “John Doe” or “Acme”
- No fake round-number claims like `99.99% accuracy`
- No AI copywriting clichés such as “Elevate”, “Seamless”, “Unleash”, or “Next-Gen”
- No filler UI text like “Scroll to explore”
- No broken stock-image links
- No centered desktop hero
- No rainbow badge systems for grade filters
- No glossy glassmorphism surfaces for the primary revamp direction
