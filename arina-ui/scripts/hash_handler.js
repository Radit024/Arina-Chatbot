// Listen for hash changes
window.addEventListener("hashchange", handleHashChange);

// Handle the initial hash on page load
document.addEventListener("DOMContentLoaded", handleHashChange);

function handleHashChange() {
    const hash = window.location.hash;

    // Hide all pages
    document.querySelectorAll(".page").forEach(page => {
        page.style.display = "none";
    });

    // Hide the chat container and greeting container by default
    const chatContainer = document.querySelector(".chat-container");
    const greetingContainer = document.querySelector(".greeting-container");
    if (chatContainer) chatContainer.style.display = "none";
    if (greetingContainer) greetingContainer.style.display = "none";

    // Show the relevant page based on the hash
    switch (hash) {
        case "#chat": {
            const chatPage = document.getElementById("chatPage");
            if (chatPage) chatPage.style.display = "block";
            if (chatContainer) chatContainer.style.display = "block";
            if (greetingContainer) greetingContainer.style.display = "block";
            break;
        }
        case "#BFA": {
            const BFAPage = document.getElementById("BFAPage");
            if (BFAPage) BFAPage.style.display = "block";
            break;
        }
        case "#home": {
            const homePage = document.getElementById("homePage");
            if (homePage) homePage.style.display = "block";
            break;
        }
        case "#features": {
            const featuresPage = document.getElementById("featuresPage");
            if (featuresPage) featuresPage.style.display = "block";
            break;
        }
        case "#manufacture": {
            const manufacturePage = document.getElementById("manufacturePage");
            if (manufacturePage) manufacturePage.style.display = "block";
            break;
        }
        case "#DF": {
            const DFPage = document.getElementById("DFPage");
            if (DFPage) DFPage.style.display = "block";
            break;
        }
        case "#MM": {
            const MMPage = document.getElementById("MMPage");
            if (MMPage) MMPage.style.display = "block";
            break;
        }
        case "#cultivation": {
            const cultivationPage = document.getElementById("cultivationPage");
            if (cultivationPage) cultivationPage.style.display = "block";
            break;
        }
        case "#seasonal": {
            const seasonalPage = document.getElementById("seasonalPage");
            if (seasonalPage) seasonalPage.style.display = "block";
            break;
        }
        case "#annual": {
            const annualPage = document.getElementById("annualPage");
            if (annualPage) annualPage.style.display = "block";
            break;
        }
        case "#BMC": {
            const BMCPage = document.getElementById("BMCPage");
            if (BMCPage) BMCPage.style.display = "block";
            break;
        }
        case "#SWOT": {
            const SWOTPage = document.getElementById("SWOTPage");
            if (SWOTPage) SWOTPage.style.display = "block";
            break;
        }
        case "#about": {
            const aboutPage = document.getElementById("aboutPage");
            if (aboutPage) aboutPage.style.display = "block";
            break;
        }
        case "#contact": {
            const contactPage = document.getElementById("contactPage");
            if (contactPage) contactPage.style.display = "block";
            break;
        }
        default: {
            const defaultPage = document.getElementById("chatPage");
            if (defaultPage) defaultPage.style.display = "block"; // Default to chat page
        }
    }
}