# Google Sheets to GitHub Sync Setup

This document explains how to set up automatic syncing of sunscreen data from Google Sheets to GitHub using Google Apps Script and GitHub Actions.

## Architecture Overview

1. **Google Sheets** - Contains the sunscreen product database
2. **Google Apps Script** - Triggers GitHub Actions workflow via repository_dispatch event
3. **GitHub Actions** - Fetches data from Google Sheets API, transforms it, and commits to repository
4. **Static JSON** - Application fetches from `/data/sunscreen-database.json` at runtime

## Benefits

- ✅ No API keys exposed in frontend code
- ✅ Data is static and cached by CDN
- ✅ Updates are version controlled
- ✅ Automatic redeployment after data updates

## Setup Instructions

### 1. GitHub Setup

#### Create a Personal Access Token (PAT)

1. Go to GitHub Settings → Developer settings → Personal access tokens → Tokens (classic)
2. Click "Generate new token (classic)"
3. Name it "Google Sheets Sync"
4. Select scopes:
   - `repo` (Full control of private repositories)
   - `workflow` (Update GitHub Action workflows)
5. Copy the token (you won't see it again!)

#### Add Secrets to Repository

1. Go to your repository → Settings → Secrets and variables → Actions
2. Add the following secrets:
   - `VITE_GOOGLE_SHEETS_API_KEY` - Your Google Sheets API key
   - `VITE_GOOGLE_SHEETS_ID` - Your Google Sheets spreadsheet ID
3. Note: `GITHUB_TOKEN` is automatically provided by GitHub Actions

### 2. Google Sheets Setup

#### Sheet Structure

Your Google Sheets document should have the following columns in **Row 1** (headers):

| name | filterType | spf | vehicle | tint | price | size | description | fitzpatrickType | skinType | link |
|------|------------|-----|---------|------|-------|------|-------------|-----------------|----------|------|

**Column Descriptions:**
- `name` - Product name (e.g., "CeraVe Hydrating Mineral Sunscreen SPF 50")
- `filterType` - "Mineral" or "Chemical"
- `spf` - SPF number (e.g., 30, 50)
- `vehicle` - "Lotion", "Gel", "Cream", "Stick", etc.
- `tint` - "Tinted" or "Untinted"
- `price` - Price in USD (e.g., 15.99)
- `size` - Size in fl oz (e.g., 1.7)
- `description` - Product description
- `fitzpatrickType` - Fitzpatrick skin type number (1-6)
- `skinType` - "normal", "oily", "dry", "combination", or "sensitive"
- `link` - (Optional) Product purchase URL

**Example Row:**
```
CeraVe Hydrating Mineral Sunscreen SPF 50 | Mineral | 50 | Lotion | Tinted | 15.99 | 1.7 | Gentle mineral sunscreen with ceramides | 2 | dry | https://example.com/product
```

### 3. Google Apps Script Setup

#### Create the Script

1. Open your Google Sheet
2. Go to Extensions → Apps Script
3. Delete any existing code
4. Paste the following script:

```javascript
/**
 * Trigger GitHub Actions workflow to sync sunscreen data
 */
function triggerGitHubSync() {
  // Configuration
  const GITHUB_TOKEN = 'YOUR_GITHUB_PAT_HERE'; // Replace with your PAT
  const GITHUB_OWNER = 'YOUR_GITHUB_USERNAME'; // Replace with your GitHub username
  const GITHUB_REPO = 'SPF-Match'; // Replace with your repo name

  // GitHub API endpoint
  const url = `https://api.github.com/repos/${GITHUB_OWNER}/${GITHUB_REPO}/dispatches`;

  // Payload
  const payload = {
    event_type: 'sync-sunscreen-data',
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
      Logger.log('✅ GitHub Actions workflow triggered successfully!');
      SpreadsheetApp.getActiveSpreadsheet().toast(
        'Sunscreen data sync initiated successfully!',
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
 * Add custom menu to Google Sheets
 */
function onOpen() {
  const ui = SpreadsheetApp.getUi();
  ui.createMenu('SPFMatch Sync')
    .addItem('Sync to GitHub', 'triggerGitHubSync')
    .addToUi();
}
```

5. Replace the placeholders:
   - `YOUR_GITHUB_PAT_HERE` - Your GitHub Personal Access Token
   - `YOUR_GITHUB_USERNAME` - Your GitHub username
   - Update `GITHUB_REPO` if you renamed the repository

6. Click "Save" (💾 icon)
7. Name the project "SPFMatch Sync"

#### Set Up Trigger (Optional - for automatic updates)

To automatically sync on edits:

1. In Apps Script, click "Triggers" (⏰ icon) in the left sidebar
2. Click "+ Add Trigger"
3. Configure:
   - Choose function: `triggerGitHubSync`
   - Event source: "From spreadsheet"
   - Event type: "On change" or "On edit"
4. Click "Save"

**Note:** Be careful with automatic triggers - they'll run on every edit!

### 4. Testing the Setup

#### Manual Test

1. In your Google Sheet, click "SPFMatch Sync" menu → "Sync to GitHub"
2. You should see a success message
3. Go to your GitHub repository → Actions tab
4. You should see "Sync Sunscreen Data from Google Sheets" workflow running
5. Once complete, check that `public/data/sunscreen-database.json` was updated
6. The deploy workflow should automatically trigger after the sync completes

#### Verify Data Format

The generated JSON should look like:

```json
{
  "1-normal": [
    {
      "name": "Product Name",
      "filterType": "Mineral",
      "spf": 50,
      "vehicle": "Lotion",
      "tint": "Tinted",
      "price": 15.99,
      "size": 1.7,
      "description": "Product description",
      "unitPrice": 9.41,
      "link": "https://example.com/product"
    }
  ],
  "1-oily": [...],
  ...
}
```

## Workflow Files

### `.github/workflows/sync-sunscreen-data.yml`
Main workflow that:
1. Fetches data from Google Sheets API
2. Transforms it using the Node.js script
3. Commits to repository
4. Triggers deployment

### `.github/scripts/transform-sunscreen-data.js`
Node.js script that converts Google Sheets format to the application's JSON format.

## Troubleshooting

### "Failed to trigger workflow"
- Check that your GitHub PAT is correct and has the right scopes
- Verify the GitHub username and repo name are correct

### "No data found in sheets response"
- Ensure your sheet is named "Sheet1" or update the workflow
- Check that the Google Sheets API key is correct

### "Missing required headers"
- Verify Row 1 has all required column headers
- Headers are case-sensitive

### Workflow doesn't run
- Check GitHub Actions tab for errors
- Verify `repository_dispatch` permissions in repository settings

### Data doesn't update on site
- Check that the deployment workflow ran successfully
- Clear your browser cache
- Wait for CDN cache to expire

## Security Notes

- ✅ Google Sheets API key is stored as GitHub Secret
- ✅ GitHub PAT is only in Apps Script (not committed to repo)
- ✅ No sensitive credentials in frontend code
- ⚠️ Keep your PAT secure - it has write access to your repo
- ⚠️ Consider using a dedicated service account for Apps Script

## Manual Workflow Trigger

You can also manually trigger the workflow:

1. Go to GitHub repository → Actions tab
2. Click "Sync Sunscreen Data from Google Sheets"
3. Click "Run workflow" → "Run workflow"

This is useful for testing or one-off updates.
