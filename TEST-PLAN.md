# SPFMatch Test Plan

**Project**: SPFMatch - Fitzpatrick Skin Type Assessment Application
**Version**: 1.0
**Date**: November 29, 2025
**Author**: Nathan Jacobs

---

## Table of Contents

1. [Part 1: Ideal Test Plan (With Unlimited Resources)](#part-1-ideal-test-plan-with-unlimited-resources)
2. [Part 2: Actual Test Plan (What Will Be Tested)](#part-2-actual-test-plan-what-will-be-tested)
3. [Test Execution Guide](#test-execution-guide)
4. [Test Data and Oracles](#test-data-and-oracles)

---

## Part 1: Ideal Test Plan (With Unlimited Resources)

### 1.1 Unit Testing

**Scope**: Test all individual functions and components in isolation

- **Fitzpatrick Calculation Logic** (`utils/fitzpatrick.ts`)
  - Test all 6 Fitzpatrick types with boundary conditions
  - Test edge cases: empty answers, partial answers, invalid answers
  - Test score thresholds at exact boundary values (7, 16, 25, 30, 34)
  - Test off-by-one errors in scoring

- **Skin Type Extraction** (`utils/fitzpatrick.ts`)
  - Test all 5 skin types (normal, oily, dry, combination, sensitive)
  - Test default fallback behavior
  - Test with missing skinType answer

- **Component Unit Tests**
  - QuizPage: Answer selection, validation, submission
  - ResultsPage: Correct display of results, sunscreen recommendations
  - ReminderPage: Timer calculations, UV index integration, notifications
  - Navigation: Route handling, state persistence
  - HomePage: Initial state, navigation triggers
  - ResourcesPage: Content rendering

- **UV Index Integration**
  - Mock API responses from Open-Meteo
  - Test all UV index levels (Low, Moderate, High, Very High, Extreme)
  - Test timer calculation multipliers for each Fitzpatrick type
  - Test geolocation error handling
  - Test offline/network failure scenarios

**Tools**: Jest, React Testing Library, Vitest
**Coverage Goal**: 95%+ code coverage

### 1.2 Integration Testing

**Scope**: Test interactions between components and systems

- **Quiz Flow Integration**
  - Complete quiz from start to finish
  - Test state persistence between pages
  - Test answer validation across all questions
  - Test navigation between quiz pages
  - Test restart functionality

- **Results and Recommendations Integration**
  - Verify correct sunscreen filtering based on Fitzpatrick type + skin type
  - Test all 30 combinations (6 Fitzpatrick types × 5 skin types)
  - Verify sunscreen database loading and parsing
  - Test image loading with fallback behavior

- **Timer and Notification Integration**
  - Test browser Notification API permission flow
  - Test timer persistence across page navigation
  - Test timer completion and notification delivery
  - Test timer reset functionality
  - Test multiple timer sessions

- **Routing Integration**
  - Test HashRouter navigation
  - Test protected routes (results page without quiz completion)
  - Test deep linking
  - Test browser back/forward buttons

**Tools**: Cypress, Playwright, or Selenium for E2E testing

### 1.3 System Testing (UI)

**Scope**: Test complete system functionality in realistic environments

**Browser Compatibility Testing**:
- Chrome (latest, 2 previous versions)
- Firefox (latest, 2 previous versions)
- Safari (latest, 2 previous versions)
- Edge (latest)
- Mobile Safari (iOS 15+)
- Chrome Mobile (Android 10+)

**Device Testing**:
- Desktop: 1920×1080, 1366×768, 2560×1440
- Tablet: iPad (768×1024), iPad Pro (1024×1366)
- Mobile: iPhone 12/13/14 (390×844), Samsung Galaxy (360×640)

**Operating Systems**:
- macOS (Ventura, Sonoma)
- Windows (10, 11)
- iOS (15, 16, 17)
- Android (10, 11, 12, 13)

**Accessibility Testing**:
- Screen reader compatibility (NVDA, JAWS, VoiceOver)
- Keyboard navigation (tab order, focus indicators)
- Color contrast ratios (WCAG 2.1 AA compliance)
- Text scaling (200% zoom)
- Alternative text for images

**Tools**: BrowserStack, Sauce Labs, axe DevTools, WAVE

### 1.4 Performance Testing

- **Load Time Testing**
  - Initial page load < 2 seconds
  - Quiz page transitions < 300ms
  - Sunscreen database load < 1 second
  - Image lazy loading performance

- **Memory Testing**
  - No memory leaks during extended use
  - Timer cleanup verification
  - React component unmounting

- **Network Testing**
  - Slow 3G/4G performance
  - Offline behavior
  - API timeout handling

**Tools**: Lighthouse, WebPageTest, Chrome DevTools Performance profiler

### 1.5 Reliability Testing

- **API Failure Testing**
  - Open-Meteo API downtime
  - Network interruptions
  - Invalid API responses
  - Rate limiting

- **Browser Storage Testing**
  - LocalStorage quota exceeded
  - SessionStorage failures
  - Cookie blocking

- **Long-Running Sessions**
  - Timer accuracy over 2+ hours
  - Memory stability over extended use
  - State persistence across page reloads

**Tools**: Chaos engineering tools, network throttling

### 1.6 Security Testing

- **Input Validation**
  - XSS prevention in quiz inputs
  - SQL injection (N/A - no backend)
  - URL manipulation attacks

- **Privacy Testing**
  - No PII storage without consent
  - Geolocation permission handling
  - Third-party script auditing

**Tools**: OWASP ZAP, npm audit, Snyk

### 1.7 User Acceptance Testing

**User Groups**:
1. **Dermatology Students** (5 users)
   - Medical accuracy validation
   - Fitzpatrick classification verification

2. **Skincare Enthusiasts** (10 users)
   - Sunscreen recommendation relevance
   - Product database completeness

3. **General Public** (15 users)
   - Ease of quiz completion
   - Clarity of results
   - Usefulness of recommendations

**Testing Period**: 2 weeks
**Feedback Methods**: Surveys, interviews, analytics
**Tools**: Google Forms, Hotjar, Google Analytics

---

## Part 2: Actual Test Plan (What Will Be Tested)

### 2.1 Unit Testing (Automated)

**What**: Core business logic functions
**When**: During development and before each deployment
**Who**: Developer (Nathan Jacobs)
**Where**: Local development environment

**Test Environment**:
- **Node.js**: v18.17.0 or higher
- **npm**: 9.6.7 or higher
- **Operating System**: macOS Sonoma 14.2.1
- **Testing Framework**: JavaScript (Node.js runtime)

**Test File**: `src/tests.ts` and `run-tests.js`

**Tests Implemented** (10 total):
1. Fitzpatrick Type I calculation (score 0-7)
2. Fitzpatrick Type II calculation (score 8-16)
3. Fitzpatrick Type III calculation (score 17-25)
4. Fitzpatrick Type IV calculation (score 26-30)
5. Fitzpatrick Type VI calculation (score 35+)
6. Oily skin type extraction
7. Dry skin type extraction
8. Combination skin type extraction
9. Sensitive skin type extraction
10. Default normal skin type extraction

**How to Run**:
```bash
node run-tests.js
```

**Expected Output**: All 10 tests should pass with ✓ indicators and "All tests passed!" message

**Test Oracle**: Each test has hardcoded expected values based on Fitzpatrick scoring algorithm:
- Type I: total score ≤ 7
- Type II: total score ≤ 16
- Type III: total score ≤ 25
- Type IV: total score ≤ 30
- Type V: total score ≤ 34
- Type VI: total score > 34

### 2.2 Integration and System Testing (Manual with UI)

**What**: End-to-end user flows and component interactions
**When**: Before each release and after major changes
**Who**: Developer + 2 peer testers

**Test Environment**:
- **Browser**: Chrome Version 131.0.6778.86 (primary), Safari 17.2 (secondary)
- **Device**: MacBook Pro 14" (1512×982 viewport)
- **Node.js**: v18.17.0
- **npm**: 9.6.7
- **React**: 19.2.0
- **Vite**: 7.1.7
- **Operating System**: macOS Sonoma 14.2.1
- **Network**: Standard broadband connection

**Test Cases**:

#### TC-01: Complete Quiz Flow (Happy Path)
- **Precondition**: Navigate to home page
- **Steps**:
  1. Click "Take the Quiz" button
  2. Answer all 11 questions with valid selections
  3. Submit quiz
  4. Verify results page displays
- **Expected Result**:
  - Fitzpatrick type displayed correctly
  - Skin type displayed correctly
  - Sunscreen recommendations shown
- **Test Data**: See Appendix A - Test Case Data
- **Pass/Fail**: Pass if all expected results met

#### TC-02: Quiz Validation
- **Precondition**: Navigate to quiz page
- **Steps**:
  1. Attempt to submit quiz without answering all questions
  2. Verify validation message appears
  3. Answer remaining questions
  4. Submit successfully
- **Expected Result**: User cannot proceed without completing all questions
- **Pass/Fail**: Pass if validation prevents incomplete submission

#### TC-03: Results Display for All Fitzpatrick Types
- **Precondition**: None
- **Steps**:
  1. Complete quiz 6 times with different answer sets targeting each Fitzpatrick type
  2. Verify correct type displayed each time
  3. Verify appropriate sunscreen recommendations for each type
- **Expected Result**: Each Fitzpatrick type (I-VI) displays correct information and recommendations
- **Test Data**: See Appendix B - Fitzpatrick Type Test Data
- **Pass/Fail**: Pass if all 6 types display correctly

#### TC-04: Sunscreen Recommendation Filtering
- **Precondition**: Quiz completed
- **Steps**:
  1. Note displayed Fitzpatrick type and skin type
  2. Verify sunscreen list matches expected filters
  3. Check that recommendations include appropriate SPF levels
  4. Verify filter type indicators (Physical/Chemical)
- **Expected Result**: Recommendations filtered by Fitzpatrick type and skin type combination
- **Pass/Fail**: Pass if filtering logic correct for tested combination

#### TC-05: UV Reminder Timer Functionality
- **Precondition**: Quiz completed (Fitzpatrick type determined)
- **Steps**:
  1. Navigate to Reminder page
  2. Allow geolocation access
  3. Click "Start Reminder"
  4. Verify UV index fetched and displayed
  5. Verify timer starts with correct duration
  6. Wait 60 seconds and verify timer counts down
- **Expected Result**:
  - UV index retrieved successfully
  - Timer calculates correctly based on Fitzpatrick type and UV level
  - Timer counts down accurately
- **Pass/Fail**: Pass if timer starts and counts down correctly

#### TC-06: Notification Permission and Delivery
- **Precondition**: Timer running, notification permission granted
- **Steps**:
  1. Set timer to 10 seconds (for testing purposes, modify code temporarily)
  2. Wait for timer to complete
  3. Verify browser notification appears
- **Expected Result**: Notification "Time to reapply your sunscreen!" displays
- **Pass/Fail**: Pass if notification appears on timer completion

#### TC-07: Navigation Between Pages
- **Precondition**: None
- **Steps**:
  1. Navigate through all pages: Home → Quiz → Results → Resources → Reminder
  2. Use both navigation menu and buttons
  3. Test browser back button
  4. Test direct URL navigation
- **Expected Result**: All navigation methods work correctly, state preserved where appropriate
- **Pass/Fail**: Pass if navigation smooth and state management correct

#### TC-08: Restart Quiz Functionality
- **Precondition**: Quiz completed, on Results page
- **Steps**:
  1. Click "Retake Quiz" button
  2. Verify redirected to quiz page
  3. Verify previous answers cleared
  4. Complete quiz again with different answers
  5. Verify new results displayed
- **Expected Result**: Quiz resets completely, new results reflect new answers
- **Pass/Fail**: Pass if quiz restart works correctly

#### TC-09: Responsive Design (Mobile)
- **Precondition**: None
- **Steps**:
  1. Open application in mobile browser or use Chrome DevTools device emulation
  2. Test on iPhone 14 viewport (390×844)
  3. Navigate through all pages
  4. Verify all buttons clickable
  5. Verify text readable without horizontal scroll
- **Expected Result**: Application fully functional and readable on mobile
- **Pass/Fail**: Pass if all elements accessible and usable

#### TC-10: Geolocation Error Handling
- **Precondition**: On Reminder page
- **Steps**:
  1. Deny geolocation permission
  2. Verify error message displays
  3. Verify graceful degradation (user can still use app)
- **Expected Result**: Clear error message, application remains functional
- **Pass/Fail**: Pass if error handled gracefully

### 2.3 Error Condition Testing

**Error Scenarios**:

1. **Network Failure During UV Fetch**
   - Disconnect network after clicking "Start Reminder"
   - Expected: Error message displayed, app remains stable

2. **Invalid Geolocation Data**
   - Mock invalid coordinates
   - Expected: Error handling or default behavior

3. **Image Load Failures**
   - Block image resources
   - Expected: Fallback placeholder images display

4. **LocalStorage Disabled**
   - Disable localStorage in browser
   - Expected: App functions without state persistence (acceptable degradation)

### 2.4 Data-Specific Test Cases

**Boundary Value Testing**:

| Test Case | Score | Expected Fitzpatrick Type |
|-----------|-------|---------------------------|
| Minimum Type I | 0 | 1 |
| Maximum Type I | 7 | 1 |
| Boundary Type I/II | 8 | 2 |
| Maximum Type II | 16 | 2 |
| Boundary Type II/III | 17 | 3 |
| Maximum Type III | 25 | 3 |
| Boundary Type III/IV | 26 | 4 |
| Maximum Type IV | 30 | 4 |
| Boundary Type IV/V | 31 | 5 |
| Maximum Type V | 34 | 5 |
| Minimum Type VI | 35 | 6 |
| Maximum Type VI | 40 | 6 |

**Skin Type Combinations** (30 total):
- Test 1 representative case from each Fitzpatrick type × skin type combination
- Verify correct sunscreen database key used (e.g., "1-normal", "3-oily", "6-dry")

### 2.5 Performance Testing (Basic)

**What**: Load times and responsiveness
**When**: After major changes
**Who**: Developer
**Tools**: Chrome DevTools Lighthouse

**Metrics**:
- **Initial Load**: < 3 seconds on standard connection
- **First Contentful Paint**: < 1.5 seconds
- **Time to Interactive**: < 3 seconds
- **Performance Score**: > 80 (Lighthouse)

**How to Test**:
1. Open Chrome DevTools
2. Navigate to Lighthouse tab
3. Run performance audit
4. Record scores

### 2.6 Acceptance Testing (User Testing)

**What**: Real user validation of functionality and usability
**When**: Before final release
**Who**: 5 external users (diverse age groups and skin types)

**User Profiles**:
1. **User A**: Age 22, Type I skin, tech-savvy
2. **User B**: Age 35, Type III skin, moderate tech experience
3. **User C**: Age 50, Type V skin, limited tech experience
4. **User D**: Age 28, Type II skin, skincare enthusiast
5. **User E**: Age 40, Type IV skin, outdoor worker

**Testing Tasks**:
1. Complete the quiz without guidance
2. Review and understand results
3. Navigate to reminder feature and set timer
4. Explore sunscreen recommendations
5. Provide feedback via survey

**Success Criteria**:
- 80% of users complete quiz without assistance
- 90% of users understand their results
- 70% of users successfully set reminder
- Average satisfaction rating ≥ 4/5

**Feedback Collection**:
- Post-test survey (Google Forms)
- Brief interview (10 minutes)
- Observation notes during testing

**Timeline**: 1 week testing period

### 2.7 Regression Testing

**What**: Verify existing functionality after changes
**When**: After any code modification
**Who**: Developer

**Process**:
1. Run automated unit tests: `node run-tests.js`
2. Execute manual test cases TC-01, TC-03, TC-05, TC-07 (core functionality)
3. Verify no new console errors
4. Check Lighthouse performance hasn't degraded

---

## Test Execution Guide

### Prerequisites

1. **Install Dependencies**:
   ```bash
   cd /Users/nathanjacobs/SPF-Match
   npm install
   ```

2. **Verify Environment**:
   ```bash
   node --version  # Should be v18.17.0+
   npm --version   # Should be 9.6.7+
   ```

### Running Automated Unit Tests

```bash
# From project root
node run-tests.js
```

**Expected Output**:
```
🧪 Running SPFMatch Test Suite...

✓ Test 1: Fitzpatrick Type I: Correctly calculates Type I (very fair skin)
✓ Test 2: Fitzpatrick Type VI: Correctly calculates Type VI (deeply pigmented skin)
✓ Test 3: Fitzpatrick Type III: Correctly calculates Type III (medium skin)
✓ Test 4: Oily Skin Type: Correctly identifies oily skin type
✓ Test 5: Dry Skin Type: Correctly identifies dry skin type
✓ Test 6: Combination Skin Type: Correctly identifies combination skin type
✓ Test 7: Sensitive Skin Type: Correctly identifies sensitive skin type
✓ Test 8: Default Normal Skin Type: Correctly defaults to normal skin type
✓ Test 9: Fitzpatrick Type II: Correctly calculates Type II (fair skin)
✓ Test 10: Fitzpatrick Type IV: Correctly calculates Type IV (moderate brown skin)

==================================================
📊 Test Summary: 10/10 tests passed
✅ All tests passed!
==================================================
```

### Running Manual Tests

1. **Start Development Server**:
   ```bash
   npm run dev
   ```

2. **Open Application**:
   - Navigate to `http://localhost:5173/SPF-Match/`
   - Verify application loads without errors

3. **Execute Test Cases**:
   - Follow steps in Section 2.2 test cases (TC-01 through TC-10)
   - Record results in test log (see Appendix C)

4. **Verify Build**:
   ```bash
   npm run build
   npm run preview
   ```
   - Test production build at preview URL

### Running Performance Tests

1. Open Chrome DevTools (F12)
2. Navigate to Lighthouse tab
3. Select "Performance" category
4. Click "Analyze page load"
5. Record scores

---

## Test Data and Oracles

### Appendix A: Test Case Data (TC-01)

**Complete Quiz - Type III Normal Skin**:
```javascript
{
  eyeColor: "Hazel or light brown",
  hairColor: "Light brown",
  skinColor: "Light brown or olive",
  freckles: "Few",
  sunTanning: "Sometimes",
  sunBurning: "Sometimes",
  skinReaction: "Moderately sensitive",
  familyBackground: "European (mixed)",
  sunExposure: "Occasionally",
  ageRange: "30-40",
  skinType: "Normal skin (balanced, not too oily or dry)"
}
```

**Expected Result**: Fitzpatrick Type III, Normal Skin

### Appendix B: Fitzpatrick Type Test Data

**Type I** (Expected Score: 0):
```javascript
{
  eyeColor: "Light blue, gray, or green",
  hairColor: "Red or light blonde",
  skinColor: "Ivory white",
  freckles: "Many",
  sunTanning: "Never, I only burn",
  sunBurning: "Always",
  skinReaction: "Very sensitive, often burns",
  familyBackground: "Scandinavian, Irish, or Scottish",
  sunExposure: "Rarely, I avoid the sun",
  ageRange: "Under 30",
  skinType: "Normal skin (balanced, not too oily or dry)"
}
```

**Type II** (Expected Score: 10):
```javascript
{
  eyeColor: "Blue or gray",
  hairColor: "Blonde",
  skinColor: "Pale white",
  freckles: "Some",
  sunTanning: "Rarely",
  sunBurning: "Often",
  skinReaction: "Sensitive, burns easily",
  familyBackground: "Northern European",
  sunExposure: "Rarely, I avoid the sun",
  ageRange: "Under 30",
  skinType: "Normal skin (balanced, not too oily or dry)"
}
```

**Type III** (Expected Score: 20):
```javascript
{
  eyeColor: "Hazel or light brown",
  hairColor: "Light brown",
  skinColor: "Light brown or olive",
  freckles: "Few",
  sunTanning: "Sometimes",
  sunBurning: "Sometimes",
  skinReaction: "Moderately sensitive",
  familyBackground: "European (mixed)",
  sunExposure: "Occasionally",
  ageRange: "30-40",
  skinType: "Normal skin (balanced, not too oily or dry)"
}
```

**Type IV** (Expected Score: 30):
```javascript
{
  eyeColor: "Dark brown",
  hairColor: "Dark brown",
  skinColor: "Moderate brown",
  freckles: "None",
  sunTanning: "Often",
  sunBurning: "Rarely",
  skinReaction: "Minimally sensitive",
  familyBackground: "Mediterranean, Asian, or Hispanic",
  sunExposure: "Often",
  ageRange: "40-50",
  skinType: "Normal skin (balanced, not too oily or dry)"
}
```

**Type V** (Expected Score: 34):
```javascript
{
  eyeColor: "Dark brown or black",
  hairColor: "Black",
  skinColor: "Dark brown or black",
  freckles: "None",
  sunTanning: "Often",
  sunBurning: "Rarely",
  skinReaction: "Minimally sensitive",
  familyBackground: "Mediterranean, Asian, or Hispanic",
  sunExposure: "Often",
  ageRange: "50-60",
  skinType: "Normal skin (balanced, not too oily or dry)"
}
```

**Type VI** (Expected Score: 40):
```javascript
{
  eyeColor: "Dark brown or black",
  hairColor: "Black",
  skinColor: "Dark brown or black",
  freckles: "None",
  sunTanning: "My skin is naturally dark",
  sunBurning: "Never",
  skinReaction: "Very resistant, never burns",
  familyBackground: "African or Afro-Caribbean",
  sunExposure: "Very often, I spend a lot of time outdoors",
  ageRange: "Over 60",
  skinType: "Normal skin (balanced, not too oily or dry)"
}
```

### Appendix C: Test Log Template

| Test Case | Date | Tester | Environment | Result | Notes |
|-----------|------|--------|-------------|--------|-------|
| TC-01 | | | | Pass/Fail | |
| TC-02 | | | | Pass/Fail | |
| TC-03 | | | | Pass/Fail | |
| TC-04 | | | | Pass/Fail | |
| TC-05 | | | | Pass/Fail | |
| TC-06 | | | | Pass/Fail | |
| TC-07 | | | | Pass/Fail | |
| TC-08 | | | | Pass/Fail | |
| TC-09 | | | | Pass/Fail | |
| TC-10 | | | | Pass/Fail | |

### Appendix D: UV Timer Calculation Oracle

**Base Reapplication Times by Fitzpatrick Type**:
- Type I: 30 minutes
- Type II: 45 minutes
- Type III: 60 minutes
- Type IV: 75 minutes
- Type V: 90 minutes
- Type VI: 105 minutes

**UV Index Multipliers**:
- Low (0-2): 1.0×
- Moderate (3-5): 0.85×
- High (6-7): 0.7×
- Very High (8-10): 0.6×
- Extreme (11+): 0.5×

**Example Calculation**:
- Fitzpatrick Type III, UV Index 6 (High)
- Base time: 60 minutes
- Multiplier: 0.7
- Final time: 60 × 0.7 = 42 minutes

### Appendix E: Tools Used

| Tool | Purpose | Version |
|------|---------|---------|
| Node.js | Test execution runtime | 18.17.0+ |
| Chrome | Primary browser testing | 131.0.6778.86 |
| Safari | Secondary browser testing | 17.2 |
| Chrome DevTools | Performance testing, debugging | Built-in |
| Lighthouse | Performance auditing | Built-in |
| Vite | Build tool and dev server | 7.1.7 |
| ESLint | Code quality | 9.36.0 |
| Git | Version control | 2.x |

---

## Test Schedule

| Phase | Timeline | Responsible |
|-------|----------|-------------|
| Automated unit tests | After each code change | Developer |
| Manual integration tests | Weekly during development | Developer |
| Performance testing | Bi-weekly | Developer |
| User acceptance testing | 1 week before release | External users |
| Regression testing | Before each deployment | Developer |

---

## Test Completion Criteria

Testing is considered complete when:
- [ ] All 10 automated unit tests pass
- [ ] All 10 manual test cases (TC-01 to TC-10) pass
- [ ] Performance score ≥ 80 on Lighthouse
- [ ] 5 user acceptance tests completed with ≥80% task completion rate
- [ ] No critical bugs remaining
- [ ] All known issues documented

---

## Defect Management

**Severity Levels**:
1. **Critical**: Application crashes, data loss, security vulnerability
2. **High**: Major feature broken, incorrect Fitzpatrick calculation
3. **Medium**: Minor feature issue, poor UX
4. **Low**: Cosmetic issue, typo

**Defect Tracking**: GitHub Issues (https://github.com/nathjaco1016/SPF-Match/issues)

---

## Contact

**Tester**: Nathan Jacobs
**Email**: [Your email]
**Project Repository**: https://github.com/nathjaco1016/SPF-Match

---

**Document Version**: 1.0
**Last Updated**: November 29, 2025
