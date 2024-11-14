require('dotenv').config();
const express = require('express');
const path = require('path');
const helmet = require('helmet');
const { Client } = require('pg');
const fs = require('fs');
const app = express();
const port = process.env.PORT || 3000;
const Joi = require('joi');
const rateLimit = require('express-rate-limit');
const bodyParser = require('body-parser');

app.use(helmet());

// En-têtes HTTP
app.use((req, res, next) => {
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-Frame-Options', 'DENY');
  res.setHeader('X-XSS-Protection', '1; mode=block');
  res.setHeader('Strict-Transport-Security', 'max-age=31536000; includeSubDomains');
  next();
});

// Bloquer les requêtes curl et wget
app.use((req, res, next) => {
  const userAgent = req.headers['user-agent'];
  if (userAgent && (userAgent.includes('curl') || userAgent.includes('Wget'))) {
    return res.status(403).send('Accès interdit');
  }
  next();
});

// Limite de taux
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
});
app.use(limiter);

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

async function checkDatabaseConnection() {
  const client = new Client({
    connectionString: process.env.DATABASE_URL,
    ssl: {
      rejectUnauthorized: false
    }
  });

  try {
    console.log('Tentative de connexion à la base de données...');
    await client.connect();
    console.log('Connexion à la base de données réussie');
    await client.end();
  } catch (error) {
    console.error('Erreur de connexion à la base de données L\'erreur est :', error);
   // process.exit(1);  Quitter le processus si la connexion échoue
  }
}

checkDatabaseConnection();

// Redirection des routes
app.use((req, res, next) => {
  const routes = {
    '/index.html': '/',
    '/faq.html': '/faq',
    '/admin.html': '/admin',
    '/command.html': '/commander',
    '/politique.html': '/Politique-de-confidentialite',
    '/merci.html': '/merci',
    '/services.html' : '/services'
  };

  if (routes[req.url]) {
    res.redirect(301, routes[req.url]);
  } else {
    next();
  }
});

// Routes pour les pages HTML
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.get('/faq', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'faq.html'));
});

app.get('/admin', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'admin.html'));
});

app.get('/commander', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'command.html'));
});

app.get('/Politique-de-confidentialite', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'politique.html'));
});
app.get('/services', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'services.html'));
});

app.get('/merci', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'merci.html'));
});

// API
const adminHandler = require('./admin').handler;
const submitHandler = require('./submit').handler;
const trackVisitorsHandler = require('./track_visitors').handler;
const loginHandler = require('./login').handler;
const dashboardHandler = require('./dashboard').handler;

app.get('/api/admins', async (req, res) => {
  try {
    const result = await adminHandler({ httpMethod: 'GET' });
    res.status(result.statusCode).send(result.body);
  } catch (error) {
    next(error);
  }
});

app.post('/api/submit', async (req, res, next) => {
  try {
    const result = await submitHandler({ httpMethod: 'POST', body: JSON.stringify(req.body) });
    res.status(result.statusCode).send(result.body);
  } catch (error) {
    next(error);
  }
});

app.get('/api/track_visitors', async (req, res) => {
  try {
    const result = await trackVisitorsHandler({ httpMethod: 'GET', headers: req.headers, requestContext: { identity: { sourceIp: req.ip } } });
    res.status(result.statusCode).send(result.body);
  } catch (error) {
    next(error);
  }
});

app.post('/api/login', async (req, res) => {
  try {
    const result = await loginHandler({ httpMethod: 'POST', body: JSON.stringify(req.body) });
    res.status(result.statusCode).send(result.body);
  } catch (error) {
    next(error);
  }
});

app.get('/dashboard', async (req, res) => {
  try {
    const result = await dashboardHandler({ httpMethod: 'GET', queryStringParameters: req.query });
    res.status(result.statusCode).send(result.body);
  } catch (error) {
    next(error);
  }
});

app.post('/api/update-commande', async (req, res) => {
  const { id, status, message } = req.body;

  const client = new Client({
    connectionString: process.env.DATABASE_URL,
    ssl: {
      rejectUnauthorized: false
    }
  });

  try {
    await client.connect();

    const query = 'UPDATE commandes SET status = $1, admin_message = $2 WHERE id = $3';
    await client.query(query, [status, message, id]);

    res.status(200).send({ message: 'Commande mise à jour avec succès' });
  } catch (error) {
    console.error('Erreur lors de la mise à jour de la commande:', error);
    res.status(500).send({ message: 'Erreur lors de la mise à jour de la commande' });
  } finally {
    await client.end();
  }
});

// Utilisation du dossier "public"
app.use(express.static(path.join(__dirname, 'public'), {
  setHeaders: (res, path) => {
    if (path.includes('.env') || path.includes('index.js')) {
      res.status(403).send('Accès interdit');
    }
  }
}));

// Gestion des erreurs
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Something broke!');
});

// Gestion des routes non trouvées
app.use((req, res) => {
  res.status(404).sendFile(path.join(__dirname, 'public', '404.html'));
});

app.listen(port, () => {
  console.log(`Serveur démarré sur le port ${port}`);
  console.log(`FAMOUS-TECH-GROUP site launched,in local get it at : http://localhost:${port}`);
});

module.exports = app; // Pour les tests