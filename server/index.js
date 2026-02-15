require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');
const fs = require('fs');
const Groq = require('groq-sdk');

const groq = new Groq({
    apiKey: process.env.GROQ_API_KEY,
});

const app = express();
const PORT = process.env.PORT || 5005;

// Configure CORS for production
app.use(cors({
    origin: process.env.FRONTEND_URL || '*',
    methods: ['GET', 'POST'],
    credentials: true
}));
app.use(express.json());

const getStatesData = () => {
    try {
        const data = fs.readFileSync(path.join(__dirname, './data/states.json'), 'utf8');
        return JSON.parse(data);
    } catch (err) {
        console.error("Error reading states data:", err);
        return [];
    }
};

// Routes
app.get('/api/states', (req, res) => {
    res.json(getStatesData());
});

app.get('/api/states/:id', (req, res) => {
    const statesData = getStatesData();
    const state = statesData.find(s => s.id === req.params.id);
    if (state) {
        res.json(state);
    } else {
        res.status(404).json({ message: 'State not found' });
    }
});

// AI Chat Route
app.post('/api/chat', async (req, res) => {
    const { message, history } = req.body;

    try {
        const statesData = getStatesData();
        // Create a condensed context of states and their places
        const contextData = statesData.map(state => ({
            name: state.name,
            id: state.id,
            places: (state.places || []).map(p => p.name)
        }));

        const systemPrompt = `You are the "India Tourist Guide" AI Advisor. 
        Your goal is to help users plan their trips to India and answer questions about Indian tourism.
        
        CRITICAL RULES:
        1. Base your recommendations on climate (best time to visit), timing (trip duration), and geography (shortest distance between places).
        2. Use the provided tourist data context to suggest specific places. 
        3. If you suggest a place that is in our database, format it as [Place Name](place:State-ID).
        4. Be helpful, enthusiastic, and informative.
        5. For planning, group places logically by proximity.
        
        AVAILABLE STATES AND PLACES CONTEXT:
        ${JSON.stringify(contextData)}
        `;

        const completion = await groq.chat.completions.create({
            messages: [
                { role: "system", content: systemPrompt },
                ...history,
                { role: "user", content: message }
            ],
            model: process.env.GROQ_MODEL || "llama-3.3-70b-versatile",
        });

        res.json({
            response: completion.choices[0].message.content,
            suggestedPlaces: [] // We can expand this later to return structured place data
        });
    } catch (err) {
        console.error("Groq API Error:", err);
        res.status(500).json({ message: "AI Advisor is currently unavailable." });
    }
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

// Keep alive interval
setInterval(() => {
    // console.log('Keep-alive tick');
}, 60000);

// Global Error Handlers
process.on('unhandledRejection', (reason, promise) => {
    console.error('Unhandled Rejection at:', promise, 'reason:', reason);
});

process.on('uncaughtException', (err) => {
    console.error('Uncaught Exception:', err);
});
