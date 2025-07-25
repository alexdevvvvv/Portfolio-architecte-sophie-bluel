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
                    <button class="back-arrow" style="display: none;">&larr;</button>
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
                        <h2>Ajout photo</h2>
                        
                        <form id="add-photo-form">
                            <div class="photo-container">
                                <div class="photo-upload-placeholder">
                                    <i class="fas fa-image" style="font-size: 58px; color: #B9C5CC;"></i>
                                    <label for="photo-input" class="photo-add-button">+ Ajouter photo</label>
                                    <input type="file" id="photo-input" accept="image/png, image/jpeg" hidden>
                                    <p class="file-info">jpg, png : 4mo max</p>
                                </div>
                                <img id="photo-preview" class="hidden">
                            </div>

                            <div class="form-group">
                                <label for="title">Titre</label>
                                <input type="text" name="title" id="title" required>
                            </div>

                            <div class="form-group">
                                <label for="category">Catégorie</label>
                                <select name="category" id="category" required>
                                    <option value="" disabled selected></option>
                                </select>
                            </div>

                            <div class="form-submit">
                                <button type="submit" class="validate-button">Valider</button>
                            </div>
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
    modal.querySelector('.back-arrow').addEventListener('click', showGalleryView);
    modal.querySelector('.photo-add-button').addEventListener('click', () => {
        modal.querySelector('#photo-input').click();
    });
    
    modal.querySelector('#photo-input').addEventListener('change', setupImagePreview);
    modal.querySelector('#add-photo-form').addEventListener('submit', setupForm);
    
    // Load gallery and categories
    loadModalGallery();
    loadCategories();
    
    // Setup form validation on input
    modal.querySelector('#add-photo-form').addEventListener('input', validateForm);
    
    // Initialize form validation
    validateForm();
    
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
    modal.querySelector('.back-arrow').style.display = 'none';
}

function showAddPhotoView() {
    modal.querySelector('.gallery-view').style.display = 'none';
    modal.querySelector('.add-photo-view').style.display = 'block';
    modal.querySelector('.back-arrow').style.display = 'block';
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

// Gestion de la prévisualisation de l'image
function setupImagePreview(e) {
    const file = e.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = function(e) {
            const photoPreview = modal.querySelector('#photo-preview');
            const placeholder = modal.querySelector('.photo-upload-placeholder');
            
            photoPreview.src = e.target.result;
            photoPreview.classList.remove('hidden');
            placeholder.classList.add('hidden');
        }
        reader.readAsDataURL(file);
    }
    validateForm();
}

function validateForm() {
    const form = modal.querySelector('#add-photo-form');
    const photoInput = form.querySelector('#photo-input');
    const titleInput = form.querySelector('#title');
    const categorySelect = form.querySelector('#category');
    const submitBtn = form.querySelector('.validate-button');
    
    const isValid = photoInput.files.length > 0 && 
                   titleInput.value.trim() !== '' && 
                   categorySelect.value !== '';
    
    if (isValid) {
        submitBtn.style.backgroundColor = '#1D6154';
        submitBtn.disabled = false;
    } else {
        submitBtn.style.backgroundColor = '#A7A7A7';
        submitBtn.disabled = true;
    }
}

// Gestion du formulaire
async function setupForm(e) {
    e.preventDefault();
    
    const form = e.target;
    const formData = new FormData();
    
    formData.append('image', form.querySelector('#photo-input').files[0]);
    formData.append('title', form.querySelector('#title').value);
    formData.append('category', form.querySelector('#category').value);

    try {
        const response = await fetch(`${API_URL}/works`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('authToken')}`
            },
            body: formData
        });

        if (response.ok) {
            // Vider le formulaire
            form.reset();
            modal.querySelector('#photo-preview').classList.add('hidden');
            modal.querySelector('.photo-upload-placeholder').classList.remove('hidden');
            
            // Actualiser les galeries
            await loadModalGallery();
            allWorks = await getWorks();
            displayWorks(allWorks);
            
            // Retourner à la vue galerie
            showGalleryView();
        }
    } catch (error) {
        console.error('Erreur lors de l\'ajout de la photo:', error);
    }
}

// Initialize modal functionality
document.addEventListener('DOMContentLoaded', () => {
    const editButton = document.querySelector('.edit-btn');
    if (editButton) {
        editButton.addEventListener('click', openModal);
    }
});