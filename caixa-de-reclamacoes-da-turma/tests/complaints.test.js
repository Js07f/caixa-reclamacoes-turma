// tests/complaints.test.js
const request = require('supertest'); // Importing supertest for testing HTTP requests
const app = require('../src/server'); // Importing the Express app from the server file

describe('Complaints API', () => {
    // Test for the POST /enviar endpoint
    it('should submit a complaint successfully', async () => {
        const response = await request(app)
            .post('/enviar') // Sending a POST request to the /enviar endpoint
            .send({ message: 'This is a test complaint.' }) // Sending a test complaint message
            .set('Accept', 'application/json'); // Setting the Accept header to application/json

        expect(response.status).toBe(200); // Expecting a 200 OK response
        expect(response.body).toHaveProperty('success', true); // Expecting a success property in the response
    });

    // Test for submitting a complaint without a message
    it('should return an error when message is empty', async () => {
        const response = await request(app)
            .post('/enviar') // Sending a POST request to the /enviar endpoint
            .send({ message: '' }) // Sending an empty message
            .set('Accept', 'application/json'); // Setting the Accept header to application/json

        expect(response.status).toBe(400); // Expecting a 400 Bad Request response
        expect(response.body).toHaveProperty('error', 'Message is required.'); // Expecting an error message in the response
    });
});