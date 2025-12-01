# Resources Sync Setup

This document explains how to set up automatic syncing of resources from Google Sheets to GitHub.

## Overview

The Resources page now fetches from a static JSON file (`/public/data/resources.json`) that is synced from Google Sheets via GitHub Actions. This approach:
- ✅ Keeps API keys secure (not exposed in frontend)
- ✅ Uses the same sync pattern as sunscreen data
- ✅ Updates automatically when you trigger from Google Sheets

## Google Sheets Setup

### Sheet Structure

Your Google Sheets must have a tab named **"Resource"** with the following columns in Row 1:

| Title | Link |
|-------|------|

**Example data:**
```
Free Skin Cancer Checks | https://www.aad.org/public/public-health/skin-cancer-screenings
What People of Color Need to Know About Sun Protection and Skin Cancer | https://www.cancer.org/cancer/latest-news/what-people-of-color-need-to-know-about-sun-protection-and-skin-cancer.html
```

## Google Apps Script Setup

### Option 1: Update Existing Script (Recommended)

If you already have the SPFMatch Sync menu from the sunscreen setup, add the resources sync function:

1. Open your Google Sheet
2. Go to Extensions → Apps Script
3. Add this new function to your existing script:

```javascript
/**
 * Trigger GitHub Actions workflow to sync resources
 */
function triggerResourcesSync() {
  // Configuration - use same values as triggerGitHubSync
  const GITHUB_TOKEN = 'YOUR_GITHUB_PAT_HERE'; // Same PAT as before
  const GITHUB_OWNER = 'YOUR_GITHUB_USERNAME'; // Your GitHub username
  const GITHUB_REPO = 'SPF-Match'; // Your repo name

  // GitHub API endpoint
  const url = `https://api.github.com/repos/${GITHUB_OWNER}/${GITHUB_REPO}/dispatches`;

  // Payload - note the different event_type
  const payload = {
    event_type: 'sync-resources', // Different from sunscreen sync
    client_payload: {
      timestamp: new Date().toISOString(),
      source: 'google-apps-script'
    }
  };

  // Request options
  const options = {
    method: 'post',
    headers: {
      'Authorization': 'Bearer ' + GITHUB_TOKEN,
      'Accept': 'application/vnd.github+json',
      'Content-Type': 'application/json'
    },
    payload: JSON.stringify(payload),
    muteHttpExceptions: true
  };

  try {
    const response = UrlFetchApp.fetch(url, options);
    const responseCode = response.getResponseCode();

    if (responseCode === 204) {
      Logger.log('✅ Resources sync workflow triggered successfully!');
      SpreadsheetApp.getActiveSpreadsheet().toast(
        'Resources sync initiated successfully!',
        'Success',
        5
      );
    } else {
      Logger.log('❌ Failed to trigger workflow. Status: ' + responseCode);
      Logger.log('Response: ' + response.getContentText());
      SpreadsheetApp.getActiveSpreadsheet().toast(
        'Failed to trigger sync. Check script logs.',
        'Error',
        5
      );
    }
  } catch (error) {
    Logger.log('❌ Error: ' + error.toString());
    SpreadsheetApp.getActiveSpreadsheet().toast(
      'Error: ' + error.toString(),
      'Error',
      5
    );
  }
}

/**
 * Sync both sunscreen and resources
 */
function triggerFullSync() {
  triggerGitHubSync(); // Sunscreen sync
  Utilities.sleep(2000); // Wait 2 seconds
  triggerResourcesSync(); // Resources sync

  SpreadsheetApp.getActiveSpreadsheet().toast(
    'Full sync initiated for sunscreen and resources!',
    'Success',
    5
  );
}
```

4. Update the `onOpen()` function to add the new menu items:

```javascript
/**
 * Add custom menu to Google Sheets
 */
function onOpen() {
  const ui = SpreadsheetApp.getUi();
  ui.createMenu('SPFMatch Sync')
    .addItem('Sync Sunscreen Data', 'triggerGitHubSync')
    .addItem('Sync Resources', 'triggerResourcesSync')
    .addSeparator()
    .addItem('Sync Everything', 'triggerFullSync')
    .addToUi();
}
```

5. Click "Save" (💾 icon)
6. Refresh your Google Sheet to see the updated menu

### Option 2: Separate Script (Alternative)

If you prefer to keep resources separate, create a new script just for resources following the same pattern as the sunscreen sync, but using `event_type: 'sync-resources'`.

## Testing the Setup

### Manual Workflow Test

1. Go to your GitHub repository → Actions tab
2. Click "Sync Resources from Google Sheets"
3. Click "Run workflow" → "Run workflow"
4. Verify the workflow completes successfully
5. Check that `public/data/resources.json` was updated

### Google Apps Script Test

1. In your Google Sheet, add/edit a resource in the "Resource" tab
2. Click "SPFMatch Sync" menu → "Sync Resources"
3. You should see a success message
4. Go to GitHub Actions and verify the workflow ran
5. Check that the changes are in `public/data/resources.json`

## How It Works

1. **Google Sheets** - Contains your resources in the "Resource" tab
2. **Google Apps Script** - Triggers GitHub Actions via `repository_dispatch` event
3. **GitHub Actions** - Fetches data from Google Sheets API, transforms it, and commits to repository
4. **Static JSON** - Application fetches from `/data/resources.json` at runtime

## Security

- ✅ Google Sheets API key is stored as GitHub Secret (not in frontend)
- ✅ GitHub PAT is only in Apps Script (not committed to repo)
- ✅ No sensitive credentials exposed to users
- ✅ Same secure pattern as sunscreen data sync

## Troubleshooting

### "No data found in sheets response"
- Ensure your sheet is named exactly "Resource" (case-sensitive)
- Check that Row 1 has "Title" and "Link" headers
- Verify the Google Sheets API key in GitHub Secrets is correct

### Workflow doesn't run
- Check that the GitHub PAT in Apps Script has correct permissions
- Verify the repository name and username are correct
- Check GitHub Actions tab for errors

### Resources don't appear on website
- Check that the workflow completed successfully
- Verify `public/data/resources.json` exists and has data
- Clear browser cache
- Check browser console for fetch errors
