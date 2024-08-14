const express = require('express');
const path = require('path');
const Airtable = require('airtable');
const bodyParser = require('body-parser');
const cors = require('cors');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 3000;

// Configure Airtable
Airtable.configure({
    apiKey: process.env.AIRTABLE_API_KEY,
});
const base = Airtable.base(process.env.AIRTABLE_BASE_ID);

// Use CORS to allow requests from the frontend
app.use(cors());

// Serve static files from 'public' directory
app.use(express.static(path.join(__dirname, 'public')));

// Serve kodan.html explicitly
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'kodan.html'));
});

// Use body-parser to parse JSON bodies
app.use(bodyParser.json());

app.post('/api/airtable', async (req, res) => {
    try {
        const { email, story } = req.body;
        let record;

        if (email) {
            // Handle email submission
            record = await base('Emails').create({
                "Emails": email
            });
            console.log('Email record created:', record);
        } else if (story) {
            // Handle story submission
            record = await base('Emails').create({
                "story": story
            });
            console.log('Story record created:', record);
        } else {
            throw new Error('Invalid submission: neither email nor story provided');
        }

        res.json({ message: 'Success', id: record.id });
    } catch (error) {
        console.error('Error creating record:', error);
        res.status(500).json({ error: error.message });
    }
});

app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
});