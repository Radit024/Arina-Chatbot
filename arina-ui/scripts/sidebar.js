document.addEventListener("DOMContentLoaded", () => {
    const sidebar = document.querySelector('.sidebar');
    sidebar.classList.remove('open'); // Ensure the sidebar starts closed
});

document.addEventListener("DOMContentLoaded", () => {
    const sidebar = document.getElementById("sidebar");
    const toggleButton = document.getElementById("toggleSidebar");
    const mainContent = document.getElementById("mainContent");

    toggleButton.addEventListener("click", () => {
        sidebar.classList.toggle("open"); // Toggle the "open" class
        mainContent.classList.toggle("shifted"); // Optional: Add a class for shifted state
    });

    // Select all menu items that have submenus
    const submenuToggles = document.querySelectorAll(".sidebar-menu li > a");

    submenuToggles.forEach((toggle) => {
        toggle.addEventListener("click", (e) => {
            const submenu = toggle.nextElementSibling;

            // Check if the clicked item has a submenu
            if (submenu && submenu.classList.contains("submenu")) {
                e.preventDefault(); // Prevent default anchor behavior

                if (submenu.classList.contains("active")) {
                    // Collapse submenu
                    submenu.style.height = `${submenu.scrollHeight}px`; // Set height to current content height
                    setTimeout(() => {
                        submenu.style.height = "0"; // Collapse to 0 height
                    }, 0);
                } else {
                    // Expand submenu
                    submenu.style.height = `${submenu.scrollHeight}px`; // Set height to content height
                    setTimeout(() => {
                        submenu.style.height = "auto"; // Reset to auto after animation
                    }, 300); // Match the transition duration
                }

                submenu.classList.toggle("active"); // Toggle active class

                // Toggle arrow direction
                const arrow = toggle.querySelector(".arrow");
                if (arrow) {
                    arrow.classList.toggle("rotated"); // Add or remove the "rotated" class
                }
            }
        });
    });
});