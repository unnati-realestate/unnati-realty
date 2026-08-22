import { getApps, initializeApp } from "https://www.gstatic.com/firebasejs/12.1.0/firebase-app.js";
import { getAuth, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/12.1.0/firebase-auth.js";
import { getFirestore, doc, setDoc, collection, serverTimestamp } from "https://www.gstatic.com/firebasejs/12.1.0/firebase-firestore.js";
import { getStorage, ref, uploadString, uploadBytes, getDownloadURL } from "https://www.gstatic.com/firebasejs/12.1.0/firebase-storage.js";
import { firebaseConfig } from "./firebase-config.js";

const app = getApps().length ? getApps()[0] : initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app);
let currentUser = null;
let syncTimer = null;

function readJSON(key, fallback) {
  try { const v = JSON.parse(localStorage.getItem(key) || ""); return v ?? fallback; }
  catch (_) { return fallback; }
}
function profile() { return readJSON("realynkBrokerProfile", {}); }
function properties() { const p = readJSON("realynkProperties", []); return Array.isArray(p) ? p : []; }
function dataUrlToBlob(dataUrl) {
  const parts = String(dataUrl || "").split(",");
  if (parts.length !== 2) return null;
  const mime = (parts[0].match(/data:([^;]+)/) || [])[1] || "application/octet-stream";
  const bin = atob(parts[1]);
  const bytes = new Uint8Array(bin.length);
  for (let i = 0; i < bin.length; i++) bytes[i] = bin.charCodeAt(i);
  return new Blob([bytes], { type: mime });
}

async function syncProfile() {
  if (!currentUser) return;
  const p = profile();
  await setDoc(doc(db, "brokers", currentUser.uid), {
    uid: currentUser.uid,
    fullName: p.agentName || "",
    phone: p.accountPhone || p.firebasePhone || "",
    email: p.agentEmail || currentUser.email || "",
    companyName: p.companyName || "",
    city: p.city || "",
    state: p.state || "",
    mobileVerified: !!p.mobileVerified,
    emailVerified: !!p.emailVerified,
    updatedAt: serverTimestamp()
  }, { merge: true });
}

async function uploadPropertyMedia(property) {
  if (!currentUser || !property || !property.id) return property;
  const out = { ...property };
  const media = Array.isArray(property.photos) ? property.photos : [];
  const urls = [];
  for (let i = 0; i < media.length && i < 10; i++) {
    const blob = dataUrlToBlob(media[i]);
    if (!blob) continue;
    const path = `properties/${currentUser.uid}/${property.id}/photo-${i + 1}`;
    const snap = await uploadBytes(ref(storage, path), blob, { contentType: blob.type });
    urls.push(await getDownloadURL(snap.ref));
  }
  if (urls.length) out.photoUrls = urls;

  // Video is kept in IndexedDB by the existing Realynk media fix.
  try {
    const dbLocal = await new Promise((resolve, reject) => {
      const r = indexedDB.open("realynkMediaDB", 1);
      r.onsuccess = () => resolve(r.result);
      r.onerror = () => reject(r.error);
    });
    const file = await new Promise((resolve, reject) => {
      const r = dbLocal.transaction("videos", "readonly").objectStore("videos").get(property.id);
      r.onsuccess = () => resolve(r.result || null);
      r.onerror = () => reject(r.error);
    });
    if (file) {
      const path = `properties/${currentUser.uid}/${property.id}/video`;
      const snap = await uploadBytes(ref(storage, path), file, { contentType: file.type || "video/mp4" });
      out.videoUrl = await getDownloadURL(snap.ref);
    }
  } catch (_) {}
  return out;
}

async function syncLatestProperty() {
  if (!currentUser) return;
  const list = properties();
  const p = list[0];
  if (!p || !p.id) return;
  try {
    const cloudProperty = await uploadPropertyMedia(p);
    await setDoc(doc(collection(db, "properties"), String(p.id)), {
      ...cloudProperty,
      brokerUid: currentUser.uid,
      syncedAt: serverTimestamp()
    }, { merge: true });
    window.dispatchEvent(new CustomEvent("realynkCloudSync", { detail: { type: "property", id: p.id } }));
  } catch (e) {
    console.warn("Realynk cloud property sync failed", e);
  }
}

function scheduleProfileSync() {
  clearTimeout(syncTimer);
  syncTimer = setTimeout(() => syncProfile().catch(e => console.warn("Realynk cloud profile sync failed", e)), 500);
}

onAuthStateChanged(auth, user => {
  currentUser = user || null;
  if (currentUser) {
    syncProfile().catch(e => console.warn("Realynk cloud profile sync failed", e));
  }
});

window.addEventListener("storage", e => {
  if (e.key === "realynkBrokerProfile") scheduleProfileSync();
});

const originalSetItem = localStorage.setItem.bind(localStorage);
localStorage.setItem = function(key, value) {
  originalSetItem(key, value);
  if (key === "realynkBrokerProfile") scheduleProfileSync();
};

const submit = document.getElementById("submit");
if (submit) submit.addEventListener("click", () => setTimeout(() => syncLatestProperty(), 1200), true);
window.realynkCloudSync = { syncProfile, syncLatestProperty };
