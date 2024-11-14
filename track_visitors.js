<<<<<<< HEAD
// track_visitors.js
const fs = require('fs');
const axios = require('axios');
=======
const fs = require('fs');
const axios = require('axios');
const Joi = require('joi');

const ipSchema = Joi.string().ip({ version: ['ipv4', 'ipv6'] }).required();
>>>>>>> f5afb80 (Ajout et modification de fichiers)

exports.handler = async (event) => {
    const ip = event.headers['x-forwarded-for'] || event.headers['x-real-ip'] || event.requestContext.identity.sourceIp;

<<<<<<< HEAD
=======
    const { error } = ipSchema.validate(ip);
    if (error) {
        return {
            statusCode: 400,
            body: 'Invalid IP address'
        };
    }

>>>>>>> f5afb80 (Ajout et modification de fichiers)
    try {
        const locationResponse = await axios.get(`http://api.ipstack.com/${ip}?access_key=YOUR_ACCESS_KEY`);
        const location = locationResponse.data;

        const visitorData = {
            ip: ip,
            location: location,
            date: new Date().toISOString()
        };

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
<<<<<<< HEAD
};
=======
};
>>>>>>> f5afb80 (Ajout et modification de fichiers)
