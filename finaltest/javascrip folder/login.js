const form = document.getElementById('loginForm');
const usernameInput = document.getElementById('username');
const passwordInput = document.getElementById('password');
const usernameError = document.getElementById('usernameError');
const passwordError = document.getElementById('passwordError');
const togglePassword = document.getElementById('togglePassword');

// Toggle password visibility
togglePassword.addEventListener('click', function() {
    const type = passwordInput.getAttribute('type') === 'password' ? 'text' : 'password';
    passwordInput.setAttribute('type', type);
    this.querySelector('i').classList.toggle('fa-eye-slash');
    this.querySelector('i').classList.toggle('fa-eye');
});

// Form validation
form.addEventListener('submit', function(e) {
    e.preventDefault();
    let isValid = true;

    // Username validation
    if (usernameInput.value.trim() === '') {
        usernameError.textContent = 'Username is required';
        usernameError.style.display = 'block';
        usernameInput.classList.add('input-error');
        isValid = false;
    } else {
        usernameError.style.display = 'none';
        usernameInput.classList.remove('input-error');
    }

    // Password validation
    if (passwordInput.value.trim() === '') {
        passwordError.textContent = 'Password is required';
        passwordError.style.display = 'block';
        passwordInput.classList.add('input-error');
        isValid = false;
    } else {
        passwordError.style.display = 'none';
        passwordInput.classList.remove('input-error');
    }

    // Submit the form if valid
    if (isValid) {
        form.submit(); // Submit the form to login_process.php
    }
});

// Real-time validation for username
usernameInput.addEventListener('input', function() {
    if (this.value.trim() !== '') {
        usernameError.style.display = 'none';
        this.classList.remove('input-error');
    }
});

// Real-time validation for password
passwordInput.addEventListener('input', function() {
    if (this.value.trim() !== '') {
        passwordError.style.display = 'none';
        this.classList.remove('input-error');
    }
});