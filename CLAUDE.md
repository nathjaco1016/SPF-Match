# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

SPFMatch is a React-based web application that helps users determine their Fitzpatrick skin type and facial skin characteristics. The app features:

- **Skin Type Quiz**: 11-question assessment determining Fitzpatrick type (I-VI) and facial skin type (normal, oily, dry, combination, sensitive)
- **UV-Based Reminders**: Location-aware reapplication timer using real-time UV index data

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

- `currentPage`: Navigation state (home, quiz, results, resources, reminder)
- `quizAnswers`: User responses to quiz
- `fitzpatrickType`: Calculated Fitzpatrick type (1-6) from quiz score

State flows down through props; actions flow up through callbacks (`onNavigate`, `onSubmit`, `onRestart`).

### Fitzpatrick Type Calculation

The quiz uses a scoring system:
- First 10 questions score 0-4 points per answer (total 0-40 points)
- Total score maps to Fitzpatrick types:
  - 0-7: Type I
  - 8-16: Type II
  - 17-25: Type III
  - 26-30: Type IV
  - 31-34: Type V
  - 35+: Type VI

**Important**: The calculation logic is centralized in [utils/fitzpatrick.ts](src/utils/fitzpatrick.ts) and imported where needed.

### UV Reminder System

[ReminderPage.tsx](src/components/ReminderPage.tsx) implements:
1. Geolocation API to get user coordinates
2. Open-Meteo API (`https://api.open-meteo.com/v1/forecast`) to fetch current UV index
3. Dynamic timer calculation based on:
   - Base time per Fitzpatrick type (30-105 minutes)
   - UV index multipliers (0.5x for extreme, 0.7x for high, 0.85x for moderate)
4. Browser Notification API for reapplication alerts

### Component Organization

- `/src/components/` - Page-level components (HomePage, QuizPage, ResultsPage, ResourcesPage, ReminderPage, Navigation)
- `/src/constants/` - Quiz questions, skin type info, and configuration constants
- `/src/types/` - TypeScript type definitions (quiz, sunscreen, etc.)
- `/src/utils/` - Utility functions (Fitzpatrick calculation, etc.)
- `/src/assets/` - Reusable UI components (button, card, badge, alert, radio-group, label) and utilities
- All components use Tailwind CSS classes with shadcn/ui-style design tokens

### Quiz Questions

The quiz questions are centralized in [constants/quiz.ts](src/constants/quiz.ts):
- First 10 questions use `scores` array (0-4 points) for Fitzpatrick calculation
- The 11th question (skinType) uses `types` array instead of `scores` to map answers to skin type categories (normal, oily, dry, combination, sensitive)

## Key Patterns

### Navigation
Navigation is prop-drilled from `App.tsx`. Always call `onNavigate` with page strings: "home", "quiz", "results", "resources", "reminder".

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

## Known Limitations

- No backend/database
- UV data requires browser geolocation permission
- Timer resets on page navigation (no persistence)
- No user accounts or saved preferences
