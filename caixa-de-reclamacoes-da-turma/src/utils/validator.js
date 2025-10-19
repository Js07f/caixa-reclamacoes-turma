// src/utils/validator.js

// This utility module provides functions to validate complaint data before processing.

const validateComplaint = (complaint) => {
    // Check if the complaint message is provided and is a string
    if (!complaint || typeof complaint.message !== 'string' || complaint.message.trim() === '') {
        return { isValid: false, error: 'Complaint message is required and must be a non-empty string.' };
    }

    // Check if the message length is within acceptable limits
    if (complaint.message.length > 500) {
        return { isValid: false, error: 'Complaint message must not exceed 500 characters.' };
    }

    // If all validations pass, return valid status
    return { isValid: true, error: null };
};

// Export the validation function for use in other modules
module.exports = {
    validateComplaint,
};