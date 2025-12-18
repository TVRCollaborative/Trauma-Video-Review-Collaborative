// form-handler.js
document.addEventListener('DOMContentLoaded', function () {

  /***********************
   * 1) Annual site data submission form (existing)
   ***********************/
  (function setupAnnualSubmissionForm() {
    const form = document.getElementById('data-submission-form');
    if (!form) return;

    // Your existing Make webhook for the annual submission form
    const MAKE_WEBHOOK_URL = 'https://hook.us2.make.com/eoijt737rjs6shtjpfbbc4mhjm19t2c5';

    form.addEventListener('submit', async function (event) {
      event.preventDefault();

      const submitButton = form.querySelector('button[type="submit"]');
      const originalButtonText = submitButton ? submitButton.textContent : '';

      if (submitButton) {
        submitButton.disabled = true;
        submitButton.textContent = 'Submitting...';
      }

      const formData = new FormData(form);

      try {
        const response = await fetch(MAKE_WEBHOOK_URL, {
          method: 'POST',
          body: formData,
          headers: { 'Accept': 'application/json' }
        });

        if (response.ok) {
          window.location.href = 'thank-you.html';
        } else {
          alert('There was a problem with the submission. Please try again.');
          if (submitButton) {
            submitButton.disabled = false;
            submitButton.textContent = originalButtonText;
          }
        }
      } catch (error) {
        console.error('Submission failed:', error);
        alert('A network error occurred. Please check your connection and try again.');
        if (submitButton) {
          submitButton.disabled = false;
          submitButton.textContent = originalButtonText;
        }
      }
    });
  })();


  /***********************
   * 2) Project intake forms (new)
   *    - Add class="project-intake-form"
   *    - Add data-webhook="https://hook.us2.make.com/...."
   ***********************/
  (function setupProjectIntakeForms() {
    const projectForms = document.querySelectorAll('form.project-intake-form');
    if (!projectForms.length) return;

    projectForms.forEach((form) => {
      form.addEventListener('submit', async function (event) {
        event.preventDefault();

        const webhookUrl = form.getAttribute('data-webhook');

        if (!webhookUrl || webhookUrl.trim() === '' || webhookUrl.includes('PASTE_')) {
          alert('This form is not configured yet (missing Make webhook URL). Please contact TVRC.');
          return;
        }

        const submitButton = form.querySelector('button[type="submit"]');
        const originalButtonText = submitButton ? submitButton.textContent : '';

        if (submitButton) {
          submitButton.disabled = true;
          submitButton.textContent = 'Submitting...';
        }

        const formData = new FormData(form);

        try {
          const response = await fetch(webhookUrl, {
            method: 'POST',
            body: formData,
            headers: { 'Accept': 'application/json' }
          });

          if (response.ok) {
            window.location.href = 'thank-you.html';
          } else {
            alert('There was a problem with the submission. Please try again.');
            if (submitButton) {
              submitButton.disabled = false;
              submitButton.textContent = originalButtonText;
            }
          }
        } catch (error) {
          console.error('Project intake submission failed:', error);
          alert('A network error occurred. Please check your connection and try again.');
          if (submitButton) {
            submitButton.disabled = false;
            submitButton.textContent = originalButtonText;
          }
        }
      });
    });
  })();

});
