document.addEventListener('DOMContentLoaded', function () {
  let user = {
    name: "John Doe",
    email: "john.doe@example.com",
    phone: "Not set",
    joinDate: "January 1, 2023",
    profilePic: "default-profile.png",
  };

  // Cache DOM elements for better performance
  const usernameEl = document.getElementById("username");
  const emailEl = document.getElementById("user-email");
  const phoneEl = document.getElementById("user-phone");
  const joinDateEl = document.getElementById("join-date");
  const profilePicEl = document.getElementById("profilePic");
  const previewPicEl = document.getElementById("previewPic");
  const modalEl = document.getElementById("updateModal");
  const updateForm = document.getElementById("updateForm");

  // Initialize user info on page load
  usernameEl.textContent = user.name;
  emailEl.textContent = user.email;
  phoneEl.textContent = user.phone;
  joinDateEl.textContent = user.joinDate;
  profilePicEl.src = user.profilePic;

  // Open Modal
  window.openModal = function () {
    modalEl.style.display = "flex";
  };

  // Close Modal
  window.closeModal = function () {
    modalEl.style.display = "none";
  };

  // Preview Profile Picture Before Upload
  window.previewProfilePic = function (event) {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = function (e) {
        previewPicEl.src = e.target.result;
      };
      reader.readAsDataURL(file);
    }
  };

  // Handle Form Submission with Validation
  updateForm.addEventListener("submit", function (event) {
    event.preventDefault();

    const formData = new FormData(updateForm);
    const newPassword = formData.get("newPassword");
    const confirmNewPassword = formData.get("confirmNewPassword");

    // Validate password match
    if (newPassword && newPassword !== confirmNewPassword) {
      alert("Passwords do not match!");
      return;
    }

    fetch("update_process.php", {
      method: "POST",
      body: formData,
    })
      .then(response => response.json())
      .then(data => {
        if (data.status === "success") {
          // Update UI with new values
          usernameEl.textContent = formData.get("newName") || user.name;
          emailEl.textContent = formData.get("newEmail") || user.email;
          phoneEl.textContent = formData.get("newPhone") || user.phone;

          // Update profile picture if changed
          if (data.profile_pic) {
            profilePicEl.src = data.profile_pic;
            previewPicEl.src = data.profile_pic;
          }

          alert("Profile updated successfully!");
          closeModal();
        } else {
          alert("Error: " + data.message);
        }
      })
      .catch(error => {
        console.error("Error:", error);
        alert("An error occurred while updating profile. Please try again.");
      });
  });

  // Close modal if clicked outside
  window.onclick = function (event) {
    if (event.target === modalEl) {
      closeModal();
    }
  };
});
