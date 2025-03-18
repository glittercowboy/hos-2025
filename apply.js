/**
 * Heart of Sound - Application Form Scripts
 * 
 * This file contains all JavaScript functionality for the Heart of Sound application form.
 * It includes:
 * - Multi-step form navigation
 * - Form validation
 * - Progress tracking
 * - Form data saving and retrieval
 * - Conditional field display
 */

document.addEventListener('DOMContentLoaded', function() {
    // Initialize the application form
    initApplicationForm();
    
    // Setup conditional fields
    setupConditionalFields();
    
    // Load saved form data if available
    loadSavedFormData();
});

/**
 * Initialize the application form
 * Sets up event listeners and form navigation
 */
function initApplicationForm() {
    // Get form elements
    const form = document.getElementById('application-form');
    const sections = document.querySelectorAll('.form-section');
    const prevButton = document.getElementById('prev-button');
    const nextButton = document.getElementById('next-button');
    const saveButton = document.getElementById('save-button');
    const submitButton = document.getElementById('submit-button');
    const progressBar = document.getElementById('application-progress');
    const currentSectionSpan = document.getElementById('current-section');
    const totalSectionsSpan = document.getElementById('total-sections');
    
    // Set total sections
    const totalSections = sections.length;
    totalSectionsSpan.textContent = totalSections;
    
    // Track current section
    let currentSection = 1;
    
    // Previous button click handler
    prevButton.addEventListener('click', function() {
        if (currentSection > 1) {
            // Hide current section
            document.getElementById(`section-${currentSection}`).classList.add('hidden');
            
            // Show previous section
            currentSection--;
            const prevSection = document.getElementById(`section-${currentSection}`);
            prevSection.classList.remove('hidden');
            
            // Update buttons
            updateNavigationButtons();
            
            // Update progress
            updateProgress();
            
            // Scroll to top of form
            scrollToFormTop();
        }
    });
    
    // Next button click handler
    nextButton.addEventListener('click', function() {
        // Validate current section
        if (validateSection(currentSection)) {
            // Hide current section
            document.getElementById(`section-${currentSection}`).classList.add('hidden');
            
            // Show next section
            currentSection++;
            const nextSection = document.getElementById(`section-${currentSection}`);
            nextSection.classList.remove('hidden');
            
            // Update buttons
            updateNavigationButtons();
            
            // Update progress
            updateProgress();
            
            // Scroll to top of form
            scrollToFormTop();
        }
    });
    
    // Save button click handler
    saveButton.addEventListener('click', function() {
        saveFormData();
        
        // Show save confirmation
        const saveConfirmation = document.createElement('div');
        saveConfirmation.className = 'save-confirmation';
        saveConfirmation.textContent = 'Your progress has been saved. You can return to complete the application later.';
        
        // Insert after the form navigation
        const formNavigation = document.querySelector('.form-navigation');
        formNavigation.parentNode.insertBefore(saveConfirmation, formNavigation.nextSibling);
        
        // Remove confirmation after 5 seconds
        setTimeout(() => {
            if (saveConfirmation.parentNode) {
                saveConfirmation.parentNode.removeChild(saveConfirmation);
            }
        }, 5000);
    });
    
    // Form submission handler
    form.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // Validate final section
        if (validateSection(currentSection)) {
            // Save form data
            saveFormData();
            
            // Show loading indicator
            const submitButton = document.getElementById('submit-button');
            const originalButtonText = submitButton.textContent;
            submitButton.textContent = 'Submitting...';
            submitButton.disabled = true;
            
            // Prepare form data for submission
            const formData = new FormData(form);
            
            // Submit form data to Formspree
            fetch('https://formspree.io/f/manenlgj', {
                method: 'POST',
                body: formData,
                headers: {
                    'Accept': 'application/json'
                }
            })
            .then(response => {
                if (response.ok) {
                    return response.json();
                }
                throw new Error('Network response was not ok.');
            })
            .then(data => {
                console.log('Form submitted successfully', data);
                
                // Track the completed application with Meta Pixel
                fbq('track', 'CompleteRegistration');
                
                // Hide form
                document.querySelector('.application-form').classList.add('hidden');
                
                // Show thank you section
                document.getElementById('thank-you-section').classList.remove('hidden');
                
                // Scroll to top
                window.scrollTo({
                    top: 0,
                    behavior: 'smooth'
                });
                
                // Clear localStorage to prevent resubmission
                localStorage.removeItem('heartOfSoundApplication');
            })
            .catch(error => {
                console.error('Error submitting form:', error);
                
                // Show error message
                const errorMessage = document.createElement('div');
                errorMessage.className = 'error-message submission-error';
                errorMessage.textContent = 'There was a problem submitting your application. Please try again or contact us directly at howdy@taches-teaches.com';
                
                // Insert after the form navigation
                const formNavigation = document.querySelector('.form-navigation');
                formNavigation.parentNode.insertBefore(errorMessage, formNavigation.nextSibling);
                
                // Reset button
                submitButton.textContent = originalButtonText;
                submitButton.disabled = false;
            });
        }
    });
    
    // Function to update navigation buttons based on current section
    function updateNavigationButtons() {
        // Update previous button
        prevButton.disabled = currentSection === 1;
        
        // Update next/submit buttons
        if (currentSection === totalSections) {
            nextButton.style.display = 'none';
            submitButton.style.display = 'block';
        } else {
            nextButton.style.display = 'block';
            submitButton.style.display = 'none';
        }
        
        // Update current section indicator
        currentSectionSpan.textContent = currentSection;
    }
    
    // Function to update progress bar
    function updateProgress() {
        const progressPercentage = (currentSection / totalSections) * 100;
        progressBar.style.width = `${progressPercentage}%`;
    }
    
    // Function to scroll to top of form
    function scrollToFormTop() {
        const formTop = document.querySelector('.application-form').offsetTop;
        window.scrollTo({
            top: formTop - 50,
            behavior: 'smooth'
        });
    }
}

/**
 * Validate a form section
 * @param {number} sectionNumber - The section number to validate
 * @returns {boolean} - Whether the section is valid
 */
function validateSection(sectionNumber) {
    const section = document.getElementById(`section-${sectionNumber}`);
    const requiredFields = section.querySelectorAll('[required]');
    let isValid = true;
    
    // Check each required field
    requiredFields.forEach(field => {
        // Reset field styling
        field.classList.remove('invalid');
        
        // Remove any existing error messages
        const existingError = field.parentNode.querySelector('.error-message');
        if (existingError) {
            existingError.parentNode.removeChild(existingError);
        }
        
        // Check if field is empty
        if (!field.value.trim()) {
            isValid = false;
            
            // Add invalid class
            field.classList.add('invalid');
            
            // Add error message
            const errorMessage = document.createElement('div');
            errorMessage.className = 'error-message';
            errorMessage.textContent = 'This field is required';
            field.parentNode.appendChild(errorMessage);
        }
        
        // Special validation for checkbox
        if (field.type === 'checkbox' && !field.checked) {
            isValid = false;
            
            // Add error message
            const errorMessage = document.createElement('div');
            errorMessage.className = 'error-message';
            errorMessage.textContent = 'You must agree to continue';
            field.parentNode.appendChild(errorMessage);
        }
    });
    
    return isValid;
}

/**
 * Setup conditional fields that show/hide based on other field values
 */
function setupConditionalFields() {
    // Show/hide "Other" field for discovery question
    const discoverySelect = document.getElementById('discovery');
    const discoveryOtherGroup = document.getElementById('discovery-other-group');
    
    discoverySelect.addEventListener('change', function() {
        discoveryOtherGroup.style.display = this.value === 'other' ? 'block' : 'none';
    });
    
    // Show/hide "Other" field for DAW question
    const dawSelect = document.getElementById('daw');
    const dawOtherGroup = document.getElementById('daw-other-group');
    
    dawSelect.addEventListener('change', function() {
        dawOtherGroup.style.display = this.value === 'other' ? 'block' : 'none';
    });
}

/**
 * Save form data to localStorage
 */
function saveFormData() {
    const form = document.getElementById('application-form');
    const formData = new FormData(form);
    const formDataObj = {};
    
    // Convert FormData to object
    for (const [key, value] of formData.entries()) {
        formDataObj[key] = value;
    }
    
    // Save to localStorage
    localStorage.setItem('heartOfSoundApplication', JSON.stringify(formDataObj));
}

/**
 * Load saved form data from localStorage
 */
function loadSavedFormData() {
    const savedData = localStorage.getItem('heartOfSoundApplication');
    
    if (savedData) {
        const formDataObj = JSON.parse(savedData);
        const form = document.getElementById('application-form');
        
        // Populate form fields
        for (const key in formDataObj) {
            const field = form.elements[key];
            
            if (field) {
                if (field.type === 'checkbox') {
                    field.checked = formDataObj[key] === 'on';
                } else {
                    field.value = formDataObj[key];
                }
            }
        }
        
        // Trigger change events for selects with conditional fields
        const discoverySelect = document.getElementById('discovery');
        const dawSelect = document.getElementById('daw');
        
        if (discoverySelect.value === 'other') {
            document.getElementById('discovery-other-group').style.display = 'block';
        }
        
        if (dawSelect.value === 'other') {
            document.getElementById('daw-other-group').style.display = 'block';
        }
    }
}

// CSS for error messages and form styling is now in apply-styles.css
