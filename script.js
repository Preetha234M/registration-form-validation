const form = document.getElementById("registrationForm");
const inputs = document.querySelectorAll("input");
const nameInput = document.getElementById("fullname");
const emailInput = document.getElementById("email");
const phoneInput = document.getElementById("phone");
const passwordInput = document.getElementById("password");
const confirmPasswordInput = document.getElementById("confirmPassword");
const progressBar = document.getElementById("formProgress");
const strengthMeter = document.getElementById("strengthMeter");
const captchaInput = document.getElementById("captcha");

let correctAnswer = 0;

// === CAPTCHA ===
function generateCaptcha() {
  const num1 = Math.floor(Math.random() * 10);
  const num2 = Math.floor(Math.random() * 10);
  correctAnswer = num1 + num2;
  document.getElementById("captchaQuestion").textContent = `What is ${num1} + ${num2}?`;
}

// === PASSWORD STRENGTH ===
function checkPasswordStrength(password) {
  let strength = 0;
  if (password.length >= 8) strength++;
  if (/[A-Z]/.test(password)) strength++;
  if (/[0-9]/.test(password)) strength++;
  if (/[^A-Za-z0-9]/.test(password)) strength++;

  strengthMeter.innerHTML = ""; // Clear before re-adding
  const meterBar = document.createElement("div");

  if (strength <= 1) {
    meterBar.classList.add("weak");
  } else if (strength === 2 || strength === 3) {
    meterBar.classList.add("medium");
  } else {
    meterBar.classList.add("strong");
  }

  strengthMeter.className = "strength-meter"; // reset class
  strengthMeter.appendChild(meterBar);
}

// === PROGRESS BAR ===
function updateProgressBar() {
  const filled = [...inputs].filter(input => input.value.trim() !== "").length;
  const total = inputs.length;
  const percent = Math.round((filled / total) * 100);
  progressBar.style.width = percent + "%";
  progressBar.textContent = percent + "%";
}

// === INPUT VALIDATION ===
inputs.forEach(input => {
  input.addEventListener("input", () => {
    validateForm(false);
    updateProgressBar();

    if (input.id === "password") {
      checkPasswordStrength(input.value);
    }
  });
});

// === FORM SUBMIT ===
form.addEventListener("submit", function (e) {
  e.preventDefault();
  if (validateForm(true)) {
    alert("Form submitted successfully!");
    form.reset();
    updateProgressBar();
    strengthMeter.innerHTML = "";
    generateCaptcha();
  }
});

// === VALIDATION FUNCTION ===
function validateForm(showErrors = true) {
  let isValid = true;

  // Clear errors
  document.querySelectorAll(".error").forEach(el => (el.textContent = ""));

  const name = nameInput.value.trim();
  const email = emailInput.value.trim();
  const phone = phoneInput.value.trim();
  const password = passwordInput.value;
  const confirmPassword = confirmPasswordInput.value;
  const captchaVal = captchaInput.value.trim();

  // Name check
  if (name.length < 5 || /[^A-Za-z ]/.test(name)) {
    if (showErrors) {
      document.getElementById("nameError").textContent = "Name must be at least 5 letters (only alphabets).";
    }
    isValid = false;
  }

  // Email check
  if (!email.includes("@")) {
    if (showErrors) {
      document.getElementById("emailError").textContent = "Enter a valid email address.";
    }
    isValid = false;
  }

  // Phone check
  const phonePattern = /^[0-9]{10}$/;
  if (!phonePattern.test(phone) || phone === "1234567890") {
    if (showErrors) {
      document.getElementById("phoneError").textContent = "Enter a valid 10-digit phone number.";
    }
    isValid = false;
  }

  // Password check
  if (
    password.toLowerCase() === "password" ||
    password.toLowerCase() === name.toLowerCase() ||
    password.length < 8
  ) {
    if (showErrors) {
      document.getElementById("passwordError").textContent = "Password is not strong.";
    }
    isValid = false;
  }

  // Confirm password
  if (password !== confirmPassword) {
    if (showErrors) {
      document.getElementById("confirmPasswordError").textContent = "Passwords do not match.";
    }
    isValid = false;
  }

  // Captcha check
  if (parseInt(captchaVal) !== correctAnswer) {
    if (showErrors) {
      document.getElementById("captchaError").textContent = "Captcha answer is incorrect.";
    }
    isValid = false;
  }

  return isValid;
}

// === PASSWORD TOGGLE ===
const toggleIcons = document.querySelectorAll(".toggle-password");
toggleIcons.forEach(icon => {
  icon.addEventListener("click", () => {
    const targetId = icon.getAttribute("toggle");
    const target = document.querySelector(targetId);
    const type = target.getAttribute("type") === "password" ? "text" : "password";
    target.setAttribute("type", type);
    icon.classList.toggle("fa-eye");
    icon.classList.toggle("fa-eye-slash");
  });
});

// === THEME TOGGLE ===
const themeBtn = document.getElementById("themeSwitcher");
themeBtn.addEventListener("click", () => {
  document.body.classList.toggle("dark");
});

// === ON LOAD ===
window.addEventListener("load", () => {
  generateCaptcha();
  updateProgressBar();
});
