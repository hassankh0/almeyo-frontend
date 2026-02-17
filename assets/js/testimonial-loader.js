// Load and render testimonials dynamically from JSON file for index page
console.log('[TESTIMONIALS] Script loaded');

document.addEventListener('DOMContentLoaded', async function() {
    console.log('[TESTIMONIALS] DOM Ready - loading testimonials...');
    await loadTestimonialsData();
});

/**
 * Load testimonials data from JSON file asynchronously
 */
async function loadTestimonialsData() {
    try {
        console.log('[TESTIMONIALS] Fetching testimonials from JSON...');
        
        // Fetch testimonials data from JSON file
        const response = await fetch('/assets/data/reviews.json', {
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
        console.log(`[TESTIMONIALS] ✓ Received ${result.reviews.length} testimonials from JSON`);
        
        // Render the testimonials
        renderTestimonials(result.reviews);
        console.log('[TESTIMONIALS] ✓✓✓ TESTIMONIALS LOADED SUCCESSFULLY ✓✓✓');
        
        // Re-initialize slick slider after rendering
        if (typeof $ !== 'undefined' && $('.testimonial-slider').length) {
            setTimeout(() => {
                // Destroy existing slider if it was already initialized
                if ($('.testimonial-slider').hasClass('slick-initialized')) {
                    $('.testimonial-slider').slick('unslick');
                }
                
                // Initialize slick slider
                $('.testimonial-slider').slick({
                    infinite: true,
                    slidesToShow: 1,
                    slidesToScroll: 1,
                    autoplay: true,
                    autoplaySpeed: 5000,
                    dots: true,
                    arrows: false,
                    fade: false
                });
                console.log('[TESTIMONIALS] Slick slider initialized');
                
                // Refresh AOS after slider is initialized
                if (typeof AOS !== 'undefined') {
                    AOS.init();
                    AOS.refreshHard();
                    console.log('[TESTIMONIALS] ✓ AOS refreshed');
                }
            }, 100);
        }
        
    } catch (error) {
        console.error('[TESTIMONIALS] ✗ Error loading testimonials:', error.message);
    }
}

/**
 * Render testimonials dynamically
 * @param {Array} reviews - Array of review objects
 */
function renderTestimonials(reviews) {
    const testimonialsContainer = document.querySelector('.testimonial-slider');
    
    if (!testimonialsContainer) {
        console.error('[TESTIMONIALS] Testimonials container not found');
        return;
    }
    
    // Clear existing testimonials
    testimonialsContainer.innerHTML = '';
    
    // Render each testimonial
    reviews.forEach(review => {
        const testimonialCard = createTestimonialCard(review);
        testimonialsContainer.appendChild(testimonialCard);
    });
    
    console.log(`[TESTIMONIALS] Rendered ${reviews.length} testimonials`);
}

/**
 * Create a testimonial item element for the slider
 * @param {Object} review - Review object
 * @returns {HTMLElement} Testimonial item element
 */
function createTestimonialCard(review) {
    const item = document.createElement('div');
    item.className = 'bistly-testimonial-item mb-4';
    
    // Create wrapper for arrows and content
    const wrapper = document.createElement('div');
    wrapper.style.display = 'flex';
    wrapper.style.alignItems = 'center';
    wrapper.style.justifyContent = 'space-between';
    wrapper.style.gap = '20px';
    
    // Left arrow
    const leftArrow = document.createElement('button');
    leftArrow.type = 'button';
    leftArrow.className = 'slick-prev';
    leftArrow.innerHTML = '<i class="fas fa-chevron-left"></i>';
    leftArrow.style.all = 'unset';
    leftArrow.style.cursor = 'pointer';
    leftArrow.style.fontSize = '48px';
    leftArrow.style.color = '#D0965C';
    leftArrow.style.lineHeight = '1';
    leftArrow.style.padding = '0 15px';
    leftArrow.style.flexShrink = '0';
    leftArrow.style.display = window.innerWidth < 768 ? 'none' : 'block';
    leftArrow.onclick = () => $('.testimonial-slider').slick('slickPrev');
    
    // Content
    const content = document.createElement('div');
    content.className = 'testimonial-content';
    content.style.flex = '1';
    content.style.minHeight = '250px';
    content.style.display = 'flex';
    content.style.flexDirection = 'column';
    content.style.justifyContent = 'center';
    
    // Create ratings
    const ratingsDiv = document.createElement('div');
    ratingsDiv.className = 'ratings';
    
    for (let i = 0; i < review.rating; i++) {
        const star = document.createElement('i');
        star.className = 'fas fa-star';
        ratingsDiv.appendChild(star);
    }
    
    // Create testimonial text
    const textP = document.createElement('p');
    textP.textContent = review.text;
    textP.style.overflow = 'hidden';
    textP.style.display = '-webkit-box';
    textP.style.webkitLineClamp = '3';
    textP.style.webkitBoxOrient = 'vertical';
    textP.style.textOverflow = 'ellipsis';
    
    // Create author info
    const authorSpan = document.createElement('span');
    authorSpan.textContent = `${review.author}`;
    
    // Assemble content
    content.appendChild(ratingsDiv);
    content.appendChild(textP);
    content.appendChild(authorSpan);
    
    // Right arrow
    const rightArrow = document.createElement('button');
    rightArrow.type = 'button';
    rightArrow.className = 'slick-next';
    rightArrow.innerHTML = '<i class="fas fa-chevron-right"></i>';
    rightArrow.style.all = 'unset';
    rightArrow.style.cursor = 'pointer';
    rightArrow.style.fontSize = '48px';
    rightArrow.style.color = '#D0965C';
    rightArrow.style.lineHeight = '1';
    rightArrow.style.padding = '0 15px';
    rightArrow.style.flexShrink = '0';
    rightArrow.style.display = window.innerWidth < 768 ? 'none' : 'block';
    rightArrow.onclick = () => $('.testimonial-slider').slick('slickNext');
    
    // Assemble wrapper
    wrapper.appendChild(leftArrow);
    wrapper.appendChild(content);
    wrapper.appendChild(rightArrow);
    
    item.appendChild(wrapper);
    
    return item;
}
