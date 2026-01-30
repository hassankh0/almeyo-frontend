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
        fetch('assets/includes/footer.html')
            .then(response => {
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                return response.text();
            })
            .then(data => {
                if (data && data.trim().length > 0) {
                    // Insert footer after placeholder, inside smooth-content
                    footerPlaceholder.insertAdjacentHTML('afterend', data);
                    footerPlaceholder.remove();
                    
                    console.log('Footer HTML inserted successfully');
                    
                    // Reinitialize all animation and scroll systems
                    setTimeout(function() {
                        // Refresh AOS animations
                        if (typeof AOS !== 'undefined') {
                            AOS.refreshHard();
                        }
                        
                        // Kill and recreate ScrollSmoother
                        if (typeof ScrollSmoother !== 'undefined') {
                            try {
                                // Kill existing ScrollSmoother
                                let existingSmoother = ScrollSmoother.get();
                                if (existingSmoother) {
                                    existingSmoother.kill();
                                }
                                
                                // Recreate it
                                if (window.innerWidth > 991) {
                                    ScrollSmoother.create({
                                        smooth: 1,
                                        effects: true
                                    });
                                    console.log('ScrollSmoother recreated');
                                }
                            } catch(e) {
                                console.log('ScrollSmoother recreation:', e.message);
                            }
                        }
                        
                        // Refresh ScrollTrigger
                        if (typeof ScrollTrigger !== 'undefined') {
                            ScrollTrigger.refresh();
                        }
                        
                        console.log('Footer animations and scroll system reinitialized');
                    }, 100);
                } else {
                    console.error('Footer HTML is empty');
                }
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
        
        // Disable/enable scroll when menu opens/closes
        if ($overlay.hasClass("overlay-open")) {
            $("body").css("overflow", "hidden");
        } else {
            $("body").css("overflow", "auto");
        }
        
        if ($(this).is($overlay)) {
            $toggler.removeClass("active");
            $menu.removeClass("menu-on");
        }
    });
    
    $(window).on("resize.offcanvas", function() {
        if ($(window).width() > 991) {
            $overlay.removeClass("overlay-open");
            $("body").css("overflow", "auto");
        }
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

