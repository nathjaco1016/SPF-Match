#!/usr/bin/env node

/**
 * Transform Google Sheets data into the sunscreen database format
 *
 * Expected Google Sheets format:
 * Sunscreen_Name, Fitzpatrick_Scale, Skin_Type, Filter_Type, SPF, Vehicle, Tint, Price, Size(oz), Unit_Price, Image, Link
 */

const fs = require('fs');

// Get command line arguments
const [inputFile, outputFile] = process.argv.slice(2);

if (!inputFile || !outputFile) {
  console.error('Usage: node transform-sunscreen-data.cjs <input-file> <output-file>');
  process.exit(1);
}

// Read the Google Sheets API response
let sheetsResponse;
try {
  sheetsResponse = JSON.parse(fs.readFileSync(inputFile, 'utf8'));
} catch (error) {
  console.error('Error parsing sheets response:', error.message);
  console.error('File contents:');
  console.error(fs.readFileSync(inputFile, 'utf8'));
  process.exit(1);
}

if (!sheetsResponse.values || sheetsResponse.values.length === 0) {
  console.error('No data found in sheets response');
  console.error('This likely means your Google Sheet is empty or the API call failed.');
  console.error('\nReceived response:');
  console.error(JSON.stringify(sheetsResponse, null, 2));
  process.exit(1);
}

const [headers, ...rows] = sheetsResponse.values;

console.log(`Found ${rows.length} rows with headers: ${headers.join(', ')}`);

// Create index map for headers
const headerIndex = {};
headers.forEach((header, index) => {
  headerIndex[header] = index;
});

// Helper function to parse Fitzpatrick scale ranges (e.g., "V–VI" -> [5, 6])
function parseFitzpatrickScale(scale) {
  if (!scale) return [];

  // Remove whitespace
  scale = scale.trim();

  // Convert roman numerals to numbers
  const romanToNum = { 'I': 1, 'II': 2, 'III': 3, 'IV': 4, 'V': 5, 'VI': 6 };

  // Handle ranges like "V–VI" or "I–III"
  const parts = scale.split(/[-–—]/);

  if (parts.length === 2) {
    const start = romanToNum[parts[0].trim()];
    const end = romanToNum[parts[1].trim()];
    const result = [];
    for (let i = start; i <= end; i++) {
      result.push(i);
    }
    return result;
  } else if (parts.length === 1 && romanToNum[parts[0]]) {
    return [romanToNum[parts[0]]];
  }

  return [];
}

// Helper function to parse skin types (e.g., "Oily, Combination" -> ["oily", "combination"])
function parseSkinTypes(skinTypeStr) {
  if (!skinTypeStr) return [];

  return skinTypeStr
    .split(',')
    .map(s => s.trim().toLowerCase())
    .filter(s => s.length > 0);
}

// Helper function to normalize tint values
function normalizeTint(tint) {
  if (!tint) return 'Untinted';
  tint = tint.trim().toLowerCase();
  if (tint === 'no' || tint === 'untinted') return 'Untinted';
  if (tint === 'yes' || tint === 'tinted') return 'Tinted';
  return tint.charAt(0).toUpperCase() + tint.slice(1); // Capitalize first letter
}

// Transform rows into products grouped by skin type
const database = {};

// Initialize all combinations
for (let fitz = 1; fitz <= 6; fitz++) {
  for (const skin of ['normal', 'oily', 'dry', 'combination', 'sensitive']) {
    database[`${fitz}-${skin}`] = [];
  }
}

rows.forEach((row, rowIndex) => {
  // Skip empty rows
  if (!row || row.length === 0) return;

  try {
    const name = row[headerIndex['Sunscreen_Name']] || '';
    const fitzpatrickScale = row[headerIndex['Fitzpatrick_Scale']] || '';
    const skinTypeStr = row[headerIndex['Skin_Type']] || '';
    const filterType = row[headerIndex['Filter_Type']] || '';
    const spf = row[headerIndex['SPF']] || '';
    const vehicle = row[headerIndex['Vehicle']] || '';
    const tint = row[headerIndex['Tint']] || '';
    const priceStr = row[headerIndex['Price']] || '';
    const sizeStr = row[headerIndex['Size(oz)']] || '';
    const link = row[headerIndex['Link']] || '';
    const image = row[headerIndex['Image']] || '';

    // Parse price (remove $ sign)
    const price = parseFloat(priceStr.replace('$', '')) || 0;
    const size = parseFloat(sizeStr) || 0;

    const product = {
      name,
      filterType,
      spf: parseInt(spf) || 0,
      vehicle,
      tint: normalizeTint(tint),
      price,
      size,
      description: `SPF ${spf} ${filterType} sunscreen`,
      link,
      unitPrice: size > 0 ? price / size : 0
    };

    // Add image if it exists
    if (image) {
      product.image = image;
    }

    // Parse Fitzpatrick types and skin types
    const fitzpatrickTypes = parseFitzpatrickScale(fitzpatrickScale);
    const skinTypes = parseSkinTypes(skinTypeStr);

    // Add product to all matching combinations
    for (const fitzType of fitzpatrickTypes) {
      for (const skinType of skinTypes) {
        const key = `${fitzType}-${skinType}`;
        if (database[key]) {
          database[key].push(product);
        }
      }
    }

    console.log(`Row ${rowIndex + 2}: ${name} -> Fitz ${fitzpatrickTypes.join(',')} / Skin ${skinTypes.join(',')}`);
  } catch (error) {
    console.warn(`Warning: Error processing row ${rowIndex + 2}: ${error.message}`);
  }
});

// Write the transformed data
fs.writeFileSync(outputFile, JSON.stringify(database, null, 2));

// Count total products
let totalProducts = 0;
let groupsWithProducts = 0;
for (const key in database) {
  if (database[key].length > 0) {
    groupsWithProducts++;
    totalProducts += database[key].length;
  }
}

console.log(`\n✅ Successfully transformed ${rows.length} rows`);
console.log(`📊 Total product entries: ${totalProducts}`);
console.log(`🎯 Skin type groups with products: ${groupsWithProducts}/30`);
console.log(`📁 Output written to: ${outputFile}`);
