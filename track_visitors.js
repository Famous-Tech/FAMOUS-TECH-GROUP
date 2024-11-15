const fs = require('fs');
const axios = require('axios');
const Joi = require('joi');

// Schéma Joi pour valider l'adresse IP
const ipSchema = Joi.string().ip({ version: ['ipv4', 'ipv6'] }).required();

exports.handler = async (event) => {
    // Récupérer l'adresse IP du visiteur
    const ip = event.headers['x-forwarded-for'] || event.headers['x-real-ip'] || event.requestContext.identity.sourceIp;

    // Valider l'adresse IP
    const { error } = ipSchema.validate(ip);
    if (error) {
        return {
            statusCode: 400,
            body: 'Invalid IP address'
        };
    }

    try {
        // Récupérer la localisation du visiteur via l'API ipstack
        const locationResponse = await axios.get(`http://api.ipstack.com/${ip}?access_key=YOUR_ACCESS_KEY`);
        const location = locationResponse.data;

        // Créer un objet avec les données du visiteur
        const visitorData = {
            ip: ip,
            location: location,
            date: new Date().toISOString()
        };

        // Ajouter les données du visiteur au fichier visitors.json
        fs.appendFileSync('visitors.json', JSON.stringify(visitorData) + '\n');

        return {
            statusCode: 200,
            body: 'Visit recorded successfully'
        };
    } catch (error) {
        console.error('Error:', error);
        return {
            statusCode: 500,
            body: 'Error recording visit'
        };
    }
};
