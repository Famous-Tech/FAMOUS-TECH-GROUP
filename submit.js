// submit.js
const { Client } = require('pg');

exports.handler = async (event) => {
    if (event.httpMethod !== 'POST') {
        return {
            statusCode: 405,
            body: 'Method Not Allowed'
        };
    }

    const formData = JSON.parse(event.body);

    const { name, email, service, details } = formData;

    if (!name || !email || !service || !details) {
        return {
            statusCode: 400,
            body: 'Invalid input'
        };
    }

    const client = new Client({
        connectionString: process.env.POSTGRES_URL,
        ssl: {
            rejectUnauthorized: false
        }
    });

    try {
        await client.connect();

        const query = 'INSERT INTO commandes (nom, email, service, details) VALUES ($1, $2, $3, $4)';
        await client.query(query, [name, email, service, details]);

        return {
            statusCode: 200,
            body: 'Order submitted successfully'
        };
    } catch (error) {
        console.error('Error:', error);
        return {
            statusCode: 500,
            body: 'Error submitting order'
        };
    } finally {
        await client.end();
    }
};
