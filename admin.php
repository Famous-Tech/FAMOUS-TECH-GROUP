<?php
// Inclure le fichier de configuration pour la connexion à la base de données
include 'config.php';

// Requête pour récupérer les commandes depuis la base de données
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

// Récupérer les commandes depuis le fichier JSON
if (file_exists('commandes.json')) {
    $json_data = file_get_contents('commandes.json');
    $json_commands = explode("\n", $json_data);
    foreach ($json_commands as $json_command) {
        if (!empty($json_command)) {
            $command = json_decode($json_command, true);
            $data[] = [
                'id' => '', // Pas d'ID pour les commandes JSON
                'nom' => htmlspecialchars($command['nom'], ENT_QUOTES, 'UTF-8'),
                'email' => htmlspecialchars($command['email'], ENT_QUOTES, 'UTF-8'),
                'service' => htmlspecialchars($command['service'], ENT_QUOTES, 'UTF-8'),
                'details' => htmlspecialchars($command['details'], ENT_QUOTES, 'UTF-8'),
                'date_commande' => htmlspecialchars($command['date_commande'], ENT_QUOTES, 'UTF-8')
            ];
        }
    }
}

// Récupérer les statistiques des visiteurs
$visitors_data = [];
if (file_exists('visitors.json')) {
    $json_data = file_get_contents('visitors.json');
    $json_visitors = explode("\n", $json_data);
    foreach ($json_visitors as $json_visitor) {
        if (!empty($json_visitor)) {
            $visitor = json_decode($json_visitor, true);
            $visitors_data[] = [
                'ip' => htmlspecialchars($visitor['ip'], ENT_QUOTES, 'UTF-8'),
                'location' => htmlspecialchars($visitor['location']['city'] . ', ' . $visitor['location']['region_name'], ENT_QUOTES, 'UTF-8'),
                'date' => htmlspecialchars($visitor['date'], ENT_QUOTES, 'UTF-8')
            ];
        }
    }
}

// Renvoyer les données au format JSON
header('Content-Type: application/json');
echo json_encode(['commandes' => $data, 'visitors' => $visitors_data]);
?>
