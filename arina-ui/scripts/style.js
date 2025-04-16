// Check theme before loading the page
(function() {
    const savedTheme = localStorage.getItem("theme");
    if (savedTheme === "dark") {
        document.body.classList.add("dark-mode");
        document.body.classList.remove("light-mode");
    } else {
        document.body.classList.add("light-mode");
        document.body.classList.remove("dark-mode");
    }
    // Ensure the switch is in the correct position before DOMContentLoaded
    const toggleSwitch = document.getElementById("themeToggle");
    if (toggleSwitch) {
        toggleSwitch.checked = savedTheme === "dark";
    }
})();

document.addEventListener("DOMContentLoaded", function () {
    const toggleSwitch = document.getElementById("themeToggle");
    const body = document.body;

    function setTheme(isDark) {
        if (isDark) {
            body.classList.add("dark-mode");
            body.classList.remove("light-mode");
            localStorage.setItem("theme", "dark");
        } else {
            body.classList.add("light-mode");
            body.classList.remove("dark-mode");
            localStorage.setItem("theme", "light");
        }
    }

    toggleSwitch.addEventListener("change", function () {
        setTheme(this.checked);
    });

    const savedTheme = localStorage.getItem("theme");
    if (savedTheme) {
        setTheme(savedTheme === "dark");
        toggleSwitch.checked = savedTheme === "dark";
    } else {
        setTheme(toggleSwitch.checked);
    }
});
