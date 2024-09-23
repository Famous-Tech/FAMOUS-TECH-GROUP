-- Créer la table commandes dans la base de données existante
CREATE TABLE IF NOT EXISTS commandes (
    id SERIAL PRIMARY KEY,
    nom VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    service VARCHAR(255) NOT NULL,
    details TEXT NOT NULL,
    date_commande TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
