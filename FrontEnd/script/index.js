// Configuration de l'API
const API_BASE_URL = 'http://localhost:5678/api';

// Variables globales
let works = [];
let categories = [];

// Fonction pour récupérer les travaux depuis l'API
async function fetchWorks() {
    try {
        const response = await fetch(`${API_BASE_URL}/works`);
        if (!response.ok) {
            throw new Error('Erreur lors de la récupération des travaux');
        }
        works = await response.json();
        displayWorks(works);
    } catch (error) {
        console.error('Erreur:', error);
        // Afficher un message d'erreur à l'utilisateur
    }
}

// Fonction pour récupérer les catégories depuis l'API
async function fetchCategories() {
    try {
        const response = await fetch(`${API_BASE_URL}/categories`);
        if (!response.ok) {
            throw new Error('Erreur lors de la récupération des catégories');
        }
        categories = await response.json();
        createFilterButtons();
    } catch (error) {
        console.error('Erreur:', error);
    }
}

// Fonction pour afficher les travaux dans la galerie
function displayWorks(worksToShow) {
    const gallery = document.querySelector('.gallery');
    
    // Vider la galerie existante
    gallery.innerHTML = '';
    
    // Créer les éléments pour chaque travail
    worksToShow.forEach(work => {
        const figure = document.createElement('figure');
        figure.innerHTML = `
            <img src="${work.imageUrl}" alt="${work.title}">
            <figcaption>${work.title}</figcaption>
        `;
        gallery.appendChild(figure);
    });
}

// Fonction pour créer les boutons de filtre
function createFilterButtons() {
    const portfolioSection = document.querySelector('#portfolio');
    const title = portfolioSection.querySelector('h2');
    
    // Créer le conteneur des filtres
    const filterContainer = document.createElement('div');
    filterContainer.className = 'filter-container';
    
    // Bouton "Tous"
    const allButton = document.createElement('button');
    allButton.textContent = 'Tous';
    allButton.className = 'filter-btn active';
    allButton.addEventListener('click', () => {
        filterWorks(null);
        setActiveButton(allButton);
    });
    filterContainer.appendChild(allButton);
    
    // Boutons pour chaque catégorie
    categories.forEach(category => {
        const button = document.createElement('button');
        button.textContent = category.name;
        button.className = 'filter-btn';
        button.addEventListener('click', () => {
            filterWorks(category.id);
            setActiveButton(button);
        });
        filterContainer.appendChild(button);
    });
    
    // Insérer les filtres après le titre
    portfolioSection.insertBefore(filterContainer, title.nextSibling);
}

        // Fonction pour gérer l'état actif des boutons
        function setActiveButton(clickedButton) {
            // Retirer la classe active de tous les boutons
            document.querySelectorAll('.filter-btn').forEach(btn => {
                btn.classList.remove('active');
            });
            
            // Ajouter la classe active au bouton cliqué
            clickedButton.classList.add('active');
        }

        // Ajouter les écouteurs d'événements
        document.querySelectorAll('.filter-btn').forEach(button => {
            button.addEventListener('click', function() {
                setActiveButton(this);
            });
        })

// Fonction pour filtrer les travaux
function filterWorks(categoryId) {
    if (categoryId === null) {
        // Afficher tous les travaux
        displayWorks(works);
    } else {
        // Filtrer par catégorie
        const filteredWorks = works.filter(work => work.categoryId === categoryId);
        displayWorks(filteredWorks);
    }
}

// Fonction pour gérer le bouton actif
function setActiveButton(activeButton) {
    const allButtons = document.querySelectorAll('.filter-btn');
    allButtons.forEach(button => button.classList.remove('active'));
    activeButton.classList.add('active');
}

// Fonction d'initialisation
async function init() {
    await fetchCategories();
    await fetchWorks();
}

// Lancer l'initialisation quand le DOM est chargé
document.addEventListener('DOMContentLoaded', init);