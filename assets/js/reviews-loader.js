// Load and render reviews dynamically from JSON file
console.log('[REVIEWS] Script loaded');

document.addEventListener('DOMContentLoaded', async function() {
    console.log('[REVIEWS] DOM Ready - loading reviews...');
    await loadReviewsData();
});

/**
 * Load reviews data from JSON file asynchronously
 */
async function loadReviewsData() {
    try {
        console.log('[REVIEWS] Fetching reviews from JSON...');
        
        // Fetch reviews data from JSON file
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
        console.log(`[REVIEWS] ✓ Received ${result.reviews.length} reviews from JSON`);
        
        // Render the reviews
        renderReviews(result.reviews);
        console.log('[REVIEWS] ✓✓✓ REVIEWS LOADED SUCCESSFULLY ✓✓✓');
        
        // Initialize AOS for animations after reviews are rendered
        setTimeout(() => {
            if (typeof AOS !== 'undefined') {
                AOS.init();
                AOS.refreshHard();
                console.log('[REVIEWS] ✓ AOS refreshed for reviews');
            }
        }, 100);
        
    } catch (error) {
        console.error('[REVIEWS] ✗ Error loading reviews:', error.message);
    }
}

/**
 * Render reviews dynamically
 * @param {Array} reviews - Array of review objects
 */
function renderReviews(reviews) {
    const reviewsContainer = document.querySelector('.row[data-reviews-container]') || 
                            document.querySelector('.testimonial-section .row:not(.justify-content-center)');
    
    if (!reviewsContainer) {
        console.error('[REVIEWS] Reviews container not found');
        return;
    }
    
    // Clear existing reviews
    reviewsContainer.innerHTML = '';
    
    // Render each review
    reviews.forEach(review => {
        const reviewCard = createReviewCard(review);
        reviewsContainer.appendChild(reviewCard);
    });
    
    console.log(`[REVIEWS] Rendered ${reviews.length} reviews`);
}

/**
 * Create a review card element
 * @param {Object} review - Review object
 * @returns {HTMLElement} Review card element
 */
function createReviewCard(review) {
    const col = document.createElement('div');
    col.className = 'col-lg-6 mb-4';
    
    const card = document.createElement('div');
    card.className = 'testimonial-card';
    card.setAttribute('data-aos', 'fade-up');
    card.setAttribute('data-aos-duration', review.delay || 800);
    
    // Create header with ratings
    const header = document.createElement('div');
    header.className = 'testimonial-header';
    
    const ratingsDiv = document.createElement('div');
    ratingsDiv.className = 'ratings';
    
    // Generate star ratings
    for (let i = 0; i < review.rating; i++) {
        const star = document.createElement('i');
        star.className = 'fas fa-star';
        ratingsDiv.appendChild(star);
    }
    
    header.appendChild(ratingsDiv);
    
    // Create body with review text
    const body = document.createElement('div');
    body.className = 'testimonial-body';
    
    const bodyP = document.createElement('p');
    bodyP.textContent = `"${review.text}"`;
    
    body.appendChild(bodyP);
    
    // Create footer with author info
    const footer = document.createElement('div');
    footer.className = 'testimonial-footer';
    
    const authorName = document.createElement('h6');
    authorName.textContent = review.author;
    
    footer.appendChild(authorName);
    
    // Assemble card
    card.appendChild(header);
    card.appendChild(body);
    card.appendChild(footer);
    
    col.appendChild(card);
    
    return col;
}
