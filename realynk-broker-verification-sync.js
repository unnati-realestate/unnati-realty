/* REALYNK BROKER VERIFICATION SYNC V1 — Firebase is the source of truth for broker approval */
import { getApps, initializeApp } from 'https://www.gstatic.com/firebasejs/12.1.0/firebase-app.js';
import { getAuth, onAuthStateChanged } from 'https://www.gstatic.com/firebasejs/12.1.0/firebase-auth.js';
import { getFirestore, doc, onSnapshot } from 'https://www.gstatic.com/firebasejs/12.1.0/firebase-firestore.js';
import { firebaseConfig } from './firebase-config.js';

(() => {
  'use strict';
  if (window.__REALYNK_BROKER_VERIFICATION_SYNC_V1__) return;
  window.__REALYNK_BROKER_VERIFICATION_SYNC_V1__ = true;

  const ADMIN = 'seagullairexpress@gmail.com';
  const app = getApps().length ? getApps()[0] : initializeApp(firebaseConfig);
  const auth = getAuth(app);
  const db = getFirestore(app);
  let stop = null;

  function readProfile() {
    try { return JSON.parse(localStorage.getItem('realynkBrokerProfile') || '{}') || {}; }
    catch (_) { return {}; }
  }
  function writeProfile(p) {
    localStorage.setItem('realynkBrokerProfile', JSON.stringify(p));
    window.dispatchEvent(new CustomEvent('realynkProfileStatusChanged'));
  }
  function setStatusUI(data) {
    const verified = data && (data.approved === true || data.verified === true || String(data.status || '').toLowerCase() === 'verified');
    const rejected = data && (String(data.status || '').toLowerCase() === 'rejected' || data.rejected === true);
    const el = document.getElementById('accountStatus');
    if (el) {
      el.textContent = verified ? '✓ Verified Broker' : rejected ? '✕ Rejected' : 'Pending Review';
      el.className = 'badge' + (verified ? '' : ' pending');
    }
    const host = document.getElementById('brokerProfileCard');
    if (host) {
      host.querySelectorAll('*').forEach(node => {
        if (node.children.length === 0) {
          const t = String(node.textContent || '').trim();
          if (t === 'Pending Review' || t === 'Pending Verification') {
            node.textContent = verified ? '✓ Verified' : rejected ? '✕ Rejected' : 'Pending Review';
            node.classList.toggle('pending', !verified);
          }
        }
      });
    }
  }
  function apply(data, user) {
    if (!user || String(user.email || '').toLowerCase() === ADMIN) return;
    const p = readProfile();
    if (!data) return;
    const verified = data.approved === true || data.verified === true || String(data.status || '').toLowerCase() === 'verified';
    const rejected = String(data.status || '').toLowerCase() === 'rejected' || data.rejected === true;
    p.uid = user.uid;
    p.agentEmail = p.agentEmail || user.email || '';
    if (data.name && !p.agentName) p.agentName = data.name;
    if (data.companyName) p.companyName = data.companyName;
    if (data.city) p.city = data.city;
    if (data.state) p.state = data.state;
    p.approved = verified;
    p.verified = verified;
    p.status = rejected ? 'rejected' : (verified ? 'verified' : 'pending');
    writeProfile(p);
    setStatusUI(data);
  }
  function watch(user) {
    if (stop) { try { stop(); } catch (_) {} stop = null; }
    if (!user || String(user.email || '').toLowerCase() === ADMIN) return;
    stop = onSnapshot(doc(db, 'brokers', user.uid), snap => {
      if (snap.exists()) apply(snap.data(), user);
    }, err => console.error('Realynk verification sync failed', err));
  }
  onAuthStateChanged(auth, watch);
  window.addEventListener('realynkProfileStatusChanged', () => setStatusUI(readProfile()));
})();
