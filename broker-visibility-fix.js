import { getApps, initializeApp } from "https://www.gstatic.com/firebasejs/12.1.0/firebase-app.js";
import { getFirestore, collection, onSnapshot } from "https://www.gstatic.com/firebasejs/12.1.0/firebase-firestore.js";
import { firebaseConfig } from "./firebase-config.js";

/* Realynk: every logged-in broker can see every active property and every broker profile.
   Approval is for broker verification/admin status, not for hiding listings from the network. */
(() => {
  if (window.__realynkVisibilityFix) return;
  window.__realynkVisibilityFix = true;

  const app = getApps().length ? getApps()[0] : initializeApp(firebaseConfig);
  const db = getFirestore(app);
  let brokers = {};
  let properties = [];
  let filter = "";

  const esc = v => String(v ?? "").replace(/[&<>\"']/g, c => ({"&":"&amp;","<":"&lt;",">":"&gt;","\"":"&quot;","'":"&#39;"}[c]));
  const digits = v => String(v || "").replace(/\D/g, "");

  function visibleProperties() {
    const search = (document.getElementById("search")?.value || "").trim().toLowerCase();
    let list = properties.filter(p => p.status !== "sold" && p.status !== "inactive" && p.sold !== true);
    if (filter) list = list.filter(p => {
      const t = String(p.type || "").toLowerCase();
      return t === filter.toLowerCase() || (filter === "Heavy Deposit" && (t.includes("heavy") || String(p.title || "").toLowerCase().includes("heavy deposit")));
    });
    if (search) list = list.filter(p => [p.title,p.area,p.description,p.brokerName,p.type].join(" ").toLowerCase().includes(search));
    return list;
  }

  function renderHome() {
    const host = document.getElementById("homeList");
    if (!host) return;
    const list = visibleProperties();
    if (!list.length) {
      host.innerHTML = '<div class="empty">No properties found.</div>';
      return;
    }
    host.innerHTML = list.map(p => {
      const b = brokers[p.brokerUid] || {};
      const ph = digits(p.phone || b.phone);
      const media = Array.isArray(p.photoUrls) ? p.photoUrls : (Array.isArray(p.photos) ? p.photos : []);
      const brokerName = b.fullName || p.brokerName || "Realynk Broker";
      return `<div class="panel property" data-property-id="${esc(p.id || "")}">
        <h3>${esc(p.title || "Property")}</h3>
        <div class="rt-lock">📍 ${esc(p.area || "Location not specified")}</div>
        <div class="details"><div class="detail"><span>TYPE</span><b>${esc(p.type || "")}</b></div><div class="detail"><span>PRICE / RENT</span><b>${esc(p.price || "On Request")}</b></div></div>
        ${p.deposit ? `<div class="rt-lock" style="margin-top:7px"><b>Deposit:</b> ${esc(p.deposit)}</div>` : ""}
        ${p.size ? `<div class="rt-lock"><b>Area:</b> ${esc(p.size)}</div>` : ""}
        ${p.description ? `<p>${esc(p.description)}</p>` : ""}
        ${media.length ? `<div class="rt-media">${media.slice(0,10).map(u => `<img class="rt-photo" src="${esc(u)}" alt="Property photo">`).join("")}</div>` : ""}
        <div class="badge">Broker: ${esc(brokerName)}</div>
        <div class="rt-actions">
          ${ph ? `<button onclick="location.href='tel:+91${ph}'">📞 Call Broker</button><button onclick="location.href='https://wa.me/91${ph}?text=${encodeURIComponent('Hi, I found your property on Realynk: '+(p.title || ''))}'">💬 WhatsApp</button>` : ""}
          <button onclick="navigator.share ? navigator.share({title:${JSON.stringify(p.title || 'Realynk Property')},text:${JSON.stringify('Property on Realynk: '+(p.title || ''))},url:location.href}).catch(()=>{}) : navigator.clipboard?.writeText(location.href)">↗️ Share</button>
        </div>
      </div>`;
    }).join("");
  }

  function renderNetwork() {
    const host = document.getElementById("brokerProfileCard");
    if (!host) return;
    const list = Object.values(brokers).filter(b => String(b.email || "").toLowerCase() !== "service.realynk@gmail.com" && (b.fullName || b.phone || b.companyName));
    host.innerHTML = list.length ? '<div style="font-weight:800;font-size:18px;color:#0b3768">Realynk Broker Network</div>' + list.map(b => {
      const ph = digits(b.phone);
      const count = properties.filter(p => p.brokerUid === b.uid && p.status !== "sold" && p.status !== "inactive" && p.sold !== true).length;
      const status = b.approved === true ? "✓ Verified" : "Pending Verification";
      return `<div class="rt-profile"><div style="font-size:20px;font-weight:800;color:#0b3768">${esc(b.fullName || "Broker")}</div><div class="rt-lock">${esc(b.companyName || "Real Estate Broker")} • ${esc(b.city || "")}</div><div class="rt-lock">${count} active ${count === 1 ? "property" : "properties"} • ${status}</div><div class="rt-actions">${ph ? `<button onclick="location.href='tel:+91${ph}'">📞 Call</button><button onclick="location.href='https://wa.me/91${ph}'">💬 WhatsApp</button>` : ""}</div></div>`;
    }).join("") : '<div class="empty">No brokers registered yet.</div>';
  }

  function setFilterFromId(id) {
    filter = id === "buy" ? "Buy" : id === "sale" ? "Sale" : id === "rent" ? "Rent" : id === "commercial" ? "Commercial" : id === "heavyDeposit" ? "Heavy Deposit" : "";
    const title = document.getElementById("filterTitle");
    const bar = document.getElementById("filterBar");
    if (bar && title && filter) { title.textContent = filter; bar.style.display = "flex"; }
    renderHome();
  }

  function bindUI() {
    ["buy","sale","rent","commercial","heavyDeposit"].forEach(id => {
      const el = document.getElementById(id);
      if (el && !el.dataset.visibilityFix) {
        el.dataset.visibilityFix = "1";
        el.addEventListener("click", () => setTimeout(() => setFilterFromId(id), 80));
      }
    });
    document.getElementById("clearFilter")?.addEventListener("click", () => { filter = ""; const bar = document.getElementById("filterBar"); if (bar) bar.style.display = "none"; renderHome(); });
    document.getElementById("search")?.addEventListener("input", () => renderHome());
  }

  bindUI();
  setTimeout(bindUI, 500);
  setTimeout(bindUI, 1500);
  onSnapshot(collection(db, "brokers"), snap => { brokers = {}; snap.forEach(d => brokers[d.id] = d.data()); renderHome(); renderNetwork(); });
  onSnapshot(collection(db, "properties"), snap => { properties = []; snap.forEach(d => { const p = d.data(); if (p.brokerUid) properties.push({ ...p, id: d.id }); }); renderHome(); renderNetwork(); });
})();
