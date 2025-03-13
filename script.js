/**
 * Heart of Sound - Course Website Scripts
 * 
 * This file contains all JavaScript functionality for the Heart of Sound course website.
 * It includes:
 * - Section fade-in animations on scroll
 * - Smooth scrolling for navigation
 * - Mobile menu toggle functionality
 */

// Wait for the DOM to be fully loaded
document.addEventListener('DOMContentLoaded', function() {
    // Fade in sections on scroll
    initSectionAnimations();
    
    // Smooth scroll for navigation links
    initSmoothScrolling();
});

/**
 * Initialize section fade-in animations
 * This function adds a 'visible' class to sections as they enter the viewport
 */
function initSectionAnimations() {
    // Function to check if an element is in the viewport
    function isElementInViewport(el) {
        const rect = el.getBoundingClientRect();
        return (
            rect.top <= (window.innerHeight || document.documentElement.clientHeight) * 0.75 &&
            rect.bottom >= 0
        );
    }

    // Get all sections with containers
    const sections = document.querySelectorAll('section');

    // Function to handle visibility on scroll
    function handleVisibility() {
        sections.forEach(function(section) {
            if (isElementInViewport(section)) {
                section.classList.add('visible');
            }
        });
    }

    // Check visibility on initial load
    handleVisibility();

    // Check visibility on scroll
    window.addEventListener('scroll', handleVisibility);
}

/**
 * Initialize smooth scrolling for navigation links
 * This function enables smooth scrolling when clicking on any link that points to an ID on the page
 */
function initSmoothScrolling() {
    // Get all links that have an hash/ID in their href
    const links = document.querySelectorAll('a[href^="#"]');
    
    links.forEach(link => {
        link.addEventListener('click', function(e) {
            // Get the target element
            const targetId = this.getAttribute('href');
            
            // Skip if it's just "#" or invalid
            if (targetId === '#' || !targetId) return;
            
            const targetElement = document.querySelector(targetId);
            
            // Proceed only if the target element exists
            if (targetElement) {
                e.preventDefault();
                
                // Scroll smoothly to the target
                targetElement.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
}

/**
 * Helper function to check if element is in viewport
 * @param {HTMLElement} el - The element to check
 * @returns {boolean} - True if element is in viewport
 */
function isInViewport(el) {
    const rect = el.getBoundingClientRect();
    return (
        rect.top >= 0 &&
        rect.left >= 0 &&
        rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
        rect.right <= (window.innerWidth || document.documentElement.clientWidth)
    );
}

// Initialize sections as visible if they're already in the viewport on page load
document.addEventListener('DOMContentLoaded', function() {
    const sections = document.querySelectorAll('section');
    sections.forEach(section => {
        if (isInViewport(section)) {
            section.classList.add('visible');
        }
    });
    
    // Make hero section visible immediately
    const heroSection = document.querySelector('.hero');
    if (heroSection) {
        heroSection.classList.add('visible');
    }
}); 