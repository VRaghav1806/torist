const fs = require('fs');
const path = require('path');

const states = [
    {
        id: "andaman-nicobar-island",
        name: "Andaman & Nicobar Island",
        description: "A tropical paradise known for its pristine beaches, clear blue waters, and vibrant marine life.",
        places: [
            "Radhanagar Beach", "Cellular Jail", "Ross Island", "Elephant Beach", "Neil Island",
            "Baratang Island", "Chidiya Tapu", "North Bay Island", "Mount Harriet National Park", "Wandoor Beach"
        ]
    },
    {
        id: "andhra-pradesh",
        name: "Andhra Pradesh",
        description: "Known for its rich cultural heritage, ancient temples, and beautiful coastline.",
        places: [
            "Tirumala Venkateswara Temple", "Kailasagiri", "Araku Valley", "Amaralingeswara Temple", "Srisailam Temple",
            "Kanaka Durga Temple", "Lepakshi", "Gandikota", "Belum Caves", "Horsley Hills"
        ]
    },
    {
        id: "arunachal-pradesh",
        name: "Arunachal Pradesh",
        description: "The land of dawn-lit mountains, offering spectacular landscapes and unique tribal culture.",
        places: [
            "Tawang Monastery", "Ziro Valley", "Namdapha National Park", "Sela Pass", "Roing",
            "Itanagar", "Bomdila", "Dirang", "Pasighat", "Mechuka"
        ]
    },
    {
        id: "assam",
        name: "Assam",
        description: "Famous for its tea gardens, wildlife sanctuaries, and the mighty Brahmaputra river.",
        places: [
            "Kaziranga National Park", "Umananda Island", "Majuli Island", "Manas National Park", "Kamakhya Temple",
            "Agnigarh", "Rang Ghar", "Joypur Rainforest", "Haflong Hill", "Pobitora Wildlife Sanctuary"
        ]
    },
    {
        id: "bihar",
        name: "Bihar",
        description: "A land of deep history and spirituality, birthplace of Buddhism and Jainism.",
        places: [
            "Bodh Gaya", "Nalanda", "Rajgir", "Golghar", "Vaishali",
            "Pawapuri", "Valmiki National Park", "Vikramshila", "Kesaria Stupa", "Tomb of Sher Shah Suri"
        ]
    },
    {
        id: "chandigarh",
        name: "Chandigarh",
        description: "The first planned city of India, known for its architecture and urban design.",
        places: [
            "Rock Garden", "Sukhna Lake", "Rose Garden", "Pinjore Gardens", "Government Museum and Art Gallery",
            "Sector 17 Market", "Japanese Garden", "Terraced Garden", "Le Corbusier Centre", "ChattBir Zoo"
        ]
    },
    {
        id: "chhattisgarh",
        name: "Chhattisgarh",
        description: "Known for its waterfalls, temples, and rich tribal heritage.",
        places: [
            "Chitrakote Falls", "Tirathgarh Falls", "Nandan Van Zoo", "Laxman Temple", "Barnawapara Wildlife Sanctuary",
            "Mainpat", "Bhoramdeo Temple", "Danteshwari Temple", "Bastars Palace", "Kanger Valley National Park"
        ]
    },
    {
        id: "dadara-nagar-havelli",
        name: "Dadara & Nagar Havelli",
        description: "A union territory known for its lush green forests, winding rivers, and tribal culture.",
        places: [
            "Vanganga Lake", "Hirwa Van Garden", "Tribal Cultural Museum", "Dudhni Lake", "Satmalia Deer Park",
            "Lion Safari Vasona", "Kauncha", "Madhuban Dam", "Bindrabin Temple", "Khanvel"
        ]
    },
    {
        id: "daman-diu",
        name: "Daman & Diu",
        description: "Coastal retreats with colonial Portuguese forts, churches, and scenic beaches.",
        places: [
            "Naida Caves", "Diu Fort", "Nagoa Beach", "Jampore Beach", "Devka Beach",
            "St. Paul's Church", "Ghoghla Beach", "Mirasol Lake Garden", "Zampa Gateway", "Fort Jerome"
        ]
    },
    {
        id: "delhi",
        name: "NCT of Delhi",
        description: "The capital of India, a mix of ancient history and modern chaos.",
        places: [
            "India Gate", "Red Fort", "Qutub Minar", "Lotus Temple", "Humayun's Tomb",
            "Akshardham Temple", "Chandni Chowk", "Jama Masjid", "Rashtrapati Bhavan", "Lodhi Gardens"
        ]
    },
    {
        id: "goa",
        name: "Goa",
        description: "Famous for its beaches, nightlife, Portuguese heritage, and relaxed vibe.",
        places: [
            "Calangute Beach", "Basilica of Bom Jesus", "Dudhsagar Falls", "Fort Aguada", "Anjuna Beach",
            "Baga Beach", "Chapora Fort", "Palolem Beach", "Se Cathedral", "Dona Paula"
        ]
    },
    {
        id: "gujarat",
        name: "Gujarat",
        description: "Known for its diverse landscapes, from the Rann of Kutch to the Gir forests.",
        places: [
            "Statue of Unity", "Gir National Park", "Rann of Kutch", "Sabarmati Ashram", "Somnath Temple",
            "Dwarkadhish Temple", "Laxmi Vilas Palace", "Rani ki Vav", "Saputara", "Dholavira"
        ]
    },
    {
        id: "haryana",
        name: "Haryana",
        description: "A state with a rich history, known for the Battle of Panipat and Kurukshetra.",
        places: [
            "Sultanpur National Park", "Brahma Sarovar", "Morni Hills", "Pinjore Gardens", "Damdama Lake",
            "Kingdom of Dreams", "Kabuli Bagh Mosque", "Surajkund", "Raja Nahar Singh Palace", "Karnal Lake"
        ]
    },
    {
        id: "himachal-pradesh",
        name: "Himachal Pradesh",
        description: "A Himalayan state famous for its scenic mountain towns and adventure sports.",
        places: [
            "Manali", "Shimla", "Dharamshala", "Spiti Valley", "Kasol",
            "Dalhousie", "Bir Billing", "Kasauli", "Khajjiar", "Rohtang Pass"
        ]
    },
    {
        id: "jammu-kashmir",
        name: "Jammu & Kashmir",
        description: "Often called 'Paradise on Earth', known for its mountains, lakes, and gardens.",
        places: [
            "Srinagar", "Gulmarg", "Pahalgam", "Sonamarg", "Vaishno Devi",
            "Dal Lake", "Mughal Gardens", "Leh-Ladakh (Region)", "Patnitop", "Hemis National Park"
        ]
    },
    {
        id: "jharkhand",
        name: "Jharkhand",
        description: "The land of forests, known for its waterfalls, hills, and holy places.",
        places: [
            "Pahari Mandir", "Jubilee Park", "Baidyanath Temple", "Betla National Park", "Dassam Falls",
            "Jonha Falls", "Hundru Falls", "Parasnath Hills", "Palamu Fort", "Massanjore Dam"
        ]
    },
    {
        id: "karnataka",
        name: "Karnataka",
        description: "A mix of modern cities, ancient ruins, hill stations, and beaches.",
        places: [
            "Hampi", "Mysore Palace", "Coorg", "Lalbagh Botanical Garden", "Gokarna",
            "Jog Falls", "Baba Budangiri", "Bandipur National Park", "Badami Caves", "Murudeshwar"
        ]
    },
    {
        id: "kerala",
        name: "Kerala",
        description: "God's Own Country, famous for its backwaters, Ayurveda, and tropical greenery.",
        places: [
            "Munnar", "Alleppey", "Wayanad", "Fort Kochi", "Varkala",
            "Periyar National Park", "Kovalam", "Kumarakom", "Athirappilly Waterfalls", "Poovar Island"
        ]
    },
    {
        id: "lakshadweep",
        name: "Lakshadweep",
        description: "A group of stunning coral islands with crystal clear waters.",
        places: [
            "Agatti Island", "Minicoy Island", "Bangaram Island", "Kavaratti Island", "Kalpeni Island",
            "Kadmat Island", "Marine Museum", "Lighthouse", "Thinnakara Island", "Amindivi Islands"
        ]
    },
    {
        id: "madhya-pradesh",
        name: "Madhya Pradesh",
        description: "The heart of India, known for its wildlife, temples, and history.",
        places: [
            "Khajuraho Temples", "Kanha National Park", "Sanchi Stupa", "Gwalior Fort", "Bandhavgarh National Park",
            "Pachmarhi", "Ujjain", "Bhedaghat", "Orchha", "Bhimbetka Caves"
        ]
    },
    {
        id: "maharashtra",
        name: "Maharashtra",
        description: "Home to Mumbai, ancient caves, hill stations, and beaches.",
        places: [
            "Gateway of India", "Ajanta and Ellora Caves", "Mahabaleshwar", "Shirdi", "Lonavala",
            "Mumbai Marine Drive", "Elephanta Caves", "Panchgani", "Nashik", "Tadoba National Park"
        ]
    },
    {
        id: "manipur",
        name: "Manipur",
        description: "Known as the Jeweled Land, famous for its dance and natural beauty.",
        places: [
            "Loktak Lake", "Imphal", "Keibul Lamjao National Park", "Kangla Fort", "Shirui Kashong Peak",
            "INA Memorial", "Moreh", "Khongjom War Memorial", "Tharon Cave", "Singda Dam"
        ]
    },
    {
        id: "meghalaya",
        name: "Meghalaya",
        description: "The Abode of Clouds, known for its rainfall, living root bridges, and waterfalls.",
        places: [
            "Cherrapunji", "Shillong", "Mawlynnong", "Dawki River", "Double Decker Living Root Bridge",
            "Nohkalikai Falls", "Elephant Falls", "Mawsynram", "Umiam Lake", "Laitlum Canyons"
        ]
    },
    {
        id: "mizoram",
        name: "Mizoram",
        description: "A land of rolling hills, valleys, rivers, and lakes.",
        places: [
            "Aizawl", "Vantawng Falls", "Reieiek", "Phawngpui Peak", "Tam Dil Lake",
            "Murlen National Park", "Dampa Tiger Reserve", "Solomon's Temple", "Falkawn Village", "Palak Lake"
        ]
    },
    {
        id: "nagaland",
        name: "Nagaland",
        description: "Land of festivals, known for its rich tribal culture and hills.",
        places: [
            "Kohima", "Dzukou Valley", "Mon", "Mokokchung", "Wokha",
            "Dimapur", "Khonoma Village", "Tuensang", "Longwa Village", "Kisama Heritage Village"
        ]
    },
    {
        id: "odisha",
        name: "Odisha",
        description: "Known for its ancient temples, beaches, and tribal culture.",
        places: [
            "Konark Sun Temple", "Puri Jagannath Temple", "Chilika Lake", "Lingaraj Temple", "Simlipal National Park",
            "Udayagiri and Khandagiri Caves", "Dhauli", "Paradip Port Beach", "Gopalpur Beach", "Nandankanan Zoological Park"
        ]
    },
    {
        id: "puducherry",
        name: "Puducherry",
        description: "A French colonial settlement with a unique blend of cultures.",
        places: [
            "Promenade Beach", "Auroville", "Sri Aurobindo Ashram", "Paradise Beach", "Arikamedu",
            "Basilica of the Sacred Heart of Jesus", "Rock Beach", "Ousteri Lake", "Botanical Garden", "French War Memorial"
        ]
    },
    {
        id: "punjab",
        name: "Punjab",
        description: "The land of five rivers, known for its Golden Temple and vibrant culture.",
        places: [
            "Golden Temple", "Wagah Border", "Jallianwala Bagh", "Rock Garden (Chandigarh)", "Anandpur Sahib",
            "Patiala", "Bhatinda Fort", "Qila Mubarak", "Harike Wetland", "Ranjit Sagar Dam"
        ]
    },
    {
        id: "rajasthan",
        name: "Rajasthan",
        description: "The Land of Kings, featuring deserts, forts, and palaces.",
        places: [
            "Hawa Mahal", "Lake Pichola", "Jaisalmer Fort", "Mehrangarh Fort", "Brahma Temple",
            "Ranthambore National Park", "Mount Abu", "Ajmer Sharif Dargah", "Junagarh Fort", "Chittorgarh Fort"
        ]
    },
    {
        id: "sikkim",
        name: "Sikkim",
        description: "A small Himalayan state known for Kanchenjunga and Buddhist monasteries.",
        places: [
            "Gangtok", "Tsomgo Lake", "Nathula Pass", "Pelling", "Yumthang Valley",
            "Gurudongmar Lake", "Rumtek Monastery", "Ravangla", "Zuluk", "Lachung"
        ]
    },
    {
        id: "tamil-nadu",
        name: "Tamil Nadu",
        description: "Famous for its Dravidian temples, hill stations, and beaches.",
        places: [
            "Marina Beach", "Meenakshi Amman Temple", "Mahabalipuram", "Ooty", "Kodaikanal",
            "Ramanathaswamy Temple", "Vivekananda Rock Memorial", "Brihadisvara Temple", "Adiyogi Shiva Statue", "Yercaud"
        ]
    },
    {
        id: "telangana",
        name: "Telangana",
        description: "Known for its historic sites, especially in Hyderabad, and unique culture.",
        places: [
            "Charminar", "Golconda Fort", "Hussain Sagar Lake", "Ramoji Film City", "Warangal Fort",
            "Thousand Pillar Temple", "Nagarjuna Sagar Dam", "Chowmahalla Palace", "Salar Jung Museum", "Birla Mandir"
        ]
    },
    {
        id: "tripura",
        name: "Tripura",
        description: "A state of hills, valleys, and palaces with a rich history.",
        places: [
            "Agartala", "Ujjayanta Palace", "Neermahal", "Unakoti", "Sepahijala Wildlife Sanctuary",
            "Tripura Sundari Temple", "Jampui Hills", "Dumboor Lake", "Heritage Park", "Buddha Temple"
        ]
    },
    {
        id: "uttar-pradesh",
        name: "Uttar Pradesh",
        description: "Home to the Taj Mahal and the spiritual heart of India.",
        places: [
            "Taj Mahal", "Kashi Vishwanath Temple", "Bara Imambara", "Agra Fort", "Fatehpur Sikri",
            "Krishna Janmabhoomi", "Vrindavan", "Triveni Sangam", "Sarnath", "Ram Mandir"
        ]
    },
    {
        id: "uttarakhand",
        name: "Uttarakhand",
        description: "Land of Gods, known for pilgrimage sites and Himalayan beauty.",
        places: [
            "Laxman Jhula", "Har Ki Pauri", "Nainital Lake", "Kempty Falls", "Kedarnath Temple",
            "Badrinath Temple", "Jim Corbett National Park", "Auli", "Valley of Flowers", "Robber's Cave"
        ]
    },
    {
        id: "west-bengal",
        name: "West Bengal",
        description: "Known for its culture, literature, and the Sundarbans.",
        places: [
            "Dakshineswar Kali Temple", "Darjeeling Tea Gardens", "Sundarbans National Park", "Victoria Memorial", "Howrah Bridge",
            "New Digha Beach", "Durpin Dara Hill", "Hazarduari Palace", "Visva Bharati University", "Bakkhali"
        ]
    }
];

// Helper to generate Placeholder URL (Unsplash source is deprecated/unreliable)
const getImageUrl = (query) => `https://placehold.co/800x600?text=${encodeURIComponent(query)}`;

const generateData = () => {
    const fullData = states.map(state => ({
        id: state.id,
        name: state.name,
        description: state.description,
        places: state.places.map(place => {
            // Helper to determine mood based on keywords
            const getMoods = (name) => {
                const moods = [];
                const lowerName = name.toLowerCase();
                if (lowerName.includes('temple') || lowerName.includes('church') || lowerName.includes('ashram')) moods.push('Spiritual', 'Culture');
                if (lowerName.includes('beach') || lowerName.includes('lake') || lowerName.includes('falls')) moods.push('Nature', 'Relax');
                if (lowerName.includes('fort') || lowerName.includes('palace') || lowerName.includes('museum')) moods.push('History', 'Culture');
                if (lowerName.includes('park') || lowerName.includes('sanctuary') || lowerName.includes('hill')) moods.push('Nature', 'Adventure');
                if (moods.length === 0) moods.push('Leisure');
                return [...new Set(moods)]; // Unique moods
            };

            const getBudget = () => {
                const budgets = ['Low', 'Medium', 'High'];
                return budgets[Math.floor(Math.random() * budgets.length)];
            };

            return {
                name: place,
                image: getImageUrl(`${place},${state.name},india,tourism`),
                description: `Explore the beauty of ${place} in ${state.name}. A must-visit destination for tourists.`,
                rating: (Math.random() * (5.0 - 3.5) + 3.5).toFixed(1), // 3.5 to 5.0
                budget: getBudget(),
                openingHours: '09:00 AM - 06:00 PM',
                moods: getMoods(place),
                bestTime: 'October to March',
                transport: 'Bus, Taxi, Auto'
            };
        })
    }));

    fs.writeFileSync(path.join(__dirname, '../data/states.json'), JSON.stringify(fullData, null, 4));
    console.log('States data generated successfully!');
};

generateData();
