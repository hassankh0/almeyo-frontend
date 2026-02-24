// Load and render menu dynamically from API

document.addEventListener('DOMContentLoaded', async function() {
    await loadMenuData();
});

/**
 * Load menu data from API asynchronously
 */
async function loadMenuData() {
    try {
        // Fetch menu data from backend API
        const response = await fetch('/api/menu', {
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
        
        // Transform API data to categorized structure
        const categories = transformMenuData(result.data);
        
        // Render the menu
        renderMenu(categories);
        
    } catch (error) {
        // Silently catch errors - logging disabled for production
    }
}

/**
 * Construct image URL from API response
 * - If image_url is provided: fetch from backend (/images/menu/...)
 * - If image_url is null: use backend default image
 */
function constructImageUrl(imageUrlFromApi) {
    // If no image from backend, use backend default image
    if (!imageUrlFromApi) {
        return '/images/menu/default.png';
    }
    
    // If URL already has a leading slash (from backend), return as-is
    // nginx will proxy /images/ to backend:3000/images/
    if (imageUrlFromApi.startsWith('/')) {
        return imageUrlFromApi;
    }
    
    // If URL is already absolute, return as is
    if (imageUrlFromApi.startsWith('http')) {
        return imageUrlFromApi;
    }
    
    // Otherwise prepend / (shouldn't happen, but safe fallback)
    return `/${imageUrlFromApi}`;
}

/**
 * Transform flat API response into categorized menu structure
 * @param {Array} items - Flat array of menu items from API
 * @returns {Array} Categorized menu structure
 */
function transformMenuData(items) {
    const categoryMap = {};
    
    // Group items by category
    items.forEach(item => {
        const categoryName = item.category || 'Autres';
        
        if (!categoryMap[categoryName]) {
            categoryMap[categoryName] = {
                category: categoryName,
                subtitle: '',
                items: []
            };
        }
        
        categoryMap[categoryName].items.push({
            name: item.name,
            description: item.description || '',
            price: item.price,
            image: constructImageUrl(item.image_url)
        });
    });
    
    // Convert to array (maintains order)
    return Object.values(categoryMap);
}

function renderMenu(categories) {
    const menuContainer = document.getElementById('dynamic-menu-container');
    
    if (!menuContainer) {
        return;
    }
    
    // Clear existing content
    menuContainer.innerHTML = '';
    
    // Create a document fragment to hold all sections
    const fragment = document.createDocumentFragment();
    
    // Render each category
    categories.forEach((category, index) => {
        const categorySection = createCategorySection(category, index);
        fragment.appendChild(categorySection);
    });
    
    // Append all at once
    menuContainer.appendChild(fragment);
    
    // Refresh animations after content is in DOM
    setTimeout(() => {
        if (typeof AOS !== 'undefined') {
            AOS.refreshHard();
        }
        if (typeof ScrollTrigger !== 'undefined') {
            ScrollTrigger.refresh();
        }
    }, 100);
}

function createCategorySection(category, index) {
    const section = document.createElement('section');
    section.className = index === 0 ? 'bistly-menu-list py-5' : 'bistly-menu-list';
    section.innerHTML = `
        <div class="container">
            <div class="row justify-content-center py-5">
                <div class="col-lg-8">
                    <!-- Section Title -->
                    <div class="section-title text-center ${index === 0 ? 'mt-3' : ''}">
                        <h2 class="sub-title" style="font-size: 50px;" data-aos="fade-down" data-aos-duration="1000" data-aos-once="true">${category.category}</h2>
                        <h6 class="text-anm" data-aos="fade-up" data-aos-duration="1200" data-aos-once="true">${category.subtitle}</h6>
                    </div>
                </div>
            </div>
            <div class="row justify-content-center ${index === 2 ? 'pb-5' : ''}">
                ${createMenuItems(category.items)}
            </div>
        </div>
    `;
    
    return section;
}

function createMenuItems(items) {
    let leftItems = '';
    let rightItems = '';
    
    // Split items equally between columns (or nearly equal with 1 difference)
    const middleIndex = Math.ceil(items.length / 2);
    
    items.slice(0, middleIndex).forEach((item, i) => {
        leftItems += createMenuItemHTML(item, i);
    });
    
    items.slice(middleIndex).forEach((item, i) => {
        rightItems += createMenuItemHTML(item, i + middleIndex);
    });
    
    return `
        <div class="col-xl-6 col-md-8">
            <div class="menu-list-wrap pe-xl-4">
                ${leftItems}
            </div>
        </div>
        <div class="col-xl-6 col-md-8">
            <div class="menu-list-wrap ps-xl-4">
                ${rightItems}
            </div>
        </div>
    `;
}

function createMenuItemHTML(item, index) {
    const durations = ['800', '1000', '1200'];
    const duration = durations[index % 3];
    
    // Use image from API or fallback to local default placeholder
    const imageUrl = item.image || '/assets/images/innerpage/menu/default.png';
    
    return `
        <!-- Bistly Menu Item -->
        <div class="bistly-menu-list-item mb-4" data-aos="fade-up" data-aos-duration="${duration}">
            <div class="thumbnail">
                <img 
                    src="${imageUrl}" 
                    alt="${item.name}"
                    onerror="this.src='/assets/images/innerpage/menu/default.png'"
                    width="150" height="150""
                >
            </div>
            <div class="content">
                <h4><a href="menu-details.html">${item.name}</a><span class="price">${item.price.toFixed(2)}€</span> </h4>
                <p>${item.description}</p>
            </div>
        </div>
    `;
}

function createRatingStars(rating) {
    let stars = '';
    for (let i = 0; i < rating; i++) {
        stars += '<i class="fas fa-star"></i>';
    }
    return stars;
}
