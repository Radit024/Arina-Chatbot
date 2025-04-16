document.addEventListener("DOMContentLoaded", function () {
    const greetingElement = document.getElementById("greeting-text");
    const greetingText = "Hello! How can Arina help?";
    let index = 0;

    function type() {
        if (index < greetingText.length) {
            greetingElement.textContent = greetingText.substring(0, index + 1);
            index++;
            setTimeout(type, 100);
        }
    }

    function handleTypingEffect() {
        const hash = window.location.hash;
        const greetingContainer = document.querySelector(".greeting-container");

        if (greetingContainer) {
            greetingContainer.style.display = hash === "#chat" ? "block" : "none";
        }

        if (hash === "#chat") {
            index = 0; // Reset typing effect
            type();
        }
    }

    // Listen for hash changes to trigger the typing effect
    window.addEventListener("hashchange", handleTypingEffect);

    // Run on initial load
    handleTypingEffect();
});
