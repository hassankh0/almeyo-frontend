// ====== Order Menu Loader - Async/Await Pattern ======
// Loads menu data from backend API and renders in orders page with quantity controls
// Integrates with the existing cart system in orders.html

document.addEventListener('DOMContentLoaded', async () => {
    try {
        await loadOrderMenuData();
        // Refresh animations after menu is rendered
        setTimeout(() => {
            if (window.AOS) {
                AOS.refresh();
            }
            if (window.ScrollTrigger) {
                ScrollTrigger.refresh();
            }
        }, 150);
    } catch (error) {
        displayErrorMessage('Erreur du chargement du menu. Veuillez rafraichir la page.');
    }
});

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
 * Main function to load menu data from API
 */
async function loadOrderMenuData() {
    try {
        // Nginx proxies /api/ to backend:3000/api/
        const response = await fetch('/api/menu');
        
        if (!response.ok) {
            throw new Error(`API error: ${response.status}`);
        }
        
        const result = await response.json();
        
        if (!result.success || !result.data) {
            throw new Error('Invalid API response format');
        }
        
        const categories = transformOrderMenuData(result.data);
        renderMenuForOrders(categories);
        
    } catch (error) {
        throw error;
    }
}

/**
 * Transform flat menu array into categorized structure
 * @param {Array} items - Flat array of menu items from API
 * @returns {Array} Categorized menu items: [{category, subtitle, items: [...]}, ...]
 */
function transformOrderMenuData(items) {
    const categoryMap = {};
    
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
            id: item.id,
            name: item.name,
            description: item.description || '',
            price: item.price,
            image: constructImageUrl(item.image_url)
        });
    });
    
    return Object.values(categoryMap);
}

/**
 * Render order menu with quantity controls
 * Matches the existing orders.html menu structure
 * @param {Array} categories - Categorized menu items
 */
function renderMenuForOrders(categories) {
    const menuContainer = document.getElementById('dynamic-menu-container');
    
    if (!menuContainer) {
        return;
    }
    
    menuContainer.innerHTML = '';
    const fragment = document.createDocumentFragment();
    
    categories.forEach((category, index) => {
        const categorySection = createOrdersCategorySection(category, index);
        fragment.appendChild(categorySection);
    });
    
    menuContainer.appendChild(fragment);
}

/**
 * Create a category section for orders (matches existing HTML structure)
 * @param {Object} category - Category object {category, subtitle, items}
 * @param {Number} index - Category index
 * @returns {HTMLElement} Section element
 */
function createOrdersCategorySection(category, index) {
    const section = document.createElement('section');
    section.className = index === 0 ? 'bistly-menu-list py-5' : 'bistly-menu-list';
    section.innerHTML = `
        <div class="container">
            <div class="row justify-content-center py-5">
                <div class="col-lg-10">
                    <div class="section-title text-center ${index === 0 ? 'mt-3' : ''}">
                        <h2 class="sub-title" style="font-size: 50px;" data-aos="fade-down" data-aos-duration="1000" data-aos-once="true">${category.category}</h2>
                        <h6 class="text-anm" data-aos="fade-up" data-aos-duration="1200" data-aos-once="true">${category.subtitle}</h6>
                    </div>
                </div>
            </div>
            <div class="row justify-content-center">
                ${createOrdersMenuItems(category.items, category.category)}
            </div>
        </div>
    `;
    
    return section;
}

/**
 * Create menu items HTML with 2-column layout
 * @param {Array} items - Menu items for this category
 * @param {String} category - Category name
 * @returns {String} HTML for left and right columns
 */
function createOrdersMenuItems(items, category) {
    let leftItems = '';
    let rightItems = '';
    
    items.slice(0, Math.ceil(items.length / 2)).forEach((item, i) => {
        leftItems += createOrdersMenuItemHTML(item, i, category);
    });
    
    items.slice(Math.ceil(items.length / 2)).forEach((item, i) => {
        rightItems += createOrdersMenuItemHTML(item, i + Math.ceil(items.length / 2), category);
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

/**
 * Create individual menu item HTML for orders
 * Matches the existing bistly-menu-list-item structure
 * @param {Object} item - Menu item {id, name, description, price, image}
 * @param {Number} index - Item index
 * @param {String} category - Category name
 * @returns {String} Menu item HTML
 */
function createOrdersMenuItemHTML(item, index, category) {
    const durations = ['800', '1000', '1200'];
    const duration = durations[index % 3];
    
    return `
        <div class="bistly-menu-list-item mb-4" data-aos="fade-up" data-aos-duration="${duration}">
            <div class="thumbnail">
                <img 
                    src="${item.image}" 
                    alt="${item.name}"
                    onerror="this.src='/assets/images/innerpage/menu/default.png'"
                    style="height: 150px; object-fit: cover;"
                >
            </div>
            <div class="content">
                <h4><span style="color: #2d2d2d;">${item.name}</span><span class="price">${item.price.toFixed(2)}€</span></h4>
                <p>${item.description}</p>
                <div class="order-menu-item-quantity">
                    <button type="button" class="qty-btn" onclick="increaseQty('${item.id}')">+</button>
                    <input type="number" class="qty-input" id="qty-${item.id}" value="0" min="0" readonly>
                    <button type="button" class="qty-btn" onclick="decreaseQty('${item.id}')">-</button>
                    <button type="button" class="add-to-cart-btn" onclick="addToCart('${item.id}', '${item.name.replace(/'/g, "\\'")}', ${item.price})">Ajouter</button>
                </div>
            </div>
        </div>
    `;
}

/**
 * Display error message to user
 * @param {String} message - Error message to display
 */
function displayErrorMessage(message) {
    const container = document.getElementById('dynamic-menu-container');
    if (container) {
        container.innerHTML = `
            <div class="error-message" style="padding: 20px; background: #fee; color: #c00; border-radius: 4px; margin: 20px;">
                <p>${message}</p>
            </div>
        `;
    }
}
