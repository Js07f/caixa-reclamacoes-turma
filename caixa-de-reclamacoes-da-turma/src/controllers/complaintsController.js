// src/controllers/complaintsController.js

const fs = require('fs');
const path = require('path');
const Complaint = require('../models/complaint');

// Path to the JSON file where complaints will be stored
const complaintsFilePath = path.join(__dirname, '../db/reclamacoes.json');

/**
 * Handles the logic for processing complaints.
 * @param {Object} req - The request object containing complaint data.
 * @param {Object} res - The response object used to send responses.
 */
const submitComplaint = (req, res) => {
    const { message } = req.body;

    // Validate the complaint message
    if (!message || message.trim() === '') {
        return res.status(400).json({ error: 'Complaint message is required.' });
    }

    // Create a new complaint object
    const newComplaint = new Complaint(message);

    // Read existing complaints from the JSON file
    fs.readFile(complaintsFilePath, 'utf8', (err, data) => {
        if (err) {
            return res.status(500).json({ error: 'Error reading complaints file.' });
        }

        let complaints = [];
        if (data) {
            complaints = JSON.parse(data);
        }

        // Add the new complaint to the array
        complaints.push(newComplaint);

        // Write the updated complaints back to the JSON file
        fs.writeFile(complaintsFilePath, JSON.stringify(complaints, null, 2), (err) => {
            if (err) {
                return res.status(500).json({ error: 'Error saving complaint.' });
            }

            // Respond with success message
            res.status(201).json({ message: 'Complaint submitted successfully.' });
        });
    });
};

// Export the submitComplaint function for use in routes
module.exports = {
    submitComplaint,
};