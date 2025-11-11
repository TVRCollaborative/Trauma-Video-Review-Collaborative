document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('tvr-form');
    if (!form) return; // Exit if form doesn't exist

    const statusEl = document.getElementById('tvr-status');
    const submitBtn = form.querySelector('button[type="submit"]');

    form.addEventListener('submit', async (e) => {
        e.preventDefault();

        // Disable button and show submitting state
        submitBtn.disabled = true;
        submitBtn.textContent = 'Submitting...';
        statusEl.style.display = 'none';
        statusEl.className = 'form-status'; // Reset classes

        const data = new FormData(form);

        try {
            const response = await fetch(form.action, {
                method: 'POST',
                body: data,
                headers: { 'Accept': 'application/json' }
            });

            if (response.ok) {
                form.reset();
                statusEl.textContent = 'Thanks! Your query has been sent successfully.';
                statusEl.classList.add('success');
            } else {
                // Handle server-side errors from Formspree
                const errorData = await response.json();
                const errorMessage = errorData.errors ? errorData.errors.map(err => err.message).join(', ') : 'Something went wrong. Please try again.';
                statusEl.textContent = `Oops! ${errorMessage}`;
                statusEl.classList.add('error');
            }
        } catch (error) {
            // Handle network errors
            statusEl.textContent = 'A network error occurred. Please check your connection and try again.';
            statusEl.classList.add('error');
        } finally {
            // Re-enable the button regardless of outcome
            submitBtn.disabled = false;
            submitBtn.textContent = 'Submit Query';
            statusEl.style.display = 'block'; // Make the status message visible
        }
    });
});
