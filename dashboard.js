const { Client } = require('pg');

exports.handler = async (event) => {
    if (event.httpMethod !== 'GET') {
        return {
            statusCode: 405,
            body: 'Method Not Allowed'
        };
    }

    const accessKey = event.queryStringParameters.accessKey;

    if (!accessKey) {
        return {
            statusCode: 400,
            body: 'Access key is required'
        };
    }

    const client = new Client({
        connectionString: process.env.DATABASE_URL,
        ssl: {
            rejectUnauthorized: false
        }
    });

    try {
        await client.connect();

        const query = 'SELECT * FROM commandes WHERE access_key = $1';
        const result = await client.query(query, [accessKey]);

        if (result.rows.length === 0) {
            return {
                statusCode: 404,
                body: 'Commande non trouvée'
            };
        }

        const commande = result.rows[0];

        const html = `
            <!DOCTYPE html>
            <html lang="fr">
            <head>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <title>Dashboard - FAMOUS-TECH GROUP</title>
                <style>
                    body {
                        font-family: Arial, sans-serif;
                        background-color: #f4f4f4;
                        margin: 0;
                        padding: 0;
                    }
                    .container {
                        max-width: 1200px;
                        margin: 0 auto;
                        padding: 20px;
                    }
                    .dashboard {
                        background-color: #fff;
                        padding: 20px;
                        border-radius: 8px;
                        box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
                    }
                    .status {
                        padding: 10px;
                        border-radius: 5px;
                        margin-bottom: 20px;
                    }
                    .status.received { background-color: #d4edda; color: #155724; }
                    .status.in-progress { background-color: #fff3cd; color: #856404; }
                    .status.completed { background-color: #cce5ff; color: #004085; }
                    .status.cancelled { background-color: #f8d7da; color: #721c24; }
                    .status.delayed { background-color: #e2e3e5; color: #383d41; }
                </style>
            </head>
            <body>
                <div class="container">
                    <h1>Dashboard - FAMOUS-TECH GROUP</h1>
                    <div class="dashboard">
                        <h2>Détails de la Commande</h2>
                        <p><strong>Nom:</strong> ${commande.nom}</p>
                        <p><strong>Email:</strong> ${commande.email}</p>
                        <p><strong>Service:</strong> ${commande.service}</p>
                        <p><strong>Détails:</strong> ${commande.details}</p>
                        <div class="status ${commande.status.toLowerCase().replace(' ', '-')}">
                            <p><strong>État de la Commande:</strong> ${commande.status}</p>
                        </div>
                        <p><strong>Message de l'Admin:</strong> ${commande.admin_message || 'Aucun message'}</p>
                    </div>
                </div>
            </body>
            </html>
        `;

        return {
            statusCode: 200,
            headers: {
                'Content-Type': 'text/html'
            },
            body: html
        };
    } catch (error) {
        console.error('Erreur lors de la récupération des données:', error);
        return {
            statusCode: 500,
            body: 'Erreur lors de la récupération des données'
        };
    } finally {
        await client.end();
    }
};