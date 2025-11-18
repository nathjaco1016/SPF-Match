#!/usr/bin/env node

/**
 * Transform Google Sheets data into the sunscreen database format
 *
 * Expected Google Sheets format:
 * Row 1: Headers (name, filterType, spf, vehicle, tint, price, size, description, fitzpatrickType, skinType, link)
 * Row 2+: Data rows
 */

const fs = require('fs');

// Get command line arguments
const [inputFile, outputFile] = process.argv.slice(2);

if (!inputFile || !outputFile) {
  console.error('Usage: node transform-sunscreen-data.js <input-file> <output-file>');
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
  console.error('Please check:');
  console.error('1. Your Google Sheet has data with proper headers in Row 1');
  console.error('2. The sheet is named "Sheet1" or update the workflow');
  console.error('3. The Google Sheets API is enabled');
  console.error('4. The API key and Sheet ID are correct in GitHub Secrets');
  console.error('\nReceived response:');
  console.error(JSON.stringify(sheetsResponse, null, 2));
  process.exit(1);
}

const [headers, ...rows] = sheetsResponse.values;

// Validate required headers
const requiredHeaders = ['name', 'filterType', 'spf', 'vehicle', 'tint', 'price', 'size', 'description', 'fitzpatrickType', 'skinType'];
const missingHeaders = requiredHeaders.filter(h => !headers.includes(h));

if (missingHeaders.length > 0) {
  console.error(`Missing required headers: ${missingHeaders.join(', ')}`);
  console.error(`Found headers: ${headers.join(', ')}`);
  process.exit(1);
}

// Create index map for headers
const headerIndex = {};
headers.forEach((header, index) => {
  headerIndex[header] = index;
});

// Transform rows into products grouped by skin type
const database = {};

rows.forEach((row, rowIndex) => {
  // Skip empty rows
  if (!row || row.length === 0) return;

  try {
    const product = {
      name: row[headerIndex.name] || '',
      filterType: row[headerIndex.filterType] || '',
      spf: parseInt(row[headerIndex.spf]) || 0,
      vehicle: row[headerIndex.vehicle] || '',
      tint: row[headerIndex.tint] || '',
      price: parseFloat(row[headerIndex.price]) || 0,
      size: parseFloat(row[headerIndex.size]) || 0,
      description: row[headerIndex.description] || '',
      link: row[headerIndex.link] || ''
    };

    // Calculate unit price
    product.unitPrice = product.size > 0 ? product.price / product.size : 0;

    // Get skin type key
    const fitzpatrickType = row[headerIndex.fitzpatrickType];
    const skinType = row[headerIndex.skinType];
    const key = `${fitzpatrickType}-${skinType}`;

    // Initialize array if needed
    if (!database[key]) {
      database[key] = [];
    }

    // Add product to the appropriate skin type group
    database[key].push(product);
  } catch (error) {
    console.warn(`Warning: Error processing row ${rowIndex + 2}: ${error.message}`);
  }
});

// Write the transformed data
fs.writeFileSync(outputFile, JSON.stringify(database, null, 2));

console.log(`Successfully transformed ${rows.length} rows into ${Object.keys(database).length} skin type groups`);
console.log(`Output written to: ${outputFile}`);
