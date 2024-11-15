const { Client } = require('pg');
const fs = require('fs');
const path = require('path');

exports.handler = async (event) => {
    // Vérifier que la méthode HTTP est bien GET
    if (event.httpMethod !== 'GET') {
        return {
            statusCode: 405,
            body: 'Method Not Allowed'
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

        // Récupérer les commandes depuis la base de données
        const commandesResult = await client.query('SELECT * FROM commandes');
        const commandes = commandesResult.rows;
        console.log('Commandes récupérées:', commandes);

        // Récupérer les visiteurs depuis le fichier JSON
        const visitorsFilePath = path.join(__dirname, 'visitors.json');
        const visitorsData = fs.readFileSync(visitorsFilePath, 'utf8');
        const visitors = JSON.parse(visitorsData);
        console.log('Visiteurs récupérés:', visitors);

        // Générer le HTML dynamiquement
        const html = `
            <!DOCTYPE html>
            <html lang="fr">
            <head>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <title>Admin - FAMOUS-TECH GROUP</title>
                <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0-beta3/css/all.min.css" />
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
                        display: flex;
                        flex-wrap: wrap;
                        gap: 20px;
                    }
                    .section {
                        background-color: #fff;
                        padding: 20px;
                        border-radius: 8px;
                        box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
                        flex: 1;
                    }
                    .profile {
                        text-align: center;
                    }
                    .profile img {
                        width: 100px;
                        height: 100px;
                        border-radius: 50%;
                    }
                    .profile h2 {
                        margin: 10px 0;
                    }
                    .profile p {
                        color: #777;
                    }
                    .table {
                        width: 100%;
                        border-collapse: collapse;
                    }
                    .table th, .table td {
                        padding: 10px;
                        border: 1px solid #ddd;
                    }
                    .table th {
                        background-color: #f4f4f4;
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
                <div class="container dashboard">
                    <div class="section profile">
                        <img src="images/profile.jpg" alt="Profile Picture" />
                        <h2>Admin Name</h2>
                        <p>Role: Super Admin</p>
                    </div>
                    <div class="section commandes">
                        <h3>Liste des Commandes</h3>
                        <table class="table">
                            <thead>
                                <tr>
                                    <th>ID</th>
                                    <th>Nom</th>
                                    <th>Email</th>
                                    <th>Service</th>
                                    <th>Détails</th>
                                    <th>Date</th>
                                    <th>État</th>
                                    <th>Message</th>
                                    <th>Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                ${commandes.map(commande => `
                                    <tr>
                                        <td>${commande.id}</td>
                                        <td>${commande.nom}</td>
                                        <td>${commande.email}</td>
                                        <td>${commande.service}</td>
                                        <td>${commande.details}</td>
                                        <td>${commande.date_commande}</td>
                                        <td>
                                            <select class="status-select" data-id="${commande.id}">
                                                <option value="Commande reçue" ${commande.status === 'Commande reçue' ? 'selected' : ''}>Commande reçue</option>
                                                <option value="En cours" ${commande.status === 'En cours' ? 'selected' : ''}>En cours</option>
                                                <option value="Terminée" ${commande.status === 'Terminée' ? 'selected' : ''}>Terminée</option>
                                                <option value="Annulée" ${commande.status === 'Annulée' ? 'selected' : ''}>Annulée</option>
                                                <option value="Retardée" ${commande.status === 'Retardée' ? 'selected' : ''}>Retardée</option>
                                            </select>
                                        </td>
                                        <td>
                                            <input type="text" class="message-input" data-id="${commande.id}" value="${commande.admin_message || ''}" placeholder="Message de l'admin">
                                        </td>
                                        <td>
                                            <button class="update-button" data-id="${commande.id}">Mettre à jour</button>
                                        </td>
                                    </tr>
                                `).join('')}
                            </tbody>
                        </table>
                    </div>
                    <div class="section stats">
                        <h3>Statistiques des Visiteurs</h3>
                        <table class="table">
                            <thead>
                                <tr>
                                    <th>IP</th>
                                    <th>Localisation</th>
                                    <th>Date</th>
                                </tr>
                            </thead>
                            <tbody>
                                ${visitors.map(visitor => `
                                    <tr>
                                        <td>${visitor.ip}</td>
                                        <td>${visitor.location}</td>
                                        <td>${visitor.date}</td>
                                    </tr>
                                `).join('')}
                            </tbody>
                        </table>
                    </div>
                </div>
                <script>
                    document.querySelectorAll('.update-button').forEach(button => {
                        button.addEventListener('click', async () => {
                            const id = button.getAttribute('data-id');
                            const statusSelect = document.querySelector(\`.status-select[data-id="\${id}"]\`);
                            const messageInput = document.querySelector(\`.message-input[data-id="\${id}"]\`);
                            const status = statusSelect.value;
                            const message = messageInput.value;

                            try {
                                const response = await fetch('/api/update-commande', {
                                    method: 'POST',
                                    headers: {
                                        'Content-Type': 'application/json'
                                    },
                                    body: JSON.stringify({ id, status, message })
                                });

                                if (response.ok) {
                                    alert('Commande mise à jour avec succès');
                                } else {
                                    alert('Erreur lors de la mise à jour de la commande');
                                }
                            } catch (error) {
                                console.error('Erreur:', error);
                                alert('Erreur lors de la mise à jour de la commande');
                            }
                        });
                    });
                </script>
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
