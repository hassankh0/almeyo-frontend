// Load and render gallery slider dynamically from JSON file for index page
console.log('[GALLERY SLIDER] Script loaded');

document.addEventListener('DOMContentLoaded', async function() {
    console.log('[GALLERY SLIDER] DOM Ready - loading gallery slider...');
    await loadGallerySliderData();
});

/**
 * Load gallery slider data from JSON file asynchronously
 */
async function loadGallerySliderData() {
    try {
        console.log('[GALLERY SLIDER] Fetching gallery from JSON...');
        
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
        console.log(`[GALLERY SLIDER] ✓ Received ${result.gallery.length} images from JSON`);
        
        // Render the gallery slider
        renderGallerySlider(result.gallery);
        console.log('[GALLERY SLIDER] ✓✓✓ GALLERY SLIDER LOADED SUCCESSFULLY ✓✓✓');
        
        // Initialize slick slider after rendering
        setTimeout(() => {
            if (typeof $ !== 'undefined' && $('.gallery-slider').length) {
                // Destroy existing slider if it was already initialized
                if ($('.gallery-slider').hasClass('slick-initialized')) {
                    $('.gallery-slider').slick('unslick');
                }
                
                // Initialize slick slider
                $('.gallery-slider').slick({
                    dots: false,
                    arrows: false,
                    infinite: true,
                    speed: 600,
                    autoplay: true,
                    slidesToShow: 3,
                    slidesToScroll: 1,
                    responsive: [
                        {
                            breakpoint: 1024,
                            settings: {
                                slidesToShow: 2,
                            }
                        },
                        {
                            breakpoint: 500,
                            settings: {
                                slidesToShow: 1,
                            }
                        }
                    ]
                });
                console.log('[GALLERY SLIDER] ✓ Slick slider initialized');
            }
        }, 100);
        
    } catch (error) {
        console.error('[GALLERY SLIDER] ✗ Error loading gallery:', error.message);
    }
}

/**
 * Render gallery slider dynamically
 * @param {Array} images - Array of gallery image objects
 */
function renderGallerySlider(images) {
    const sliderContainer = document.querySelector('.gallery-slider');
    
    if (!sliderContainer) {
        console.error('[GALLERY SLIDER] Gallery slider container not found');
        return;
    }
    
    // Clear existing gallery items
    sliderContainer.innerHTML = '';
    
    // Render each gallery image
    images.forEach(image => {
        const sliderItem = createSliderItem(image);
        sliderContainer.appendChild(sliderItem);
    });
    
    console.log(`[GALLERY SLIDER] Rendered ${images.length} gallery slider items`);
}

/**
 * Create a gallery slider item element
 * @param {Object} image - Gallery image object
 * @returns {HTMLElement} Gallery slider item element
 */
function createSliderItem(image) {
    const item = document.createElement('div');
    item.className = 'bistly-gallery-item';
    
    const imgDiv = document.createElement('div');
    imgDiv.className = 'gallery-img';
    
    const img = document.createElement('img');
    img.src = image.image;
    img.alt = `Gallery Image ${image.id}`;
    img.style.maxwidth = '450px';
    img.style.objectFit = 'cover';
    img.style.display = 'block';
    
    imgDiv.appendChild(img);
    item.appendChild(imgDiv);
    
    return item;
}
