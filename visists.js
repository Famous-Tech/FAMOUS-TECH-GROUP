document.addEventListener('DOMContentLoaded', function() {
    // Faire une requête AJAX vers track_visitors.php
    fetch('track_visitors.php')
        .then(response => response.text())
        .then(data => {
            // Vous pouvez ajouter des logs ici si vous souhaitez voir la réponse du serveur
            console.log('Visiteur enregistré:', data);
        })
        .catch(error => {
            console.error('Erreur lors de l\'enregistrement de la visite:', error);
        });
});
