// script.js

// Function to handle login button click
function handleLogin() {
    // Redirect to landing page with a query parameter
    window.location.href = "landing copy.html?showAnimation=true";
  }
  
  // Function to handle animation on the landing page
  function handleLandingAnimation() {
    // Get references to DOM elements
    const animationContainer = document.getElementById("animation-container");
    const animatedImage = document.getElementById("animated-image");
    const animationText = document.getElementById("animation-text");
  
    // Check for the query parameter
    const urlParams = new URLSearchParams(window.location.search);
    const showAnimation = urlParams.get("showAnimation");
  
    // If the query parameter is present, show the animation
    if (showAnimation === "true") {
      // Show the animation container
      animationContainer.style.display = "flex";
  
      // Trigger the image animation
      setTimeout(() => {
        animatedImage.classList.add("animate-image");
      }, 100); // Small delay to ensure the container is visible
  
      // Trigger the text animation
      setTimeout(() => {
        animationText.classList.add("animate-text");
      }, 500); // Delay text animation slightly
  
      // Hide the animation container after 5 seconds
      setTimeout(() => {
        animationContainer.style.display = "none";
      }, 5000); // 5 seconds delay
    }
  }
  
  // Add event listeners based on the page
  if (window.location.pathname.includes("login.html")) {
    // Login page logic
    const loginButton = document.getElementById("login-button");
    if (loginButton) {
      loginButton.addEventListener("click", handleLogin);
    }
  } else if (window.location.pathname.includes("landing.html")) {
    // Landing page logic
    handleLandingAnimation();
  }