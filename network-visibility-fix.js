/* Realynk network visibility fix
   Approval controls verification/admin status only.
   All logged-in brokers can see all active properties from all brokers.
*/
import { getApps, initializeApp } from "https://www.gstatic.com/firebasejs/12.1.0/firebase-app.js";
import { getAuth, onAuthStateChanged, signInAnonymously } from "https://www.gstatic.com/firebasejs/12.1.0/firebase-auth.js";
import { getFirestore, collection, doc, setDoc, onSnapshot, serverTimestamp } from "https://www.gstatic.com/firebasejs/12.1.0/firebase-firestore.js";
import { firebaseConfig } from "./firebase-config.js";

(() => {
  if (window.__realynkNetworkVisibilityFix) return;
  window.__realynkNetworkVisibilityFix = true;
  const app = getApps().length ? getApps()[0] : initializeApp(firebaseConfig);
  const auth = getAuth(app), db = getFirestore(app);
  let brokers = {}, properties = [], currentFilter = "";
  const $ = id => document.getElementById(id);
  const esc = v => String(v ?? "").replace(/[&<>\"']/g, c => ({"&":"&amp;","<":"&lt;",">":"&gt;","\"":"&quot;","'":"&#39;"}[c]));
  const digits = v => String(v || "").replace(/\D/g, "");
  const active = p => p.status !== "sold" && p.status !== "soldout" && p.status !== "inactive" && p.sold !== true && p.soldOut !== true;

  function matchesFilter(p) {
    if (!currentFilter) return true;
    const type = String(p.type || "").toLowerCase(), title = String(p.title || "").toLowerCase();
    if (currentFilter === "Heavy Deposit") return type.includes("heavy") || title.includes("heavy deposit");
    return type === currentFilter.toLowerCase();
  }
  function listProperties() {
    const q = ($("search")?.value || "").trim().toLowerCase();
    return properties.filter(p => active(p) && matchesFilter(p) && (!q || [p.title,p.area,p.description,p.desc,p.type,p.brokerName].join(" ").toLowerCase().includes(q)));
  }
  function renderHome() {
    const host = $("homeList"); if (!host) return;
    const list = listProperties();
    if ($("filterBar")) $("filterBar").style.display = currentFilter ? "flex" : "none";
    if ($("filterTitle")) $("filterTitle").textContent = currentFilter;
    if (!list.length) { host.innerHTML = '<div class="empty">No properties found.</div>'; return; }
    host.innerHTML = list.map(p => {
      const b = brokers[p.brokerUid] || {}, phone = digits(p.phone || p.brokerPhone || b.phone);
      const media = Array.isArray(p.photoUrls) ? p.photoUrls : (Array.isArray(p.photos) ? p.photos : []);
      const brokerName = b.fullName || p.brokerName || "Realynk Broker";
      const description = p.description || p.desc || "", price = p.price || p.rent || "On Request";
      const shareText = encodeURIComponent("Hi, I found this property on Realynk: " + (p.title || "Property"));
      return `<div class="panel property"><h3>${esc(p.title || "Property")}</h3><div class="rt-lock">📍 ${esc(p.area || "Location not specified")}</div><div class="details"><div class="detail"><span>TYPE</span><b>${esc(p.type || "")}</b></div><div class="detail"><span>PRICE / RENT</span><b>${esc(price)}</b></div></div>${p.deposit ? `<div class="rt-lock" style="margin-top:7px"><b>Deposit:</b> ${esc(p.deposit)}</div>` : ""}${p.size ? `<div class="rt-lock"><b>Area:</b> ${esc(p.size)}</div>` : ""}${description ? `<p>${esc(description)}</p>` : ""}${media.length ? `<div class="rt-media">${media.slice(0,10).map(u => `<img class="rt-photo" src="${esc(u)}" alt="Property photo">`).join("")}</div>` : ""}<div class="badge">Broker: ${esc(brokerName)}</div><div class="rt-actions">${phone ? `<button type="button" onclick="location.href='tel:+91${phone}'">📞 Call Broker</button><button type="button" onclick="location.href='https://wa.me/91${phone}?text=${shareText}'">💬 WhatsApp</button>` : ""}<button type="button" onclick="try{if(navigator.share){navigator.share({title:${JSON.stringify(p.title || 'Realynk Property')},text:${JSON.stringify('Property on Realynk: '+(p.title || ''))},url:location.href}).catch(()=>{})}else if(navigator.clipboard){navigator.clipboard.writeText(location.href);alert('Property link copied')}}catch(e){}">↗️ Share</button></div></div>`;
    }).join("");
  }
  function renderBrokerNetwork() {
    const host = $("brokerProfileCard"); if (!host) return;
    const list = Object.values(brokers).filter(b => String(b.email || "").toLowerCase() !== "service.realynk@gmail.com" && (b.fullName || b.phone || b.email));
    if (!list.length) { host.innerHTML = '<div class="empty">No brokers registered yet.</div>'; return; }
    host.innerHTML = '<div style="font-weight:800;font-size:18px;color:#0b3768">Realynk Broker Network</div>' + list.map(b => {
      const phone = digits(b.phone), count = properties.filter(p => p.brokerUid === b.uid && active(p)).length, status = b.approved === true ? "✓ Verified" : "Pending Verification";
      return `<div class="rt-profile"><div style="font-size:20px;font-weight:800;color:#0b3768">${esc(b.fullName || "Broker")}</div><div class="rt-lock">${esc(b.companyName || "Real Estate Broker")} • ${esc(b.city || "")}</div><div class="rt-lock">${count} active ${count === 1 ? "property" : "properties"} • ${status}</div><div class="rt-actions">${phone ? `<button type="button" onclick="location.href='tel:+91${phone}'">📞 Call</button><button type="button" onclick="location.href='https://wa.me/91${phone}'">💬 WhatsApp</button>` : ""}</div></div>`;
    }).join("");
  }
  async function syncLocalProperties(user) {
    if (!user) return;
    let local = []; try { local = JSON.parse(localStorage.getItem("realynkProperties") || "[]"); } catch {}
    if (!Array.isArray(local)) return;
    let profile = {}; try { profile = JSON.parse(localStorage.getItem("realynkBrokerProfile") || "{}"); } catch {}
    for (const p of local.slice(0,50)) {
      if (!p?.id) continue;
      try { await setDoc(doc(db,"properties",String(p.id)), {...p,brokerUid:user.uid,brokerName:profile.agentName || p.broker || p.brokerName || "Realynk Broker",brokerPhone:profile.accountPhone || p.phone || "",updatedAt:serverTimestamp()},{merge:true}); } catch(e) { console.warn("property sync",e); }
    }
  }
  function setFilter(v) { currentFilter = v || ""; renderHome(); }
  const filterMap = {buy:"Buy",sale:"Sale",rent:"Rent",commercial:"Commercial",heavyDeposit:"Heavy Deposit",clearFilter:""};
  document.addEventListener("click", e => { const btn = e.target.closest?.("#buy,#sale,#rent,#commercial,#heavyDeposit,#clearFilter"); if (btn) setTimeout(() => setFilter(filterMap[btn.id] || ""),180); }, true);
  $("search")?.addEventListener("input", () => setTimeout(renderHome,80));
  onSnapshot(collection(db,"brokers"), snap => { brokers={}; snap.forEach(d=>brokers[d.id]=d.data()); renderBrokerNetwork(); renderHome(); }, err => console.warn("brokers snapshot",err));
  onSnapshot(collection(db,"properties"), snap => { properties=[]; snap.forEach(d=>{const p=d.data(); if(p.brokerUid) properties.push({...p,id:d.id});}); renderHome(); renderBrokerNetwork(); }, err => console.warn("properties snapshot",err));
  onAuthStateChanged(auth, async user => { if(user) await syncLocalProperties(user); else { try { const c=await signInAnonymously(auth); if(c?.user) await syncLocalProperties(c.user); } catch(e) { console.warn("auth",e); } } });
  setInterval(() => { renderHome(); if($("brokers")?.classList.contains("active")) renderBrokerNetwork(); },1200);
})();
