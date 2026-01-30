// Function to reinitialize header handlers
function reinitializeHeader() {
    setTimeout(function() {
        if (typeof $ !== 'undefined') {
            cleanupMenuHandlers();
            mainMenu();
            offCanvas();
        }
    }, 50);
}

// Load header and footer dynamically
document.addEventListener('DOMContentLoaded', function() {
    // Load header
    const headerPlaceholder = document.getElementById('header-placeholder');
    if (headerPlaceholder) {
        fetch('assets/includes/header.html')
            .then(response => response.text())
            .then(data => {
                headerPlaceholder.outerHTML = data;
                reinitializeHeader();
            })
            .catch(error => console.error('Error loading header:', error));
    }

    // Load footer
    const footerPlaceholder = document.getElementById('footer-placeholder');
    if (footerPlaceholder) {
        // Create wrapper divs structure to replace the placeholder
        const footerWrapper = document.createElement('div');
        footerWrapper.innerHTML = `
            <!--====== Start Footer ======-->
            <footer class="default-footer rs-footer pt-5 p-r z-1">
                <div class="shape shape-one"><img src="assets/images/innerpage/footer/shape1.png" alt="shape"></div>
                <div class="shape shape-two"><img src="assets/images/innerpage/footer/shape2.png" alt="shape"></div>
                <div class="footer-content-wrapper"></div>
            </footer><!--====== End Footer ======-->
            </div>
        </div>`;
        
        // Get the footer content and insert it
        fetch('assets/includes/footer.html')
            .then(response => response.text())
            .then(data => {
                // Find the wrapper div inside our created structure
                const footerContentWrapper = footerWrapper.querySelector('.footer-content-wrapper');
                footerContentWrapper.innerHTML = data;
                footerPlaceholder.outerHTML = footerWrapper.innerHTML;
            })
            .catch(error => console.error('Error loading footer:', error));
    }
});

// Clean up old event handlers before reattaching
function cleanupMenuHandlers() {
    var navbarToggler = $('.navbar-toggler');
    var navMenu = $('.theme-nav-menu');
    var closeIcon = $('.navbar-close');
    var $overlay = $(".offcanvas__overlay");
    var $toggler = $(".navbar-toggler");
    
    // Remove all previous event listeners
    navbarToggler.off('click');
    closeIcon.off('click');
    navMenu.off('click', '.dd-trigger');
    $toggler.add($overlay).add(".navbar-close, .panel-close-btn").off('click');
    $(window).off('resize.offcanvas');
}

// Replicate mainMenu function from common.js
function mainMenu() {
    var var_window = $(window),
        navContainer = $('.header-navigation'),
        navbarToggler = $('.navbar-toggler'),
        navMenu = $('.theme-nav-menu'),
        navMenuLi = $('.theme-nav-menu ul li ul li'),
        closeIcon = $('.navbar-close');
    
    navbarToggler.on('click', function() {
        navbarToggler.toggleClass('active');
        navMenu.toggleClass('menu-on');
    });
    
    closeIcon.on('click', function() {
        navMenu.removeClass('menu-on');
        navbarToggler.removeClass('active');
    });
    
    navMenu.find("li a").each(function() {
        if ($(this).children('.dd-trigger').length < 1) {
            if ($(this).next().length > 0) {
                $(this).append('<span class="dd-trigger"><i class="far fa-angle-down"></i></span>')
            }
        }
    });
    
    navMenu.on('click', '.dd-trigger', function(e) {
        e.preventDefault();
        $(this).parent().parent().siblings().children('ul.sub-menu').slideUp();
        $(this).parent().next('ul.sub-menu').stop(true, true).slideToggle(350);
        $(this).toggleClass('sub-menu-open');
    });
}

// Replicate offCanvas function from common.js
function offCanvas() {
    const $overlay = $(".offcanvas__overlay");
    const $toggler = $(".navbar-toggler");
    const $menu = $(".theme-nav-menu");
    
    $toggler.add($overlay).add(".navbar-close, .panel-close-btn").on("click", function() {
        $overlay.toggleClass("overlay-open");
        if ($(this).is($overlay)) {
            $toggler.removeClass("active");
            $menu.removeClass("menu-on");
        }
    });
    
    $(window).on("resize.offcanvas", function() {
        if ($(window).width() > 991) $overlay.removeClass("overlay-open");
    });
}

// Helper function to reload header when navigating
function reloadHeaderOnNavigation() {
    // Listen for link clicks on menu items
    $(document).on('click', '.theme-nav-menu a, .navbar-toggler', function() {
        var href = $(this).attr('href');
        
        // If it's an internal link (not # anchor), reload header after navigation
        if (href && !href.startsWith('#') && !href.startsWith('javascript')) {
            // Small delay to allow page to load
            setTimeout(function() {
                var headerPlaceholder = document.getElementById('header-placeholder');
                if (headerPlaceholder) {
                    fetch('assets/includes/header.html')
                        .then(response => response.text())
                        .then(data => {
                            headerPlaceholder.outerHTML = data;
                            reinitializeHeader();
                        });
                }
            }, 100);
        }
    });
}

// Start listening for navigation
document.addEventListener('DOMContentLoaded', function() {
    setTimeout(function() {
        if (typeof $ !== 'undefined') {
            reloadHeaderOnNavigation();
        }
    }, 100);
});

