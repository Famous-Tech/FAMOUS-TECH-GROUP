<?php
// Inclure le fichier de configuration pour la connexion à la base de données
include 'config.php';

// Requête pour récupérer les commandes
$sql = "SELECT * FROM commandes";
$result = $conn->query($sql);

$data = [];

// Vérification du résultat
if ($result && $result->num_rows > 0) {
    while ($row = $result->fetch_assoc()) {
        $data[] = [
            'id' => htmlspecialchars($row['id'], ENT_QUOTES, 'UTF-8'),
            'nom' => htmlspecialchars($row['nom'], ENT_QUOTES, 'UTF-8'),
            'email' => htmlspecialchars($row['email'], ENT_QUOTES, 'UTF-8'),
            'service' => htmlspecialchars($row['service'], ENT_QUOTES, 'UTF-8'),
            'details' => htmlspecialchars($row['details'], ENT_QUOTES, 'UTF-8'),
            'date_commande' => htmlspecialchars($row['date_commande'], ENT_QUOTES, 'UTF-8')
        ];
    }
}

// Fermer la connexion à la base de données
$conn->close();

// Renvoyer les données au format JSON
header('Content-Type: application/json');
echo json_encode($data);
?>
