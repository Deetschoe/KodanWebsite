const express = require('express');
const path = require('path');
const Airtable = require('airtable');
const bodyParser = require('body-parser');
const cors = require('cors');
require('dotenv').config();

const app = express();
const port = 3000;

// Configure Airtable
Airtable.configure({
    apiKey: process.env.AIRTABLE_API_KEY,
});
const base = Airtable.base(process.env.AIRTABLE_BASE_ID);

// Use CORS to allow requests from the frontend
app.use(cors());

// Serve static files from 'public' directory
app.use(express.static(path.join(__dirname, 'public')));

// Use body-parser to parse JSON bodies
app.use(bodyParser.json());

// Endpoint to handle Airtable form submissions
app.post('/api/airtable', async (req, res) => {
    const { email } = req.body;
    console.log('Received email:', email); // Debugging statement
    try {
        const records = await base(process.env.AIRTABLE_TABLE_NAME).create([
            {
                fields: {
                    Emails: email, // Ensure this matches the field name in Airtable
                },
            },
        ]);
        res.status(200).json({ message: 'Success', records });
    } catch (error) {
        console.error('Error creating record:', error);
        res.status(500).json({ message: 'Error', error: error.message });
    }
});

app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
});
