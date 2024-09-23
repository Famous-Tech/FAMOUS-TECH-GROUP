<?php
// Inclure le fichier de configuration pour la connexion à la base de données
include 'config.php';

// Lire le contenu du fichier SQL
$sql = file_get_contents('famous_tech.sql');

// Exécuter le script SQL
try {
    $conn->exec($sql);
    echo "Script SQL exécuté avec succès.";
} catch (PDOException $e) {
    echo "Erreur lors de l'exécution du script SQL : " . $e->getMessage();
}

if ($_SERVER["REQUEST_METHOD"] == "POST") {
    // Filtrer et valider les entrées utilisateur
    $nom = htmlspecialchars(filter_input(INPUT_POST, 'name', FILTER_SANITIZE_STRING));
    $email = filter_input(INPUT_POST, 'email', FILTER_VALIDATE_EMAIL);
    $service = htmlspecialchars(filter_input(INPUT_POST, 'service', FILTER_SANITIZE_STRING));
    $details = htmlspecialchars(filter_input(INPUT_POST, 'details', FILTER_SANITIZE_STRING));

    // Vérifier que les entrées sont valides
    if ($nom && $email && $service && $details) {
        // Préparer la requête SQL pour éviter les injections SQL
        $stmt = $conn->prepare("INSERT INTO commandes (nom, email, service, details) VALUES (:nom, :email, :service, :details)");
        $stmt->bindParam(':nom', $nom);
        $stmt->bindParam(':email', $email);
        $stmt->bindParam(':service', $service);
        $stmt->bindParam(':details', $details);

        // Exécuter la requête et vérifier le succès
        if ($stmt->execute()) {
            // Redirection vers la page merci.html après succès
            header("Location: merci.html");
            exit(); // Assurer que le script s'arrête après la redirection
        } else {
            echo "Erreur : " . $stmt->errorInfo()[2];
        }
    } else {
        echo "Entrées invalides. Veuillez vérifier vos informations.";
    }

    // Fermer la connexion à la base de données
    $conn = null;
}
?>
