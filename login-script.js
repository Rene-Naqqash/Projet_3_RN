document.addEventListener('DOMContentLoaded', function () {
  const loginForm = document.querySelector('#login-form-container');

  loginForm.addEventListener('submit', async (event) => {
    event.preventDefault();

    const email = document.querySelector('#userEmail').value;
    const password = document.querySelector('#userPassword').value;

    try {
      const response = await fetch('http://localhost:5678/api/users/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (response.ok) {
        localStorage.setItem('token', data.token);
        window.location.href = '/Projet_3_RN/index.html';
      } else {
        switch (response.status) {
          case 401:
            displayError(
              'Email ou mot de passe incorrect. Veuillez réessayer.'
            );
            break;
          case 404:
            displayError(
              'Email ou mot de passe incorrect. Veuillez   réessayer.'
            );
            break;
          default:
            displayError(
              'Une erreur est survenue. Veuillez réessayer plus tard.'
            );
            break;
        }
      }
    } catch (error) {
      displayError();
    }
  });

  function displayError(message) {
    let displayMessage = document.querySelector('#errorMessage');
    displayMessage.innerText = message;
    displayMessage.style.visibility = 'visible';
  }
});
