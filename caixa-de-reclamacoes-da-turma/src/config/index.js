// src/config/index.js

// Import the dotenv package to load environment variables from the .env file
require('dotenv').config();

// Configuration object to hold application settings
const config = {
    // Application port, defaulting to 3000 if not specified in the environment
    PORT: process.env.PORT || 3000,
    
    // Database file path, can be modified as needed
    DB_FILE: process.env.DB_FILE || 'src/db/reclamacoes.json',
    
    // Other configuration settings can be added here
};

// Export the configuration object for use in other parts of the application
module.exports = config;