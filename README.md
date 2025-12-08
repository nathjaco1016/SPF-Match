# SPFMatch
<img src="public/images/logo.png" alt='SPFMatch Sun Logo' width="200">

In many underserved and minority skin communities, the risk of UV-related damage is high. However, finding sunscreen that truly matches their complexion is difficult as they are not the focus of much research in the field. To address this gap, SPFMatch is an accessible tool focused on helping people of color discover sunscreen products that meet their unique needs.

The application provides personalized sunscreen recommendations by considering skin tone, sensitivity, lifestyle, and user preferences. Instead of relying on trial and error or unclear marketing, users will receive guidance that helps them make informed decisions about their health. Our goal is to make the process simple, intuitive, and empowering so that users feel confident in protecting their skin.

Visit our [project website](https://sites.google.com/view/spfmatch) to learn more about the team behind SPFMatch as well as the development process!

# Access
SPFMatch is accessible at [spfmatch.com](https://spfmatch.com).

For development, clone the repository. Run `npm run dev` in the root folder to start the development server.

# Architecture
<img src="public/images/architectureDiagram.png" alt='SPFMatch Sun Logo'>

## Frontend (React, Vite, Tailwind CSS)

### Structure

The application is organized into several key modules:

**Core Application (`App.tsx`)**
- Single-page application with centralized state management
- Manages navigation between pages (home, quiz, results, resources, reminder)
- Stores quiz answers and calculated Fitzpatrick type
- Passes state and callbacks down through props

**Components (`/src/components/`)**
- `HomePage` - Landing page with application introduction
- `QuizPage` - 11-question assessment for skin type determination
- `ResultsPage` - Displays personalized sunscreen recommendations
- `ResourcesPage` - Educational resources about sun protection
- `ReminderPage` - UV-based reapplication timer with geolocation
- `Navigation` - Shared navigation bar across all pages

**Constants & Configuration (`/src/constants/`)**
- `quiz.ts` - Question definitions and scoring system
- `skinTypes.ts` - Skin type information and characteristics

**Utilities (`/src/utils/`)**
- `fitzpatrick.ts` - Fitzpatrick type calculation logic
- Scoring algorithm maps quiz responses (0-40 points) to types I-VI

**UI Components (`/src/assets/`)**
- Reusable shadcn/ui-style components (button, card, badge, alert)
- Tailwind CSS utility functions

**Types (`/src/types/`)**
- TypeScript interfaces for quiz, sunscreen products, and resources
- Ensures type safety across the application

### Data Flow

1. User takes quiz → `QuizPage` collects answers
2. Answers passed to `fitzpatrick.ts` → calculates Fitzpatrick type
3. Type and skin characteristics → `ResultsPage` filters recommendations
4. Recommendations sourced from `/public/data/sunscreen-database.json` (synced from Google Sheets)

### Programming Languages

- **TypeScript** - Primary language for type-safe React components
- **HTML** - JSX/TSX markup within React components
- **CSS** - Tailwind CSS utility classes for styling

## Backend (Google Apps Script + GitHub Actions)

### Structure

The backend uses a serverless architecture with Google Apps Script for triggers and GitHub Actions for data processing:

**Google Apps Script**
- Manual trigger functions for syncing data from Google Sheets
- Sends `repository_dispatch` events to GitHub Actions workflows
- Functions: `triggerGitHubSync()`, `triggerResourcesSync()`, `triggerFullSync()`

**GitHub Actions Workflows (`/.github/workflows/`)**

**Sync Workflows:**
- `sync-sunscreen-data.yml` - Fetches sunscreen data from Google Sheets
- `sync-resources.yml` - Fetches educational resources from Google Sheets
- Transform scripts (`/.github/scripts/`) convert sheet data to JSON
- Commits transformed data back to repository
- Includes retry logic for handling race conditions

**Deploy Workflow:**
- `deploy.yml` - Builds and deploys to GitHub Pages
- Triggered by: pushes to main, manual dispatch, sync workflow completions
- Builds Vite app and uploads to GitHub Pages

**Data Transformation Scripts (`/.github/scripts/`)**
- `transform-sunscreen-data.cjs` - Parses sunscreen sheet, groups by Fitzpatrick type and skin type
- `transform-resources.cjs` - Parses resources sheet into simple title/link format
- Output: Static JSON files in `/public/data/`

### Data Pipeline

```
Google Sheets → Apps Script → GitHub API (repository_dispatch)
    ↓
GitHub Actions (fetch & transform) → Commit JSON → Push to main
    ↓
Deploy Workflow → Build Vite App → GitHub Pages
```

### Security

- **API keys stored as GitHub Secrets** - Not exposed in frontend code
- **Static JSON generation** - No runtime API calls from browser
- **GitHub PAT** - Secured in Google Apps Script (not committed)
- **Repository dispatch** - Secure trigger mechanism between services

### Programming Languages

- **JavaScript** - Google Apps Script for triggers
- **JavaScript (Node.js)** - GitHub Actions transformation scripts
- **Shell/Bash** - GitHub Actions workflow orchestration

# Testing
## Unit Testing
This project includes a lightweight custom test runner that verifies the core logic for:

- Fitzpatrick skin type scoring  
- Skin type extraction  
- UV reapplication timing rules

### Tests

#### Fitzpatrick Scoring & Classification
- Score boundaries for all Fitzpatrick types (I–VI)  
- Correct mapping from numeric score → skin type  
- Threshold edge cases  

#### Skin Type Extraction
- Oily, dry, combination, and sensitive facial skin types
- Default normal skin when no category matches  

#### UV Reapplication Logic
- Correct lookup for UV categories  
- Correct reapplication intervals  
- Boundary conditions for min/max UV values  

#### Additional Validation
- Consistency of configuration tables  
- Randomized integrity checks

### Execution
Run `node src/tests.ts`

### Success Criteria
If all tests pass, the test runner will display:
```bash
==================================================
📊 Test Summary: 10/10 tests passed
✅ All tests passed!
==================================================
```

If any tests fail, the summary will instead show the number of failed tests, for example:
```bash
==================================================
📊 Test Summary: 8/10 tests passed
❌ 2 test(s) failed
==================================================
```

## Integration Testing
### Tests

**TC-01: Complete Quiz Flow**
- Navigate to home → take quiz → answer 11 questions → verify results display
- Expected: Correct Fitzpatrick type and skin type shown

**TC-02: Results for All Fitzpatrick Types**
- Complete quiz 6 times targeting each type (I-VI)
- Expected: Each type displays correct information and sunscreen recommendations

**TC-03: UV Reminder Timer**
- Navigate to Reminder → allow geolocation → start timer
- Expected: UV index fetched, timer starts and counts down correctly

**TC-04: Navigation**
- Test all page navigation (Home, Quiz, Results, Resources, Reminder)
- Expected: All routes work, state preserved

**TC-05: Mobile Responsive**
- Test on iPhone 14 viewport (390×844)
- Expected: All elements functional and readable

### Execution
1. Run: `npm run dev`
2. Open http://localhost:5173/
3. Execute TC-01 through TC-05

## Performance Testing

**Platforms**

Browsers:
- Chrome
- Firefox
- Safari
- Edge

Devices:
- Desktop
- Tablet
- Smartphone

**Execution**
1. Open Chrome DevTools (F12)
2. Navigate to Lighthouse tab
3. Run performance audit
4. Record scores

**Success Criteria**
- Initial load: < 3 seconds
- Performance score: > 80

## Acceptance Testing

**Who**: Users with different skin tones and tech experience

**Tasks**
1. Complete quiz without guidance
2. Review and understand results
3. Explore sunscreen recommendations
4. Set reminder timer

**Success Criteria**
- 90% complete quiz without help
- 90% understand results

## Tools
- Node.js: Unit Testing
- Google Chrome: Integration Testing, Acceptance Testing
- Chrome DevTools: Performance Testing

## Test Completion Criteria

- [ ] All unit tests pass
- [ ] All integration tests pass
- [ ] All performance tests pass
- [ ] All acceptance tests pass
- [ ] No critical bugs reported