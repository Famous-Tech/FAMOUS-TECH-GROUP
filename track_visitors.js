// track_visitors.js
const fs = require('fs');
const axios = require('axios');

exports.handler = async (event) => {
    const ip = event.headers['x-forwarded-for'] || event.headers['x-real-ip'] || event.requestContext.identity.sourceIp;

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
};
