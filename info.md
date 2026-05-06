# MMC Project Context — Research Findings

## Project Overview
Mutants × Monsters (MMC) is a browser-based, AI-assisted tabletop RPG session platform built around an original post-apocalyptic game schema. Not D&D. The platform has three jobs: (1) Run a live session, (2) Log everything into a typed event stream, (3) Export the story as an illustrated storybook PDF. The third job is the soul of the product.

## Aesthetic Direction: Hanford "Records Office"
The aesthetic is **decommissioned DOE facility records system** — as if the Office of River Protection built an internal tool and someone modded it for survivors. Direction A: "Records office" — light, paper-based, manila folders, typewriter ink, redaction bars over MK notes. Reads like declassified documents.

### Core Palette
- paper: #e8e2d0 (aged document, primary surface)
- paperShadow: #c9c2ad (shadowed paper)
- manila: #d4b97e (folder tab)
- ink: #1c1812 (typewriter ink)
- ash: #2a2724 (panel background)
- trefoilYellow: #f5c842 (radiation symbol yellow)
- trefoilMagenta: #b8336a (radiation symbol magenta)
- hazardOrange: #d97441 (tyvek suit, dosimeter warn)
- sage: #87917a (Eastern WA scrubland)
- basalt: #3a3936 (columnar basalt)
- rust: #8a4a2b (oxidized rebar)
- columbia: #4a6670 (Columbia River cold blue-grey)
- concrete: #b5b0a3 (weathered concrete)
- classified: #8b1f1f (CONFIDENTIAL stamp red)
- declassified: #1f5d3a (DECLASSIFIED stamp green)
- redactionBar: #0a0a0a (pure black bars)

### Typography
- Headers: stencil/stamped — Octin Stencil, Allerta Stencil, Rubik Mono One. Letterspacing 4-6, all caps.
- Body: JetBrains Mono or IBM Plex Mono (refined typewriter)
- Display accents: rubber-stamp font for "REDACTED" / "CONTAMINATED" / "ELIMINATED" overlays. Slightly rotated, slightly faded.

### Component Patterns
- Cards as manila folder tops with tabs
- MK notes = redaction bars in player view
- HP bar = dosimeter gauge with hazard-yellow fill, magenta when critical
- Status conditions = hazard placards (yellow-bordered tags)
- Scene panel = blueprint frame with corner reinforcements
- Title bar: "MUTANTS × MONSTERS // CASE FILE 14PN100206 // SESSION 14"
- Active player indicator: dosimeter-style pulsing badge
- Dice roll: mechanical counter / odometer style

### Texture
Single faint paper-fiber SVG overlay (5-8% opacity). One subtle coffee-ring or fold-crease per panel.

## Storybook Export Aesthetic (AD&D Hardcover)
The player storybook is treated as a printable hardcover artifact in the visual tradition of pre-3e AD&D hardcovers (Trampier, Easley, Otus). 

- 8.5×11 trim, two-column justified body in classical serif (EB Garamond or Sabon)
- Trajan/Cinzel display caps
- Drop caps starting each chapter
- Scene images full-bleed as chapter openers
- Milestones boxed with ornamental borders
- Section ornaments use radiation-trefoil fleurons
- Running heads with campaign name and page number

## Tech Stack for This Build
- React (functional components, hooks only)
- CSS-in-JS via styled-components (no Tailwind, no external CSS files)
- Vite + TypeScript
- HashRouter for static deployment

## Session Interface Structure
Three-column session layout:
- Left: Player cards (character info, HP dosimeters, conditions as hazard placards)
- Center: Scene graphic panel (blueprint frame, AI-generated scene images)
- Right: DM controls + action log (typed event stream with per-class visual treatment)

## Event Classes (9 narrative + 1 marker)
ACTION, RESOLUTION, DM_EVENT, SCENE_CHANGE, MK_NOTE, COMMENT, COMMENT_ACTION, STATUS_CHANGE, MILESTONE, SESSION_MARKER. Each renders differently. SCENE_CHANGE is the structural anchor (chapter break).

## Game Schema (NOT D&D)
Five entity types: CH (Character), Mu (Mutant), Mo (Monster), Sy (Synthetic), Hy (Hybrid).
Seven attributes: VIT (Vitality), MX (Mutation Index), REF (Reflex), BRT (Brutality), CUN (Cunning), END (Endurance), PRS (Presence).
All checks are D20 against attribute. Roll >= attribute = success. Exact match = critical.

## The Build Goal
A creative, attractive, worth-people's-time demonstration that fills in the gaps between the current prototypes and the final vision. Make it feel like opening a declassified case file from the Hanford Site. The site should showcase the aesthetic, the session interface concept, and the storybook export promise. This is an attractor surface — the thing that makes people want to play.
