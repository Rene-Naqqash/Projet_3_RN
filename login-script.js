/** @format */

document.addEventListener('DOMContentLoaded', function () {
  const loginForm = document.querySelector('#login-form-container');

  const emailInput = document.querySelector('#userEmail');

  // je verifie le input des mail en temps réel
  emailInput.addEventListener('input', function () {
    const email = emailInput.value.trim();
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (email === '') {
      emailInput.setCustomValidity('Veuillez entrer une adresse e-mail.');
    } else if (!emailRegex.test(email)) {
      emailInput.setCustomValidity(
        'Veuillez entrer une adresse e-mail valide.'
      );
    } else {
      emailInput.setCustomValidity('');
    }
  });

  loginForm.addEventListener('submit', function (event) {
    event.preventDefault();

    const email = emailInput.value;
    const password = document.querySelector('#userPassword').value;

    fetch('http://localhost:5678/api/users/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password }),
    })
      .then((response) => {
        if (response.ok) {
          return response.json();
        } else {
          switch (response.status) {
            case 401:
              displayError(
                'Email ou mot de passe incorrect. Veuillez   réessayer.'
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
      })
      .then((data) => {
        localStorage.setItem('token', data.token);
        window.location.href = 'index.html';
      })
      .catch(() => {});
  });

  function displayError(message) {
    let displayMessage = document.querySelector('#errorMessage');
    displayMessage.innerText = message;
    displayMessage.style.visibility = 'visible';
  }
});
