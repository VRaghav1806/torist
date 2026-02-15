const fs = require('fs');
const path = require('path');
const axios = require('axios');

const statesFilePath = path.join(__dirname, '../data/states.json');
const statesData = require(statesFilePath);

const WIKI_API_URL = 'https://en.wikipedia.org/w/api.php';

const getImageFromWiki = async (query) => {
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

        if (pageId === '-1') return null;

        const page = pages[pageId];
        if (page.original && page.original.source) {
            return page.original.source;
        }
        return null;
    } catch (error) {
        console.error(`Error fetching image for ${query}:`, error.message);
        return null;
    }
};

const updateImages = async () => {
    console.log("Starting image update process...");

    for (const state of statesData) {
        console.log(`Processing state: ${state.name}`);
        for (const place of state.places) {
            // Try to get image for the specific place
            // Sometimes adding "India" or the state name helps disambiguate
            let imageUrl = await getImageFromWiki(place.name);

            if (!imageUrl) {
                // Retry with Place + State
                imageUrl = await getImageFromWiki(`${place.name} ${state.name}`);
            }

            if (!imageUrl) {
                // Retry with Place + "India"
                imageUrl = await getImageFromWiki(`${place.name} India`);
            }

            if (imageUrl) {
                console.log(`  Updated: ${place.name}`);
                place.image = imageUrl;
            } else {
                console.log(`  No image found for: ${place.name}, keeping existing/placeholder.`);
                // Fallback to a better placeholder if it's currently a text one
                if (place.image.includes('placehold.co')) {
                    place.image = `https://source.unsplash.com/800x600/?${encodeURIComponent(place.name)},tourism,india`;
                }
            }

            // Be nice to the API - increased delay
            await new Promise(resolve => setTimeout(resolve, 500));
        }
        // Save execution progress after every state to avoid total data loss on crash
        fs.writeFileSync(statesFilePath, JSON.stringify(statesData, null, 4));
    }

    console.log("All states updated successfully!");
};

updateImages().catch(err => {
    console.error("Fatal error in updateImages:", err);
    // Try to save whatever we have
    fs.writeFileSync(statesFilePath, JSON.stringify(statesData, null, 4));
});
