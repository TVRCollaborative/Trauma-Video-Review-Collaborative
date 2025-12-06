// form-handler.js

// Wait for the entire HTML document to be loaded and parsed
document.addEventListener('DOMContentLoaded', function () {
    // Find our specific form on the page by its ID
    const form = document.getElementById('data-submission-form');

    // If the form doesn't exist on this page, do nothing.
    if (!form) {
        return;
    }

    // Your Make.com webhook URL
    const MAKE_WEBHOOK_URL = 'https://hook.us2.make.com/eoijt737rjs6shtjpfbbc4mhjm19t2c5';

    // Add an event listener to run our code when the form is submitted
    form.addEventListener('submit', async function (event) {
        // 1. Prevent the browser's default behavior of navigating away
        event.preventDefault();

        const submitButton = form.querySelector('button[type="submit"]');
        const originalButtonText = submitButton ? submitButton.textContent : '';

        // Give the user visual feedback that something is happening
        if (submitButton) {
            submitButton.disabled = true;
            submitButton.textContent = 'Submitting...';
        }

        // 2. Grab the form data
        const formData = new FormData(form);

        try {
            // 3. Send the form data to the Make webhook in the background
            const response = await fetch(MAKE_WEBHOOK_URL, {
                method: 'POST',
                body: formData,
                headers: {
                    'Accept': 'application/json'
                }
            });

            // Check if Make received the data successfully (HTTP status 2xx)
            if (response.ok) {
                // 4. If successful, redirect the user to the thank you page
                window.location.href = 'thank-you.html';
            } else {
                // If Make returns an error, alert the user
                alert('There was a problem with the submission. Please try again.');
                if (submitButton) {
                    submitButton.disabled = false;
                    submitButton.textContent = originalButtonText;
                }
            }
        } catch (error) {
            // If a network error occurs (e.g., no internet), alert the user
            console.error('Submission failed:', error);
            alert('A network error occurred. Please check your connection and try again.');
            if (submitButton) {
                submitButton.disabled = false;
                submitButton.textContent = originalButtonText;
            }
        }
    });
});
