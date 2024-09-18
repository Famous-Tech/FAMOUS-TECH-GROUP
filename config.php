<?php
// Détails de connexion à la base de données
$host = 'mysql.hostinger.com';  // Use nom serveur hébergeur la baw la sa se pou hostiger
$dbname = 'famoustechdb';  // Nom de ta base de données
$username = 'tech_famous';  // use nom d'utilisateur hébergeur la
$password = 'Habby_LordInferfo999&@^#:@&,@,';  // Mot de passe de l'utilisateur

// Créer une connexion à la base de données en utilisant MySQLi
$conn = new mysqli($host, $username, $password, $dbname);

// Vérifier la connexion
if ($conn->connect_error) {
    die("Échec de la connexion : " . $conn->connect_error);
}
?>
