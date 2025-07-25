const API_URL = 'http://localhost:5678/api';

let allWorks = [];

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

async function getCategories() {
    try {
        const response = await fetch(`${API_URL}/categories`);
        const categories = await response.json();
        return categories;
    } catch (error) {
        console.error('Erreur lors de la récupération des catégories:', error);
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

function createCategoryButton(category, isActive = false) {
    const button = document.createElement('button');
    button.textContent = category.name;
    button.classList.add('filter-btn');
    if (isActive) button.classList.add('active');
    
    button.addEventListener('click', () => {
        document.querySelectorAll('.filter-btn').forEach(btn => btn.classList.remove('active'));
        button.classList.add('active');
        
        if (category.id === 'all') {
            displayWorks(allWorks);
        } else {
            const filteredWorks = allWorks.filter(work => work.categoryId === category.id);
            displayWorks(filteredWorks);
        }
    });
    
    return button;
}

function displayCategoryFilters(categories) {
    const portfolioSection = document.getElementById('portfolio');
    const existingFilters = document.querySelector('.category-filters');
    if (existingFilters) existingFilters.remove();
    
    const filtersContainer = document.createElement('div');
    filtersContainer.classList.add('category-filters');
    
    const allButton = createCategoryButton({ id: 'all', name: 'Tous' }, true);
    filtersContainer.appendChild(allButton);
    
    categories.forEach(category => {
        const button = createCategoryButton(category);
        filtersContainer.appendChild(button);
    });
    
    const title = portfolioSection.querySelector('h2');
    portfolioSection.insertBefore(filtersContainer, title.nextSibling);
}

async function initGallery() {
    allWorks = await getWorks();
    const categories = await getCategories();
    
    displayCategoryFilters(categories);
    displayWorks(allWorks);
}

document.addEventListener('DOMContentLoaded', initGallery);