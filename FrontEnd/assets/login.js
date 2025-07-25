const form = document.querySelector('#login form');
const emailInput = document.querySelector('#email');
const passwordInput = document.querySelector('#password');

form.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const email = emailInput.value;
    const password = passwordInput.value;
    
    if (!email || !password) {
        displayError('Veuillez remplir tous les champs');
        return;
    }
    
    try {
        const response = await fetch('http://localhost:5678/api/users/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ email, password })
        });
        
        if (response.ok) {
            const data = await response.json();
            localStorage.setItem('authToken', data.token);
            localStorage.setItem('userId', data.userId);
            window.location.href = 'index.html';
        } else {
            const errorData = await response.json();
            if (response.status === 404) {
                displayError('Utilisateur introuvable');
            } else if (response.status === 401) {
                displayError('Mot de passe incorrect');
            } else {
                displayError('Erreur de connexion');
            }
        }
    } catch (error) {
        displayError('Erreur de connexion au serveur');
    }
});

function displayError(message) {
    let errorElement = document.querySelector('.error-message');
    
    if (!errorElement) {
        errorElement = document.createElement('div');
        errorElement.className = 'error-message';
        form.insertBefore(errorElement, form.firstChild);
    }
    
    errorElement.textContent = message;
    errorElement.style.display = 'block';
    
    setTimeout(() => {
        errorElement.style.display = 'none';
    }, 5000);
}