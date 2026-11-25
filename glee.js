// ===== GLEE EXTRAS =====
const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
const store = {
    get(k, d) { try { return JSON.parse(localStorage.getItem(k)) ?? d; } catch { return d; } },
    set(k, v) { try { localStorage.setItem(k, JSON.stringify(v)); } catch { } }
};

// 1. MARQUEE TICKER (edit the text here)
(function () {
    const strip = document.querySelector(".top-strip");
    if (!strip) return;
    const text = "★ NOW SHOWING: ME ★ ONE NIGHT ONLY ★ ENCORE ★ STANDING OVATIONS WELCOME ★ ";
    const m = document.createElement("div");
    m.className = "marquee";
    m.innerHTML = `<div class="marquee-track"><span>${text.repeat(4)}</span><span>${text.repeat(4)}</span></div>`;
    strip.after(m);
})();

// 2. SPOTLIGHT + GOLD STAR BADGES
(function () {
    const art = document.querySelector(".hero-art");
    if (art) {
        const s = document.createElement("div");
        s.className = "spotlight";
        art.prepend(s);
    }
    const badge = (host, text) => {
        if (!host) return;
        const b = document.createElement("span");
        b.className = "star-badge";
        b.textContent = text;
        host.appendChild(b);
    };
    badge(document.querySelector(".avatar-frame"), "★ STAR OF THE SHOW");
})();

// 3. SPARKLE CURSOR TRAIL
(function () {
    if (reduceMotion || !window.matchMedia("(pointer: fine)").matches) return;
    let last = 0;
    document.addEventListener("mousemove", e => {
        const now = Date.now();
        if (now - last < 45) return;
        last = now;
        const s = document.createElement("span");
        s.className = "sparkle-trail";
        s.textContent = Math.random() > .5 ? "✦" : "✧";
        s.style.left = e.clientX + "px";
        s.style.top = e.clientY + "px";
        s.style.setProperty("--dx", (Math.random() * 30 - 15) + "px");
        document.body.appendChild(s);
        setTimeout(() => s.remove(), 800);
    });
})();

// 4. DRAMATIC LOADING SCREEN (once per visit)
(function () {
    let seen = false;
    try { seen = sessionStorage.getItem("gleeLoaded"); } catch { }
    if (seen || reduceMotion) return;
    const l = document.createElement("div");
    l.className = "loader";
    l.innerHTML = `<div class="curtain c-left"></div><div class="curtain c-right"></div>
        <div class="loader-box"><p id="loaderText">WARMING UP VOCALS…</p><div class="loader-bar"><span id="loaderFill"></span></div></div>`;
    document.body.appendChild(l);
    const fill = l.querySelector("#loaderFill"), text = l.querySelector("#loaderText");
    let pct = 0, done = false;
    const finish = () => {
        if (done) return; done = true;
        clearInterval(t);
        fill.style.width = "100%";
        text.textContent = "CURTAIN UP ✦";
        setTimeout(() => { l.classList.add("open"); setTimeout(() => l.remove(), 1200); }, 350);
        try { sessionStorage.setItem("gleeLoaded", "1"); } catch { }
    };
    const t = setInterval(() => { pct += 5 + Math.random() * 9; fill.style.width = Math.min(pct, 100) + "%"; if (pct >= 100) finish(); }, 110);
    l.addEventListener("click", finish);
})();

// 5. SLUSHIE COUNTER
(function () {
    const btn = document.getElementById("slushieBtn");
    if (!btn) return;
    const countEl = document.getElementById("slushieCount"), msg = document.getElementById("slushieMsg");
    let n = store.get("slushies", 0);
    const lines = { 1: "BRRR. IT BEGINS.", 5: "THE HALLWAY IS STICKY.", 10: "NEW JACKET, WHO DIS?", 25: "SLUSHIE LEGEND UNLOCKED ★", 50: "THE JANITOR IS CRYING." };
    const colors = ["#7ad7ff", "#ff7ad9", "#a34cff", "#7aff9e"];
    countEl.textContent = n;
    btn.addEventListener("click", () => {
        n++; store.set("slushies", n);
        countEl.textContent = n;
        if (lines[n]) msg.textContent = lines[n];
        if (reduceMotion) return;
        for (let i = 0; i < 4; i++) {
            const s = document.createElement("div");
            const size = 60 + Math.random() * 120;
            s.className = "splash";
            s.style.cssText = `width:${size}px;height:${size}px;left:${Math.random() * 90}vw;top:${Math.random() * 80}vh;background:${colors[Math.floor(Math.random() * colors.length)]}`;
            document.body.appendChild(s);
            setTimeout(() => s.remove(), 1000);
        }
    });
})();

// 6. WHICH GLEE CLUB ROLE ARE YOU?
(function () {
    const box = document.getElementById("quizBox");
    if (!box) return;
    const Q = [
        { q: "Your grand entrance is…", a: [["A slow walk into the spotlight", "diva"], ["Quietly slipping in to fix the harmony", "harmony"], ["A cartwheel. Obviously.", "choreo"], ["Late, loud, and kicking the door open", "rebel"]] },
        { q: "Pick a rehearsal snack:", a: [["Something dramatic and overpriced", "diva"], ["Homemade cookies for everyone", "harmony"], ["Energy drink, no breaks", "choreo"], ["Whatever I stole from the vending machine", "rebel"]] },
        { q: "Your group project role is…", a: [["Presenter. Always.", "diva"], ["The one who actually organizes it", "harmony"], ["Idea machine with way too many ideas", "choreo"], ["The wildcard nobody expected to deliver", "rebel"]] },
        { q: "Your ideal encore is…", a: [["A power ballad, full lights", "diva"], ["A tight group number where everyone shines", "harmony"], ["A high-energy dance break", "choreo"], ["An unexpected genre switch", "rebel"]] }
    ];
    const R = {
        diva: ["♛", "THE DIVA", "Big voice, bigger presence. You were born for the spotlight and you know how to hold it."],
        harmony: ["♡", "THE DEPENDABLE HARMONY", "You make everyone around you sound better. The show runs because of you."],
        choreo: ["✦", "THE CHOREOGRAPHER", "Endless energy and big ideas. You can't help turning everything into a production."],
        rebel: ["★", "THE SHOWSTOPPER REBEL", "You break the rules and somehow steal the scene. Nobody saw it coming."]
    };
    let i = 0, score = {};
    function ask() {
        const c = Q[i];
        box.innerHTML = `<p class="quiz-step">QUESTION ${i + 1} / ${Q.length}</p><p class="quiz-q"></p><div class="quiz-options"></div>`;
        box.querySelector(".quiz-q").textContent = c.q;
        const opts = box.querySelector(".quiz-options");
        c.a.forEach(([label, key]) => {
            const b = document.createElement("button");
            b.textContent = label;
            b.addEventListener("click", () => { score[key] = (score[key] || 0) + 1; i++; i < Q.length ? ask() : result(); });
            opts.appendChild(b);
        });
    }
    function result() {
        const top = Object.keys(score).sort((a, b) => score[b] - score[a])[0];
        const [icon, name, desc] = R[top];
        box.innerHTML = `<div class="quiz-result"><div class="big-icon">${icon}</div><p class="quiz-step">YOU ARE…</p><h3>${name}</h3><p>${desc}</p><button class="button button-ghost" id="quizAgain">TAKE IT AGAIN ✦</button></div>`;
        box.querySelector("#quizAgain").addEventListener("click", () => { i = 0; score = {}; ask(); });
    }
    ask();
})();

// 7. APPLAUSE WALL (saved in this visitor's own browser only)
(function () {
    const wall = document.getElementById("applauseWall");
    const form = document.getElementById("applauseForm");
    if (!wall || !form) return;
    const seed = [
        { name: "Santana Lopez", text: "I've gotta gay. Go - go, I've gotta go." },
        { name: "Brittany S. Pierce", text: "Did you know that dolphins are just gay sharks?" },
        { name: "Sue Sylvester", text: "You think this is hard? Try being waterboarded...that's hard!" }
    ];
    const notes = store.get("applause", []);
    function render() {
        wall.innerHTML = "";
        [...notes, ...seed].forEach(n => {
            const c = document.createElement("div"), s = document.createElement("small"), p = document.createElement("p");
            c.className = "applause-card";
            s.textContent = "👏 STANDING OVATION FROM " + n.name.toUpperCase();
            p.textContent = n.text;
            c.append(s, p);
            wall.appendChild(c);
        });
    }
    const ENDPOINT = "https://api.web3forms.com/submit";
    const ACCESS_KEY = "9ca3c68c-d77d-44c3-b880-bf73f26b732f";
    const noteEl = document.getElementById("applauseNote");

    form.addEventListener("submit", async e => {
        e.preventDefault();
        const name = form.name.value.trim().slice(0, 30);
        const text = form.message.value.trim().slice(0, 160);
        if (!name || !text) return;

        // show it on this visitor's wall right away
        notes.unshift({ name, text });
        store.set("applause", notes.slice(0, 30));
        form.reset();
        render();

        // send it to your email
        try {
            const res = await fetch(ENDPOINT, {
                method: "POST",
                headers: { "Content-Type": "application/json", Accept: "application/json" },
                body: JSON.stringify({
                    access_key: ACCESS_KEY,
                    subject: "New applause from " + name,
                    from_name: "Applause Wall",
                    name: name,
                    message: text
                })
            });
            const data = await res.json();
            if (noteEl) noteEl.textContent = data.success
                ? "SENT! THANK YOU FOR THE APPLAUSE ♡"
                : "SAVED HERE, BUT IT COULDN'T BE SENT. TRY AGAIN LATER.";
        } catch {
            if (noteEl) noteEl.textContent = "SAVED HERE, BUT IT COULDN'T BE SENT. TRY AGAIN LATER.";
        }
    });
    render();
})();
