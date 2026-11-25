// Split .ransom titles into mismatched "cut-out" letters
document.querySelectorAll(".ransom").forEach(el=>{
  const cls=["w","k","p","w","w","k"];let n=0;
  const walk=node=>{[...node.childNodes].forEach(c=>{
    if(c.nodeType===3){const f=document.createDocumentFragment();
      [...c.textContent].forEach(ch=>{const i=document.createElement("i");
        if(ch===" "){i.className="s";i.innerHTML="&nbsp;"}
        else{i.textContent=ch;i.className=cls[(n*7+3)%cls.length];i.style.setProperty("--r",((n%5)-2)*2+"deg");n++}
        f.appendChild(i)});c.replaceWith(f)}
    else if(c.nodeType===1&&c.tagName!=="BR")walk(c)})};
  walk(el);
});
// Mobile nav
const t=document.getElementById("menuToggle"),nav=document.getElementById("navLinks");
if(t&&nav)t.addEventListener("click",()=>t.setAttribute("aria-expanded",String(nav.classList.toggle("open"))));
// Clock
const clock=document.getElementById("liveClock");
if(clock){const tick=()=>clock.textContent=new Date().toLocaleTimeString([],{hour12:false});tick();setInterval(tick,1000)}
// Surprise button
const sb=document.getElementById("surpriseButton"),sm=document.getElementById("surpriseMessage");
if(sb&&sm){const m=["STATUS: main character energy detected.","SYSTEM MESSAGE: you are doing amazing. ✦","NOW LOADING: your next great idea...","REMINDER: be unapologetically yourself. ♡","ERROR 404: boring personality not found."];
sb.addEventListener("click",()=>sm.textContent=m[Math.floor(Math.random()*m.length)])}
