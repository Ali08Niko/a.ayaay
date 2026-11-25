// ===== EXTRAS =====
(function () {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const get = k => { try { return localStorage.getItem(k); } catch { return null; } };
    const set = (k, v) => { try { localStorage.setItem(k, v); } catch {} };

    // 1. THEME SWITCHER (add or edit colors here)
    const themes = {
        purple: null,
        pink:   { "--purple": "#e0408f", "--purple-bright": "#ff7ac0", "--lavender": "#ffc2e2" },
        blue:   { "--purple": "#3b82f6", "--purple-bright": "#7ab4ff", "--lavender": "#bcd8ff" },
        green:  { "--purple": "#22b573", "--purple-bright": "#5ee6a2", "--lavender": "#b5f5d6" },
        sunset: { "--purple": "#f07a2c", "--purple-bright": "#ffa45e", "--lavender": "#ffd2ae" }
    };
    const dotColor = { purple: "#a34cff", pink: "#e0408f", blue: "#3b82f6", green: "#22b573", sunset: "#f07a2c" };
    function applyTheme(name) {
        const root = document.documentElement;
        Object.values(themes).forEach(t => t && Object.keys(t).forEach(k => root.style.removeProperty(k)));
        const t = themes[name];
        if (t) Object.entries(t).forEach(([k, v]) => root.style.setProperty(k, v));
        document.querySelectorAll(".theme-dot").forEach(d => d.classList.toggle("on", d.dataset.theme === name));
        set("theme", name);
    }
    const fab = document.createElement("div");
    fab.className = "theme-fab";
    fab.innerHTML = `<button class="theme-main" aria-label="Change theme color">🎨</button><div class="theme-panel">${
        Object.keys(themes).map(n => `<button class="theme-dot" data-theme="${n}" style="--c:${dotColor[n]}" aria-label="${n} theme"></button>`).join("")}</div>`;
    document.body.appendChild(fab);
    fab.querySelector(".theme-main").addEventListener("click", () => fab.classList.toggle("open"));
    fab.querySelectorAll(".theme-dot").forEach(d => d.addEventListener("click", () => applyTheme(d.dataset.theme)));
    applyTheme(themes[get("theme")] !== undefined ? get("theme") : "purple");

    // 2. MIC CURSOR (desktop only)
    if (window.matchMedia("(pointer: fine)").matches) {
        const svg = "<svg xmlns='http://www.w3.org/2000/svg' width='32' height='32' viewBox='0 0 32 32'><g transform='rotate(-40 16 16)'><circle cx='16' cy='7' r='6' fill='white' stroke='#a34cff' stroke-width='2'/><path d='M11 5.5h10M10.5 8.5h11' stroke='#a34cff' stroke-width='1.2'/><rect x='12.5' y='12.5' width='7' height='4' fill='#ffd24a' stroke='#a34cff' stroke-width='1.4'/><rect x='12.5' y='16.5' width='7' height='13' rx='3.5' fill='white' stroke='#a34cff' stroke-width='2'/></g></svg>";
        const url = `url("data:image/svg+xml,${encodeURIComponent(svg)}") 8 8`;
        const st = document.createElement("style");
        st.textContent = `html,body{cursor:${url},auto} a,button,select,summary{cursor:${url},pointer} input,textarea{cursor:text}`;
        document.head.appendChild(st);
    }

    // 3. SKILL BARS FILL WHEN SCROLLED INTO VIEW
    const skills = document.querySelectorAll(".skill");
    if (skills.length) {
        if (!("IntersectionObserver" in window) || reduce) skills.forEach(s => s.classList.add("in"));
        else {
            const io = new IntersectionObserver(es => es.forEach(e => { if (e.isIntersecting) { e.target.classList.add("in"); io.unobserve(e.target); } }), { threshold: .4 });
            skills.forEach(s => io.observe(s));
        }
    }

    // 4. WATCHLIST CAROUSEL
    document.querySelectorAll(".carousel").forEach(c => {
        const track = c.querySelector(".watch-track");
        const step = dir => track.scrollBy({ left: dir * (track.querySelector(".watch-card").offsetWidth + 16) * 2, behavior: reduce ? "auto" : "smooth" });
        c.querySelector(".car-prev").addEventListener("click", () => step(-1));
        c.querySelector(".car-next").addEventListener("click", () => step(1));
    });

    // 5. FORTUNE COOKIE (edit the fortunes here)
    const qText = document.getElementById("quoteText");
    if (qText) {
        const qBy = document.getElementById("quoteBy"), qBtn = document.getElementById("quoteBtn");
        const QUOTES = [
        ["It tastes like pink. IT TASTES LIKE PINK", "Rachel Berry"],
        ["Stop the violence🧍.", "Brittany S. Pierce"],
        ["There was a mouse in mine.", "Brittany S. Pierce"],
        ["Oh, please! She has a family! She's a mother!", "Santana Lopez"],
        ["Well, congratulations. Normally you dress like a fantasy of a perverted Japanese business man with a very dark specific fetish but I actually dig this look. Yay.", "Santana Lopez"],
        ["I'm like a lizard. I need something warm beneath me or else I can't digest my food.", "Santana Lopez"],
        ["How can you do a duet by yourself? That's like vocal masturbation.", "Santana Lopez"],
        ["Wanky.", "Santana Lopez"],
        ["I just try to be really, really honest with people when I think that they suck! You know? No one gets it.", "Santana Lopez"],
        ["That's how we do it in Lima Heights!", "Santana Lopez"],
        ["I've been dry heaving all weekend. When my mother asked what the sound was, I said I was practicing bird calls.", "Santana Lopez"],
        ["I've gotta gay. Go - go, I've gotta go.", "Santana Lopez"],
        ["The only straight I am is straight-up bitch.", "Santana Lopez"],
        ["I'm Hispanic. Wait... was that supposed to say lesbian?", "Santana Lopez"],
        ["Holy crap. I'm a closet lesbian and a judgmental bitch, which means one thing. I have awesome gay-dar.", "Santana Lopez"],
        ["As soon as we get to New York I'm bailing to live in a lesbian colony, or Tribeca.", "Santana Lopez"],
        ["I'm about to go ALL Lima Heights!", "Santana Lopez"],
        ["¡Escucha! ¡Soy de Lima Heights Adjacent y yo tengo orgullo! ¿Sabes lo que pasa en Lima Heights Adjacent? ¡Cosas malas!", "Santana Lopez"],
        ["Wait, isn't this a date? Aren't you were paying. I ordered shrimp! Wasn't it last week we were taking a bath together-wasn't that a date? Are you crying?", "Brittany S. Pierce"],
        ["Here's the deal, pixie boy. You've got a crush on my girl, Brittany. I understand. She's beautiful, she's innocent, she's everything that's good in this miserable, stinking world.", "Santana Lopez"],
        ["When I get really pissed off, Santana gets taken over by my other evil personality. I call her Snix. Her wrath of words is called Snix Juice. I'm kind of like the Incredible Hulk. You can't blame me for anything Snix does.", "Santana Lopez"],
        [" When I'm with Brittany, I finally understand what people are talking about when they talk about love.", "Santana Lopez"],
        ["In that case, I would like to send one to my girlfriend, Brittany. And by that, I don't mean my friend who's a girl. I mean my girlfriend girlfriend. How does that sound?", "Santan Lopez"],
        ["Brit and I are gay and Mercedes is black, so kicking us out would be a hate crime.", "Santana Lopez"],
        ["I'm sorry. I always go to the yelling place. I have rage.", "Santana Lopez"],
        ["Sophomore year, I used to sit in this back row and secretly watch you. I counted the number of times you'd smile at me, and I'd die on days that you didn't.", "Santana Lopez"],
        ["I can sense it thanks to my psychic Mexican third eye.", "Santana Lopez"],
        ["I like yeast in my bagel but not in my muffin.", "Santana Lopez"],
        ["Whoa, stop right there. You look a little Jewish, right Rachel?...bye.", "Santana Lopez"],
        ["Did you know that dolphins are just gay sharks?", "Brittany S. Pierce"],
        ["When I pulled my hamstring, I went to a misogynist.", "Brittany S. Pierce"],
        ["People think I went on vacation, but actually, I spent all summer lost in the sewers.", "Brittany S. Pierce"],
        ["My middle name is Susan, my last name is Pierce. That makes me Brittany S. Pierce. Brittany Spierce.", "Brittany S. Pierce"],
        ["I'm more talented than all of you. I see that clearly now. It's Brittany... bitch.", "Brittany S. Pierce"],
        ["He may be the dumbest person on Earth, and that's coming from me.", "Brittany S. Pierce"],
        ["I'm mad at you, but you're still so hot.", "Brittany S. Pierce"],
        ["Mr. Schue taught me the second half of the alphabet. I stopped after M and N. I felt they sounded too similar and got frustrated.", "Brittany S. Pierce"],
        ["I don't want to die yet. At least not until One Tree Hill gets cancelled.", "Brittany S. Pierce"],
        ["I love you Santana. I love you more than I've ever loved anyone else in this world. All i know about you and I is that because of that, I think anything's possible.", "Brittany S. Pierce"],
        ["I'm also a unicorn. Maybe a bi-corn. Either way, I'm starting to believe in my own magic. ", "Brittany S. Pierce"],
        ["I have to bail Lord Tubbington out of jail. He tried to sell my iPhone for drugs.", "Brittany S. Pierce"],
        ["That's a great haircut, Mercedes, I thought you graduated.", "Brittany S. Pierce"],
        ["It's hard to make out over Skype. You can't really scissor a webcam.", "Brittany S. Pierce"],
        ["Come on this is a safe space, we're on the internet.", "Brittany S. Pierce"],
        ["I have an announcement. I have recently discovered that the Tubbington-Bopp is not an asteroid. It is a dead ladybug at the end of my telescope. And I have also discovered that my telescope is not a telescope. It is a Pringles can. Hallelujah, we're saved.", "Brittany S. Pierce"],
        ["Well get over it because sadness is stupid.", "Brittany S. Pierce"],
        ["I'm Brittany S. Pierce, and Fondue for Two has been on hiatus because, as it turns out, I'm a genius.", "Brittany S. Pierce"],
        ];
        let bag = [], last = -1;
        function nextIndex() {
            if (!bag.length) {   
                bag = QUOTES.map((_, i) => i);
                for (let i = bag.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [bag[i], bag[j]] = [bag[j], bag[i]]; }
                if (bag.length > 1 && bag[bag.length - 1] === last) bag.unshift(bag.pop());
            }
            return last = bag.pop();
        }
        function showQuote(instant) {
            const [q, by] = QUOTES[nextIndex()];
            const apply = () => { qText.textContent = q; qBy.textContent = "— " + by; qText.classList.remove("quote-fade"); qBy.classList.remove("quote-fade"); };
            if (instant || reduce) return apply();
            qText.classList.add("quote-fade"); qBy.classList.add("quote-fade");
            setTimeout(apply, 250);
        }
        showQuote(true);                              // random quote on every page load
        if (qBtn) qBtn.addEventListener("click", () => showQuote(false));
    }

    // 6. PAGE TRANSITIONS (curtain wipe between pages)
    if (!reduce) {
        const c = document.createElement("div");
        c.className = "page-curtain";
        c.innerHTML = "<i></i><i></i>";
        document.body.appendChild(c);
        let arriving = false;
        try { arriving = sessionStorage.getItem("curtain") === "1"; sessionStorage.removeItem("curtain"); } catch {}
        if (arriving) {
            c.classList.add("closed", "instant");
            void c.offsetWidth;
            c.classList.remove("instant");
            requestAnimationFrame(() => c.classList.remove("closed"));
        }
        window.addEventListener("pageshow", e => { if (e.persisted) c.classList.remove("closed"); });
        document.addEventListener("click", e => {
            const a = e.target.closest("a[href]");
            if (!a || e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || a.target === "_blank" || a.hasAttribute("download")) return;
            const u = new URL(a.href, location.href);
            if (!/^(https?|file):$/.test(u.protocol) || u.origin !== location.origin || u.pathname === location.pathname) return;
            e.preventDefault();
            try { sessionStorage.setItem("curtain", "1"); } catch {}
            c.classList.add("closed");
            setTimeout(() => { location.href = a.href; }, 420);
        });
    }
})();
