<?php
// Inclure le fichier de configuration pour la connexion à la base de données
include 'config.php';

// Requête pour récupérer les commandes
$sql = "SELECT * FROM commandes";
$stmt = $conn->prepare($sql);
$stmt->execute();

$data = [];

// Vérification du résultat
if ($stmt->rowCount() > 0) {
    while ($row = $stmt->fetch(PDO::FETCH_ASSOC)) {
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
$conn = null;

// Renvoyer les données au format JSON
header('Content-Type: application/json');
echo json_encode($data);
?>
