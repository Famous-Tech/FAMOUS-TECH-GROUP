<<<<<<< HEAD
// submit.js
const { Client } = require('pg');
=======
const { Client } = require('pg');
const Joi = require('joi');
const crypto = require('crypto');

const schema = Joi.object({
    name: Joi.string().required(),
    email: Joi.string().email().required(),
    service: Joi.string().required(),
    details: Joi.string().required()
});
>>>>>>> f5afb80 (Ajout et modification de fichiers)

exports.handler = async (event) => {
    if (event.httpMethod !== 'POST') {
        return {
            statusCode: 405,
            body: 'Method Not Allowed'
        };
    }

    const formData = JSON.parse(event.body);

<<<<<<< HEAD
    const { name, email, service, details } = formData;

    if (!name || !email || !service || !details) {
        return {
            statusCode: 400,
            body: 'Invalid input'
        };
    }

    const client = new Client({
        connectionString: process.env.POSTGRES_URL,
=======
    const { error } = schema.validate(formData);
    if (error) {
        return {
            statusCode: 400,
            body: error.details[0].message
        };
    }

    const { name, email, service, details } = formData;

    const client = new Client({
        connectionString: process.env.DATABASE_URL,
>>>>>>> f5afb80 (Ajout et modification de fichiers)
        ssl: {
            rejectUnauthorized: false
        }
    });

    try {
        await client.connect();

<<<<<<< HEAD
        const query = 'INSERT INTO commandes (nom, email, service, details) VALUES ($1, $2, $3, $4)';
        await client.query(query, [name, email, service, details]);

        return {
            statusCode: 200,
            body: 'Order submitted successfully'
=======
        // Générer une clé d'accès unique
        const accessKey = crypto.randomBytes(16).toString('hex');

        const query = 'INSERT INTO commandes (nom, email, service, details, access_key) VALUES ($1, $2, $3, $4, $5)';
        await client.query(query, [name, email, service, details, accessKey]);

        return {
            statusCode: 200,
            body: JSON.stringify({ message: 'Order submitted successfully', accessKey })
>>>>>>> f5afb80 (Ajout et modification de fichiers)
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
<<<<<<< HEAD
};
=======
};
>>>>>>> f5afb80 (Ajout et modification de fichiers)
