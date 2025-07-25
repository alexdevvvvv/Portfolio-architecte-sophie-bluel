function isLoggedIn() {
    return localStorage.getItem('authToken') !== null;
}

function logout() {
    localStorage.removeItem('authToken');
    localStorage.removeItem('userId');
    window.location.href = 'index.html';
}

function updateNavigation() {
    const loginLink = document.querySelector('nav a[href="login.html"]');
    const loginListItem = loginLink ? loginLink.parentElement : document.querySelector('nav li:nth-child(3)');
    
    if (isLoggedIn()) {
        document.body.classList.add('is-logged');
        
        if (loginLink) {
            loginLink.textContent = 'logout';
            loginLink.href = '#';
            loginLink.addEventListener('click', (e) => {
                e.preventDefault();
                logout();
            });
        } else {
            loginListItem.innerHTML = '<a href="#" onclick="logout()">logout</a>';
        }
    } else {
        document.body.classList.remove('is-logged');
        
        if (loginLink) {
            loginLink.textContent = 'login';
            loginLink.href = 'login.html';
        } else {
            loginListItem.innerHTML = '<a href="login.html">login</a>';
        }
    }
}

document.addEventListener('DOMContentLoaded', updateNavigation);