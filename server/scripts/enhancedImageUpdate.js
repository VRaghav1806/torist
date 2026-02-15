const fs = require('fs');
const path = require('path');
const axios = require('axios');

const statesFilePath = path.join(__dirname, '../data/states.json');
const statesData = require(statesFilePath);

const WIKI_API_URL = 'https://en.wikipedia.org/w/api.php';
const COMMONS_API_URL = 'https://commons.wikimedia.org/w/api.php';

// Try multiple strategies to find images
const getImageFromWikipedia = async (query) => {
    try {
        const response = await axios.get(WIKI_API_URL, {
            params: {
                action: 'query',
                prop: 'pageimages',
                format: 'json',
                piprop: 'original',
                titles: query,
                origin: '*'
            },
            headers: {
                'User-Agent': 'TouristGuideApp/1.0 (contact@example.com)'
            }
        });

        const pages = response.data.query.pages;
        const pageId = Object.keys(pages)[0];

        if (pageId !== '-1') {
            const page = pages[pageId];
            if (page.original && page.original.source) {
                return page.original.source;
            }
        }
        return null;
    } catch (error) {
        console.error(`  Error fetching from Wikipedia for ${query}:`, error.message);
        return null;
    }
};

// Search Wikimedia Commons for images
const searchCommonsImage = async (query) => {
    try {
        const response = await axios.get(COMMONS_API_URL, {
            params: {
                action: 'query',
                list: 'search',
                srsearch: query,
                srnamespace: '6', // File namespace
                format: 'json',
                srlimit: '1',
                origin: '*'
            },
            headers: {
                'User-Agent': 'TouristGuideApp/1.0 (contact@example.com)'
            }
        });

        if (response.data.query.search.length > 0) {
            const fileName = response.data.query.search[0].title;
            // Get the actual image URL
            const imageResponse = await axios.get(COMMONS_API_URL, {
                params: {
                    action: 'query',
                    titles: fileName,
                    prop: 'imageinfo',
                    iiprop: 'url',
                    format: 'json',
                    origin: '*'
                },
                headers: {
                    'User-Agent': 'TouristGuideApp/1.0 (contact@example.com)'
                }
            });

            const pages = imageResponse.data.query.pages;
            const pageId = Object.keys(pages)[0];
            if (pages[pageId].imageinfo && pages[pageId].imageinfo[0]) {
                return pages[pageId].imageinfo[0].url;
            }
        }
        return null;
    } catch (error) {
        console.error(`  Error searching Commons for ${query}:`, error.message);
        return null;
    }
};

const targetStateId = process.argv[2];

const updateMissingImages = async () => {
    console.log("Starting enhanced image update process...\n");
    let updatedCount = 0;
    let totalPlaceholder = 0;

    for (const state of statesData) {
        if (targetStateId && state.id !== targetStateId) {
            continue;
        }
        console.log(`Processing state: ${state.name}`);

        for (const place of state.places) {
            // Skip if already has a good image
            if (!place.image.includes('placehold.co')) {
                continue;
            }

            totalPlaceholder++;
            console.log(`  Searching for: ${place.name}`);

            // Try multiple search strategies
            const searchQueries = [
                place.name,
                `${place.name} ${state.name}`,
                `${place.name} India`,
                `${place.name} tourism`,
                `${place.name} ${state.name} India`
            ];

            let imageUrl = null;

            // Try Wikipedia first with different queries
            for (const query of searchQueries) {
                if (imageUrl) break;
                imageUrl = await getImageFromWikipedia(query);
                if (imageUrl) {
                    console.log(`    ✓ Found via Wikipedia: ${query}`);
                }
                await new Promise(resolve => setTimeout(resolve, 300));
            }

            // If not found, try Wikimedia Commons
            if (!imageUrl) {
                for (const query of searchQueries.slice(0, 3)) {
                    if (imageUrl) break;
                    imageUrl = await searchCommonsImage(query);
                    if (imageUrl) {
                        console.log(`    ✓ Found via Commons: ${query}`);
                    }
                    await new Promise(resolve => setTimeout(resolve, 300));
                }
            }

            if (imageUrl) {
                place.image = imageUrl;
                updatedCount++;
            } else {
                console.log(`    ✗ No image found, keeping placeholder`);
            }

            // Save progress periodically
            if (updatedCount % 10 === 0 && updatedCount > 0) {
                fs.writeFileSync(statesFilePath, JSON.stringify(statesData, null, 4));
                console.log(`  [Progress saved: ${updatedCount}/${totalPlaceholder} updated]`);
            }

            await new Promise(resolve => setTimeout(resolve, 400));
        }

        // Save after each state
        fs.writeFileSync(statesFilePath, JSON.stringify(statesData, null, 4));
        console.log(`  State completed and saved\n`);
    }

    console.log("\n=== SUMMARY ===");
    console.log(`Total placeholders found: ${totalPlaceholder}`);
    console.log(`Successfully updated: ${updatedCount}`);
    console.log(`Still using placeholders: ${totalPlaceholder - updatedCount}`);
};

updateMissingImages().catch(err => {
    console.error("\nFatal error:", err);
    // Try to save whatever we have
    try {
        fs.writeFileSync(statesFilePath, JSON.stringify(statesData, null, 4));
        console.log("Saved current progress despite error");
    } catch (saveErr) {
        console.error("Could not save progress:", saveErr);
    }
});
