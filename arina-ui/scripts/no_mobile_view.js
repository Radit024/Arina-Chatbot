document.addEventListener("DOMContentLoaded", () => {
    const overlay = document.getElementById("mobileOverlay");

    const checkWindowSize = () => {
        if (window.innerWidth < 768 || window.innerHeight < 500) { // Adjust breakpoints as needed
            overlay.style.opacity = "1";
            overlay.style.pointerEvents = "auto"; // Enable interaction when visible
        } else {
            overlay.style.opacity = "0";
            overlay.style.pointerEvents = "none"; // Disable interaction when hidden
        }
    };

    window.addEventListener("resize", checkWindowSize);
    checkWindowSize(); // Initial check on page load
});