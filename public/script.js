document.addEventListener('DOMContentLoaded', () => {
    // Scroll-to-top functionality
    const scrollToTop = document.getElementById('scroll-to-top');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 300) {
            scrollToTop.classList.add('visible');
        } else {
            scrollToTop.classList.remove('visible');
        }
    });

    // FAQ toggle functionality
    const faqItems = document.querySelectorAll('.faq-item');
    faqItems.forEach(item => {
        item.addEventListener('click', () => {
            item.classList.toggle('active');
            const answer = item.querySelector('.faq-answer');
            if (item.classList.contains('active')) {
                answer.style.display = 'block';
            } else {
                answer.style.display = 'none';
            }
        });
    });

    // Order form submission functionality
    const orderForm = document.getElementById('orderForm');
    orderForm.addEventListener('submit', async (event) => {
        event.preventDefault();

        const formData = new FormData(orderForm);
        const data = {
            name: formData.get('name'),
            email: formData.get('email'),
            service: formData.get('service'),
            details: formData.get('details')
        };

        try {
            const response = await fetch('/api/submit', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(data)
            });

            if (response.ok) {
                alert('Commande soumise avec succès, redirection en cours...');
                window.location.href = 'merci.html';
            } else {
                alert('Erreur lors de la soumission de la commande.');
            }
        } catch (error) {
            console.error('Erreur:', error);
            alert('Erreur lors de la soumission de la commande.');
        }
    });
});
