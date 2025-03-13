/**
 * Heart of Sound - Course Website Scripts
 * 
 * This file contains all JavaScript functionality for the Heart of Sound course website.
 * It includes:
 * - Component fade-in animations on scroll
 * - Smooth scrolling for navigation
 * - Mobile menu toggle functionality
 */

// Wait for the DOM to be fully loaded
document.addEventListener('DOMContentLoaded', function() {
    // Add fade-in class to elements we want to animate
    setupFadeElements();
    
    // Fade in elements on scroll
    initFadeInAnimations();
    
    // Smooth scroll for navigation links
    initSmoothScrolling();
});

/**
 * Setup elements that should fade in
 * This function adds the 'fade-in' class to elements we want to animate
 */
function setupFadeElements() {
    // Select all headings, paragraphs, images, cards, and buttons within sections
    const fadeElements = document.querySelectorAll('section h1, section h2, section h3, section h4, section h5, section h6, section p, section img, section .card, section .button, section .row');
    
    // Add the fade-in class to each element
    fadeElements.forEach(element => {
        element.classList.add('fade-in');
    });
}

/**
 * Initialize fade-in animations
 * This function adds a 'visible' class to elements as they enter the viewport
 */
function initFadeInAnimations() {
    // Function to check if an element is in the viewport
    function isElementInViewport(el) {
        const rect = el.getBoundingClientRect();
        return (
            rect.top <= (window.innerHeight || document.documentElement.clientHeight) * 0.9 &&
            rect.bottom >= 0
        );
    }

    // Get all elements with the fade-in class
    const fadeElements = document.querySelectorAll('.fade-in');

    // Function to handle visibility on scroll
    function handleVisibility() {
        fadeElements.forEach(function(element) {
            if (isElementInViewport(element)) {
                element.classList.add('visible');
            }
        });
    }

    // Check visibility on initial load
    handleVisibility();

    // Check visibility on scroll
    window.addEventListener('scroll', handleVisibility);
    
    // Make hero section elements visible immediately
    const heroElements = document.querySelectorAll('.hero .fade-in');
    heroElements.forEach(element => {
        element.classList.add('visible');
    });
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
