document.addEventListener('DOMContentLoaded', function() {
    // Faire une requête AJAX 
    fetch('/api/track_visitors')
        .then(response => response.text())
        .then(data => {
            
            console.log('Visiteur enregistré:', data);
        })
        .catch(error => {
            console.error('Erreur lors de l\'enregistrement de la visite:', error);
        });
});
