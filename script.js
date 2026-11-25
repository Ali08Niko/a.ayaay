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

// IMAGE LIGHTBOX (gallery, works, avatar)
(function () {
    const galleryImgs = [...document.querySelectorAll(".gallery-slot.has-img img")];
    const avatarImgs  = [...document.querySelectorAll(".avatar-placeholder.has-photo img")];
    if (!galleryImgs.length && !avatarImgs.length) return;

    const box = document.createElement("div");
    box.className = "lightbox";
    box.setAttribute("role", "dialog");
    box.setAttribute("aria-modal", "true");
    box.innerHTML = `
        <div class="lightbox-window">
            <div class="lightbox-bar">
                <span id="lbCount">PHOTO.jpg</span>
                <button class="lightbox-close" aria-label="Close">×</button>
            </div>
            <div class="lightbox-stage">
                <button class="lightbox-nav lightbox-prev" aria-label="Previous">◀</button>
                <img id="lbImg" alt="">
                <button class="lightbox-nav lightbox-next" aria-label="Next">▶</button>
            </div>
            <div class="lightbox-caption" id="lbCaption"></div>
        </div>`;
    document.body.appendChild(box);

    const lbImg = box.querySelector("#lbImg");
    const lbCaption = box.querySelector("#lbCaption");
    const lbCount = box.querySelector("#lbCount");

    let list = [];
    let index = 0;
    let lastFocus = null;

    function show() {
        const img = list[index];
        const caption = img.parentElement.querySelector(".caption");

        lbImg.src = img.currentSrc || img.src;
        lbImg.alt = img.alt;
        lbCaption.textContent = (caption && caption.textContent.trim()) || img.alt || "";
        lbCount.textContent = list.length > 1
            ? `PHOTO ${index + 1} / ${list.length}`
            : "PHOTO.jpg";
        box.classList.toggle("single", list.length < 2);
    }

    function open(img) {
        list = galleryImgs.includes(img) ? galleryImgs : [img];
        index = list.indexOf(img);
        lastFocus = document.activeElement;
        show();
        box.classList.add("open");
        document.body.classList.add("lightbox-open");
        box.querySelector(".lightbox-close").focus();
    }

    function close() {
        box.classList.remove("open");
        document.body.classList.remove("lightbox-open");
        if (lastFocus) lastFocus.focus();
    }

    function step(dir) {
        if (list.length < 2) return;
        index = (index + dir + list.length) % list.length;
        show();
    }

    galleryImgs.concat(avatarImgs).forEach(img => {
        img.parentElement.addEventListener("click", () => open(img));
    });

    box.querySelector(".lightbox-close").addEventListener("click", close);
    box.querySelector(".lightbox-prev").addEventListener("click", () => step(-1));
    box.querySelector(".lightbox-next").addEventListener("click", () => step(1));

    // click the dark backdrop to close
    box.addEventListener("click", e => { if (e.target === box) close(); });

    // keyboard: Esc closes, arrows browse
    document.addEventListener("keydown", e => {
        if (!box.classList.contains("open")) return;
        if (e.key === "Escape") close();
        if (e.key === "ArrowLeft") step(-1);
        if (e.key === "ArrowRight") step(1);
    });

    // swipe on phones
    let startX = null;
    box.addEventListener("touchstart", e => { startX = e.touches[0].clientX; }, { passive: true });
    box.addEventListener("touchend", e => {
        if (startX === null) return;
        const dx = e.changedTouches[0].clientX - startX;
        if (Math.abs(dx) > 50) step(dx < 0 ? 1 : -1);
        startX = null;
    });
})();