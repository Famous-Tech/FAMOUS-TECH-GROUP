<?php
// Charger les variables d'environnement
$dotenv = parse_ini_file('.env');
foreach ($dotenv as $key => $value) {
    putenv("$key=$value");
}

// Détails de connexion à la base de données PostgreSQL
$databaseUrl = getenv('DATABASE_URL');
$url = parse_url($databaseUrl);

$host = $url['host'];
$dbname = ltrim($url['path'], '/');
$username = $url['user'];
$password = $url['pass'];
$port = $url['port'];
$sslmode = 'require';

// Créer une connexion à la base de données en utilisant PDO
try {
    $conn = new PDO("pgsql:host=$host;port=$port;dbname=$dbname;user=$username;password=$password;sslmode=$sslmode");
    // Configurer PDO pour lancer des exceptions en cas d'erreur
    $conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
} catch (PDOException $e) {
    die("Échec de la connexion : " . $e->getMessage());
}
?>
