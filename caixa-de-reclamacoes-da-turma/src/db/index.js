// This file manages the database interactions, including reading from and writing to the reclamacoes.json file.

const fs = require('fs');
const path = require('path');

// Define the path to the JSON file that will store complaints
const complaintsFilePath = path.join(__dirname, 'reclamacoes.json');

// Function to read complaints from the JSON file
const readComplaints = () => {
    // Check if the file exists
    if (!fs.existsSync(complaintsFilePath)) {
        // If not, return an empty array
        return [];
    }
    // Read the file and parse the JSON data
    const data = fs.readFileSync(complaintsFilePath, 'utf-8');
    return JSON.parse(data);
};

// Function to write a new complaint to the JSON file
const writeComplaint = (complaint) => {
    // Read existing complaints
    const complaints = readComplaints();
    // Add the new complaint to the array
    complaints.push(complaint);
    // Write the updated complaints back to the file
    fs.writeFileSync(complaintsFilePath, JSON.stringify(complaints, null, 2));
};

// Export the functions for use in other parts of the application
module.exports = {
    readComplaints,
    writeComplaint,
};