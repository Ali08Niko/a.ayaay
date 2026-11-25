// LIVE CLOCK (home page)
const clock = document.getElementById("liveClock");
if (clock) {
    const tick = () => clock.textContent = new Date().toLocaleTimeString([], { hour12: false });
    tick();
    setInterval(tick, 1000);
}

// SURPRISE BUTTON (home page)
const surpriseButton = document.getElementById("surpriseButton");
const surpriseMessage = document.getElementById("surpriseMessage");
if (surpriseButton && surpriseMessage) {
    const messages = [
        "STATUS: main character energy detected.",
        "SYSTEM MESSAGE: you are doing amazing. ✦",
        "NOW LOADING: your next great idea...",
        "REMINDER: be unapologetically yourself. ♡",
        "ERROR 404: boring personality not found."
    ];
    surpriseButton.addEventListener("click", () => {
        surpriseMessage.textContent = messages[Math.floor(Math.random() * messages.length)];
    });
}

// MOBILE NAVIGATION
const menuToggle = document.getElementById("menuToggle");
const navLinks = document.getElementById("navLinks");
if (menuToggle && navLinks) {
    menuToggle.addEventListener("click", () => {
        const isOpen = navLinks.classList.toggle("open");
        menuToggle.setAttribute("aria-expanded", String(isOpen));
    });
    navLinks.querySelectorAll("a").forEach(link => {
        link.addEventListener("click", () => navLinks.classList.remove("open"));
    });
}

