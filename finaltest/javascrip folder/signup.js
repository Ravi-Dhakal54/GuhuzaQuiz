const form = document.getElementById('signupForm');
const usernameInput = document.getElementById('username');
const addressInput = document.getElementById('address');
const phoneInput = document.getElementById('phone');
const emailInput = document.getElementById('email');
const passwordInput = document.getElementById('password');
const confirmPasswordInput = document.getElementById('confirmPassword');
const termsCheckbox = document.getElementById('terms');
const togglePassword = document.getElementById('togglePassword');

const errorMessages = {
    username: 'Username is required',
    address: 'Address is required',
    phone: 'Phone number is required',
    email: 'Email must contain @ and .com',
    password: 'Password is required',
    confirmPassword: 'Passwords do not match',
    terms: 'You must accept the terms and conditions',
};

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
        showError('usernameError', errorMessages.username);
        usernameInput.classList.add('input-error');
        isValid = false;
    } else {
        hideError('usernameError');
        usernameInput.classList.remove('input-error');
    }

    // Address validation
    if (addressInput.value.trim() === '') {
        showError('addressError', errorMessages.address);
        addressInput.classList.add('input-error');
        isValid = false;
    } else {
        hideError('addressError');
        addressInput.classList.remove('input-error');
    }

    // Phone validation
    if (phoneInput.value.trim() === '') {
        showError('phoneError', errorMessages.phone);
        phoneInput.classList.add('input-error');
        isValid = false;
    } else {
        hideError('phoneError');
        phoneInput.classList.remove('input-error');
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(emailInput.value.trim()) || !emailInput.value.includes('.com')) {
        showError('emailError', errorMessages.email);
        emailInput.classList.add('input-error');
        isValid = false;
    } else {
        hideError('emailError');
        emailInput.classList.remove('input-error');
    }

    // Password validation
    if (passwordInput.value.trim() === '') {
        showError('passwordError', errorMessages.password);
        passwordInput.classList.add('input-error');
        isValid = false;
    } else {
        hideError('passwordError');
        passwordInput.classList.remove('input-error');
    }

    // Confirm Password validation
    if (confirmPasswordInput.value.trim() === '' || confirmPasswordInput.value !== passwordInput.value) {
        showError('confirmPasswordError', errorMessages.confirmPassword);
        confirmPasswordInput.classList.add('input-error');
        isValid = false;
    } else {
        hideError('confirmPasswordError');
        confirmPasswordInput.classList.remove('input-error');
    }

    // Terms and Conditions validation
    if (!termsCheckbox.checked) {
        showError('termsError', errorMessages.terms);
        isValid = false;
    } else {
        hideError('termsError');
    }

    if (isValid) {
        form.submit(); // Submit the form if all validations pass
    }
});

// Helper functions to show/hide errors
function showError(id, message) {
    const errorElement = document.getElementById(id);
    errorElement.textContent = message;
    errorElement.style.display = 'block';
}

function hideError(id) {
    const errorElement = document.getElementById(id);
    errorElement.style.display = 'none';
}