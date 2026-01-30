// Load header and footer dynamically
document.addEventListener('DOMContentLoaded', function() {
    // Load header
    const headerPlaceholder = document.getElementById('header-placeholder');
    if (headerPlaceholder) {
        fetch('assets/includes/header.html')
            .then(response => response.text())
            .then(data => {
                headerPlaceholder.outerHTML = data;
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
