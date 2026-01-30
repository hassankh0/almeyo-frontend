// Load and render menu dynamically from JSON
document.addEventListener('DOMContentLoaded', function() {
    loadMenuData();
});

function loadMenuData() {
    fetch('assets/data/menu.json')
        .then(response => response.json())
        .then(data => {
            renderMenu(data.menu);
            // Reinitialize animations after DOM update
            setTimeout(() => {
                // Initialize/refresh AOS (Animate On Scroll)
                if (window.AOS) {
                    AOS.init({
                        duration: 800,
                        easing: 'ease-in-out',
                        once: true,
                        mirror: false,
                        offset: 100
                    });
                    AOS.refresh();
                }
                // Refresh GSAP ScrollTrigger for smooth scroll effects
                if (window.gsap && window.ScrollTrigger) {
                    ScrollTrigger.refresh();
                }
            }, 150);
        })
        .catch(error => console.error('Error loading menu data:', error));
}

function renderMenu(categories) {
    const menuContainer = document.getElementById('dynamic-menu-container');
    
    if (!menuContainer) {
        console.error('Menu container not found');
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
                        <span class="sub-title" data-aos="fade-down" data-aos-duration="1000" data-aos-once="true">${category.subtitle}</span>
                        <h2 class="text-anm" data-aos="fade-up" data-aos-duration="1200" data-aos-once="true">${category.category}</h2>
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
    
    // Split items into two columns
    items.slice(0, 3).forEach((item, i) => {
        leftItems += createMenuItemHTML(item, i);
    });
    
    items.slice(3).forEach((item, i) => {
        rightItems += createMenuItemHTML(item, i + 3);
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
    
    return `
        <!-- Bistly Menu Item -->
        <div class="bistly-menu-list-item mb-4" data-aos="fade-up" data-aos-duration="${duration}">
            <div class="thumbnail">
                <img src="${item.image}" alt="${item.name}">
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
