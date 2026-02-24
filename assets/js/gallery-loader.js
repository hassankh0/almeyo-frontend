// Load and render gallery dynamically from JSON file

document.addEventListener('DOMContentLoaded', async function() {
    await loadGalleryData();
});

/**
 * Load gallery data from JSON file asynchronously
 */
async function loadGalleryData() {
    try {
        // Fetch gallery data from JSON file
        const response = await fetch('/assets/data/gallery.json', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        });
        
        // Check if response is ok
        if (!response.ok) {
            throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }
        
        // Parse JSON response
        const result = await response.json();
        
        // Render the gallery
        renderGallery(result.gallery);
        
        // Initialize magnific popup for gallery
        setTimeout(() => {
            if (typeof $ !== 'undefined' && $.magnificPopup) {
                $('.popup-gallery').magnificPopup({
                    type: 'image',
                    gallery: {
                        enabled: true
                    }
                });
            }
            
            // Refresh AOS
            if (typeof AOS !== 'undefined') {
                AOS.init();
                AOS.refreshHard();
            }
        }, 100);
        
    } catch (error) {
        // Silently handle errors
    }
}

/**
 * Render gallery dynamically
 * @param {Array} images - Array of gallery image objects
 */
function renderGallery(images) {
    const galleryContainer = document.querySelector('.gallery-section .row');
    
    if (!galleryContainer) {

        return;
    }
    
    // Clear existing gallery items
    galleryContainer.innerHTML = '';
    
    // Render each gallery image
    images.forEach((image, index) => {
        const galleryItem = createGalleryItem(image, index);
        galleryContainer.appendChild(galleryItem);
    });
}

/**
 * Create a gallery item element
 * @param {Object} image - Gallery image object
 * @param {Number} index - Index for animation delay
 * @returns {HTMLElement} Gallery item element
 */
function createGalleryItem(image, index) {
    const col = document.createElement('div');
    col.className = 'col-lg-4 col-md-6 mb-4';
    col.setAttribute('data-aos', 'fade-up');
    
    // Calculate staggered delays
    const delays = [800, 1000, 1200];
    const delay = delays[index % delays.length];
    col.setAttribute('data-aos-duration', delay);
    
    const item = document.createElement('div');
    item.className = 'gallery-item';
    
    // Create image container
    const imageDiv = document.createElement('div');
    imageDiv.className = 'gallery-image';
    imageDiv.style.width = '100%';
    imageDiv.style.maxWidth = '300px';
    imageDiv.style.height = '225px';
    imageDiv.style.overflow = 'hidden';
    imageDiv.style.margin = '0 auto';
    
    // Create image element
    const img = document.createElement('img');
    img.src = image.image;
    img.alt = `Gallery Image ${image.id}`;
    img.style.width = '100%';
    img.style.height = '100%';
    img.style.objectFit = 'cover';
    
    // Create overlay with magnific popup link
    const overlay = document.createElement('div');
    overlay.className = 'gallery-overlay';
    
    const link = document.createElement('a');
    link.href = image.image;
    link.className = 'popup-gallery';
    link.innerHTML = '<i class="fas fa-search-plus"></i>';
    
    overlay.appendChild(link);
    
    // Assemble image section
    imageDiv.appendChild(img);
    imageDiv.appendChild(overlay);
    
    item.appendChild(imageDiv);
    col.appendChild(item);
    
    return col;
}
