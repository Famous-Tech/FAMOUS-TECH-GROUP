ALTER TABLE commandes
ADD COLUMN access_key TEXT UNIQUE,
ADD COLUMN status TEXT DEFAULT 'Commande reçue',
ADD COLUMN admin_message TEXT;