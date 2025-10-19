// This file defines the structure of a complaint object.
// It includes properties like message and timestamp.

class Complaint {
    constructor(message) {
        this.message = message; // The content of the complaint
        this.timestamp = new Date(); // The time when the complaint was created
    }
}

module.exports = Complaint; // Exporting the Complaint class for use in other modules