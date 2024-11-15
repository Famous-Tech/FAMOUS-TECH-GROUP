const { Client } = require('pg');
const Joi = require('joi');
const crypto = require('crypto');

// Schéma Joi pour valider les données du formulaire
const schema = Joi.object({
    name: Joi.string().required(),
    email: Joi.string().email().required(),
    service: Joi.string().required(),
    details: Joi.string().required()
});

exports.handler = async (event) => {
    // Vérifier que la méthode HTTP est bien POST
    if (event.httpMethod !== 'POST') {
        return {
            statusCode: 405,
            body: 'Method Not Allowed'
        };
    }

    // Récupérer les données du formulaire
    const formData = JSON.parse(event.body);

    // Valider les données du formulaire
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
        ssl: {
            rejectUnauthorized: false
        }
    });

    try {
        await client.connect();

        // Générer une clé d'accès unique
        const accessKey = crypto.randomBytes(16).toString('hex');

        // Insérer la commande dans la base de données
        const query = 'INSERT INTO commandes (nom, email, service, details, access_key) VALUES ($1, $2, $3, $4, $5)';
        await client.query(query, [name, email, service, details, accessKey]);

        return {
            statusCode: 200,
            body: JSON.stringify({ message: 'Order submitted successfully', accessKey })
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
