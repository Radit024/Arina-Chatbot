document.addEventListener("DOMContentLoaded", () => {
    const userName = "Jane Doe"; // Replace with the actual user's name
    const greetingText = document.querySelector(".greeting-text");
    const profileUserName = document.getElementById("profileUserName");

    // Update greeting text and profile popup name
    greetingText.textContent = `Hello, ${userName}!`;
    profileUserName.textContent = userName;

    const profilePlaceholder = document.querySelector(".profile-placeholder");
    const profilePopup = document.getElementById("profilePopup");

    // Toggle the profile popup
    profilePlaceholder.addEventListener("click", () => {
        profilePopup.classList.toggle("show");
    });

    // Close the popup when clicking outside
    document.addEventListener("click", (event) => {
        if (!profilePlaceholder.contains(event.target) && !profilePopup.contains(event.target)) {
            profilePopup.classList.remove("show");
        }
    });
});