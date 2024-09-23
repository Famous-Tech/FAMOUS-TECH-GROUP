<?php
// Inclure le fichier de configuration pour la connexion à la base de données
include 'config.php';

// Récupérer l'adresse IP du visiteur
$ip = $_SERVER['REMOTE_ADDR'];

// Récupérer la localisation (vous pouvez utiliser une API comme ipstack)
$location_data = file_get_contents("http://api.ipstack.com/{$ip}?access_key=YOUR_ACCESS_KEY");
$location = json_decode($location_data, true);

// Enregistrer les données dans un fichier JSON
$visitor_data = [
    'ip' => $ip,
    'location' => $location,
    'date' => date('Y-m-d H:i:s')
];
$json_visitor_data = json_encode($visitor_data);
file_put_contents('visitors.json', $json_visitor_data . PHP_EOL, FILE_APPEND);

// Fermer la connexion à la base de données
$conn = null;

// Renvoyer une réponse pour confirmer l'enregistrement
echo "Visite enregistrée avec succès.";
?>
