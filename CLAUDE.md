# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

SPFMatch is a React-based web application that helps users find personalized sunscreen recommendations based on their Fitzpatrick skin type and facial skin characteristics. The app features:

- **Skin Type Questionnaire**: 11-question assessment determining Fitzpatrick type (I-VI) and facial skin type (normal, oily, dry, combination, sensitive)
- **Personalized Recommendations**: Sunscreen database with 30 products matched to specific skin type combinations
- **UV-Based Reminders**: Location-aware reapplication timer using real-time UV index data
- **Educational Resources**: Curated links to authoritative sunscreen and sun protection information

## Development Commands

```bash
# Start development server with hot reload
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Run ESLint
npm run lint
```

## Tech Stack

- **Framework**: React 19.2.0 with TypeScript (TSX files)
- **Build Tool**: Vite 7.x
- **Styling**: Tailwind CSS 4.x
- **UI Components**: Radix UI primitives (Label, RadioGroup, Slot)
- **Icons**: lucide-react
- **Utilities**: class-variance-authority, tailwind-merge

## Architecture

### State Management

The application uses React's built-in state management with a single top-level `App.tsx` component managing all application state:

- `currentPage`: Navigation state (home, questionnaire, results, blogs, reminder)
- `questionnaireAnswers`: User responses to questionnaire
- `fitzpatrickType`: Calculated Fitzpatrick type (1-6) from questionnaire score

State flows down through props; actions flow up through callbacks (`onNavigate`, `onSubmit`, `onRestart`).

### Fitzpatrick Type Calculation

The questionnaire uses a scoring system:
- First 10 questions score 0-4 points per answer (total 0-40 points)
- Total score maps to Fitzpatrick types:
  - 0-7: Type I
  - 8-16: Type II
  - 17-25: Type III
  - 26-30: Type IV
  - 31-34: Type V
  - 35+: Type VI

**Important**: The calculation logic exists in TWO places and must be kept in sync:
- [App.tsx:32-73](src/App.tsx#L32-L73) - Used when navigating from questionnaire
- [ResultsPage.tsx:135-155](src/components/ResultsPage.tsx#L135-L155) - Used when rendering results

### Sunscreen Database Structure

The `sunscreenDatabase` in [ResultsPage.tsx:214](src/components/ResultsPage.tsx#L214) uses keys in the format `"{fitzpatrickType}-{skinType}"` (e.g., "3-oily", "5-sensitive"). Each recommendation includes:
- `name`, `filterType` (Mineral/Chemical), `spf`, `vehicle` (Lotion/Gel/Cream/etc.)
- `tint`, `price`, `size`, `description`
- `imageQuery` (currently unused - all display same placeholder)

### UV Reminder System

[ReminderPage.tsx](src/components/ReminderPage.tsx) implements:
1. Geolocation API to get user coordinates
2. Open-Meteo API (`https://api.open-meteo.com/v1/forecast`) to fetch current UV index
3. Dynamic timer calculation based on:
   - Base time per Fitzpatrick type (30-105 minutes)
   - UV index multipliers (0.5x for extreme, 0.7x for high, 0.85x for moderate)
4. Browser Notification API for reapplication alerts

### Component Organization

- `/src/components/` - Page-level components (HomePage, QuestionnairePage, ResultsPage, BlogsPage, ReminderPage, Navigation)
- `/src/assets/` - Reusable UI components (button, card, badge, alert, radio-group, label) and utilities
- All components use Tailwind CSS classes with shadcn/ui-style design tokens

### Questionnaire Questions

The questionnaire structure is duplicated across components. When modifying questions, update all three locations:
1. [QuestionnairePage.tsx:11-148](src/components/QuestionnairePage.tsx#L11-L148) - UI rendering
2. [ResultsPage.tsx:11-133](src/components/ResultsPage.tsx#L11-L133) - Scoring calculation
3. [App.tsx:32-56](src/components/App.tsx#L32-L56) - Navigation calculation

The 11th question (skinType) uses `types` array instead of `scores` to map answers to skin type categories.

## Key Patterns

### Navigation
Navigation is prop-drilled from `App.tsx`. Always call `onNavigate` with page strings: "home", "questionnaire", "results", "blogs", "reminder".

### Image Fallback
Use `ImageWithFallback` component for images that may fail to load - it shows a placeholder on error.

### Styling
- Use Tailwind CSS utility classes directly in components
- Leverage `cn()` utility from [assets/utils.ts](src/assets/utils.ts) for conditional class merging
- Color tokens: `primary`, `secondary`, `muted`, `accent`, `destructive`, `border`, `background`, `foreground`

### Type Safety
All components use TypeScript with explicit prop interfaces. Maintain type safety when modifying component APIs.

## External APIs

- **Open-Meteo**: No API key required, free UV index data
- **Unsplash**: Used for placeholder images (no API integration - direct URLs)

## Known Limitations

- No backend/database - all data is hardcoded in components
- Sunscreen recommendations are static (30 products total)
- UV data requires browser geolocation permission
- Timer resets on page navigation (no persistence)
- No user accounts or saved preferences
