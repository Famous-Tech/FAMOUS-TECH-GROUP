// admin.js
const { Client } = require('pg');
const fs = require('fs');

exports.handler = async (event) => {
    const client = new Client({
        connectionString: process.env.DATABASE_URL,
        ssl: {
            rejectUnauthorized: false
        }
    });

    try {
        await client.connect();

        // Récupérer les commandes depuis la base de données
        const ordersQuery = 'SELECT * FROM commandes';
        const ordersResult = await client.query(ordersQuery);
        const orders = ordersResult.rows.map(row => ({
            id: row.id,
            nom: row.nom,
            email: row.email,
            service: row.service,
            details: row.details,
            date_commande: row.date_commande
        }));

        // Récupérer les commandes depuis le fichier JSON
        let jsonOrders = [];
        if (fs.existsSync('commandes.json')) {
            const jsonData = fs.readFileSync('commandes.json', 'utf8');
            const jsonCommands = jsonData.split('\n').filter(line => line.trim() !== '');
            jsonOrders = jsonCommands.map(jsonCommand => JSON.parse(jsonCommand));
        }

        // Récupérer les statistiques des visiteurs depuis le fichier JSON
        let visitorsData = [];
        if (fs.existsSync('visitors.json')) {
            const jsonData = fs.readFileSync('visitors.json', 'utf8');
            const jsonVisitors = jsonData.split('\n').filter(line => line.trim() !== '');
            visitorsData = jsonVisitors.map(jsonVisitor => JSON.parse(jsonVisitor));
        }

        return {
            statusCode: 200,
            body: JSON.stringify({
                commandes: [...orders, ...jsonOrders],
                visitors: visitorsData
            })
        };
    } catch (error) {
        console.error('Error:', error);
        return {
            statusCode: 500,
            body: 'Error retrieving data'
        };
    } finally {
        await client.end();
    }
};
