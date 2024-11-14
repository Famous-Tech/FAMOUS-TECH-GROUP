const { Client } = require('pg');

async function createVisitorsTable() {
  const client = new Client({
    connectionString: process.env.DATABASE_URL,
    ssl: {
      rejectUnauthorized: false
    }
  });

  try {
    await client.connect();

    // Créer la table visitors
    await client.query(`
      CREATE TABLE visitors (
        id SERIAL PRIMARY KEY,
        ip VARCHAR(255) NOT NULL,
        location VARCHAR(255),
        date TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    console.log('Table visitors créée avec succès');
  } catch (error) {
    console.error('Erreur lors de la création de la table visitors:', error);
  } finally {
    await client.end();
  }
}

createVisitorsTable();