const API_URL = 'http://localhost:5678/api';

async function getWorks() {
    try {
        const response = await fetch(`${API_URL}/works`);
        const works = await response.json();
        return works;
    } catch (error) {
        console.error('Erreur lors de la récupération des travaux:', error);
        return [];
    }
}

function createWorkElement(work) {
    const figure = document.createElement('figure');
    
    const img = document.createElement('img');
    img.src = work.imageUrl;
    img.alt = work.title;
    
    const figcaption = document.createElement('figcaption');
    figcaption.textContent = work.title;
    
    figure.appendChild(img);
    figure.appendChild(figcaption);
    
    return figure;
}

function displayWorks(works) {
    const gallery = document.querySelector('.gallery');
    gallery.innerHTML = '';
    
    works.forEach(work => {
        const workElement = createWorkElement(work);
        gallery.appendChild(workElement);
    });
}

async function initGallery() {
    const works = await getWorks();
    displayWorks(works);
}

document.addEventListener('DOMContentLoaded', initGallery);