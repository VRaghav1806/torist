const fs = require('fs');
const path = require('path');

const statesFilePath = path.join(__dirname, '../data/states.json');
const statesData = require(statesFilePath);

// Collect all tourist places that still have Unsplash placeholders
const placesNeedingImages = [];

for (const state of statesData) {
    for (const place of state.places) {
        if (place.image.includes('source.unsplash.com')) {
            placesNeedingImages.push({
                state: state.name,
                place: place.name,
                currentImage: place.image
            });
        }
    }
}

console.log(`\n=== TOURIST PLACES NEEDING IMAGES ===`);
console.log(`Total places needing images: ${placesNeedingImages.length}\n`);

// Group by state
const byState = {};
for (const item of placesNeedingImages) {
    if (!byState[item.state]) {
        byState[item.state] = [];
    }
    byState[item.state].push(item.place);
}

// Print grouped list
console.log('Places by state:');
for (const state in byState) {
    console.log(`\n${state} (${byState[state].length} places):`);
    byState[state].forEach((place, idx) => {
        console.log(`  ${idx + 1}. ${place}`);
    });
}

// Save the list to a file for reference
const reportPath = path.join(__dirname, 'missing_images_report.txt');
let report = `=== TOURIST PLACES NEEDING IMAGES ===\n`;
report += `Total places: ${placesNeedingImages.length}\n\n`;
report += `Places by state:\n`;
for (const state in byState) {
    report += `\n${state} (${byState[state].length} places):\n`;
    byState[state].forEach((place, idx) => {
        report += `  ${idx + 1}. ${place}\n`;
    });
}

fs.writeFileSync(reportPath, report);
console.log(`\n\nReport saved to: ${reportPath}`);
