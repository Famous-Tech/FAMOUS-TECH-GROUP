<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Liste des Commandes - FAMOUS-TECH GROUP</title>
    <link rel="stylesheet" href="admin.css"> <!-- Lien vers ton fichier CSS -->
</head>
<body>
    <div class="container">
        <?php
        // Inclure le fichier de configuration pour la connexion à la base de données
        include 'config.php';

        // Requête pour récupérer les commandes
        $sql = "SELECT * FROM commandes";
        $result = $conn->query($sql);

        // Vérification du résultat
        if ($result && $result->num_rows > 0) {
            echo "<h2>Liste des Commandes</h2>";

            // Structure de la table avec des classes pour un style CSS plus propre
            echo "<table class='table'>
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Nom</th>
                            <th>Email</th>
                            <th>Service</th>
                            <th>Détails</th>
                            <th>Date</th>
                        </tr>
                    </thead>
                    <tbody>";

            // Affichage des lignes de commandes
            while ($row = $result->fetch_assoc()) {
                // Utilisation de htmlspecialchars pour protéger contre les attaques XSS
                echo "<tr>
                        <td>" . htmlspecialchars($row['id'], ENT_QUOTES, 'UTF-8') . "</td>
                        <td>" . htmlspecialchars($row['nom'], ENT_QUOTES, 'UTF-8') . "</td>
                        <td>" . htmlspecialchars($row['email'], ENT_QUOTES, 'UTF-8') . "</td>
                        <td>" . htmlspecialchars($row['service'], ENT_QUOTES, 'UTF-8') . "</td>
                        <td>" . htmlspecialchars($row['details'], ENT_QUOTES, 'UTF-8') . "</td>
                        <td>" . htmlspecialchars($row['date_commande'], ENT_QUOTES, 'UTF-8') . "</td>
                      </tr>";
            }

            echo "</tbody></table>";
        } else {
            echo "<p>Aucune commande trouvée.</p>";
        }

        // Fermer la connexion à la base de données
        $conn->close();
        ?>
    </div>
</body>
</html>
