document.addEventListener('DOMContentLoaded', () => {
    const scrollToTop = document.getElementById('scroll-to-top');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 300) {
            scrollToTop.classList.add('visible');
        } else {
            scrollToTop.classList.remove('visible');
        }
    });

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

    const orderForm = document.getElementById('orderForm');
    orderForm.addEventListener('submit', async (event) => {
        event.preventDefault();

        const formData = new FormData(orderForm);
        const order = Object.fromEntries(formData.entries());

        try {
            const response = await fetch('https://famous-server.onrendercom/command', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization Bearer': '1609'
                },
                body: JSON.stringify(order)
            });

            if (response.ok) {
                alert('Commande soumise avec succès!');
                orderForm.reset();
            } else {
                alert('Erreur lors de la soumission de la commande.');
            }
        } catch (error) {
            console.error('Erreur:', error);
            alert('Erreur lors de la soumission de la commande.');
        }
    });
});
