#!/usr/bin/env node

/**
 * Transform Google Sheets data into the resources JSON format
 *
 * Expected Google Sheets format:
 * Title, Link
 */

const fs = require('fs');

// Get command line arguments
const [inputFile, outputFile] = process.argv.slice(2);

if (!inputFile || !outputFile) {
  console.error('Usage: node transform-resources.cjs <input-file> <output-file>');
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
  console.error('This likely means your Google Sheet Resource tab is empty or the API call failed.');
  console.error('\nReceived response:');
  console.error(JSON.stringify(sheetsResponse, null, 2));
  process.exit(1);
}

const [headers, ...rows] = sheetsResponse.values;

console.log(`Found ${rows.length} resource rows with headers: ${headers.join(', ')}`);

// Validate headers
if (!headers.includes('Title') || !headers.includes('Link')) {
  console.error('Error: Resource sheet must have "Title" and "Link" columns');
  console.error('Found headers:', headers);
  process.exit(1);
}

// Create index map for headers
const titleIndex = headers.indexOf('Title');
const linkIndex = headers.indexOf('Link');

// Transform rows into resource objects
const resources = rows
  .filter(row => row.length >= 2 && row[titleIndex] && row[linkIndex]) // Only include rows with both title and link
  .map(row => ({
    title: row[titleIndex].trim(),
    link: row[linkIndex].trim()
  }));

console.log(`Transformed ${resources.length} resources`);

// Write output
try {
  fs.writeFileSync(outputFile, JSON.stringify(resources, null, 2), 'utf8');
  console.log(`✅ Successfully wrote resources to ${outputFile}`);
} catch (error) {
  console.error('Error writing output file:', error.message);
  process.exit(1);
}
