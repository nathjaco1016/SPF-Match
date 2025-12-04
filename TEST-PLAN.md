# SPFMatch Test Plan

**Project**: SPFMatch - Fitzpatrick Skin Type Assessment Application
**Author**: Nathan Jacobs
**Date**: November 29, 2025

---

## Part 1: Ideal Test Plan (With Unlimited Resources)

### Unit Testing
- Test all 6 Fitzpatrick types with boundary conditions (scores 0-7, 8-16, 17-25, 26-30, 31-34, 35+)
- Test all 5 skin types (normal, oily, dry, combination, sensitive)
- Test edge cases: empty answers, partial answers, invalid inputs
- Component testing for QuizPage, ResultsPage, ReminderPage, Navigation
- UV index integration with mock API responses
- **Tools**: Jest, React Testing Library, Vitest
- **Coverage Goal**: 95%+

### Integration and System Testing
- Complete quiz flow from start to finish
- Test all 30 combinations (6 Fitzpatrick types × 5 skin types)
- Results display and sunscreen filtering
- Timer and notification integration
- Routing and navigation
- **Tools**: Cypress or Playwright

### Browser/Device Testing
- Chrome, Firefox, Safari, Edge (latest versions)
- Desktop, tablet, mobile viewports
- macOS, Windows, iOS, Android
- **Tools**: BrowserStack

### Performance Testing
- Page load times < 2 seconds
- Lighthouse performance score > 80
- Memory leak detection
- **Tools**: Lighthouse, Chrome DevTools

### Usability Testing
- 5 dermatology students for medical accuracy
- 10 skincare enthusiasts for product recommendations
- 15 general public users for ease of use
- **Methods**: Surveys, interviews, observation

### Acceptance Testing
- User testing with diverse age groups and skin types
- 80% task completion rate
- Average satisfaction ≥ 4/5

---

## Part 2: Actual Test Plan (What Will Be Tested)

### Unit Testing (Automated)

**Environment**:
- Node.js: v18.17.0+
- npm: 9.6.7+
- OS: macOS Sonoma 14.2.1
- Framework: JavaScript (Node.js)

**Test Files**: `src/tests.ts` and `run-tests.js`

**10 Tests Implemented**:
1. Fitzpatrick Type I (score 0-7)
2. Fitzpatrick Type II (score 8-16)
3. Fitzpatrick Type III (score 17-25)
4. Fitzpatrick Type IV (score 26-30)
5. Fitzpatrick Type VI (score 35+)
6. Oily skin type extraction
7. Dry skin type extraction
8. Combination skin type extraction
9. Sensitive skin type extraction
10. Default normal skin type extraction

**How to Run**:
```bash
node run-tests.js
```

**Expected Output**: All 10 tests pass with "✅ All tests passed!" message

### Integration Testing (Manual)

**Environment**:
- Browser: Chrome 131.0.6778.86
- Device: MacBook Pro 14" (1512×982)
- OS: macOS Sonoma 14.2.1
- React: 19.2.0
- Vite: 7.1.7

**Test Cases**:

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

### Performance Testing

**Tools**: Chrome DevTools Lighthouse

**Metrics**:
- Initial load: < 3 seconds
- Performance score: > 80

### User Acceptance Testing

**Who**: 5 external users (ages 22-50, diverse skin types)

**Tasks**:
1. Complete quiz without guidance
2. Review and understand results
3. Set reminder timer
4. Explore sunscreen recommendations

**Success Criteria**: 80% complete quiz without help, 90% understand results

---

## Test Execution Guide

### Running Automated Tests

```bash
# Install dependencies
npm install

# Run tests
node run-tests.js
```

Expected output: 10/10 tests passed

### Running Manual Tests

```bash
# Start dev server
npm run dev

# Open http://localhost:5173/SPF-Match/
# Execute TC-01 through TC-05
```

### Running Performance Tests

1. Open Chrome DevTools (F12)
2. Navigate to Lighthouse tab
3. Run performance audit
4. Record scores

---

## Test Data (Oracles)

### Fitzpatrick Type I (Expected: Type 1)
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

### Fitzpatrick Type III (Expected: Type 3)
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

### Fitzpatrick Type VI (Expected: Type 6)
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

### Scoring Algorithm
- Type I: score ≤ 7
- Type II: score ≤ 16
- Type III: score ≤ 25
- Type IV: score ≤ 30
- Type V: score ≤ 34
- Type VI: score > 34

---

## Tools Used

| Tool | Purpose | Version |
|------|---------|---------|
| Node.js | Test execution | 18.17.0+ |
| Chrome | Browser testing | 131.0.6778.86 |
| Chrome DevTools | Performance testing | Built-in |
| Vite | Dev server | 7.1.7 |
| Git | Version control | 2.x |

---

## Test Completion Criteria

- [ ] All 10 automated unit tests pass
- [ ] All 5 manual test cases pass
- [ ] Performance score ≥ 80
- [ ] 5 user acceptance tests completed
- [ ] No critical bugs
