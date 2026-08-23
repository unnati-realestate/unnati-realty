import { getApps } from "https://www.gstatic.com/firebasejs/12.1.0/firebase-app.js";
import { getFirestore, collection, onSnapshot } from "https://www.gstatic.com/firebasejs/12.1.0/firebase-firestore.js";

const app = getApps()[0];
if (!app) throw new Error("Realynk Firebase app not initialized");
const db = getFirestore(app);
let cloudProperties = [];

const esc = s => String(s ?? "").replace(/[&<>\"']/g, c => ({"&":"&amp;","<":"&lt;",">":"&gt;","\"":"&quot;","'":"&#39;"}[c]));
const digits = s => String(s || "").replace(/\D/g, "");

function localProperties(){
  try { const p = JSON.parse(localStorage.getItem("realynkProperties") || "[]"); return Array.isArray(p) ? p : []; }
  catch (_) { return []; }
}

function listForCategory(type){
  const source = cloudProperties.length ? cloudProperties : localProperties();
  const wanted = String(type).toLowerCase();
  return source.filter(p => String(p.type || p.listingType || "").toLowerCase() === wanted);
}

function renderCategory(type){
  const out = document.getElementById("homeList");
  const bar = document.getElementById("filterBar");
  const title = document.getElementById("filterTitle");
  const search = document.getElementById("search");
  if (!out) return;
  if (search) search.value = "";
  if (bar) bar.style.display = "flex";
  if (title) title.textContent = type + " Properties";

  const list = listForCategory(type);
  if (!list.length) {
    out.innerHTML = `<div class="panel empty">No ${esc(type)} properties posted yet.</div>`;
    return;
  }

  out.innerHTML = list.map(p => {
    const phone = digits(p.phone || "");
    const price = p.price || p.rent || "—";
    const media = Array.isArray(p.photoUrls) ? p.photoUrls : [];
    return `<div class="panel property">
      <h3>${esc(p.title || "Property")}</h3>
      <div>📍 ${esc(p.area || p.location || "")}</div>
      <div class="details">
        <div class="detail"><span>TYPE</span><b>${esc(p.type || type)}</b></div>
        <div class="detail"><span>PRICE / RENT</span><b>${esc(price)}</b></div>
      </div>
      ${p.description ? `<p>${esc(p.description)}</p>` : ""}
      ${media.length ? `<div class="listingMedia">${media.slice(0,10).map(u => `<img src="${esc(u)}" alt="Property photo">`).join("")}</div>` : ""}
      ${phone ? `<div class="rn-actions"><button type="button" data-cat-call="${phone}">📞 Call Broker</button><button type="button" data-cat-wa="${phone}">💬 WhatsApp</button></div>` : ""}
    </div>`;
  }).join("");

  out.querySelectorAll("[data-cat-call]").forEach(b => b.onclick = () => { location.href = "tel:+91" + b.dataset.catCall; });
  out.querySelectorAll("[data-cat-wa]").forEach(b => b.onclick = () => { location.href = "https://wa.me/91" + b.dataset.catWa; });
  window.scrollTo(0, bar ? bar.offsetTop : 0);
}

function wire(){
  const map = { buy:"Buy", sale:"Sale", rent:"Rent", commercial:"Commercial" };
  Object.entries(map).forEach(([id,type]) => {
    const b = document.getElementById(id);
    if (!b || b.dataset.categoryFix === "1") return;
    b.dataset.categoryFix = "1";
    b.addEventListener("click", e => {
      e.preventDefault();
      e.stopImmediatePropagation();
      renderCategory(type);
    }, true);
  });
}

wire();
setTimeout(wire, 300);
setTimeout(wire, 1000);
new MutationObserver(wire).observe(document.body, { childList:true, subtree:true });

onSnapshot(collection(db, "properties"), snap => {
  cloudProperties = [];
  snap.forEach(d => cloudProperties.push({ ...d.data(), id:d.id }));
});
