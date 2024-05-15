document.addEventListener('DOMContentLoaded', () => {
  const loginForm = document.getElementById('login-form-container');

  loginForm.addEventListener('submit', async (event) => {
    event.preventDefault();

    const email = document.getElementById('userEmail').value;
    const password = document.getElementById('userPassword').value;

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

        window.location.href = '/index.html';
      } else {
        // alert(data.message);
      }
    } catch (error) {
      console.error('Error:', error);
      // alert('An error occurred, please try again later.');
    }
  });
});
