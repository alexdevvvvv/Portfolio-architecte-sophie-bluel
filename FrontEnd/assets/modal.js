let modal = null;

function openModal(e) {
    e.preventDefault();
    
    if (modal) {
        modal.remove();
    }
    
    modal = document.createElement('div');
    modal.className = 'modal';
    modal.innerHTML = `
        <div class="modal-wrapper">
            <div class="modal-content">
                <div class="modal-header">
                    <button class="modal-close">
                        <i class="fas fa-times"></i>
                    </button>
                </div>
                <div class="modal-body">
                    <div class="modal-view gallery-view">
                        <h3>Galerie photo</h3>
                        <div class="modal-gallery">
                            <!-- Les photos seront ajoutées ici -->
                        </div>
                        <hr>
                        <button class="btn-add-photo">Ajouter une photo</button>
                    </div>
                    <div class="modal-view add-photo-view" style="display: none;">
                        <div class="modal-nav">
                            <button class="modal-back">
                                <i class="fas fa-arrow-left"></i>
                            </button>
                        </div>
                        <h3>Ajout photo</h3>
                        <form class="add-photo-form">
                            <div class="photo-upload">
                                <i class="fas fa-image"></i>
                                <button type="button" class="upload-btn">+ Ajouter photo</button>
                                <p>jpg, png : 4mo max</p>
                                <input type="file" id="photo-input" accept="image/*" style="display: none;">
                                <img class="preview-image" style="display: none;">
                            </div>
                            <label for="title">Titre</label>
                            <input type="text" id="title" name="title" required>
                            <label for="category">Catégorie</label>
                            <select id="category" name="category" required>
                                <option value="">Sélectionnez une catégorie</option>
                            </select>
                            <hr>
                            <button type="submit" class="btn-validate">Valider</button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    `;
    
    document.body.appendChild(modal);
    
    // Event listeners
    modal.querySelector('.modal-close').addEventListener('click', closeModal);
    modal.querySelector('.modal-wrapper').addEventListener('click', (e) => {
        if (e.target === modal.querySelector('.modal-wrapper')) {
            closeModal();
        }
    });
    
    modal.querySelector('.btn-add-photo').addEventListener('click', showAddPhotoView);
    modal.querySelector('.modal-back').addEventListener('click', showGalleryView);
    modal.querySelector('.upload-btn').addEventListener('click', () => {
        modal.querySelector('#photo-input').click();
    });
    
    // Load gallery and categories
    loadModalGallery();
    loadCategories();
    
    // Show modal
    modal.style.display = 'flex';
}

function closeModal() {
    if (modal) {
        modal.style.display = 'none';
        modal.remove();
        modal = null;
    }
}

function showGalleryView() {
    modal.querySelector('.gallery-view').style.display = 'block';
    modal.querySelector('.add-photo-view').style.display = 'none';
}

function showAddPhotoView() {
    modal.querySelector('.gallery-view').style.display = 'none';
    modal.querySelector('.add-photo-view').style.display = 'block';
}

async function loadModalGallery() {
    const works = await getWorks();
    const modalGallery = modal.querySelector('.modal-gallery');
    modalGallery.innerHTML = '';
    
    works.forEach(work => {
        const workElement = document.createElement('div');
        workElement.className = 'modal-work';
        workElement.innerHTML = `
            <img src="${work.imageUrl}" alt="${work.title}">
            <button class="delete-work" data-id="${work.id}">
                <i class="fa-solid fa-trash-can"></i>
            </button>
        `;
        modalGallery.appendChild(workElement);
    });
    
    // Add delete event listeners
    modalGallery.querySelectorAll('.delete-work').forEach(button => {
        button.addEventListener('click', (e) => {
            const workId = e.target.closest('.delete-work').dataset.id;
            deleteWork(workId);
        });
    });
}

async function loadCategories() {
    const categories = await getCategories();
    const categorySelect = modal.querySelector('#category');
    
    categories.forEach(category => {
        const option = document.createElement('option');
        option.value = category.id;
        option.textContent = category.name;
        categorySelect.appendChild(option);
    });
}

async function deleteWork(workId) {
    try {
        const token = localStorage.getItem('authToken');
        const response = await fetch(`${API_URL}/works/${workId}`, {
            method: 'DELETE',
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
        
        if (response.ok) {
            loadModalGallery();
            // Refresh main gallery
            allWorks = await getWorks();
            displayWorks(allWorks);
        }
    } catch (error) {
        console.error('Erreur lors de la suppression:', error);
    }
}

// Initialize modal functionality
document.addEventListener('DOMContentLoaded', () => {
    const editButton = document.querySelector('.edit-btn');
    if (editButton) {
        editButton.addEventListener('click', openModal);
    }
});