import { initializeApp, getApps } from "https://www.gstatic.com/firebasejs/12.1.0/firebase-app.js";
import { getAuth, RecaptchaVerifier, signInWithPhoneNumber, createUserWithEmailAndPassword, signInWithEmailAndPassword, sendEmailVerification, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/12.1.0/firebase-auth.js";
import { firebaseConfig } from "./firebase-config.js";

const configured = Object.values(firebaseConfig).every(v => v && !String(v).startsWith("PASTE_"));
let auth = null;
let recaptcha = null;
let confirmation = null;

function $(id) { return document.getElementById(id); }
function profile() {
  try { return JSON.parse(localStorage.getItem("realynkBrokerProfile") || "{}") || {}; }
  catch (_) { return {}; }
}
function saveProfile(p) { localStorage.setItem("realynkBrokerProfile", JSON.stringify(p)); }
function toast(message) {
  const box = $("toast");
  if (!box) return;
  box.textContent = message;
  box.style.display = "block";
  clearTimeout(window.__realynkFirebaseToast);
  window.__realynkFirebaseToast = setTimeout(() => box.style.display = "none", 3200);
}
function setVerification(mobileVerified, emailVerified) {
  const p = profile();
  if (mobileVerified !== undefined) p.mobileVerified = !!mobileVerified;
  if (emailVerified !== undefined) p.emailVerified = !!emailVerified;
  if (p.firebaseUid) p.firebaseUid = p.firebaseUid;
  saveProfile(p);
  const m = $("mobileVerifyStatus");
  if (m && mobileVerified !== undefined) {
    m.textContent = mobileVerified ? "Verified" : "Not verified";
  }
  const e = $("emailVerifyStatus");
  if (e && emailVerified !== undefined) {
    e.textContent = emailVerified ? "Verified" : "Not verified";
  }
}

function modal() {
  if ($("realynkAuthModal")) return;
  const style = document.createElement("style");
  style.textContent = `
    #realynkAuthModal{position:fixed;inset:0;background:rgba(10,35,60,.58);z-index:100;display:none;align-items:flex-end;justify-content:center;padding:12px}
    #realynkAuthModal .ram{width:min(620px,100%);max-height:92vh;overflow:auto;background:#fff;border-radius:20px;padding:18px;box-shadow:0 20px 60px rgba(0,0,0,.25)}
    #realynkAuthModal h3{margin:0 0 8px;color:#0b3768;font-size:22px}#realynkAuthModal p{color:#6b7a8c;font-size:13px;line-height:1.45}
    #realynkAuthModal input{width:100%;padding:13px;border:1px solid #cfd9e5;border-radius:10px;margin:7px 0;font-size:16px;box-sizing:border-box}
    #realynkAuthModal .ramBtns{display:grid;grid-template-columns:1fr 1fr;gap:9px;margin-top:10px}.ramBtn{border:0;border-radius:10px;padding:13px;font-weight:800;cursor:pointer}.ramPrimary{background:#0b3768;color:#fff}.ramLight{background:#f5f7fb;color:#0b3768;border:1px solid #dfe6ee}.ramClose{float:right;border:0;background:#fff;font-size:25px;color:#6b7a8c}.ramHidden{display:none}.ramMsg{padding:10px;border-radius:10px;background:#f8fbff;color:#17324d;font-size:13px;margin-top:9px}.ramErr{background:#fff3f1;color:#b42318}.ramOk{background:#e9f8ef;color:#18864b}
  `;
  document.head.appendChild(style);
  const div = document.createElement("div");
  div.id = "realynkAuthModal";
  div.innerHTML = `<div class="ram">
    <button class="ramClose" id="ramClose" type="button">×</button>
    <h3>Broker Verification</h3>
    <p>Verify your mobile by OTP or verify your email. This confirms account ownership. The separate <b>Broker Verified</b> badge remains subject to profile review.</p>
    <div class="ramBtns"><button class="ramBtn ramPrimary" id="ramPhoneTab" type="button">📱 Mobile OTP</button><button class="ramBtn ramLight" id="ramEmailTab" type="button">✉️ Email</button></div>
    <div id="ramPhonePane">
      <input id="ramPhone" inputmode="tel" maxlength="10" placeholder="10-digit mobile number">
      <div id="ramRecaptcha"></div>
      <button class="ramBtn ramPrimary" id="ramSendOtp" type="button">Send OTP</button>
      <div id="ramOtpPane" class="ramHidden"><input id="ramOtp" inputmode="numeric" maxlength="6" placeholder="Enter 6-digit OTP"><button class="ramBtn ramPrimary" id="ramConfirmOtp" type="button">Verify OTP</button></div>
    </div>
    <div id="ramEmailPane" class="ramHidden">
      <input id="ramEmail" type="email" placeholder="Email address">
      <input id="ramPassword" type="password" minlength="6" placeholder="Password (minimum 6 characters)">
      <button class="ramBtn ramPrimary" id="ramVerifyEmail" type="button">Create / Verify Email</button>
    </div>
    <div id="ramMsg" class="ramMsg">Choose a verification method.</div>
  </div>`;
  document.body.appendChild(div);
  $("ramClose").onclick = closeModal;
  div.addEventListener("click", e => { if (e.target === div) closeModal(); });
  $("ramPhoneTab").onclick = () => switchPane("phone");
  $("ramEmailTab").onclick = () => switchPane("email");
  $("ramSendOtp").onclick = sendOtp;
  $("ramConfirmOtp").onclick = confirmOtp;
  $("ramVerifyEmail").onclick = verifyEmail;
}
function openModal() {
  modal();
  $("realynkAuthModal").style.display = "flex";
  const p = profile();
  $("ramPhone").value = p.accountPhone || "";
  $("ramEmail").value = p.agentEmail || "";
  switchPane("phone");
  if (!configured) setMsg("Firebase Web App config is not connected yet. Add the config in firebase-config.js first.", true);
}
function closeModal() { const m = $("realynkAuthModal"); if (m) m.style.display = "none"; }
function switchPane(which) {
  const phone = which === "phone";
  $("ramPhonePane").classList.toggle("ramHidden", !phone);
  $("ramEmailPane").classList.toggle("ramHidden", phone);
  $("ramPhoneTab").className = "ramBtn " + (phone ? "ramPrimary" : "ramLight");
  $("ramEmailTab").className = "ramBtn " + (!phone ? "ramPrimary" : "ramLight");
  if (phone && configured && !recaptcha) setupRecaptcha();
}
function setMsg(text, error = false, ok = false) {
  const box = $("ramMsg"); if (!box) return;
  box.textContent = text; box.className = "ramMsg" + (error ? " ramErr" : ok ? " ramOk" : "");
}
async function setupRecaptcha() {
  if (!auth || recaptcha) return;
  try {
    recaptcha = new RecaptchaVerifier(auth, "ramRecaptcha", { size: "normal" });
    await recaptcha.render();
  } catch (e) { setMsg("reCAPTCHA could not load. Check the Authorized domains in Firebase.", true); }
}
async function sendOtp() {
  if (!configured) return setMsg("Firebase Web App config is not connected yet.", true);
  if (!auth) return setMsg("Firebase Authentication is not available.", true);
  const raw = $("ramPhone").value.replace(/\D/g, "");
  if (!/^\d{10}$/.test(raw)) return setMsg("Enter a valid 10-digit Indian mobile number.", true);
  try {
    if (!recaptcha) await setupRecaptcha();
    confirmation = await signInWithPhoneNumber(auth, "+91" + raw, recaptcha);
    $("ramOtpPane").classList.remove("ramHidden");
    setMsg("OTP sent. Enter the 6-digit code received on your mobile.", false, true);
  } catch (e) {
    setMsg(e?.message || "Could not send OTP. Please try again.", true);
    try { recaptcha?.clear(); } catch (_) {}
    recaptcha = null;
    $("ramRecaptcha").innerHTML = "";
  }
}
async function confirmOtp() {
  if (!confirmation) return setMsg("Please send the OTP first.", true);
  const code = $("ramOtp").value.trim();
  if (!/^\d{6}$/.test(code)) return setMsg("Enter the 6-digit OTP.", true);
  try {
    const result = await confirmation.confirm(code);
    const p = profile();
    p.mobileVerified = true;
    p.firebaseUid = result.user.uid;
    p.firebasePhone = result.user.phoneNumber || ("+91" + $("ramPhone").value.replace(/\D/g, ""));
    saveProfile(p);
    setVerification(true, undefined);
    closeModal();
    toast("Mobile OTP verified successfully. Broker profile review is still pending.");
    if (typeof window.realynkRefreshAccount === "function") window.realynkRefreshAccount();
  } catch (e) { setMsg("Invalid or expired OTP. Please try again.", true); }
}
async function verifyEmail() {
  if (!configured) return setMsg("Firebase Web App config is not connected yet.", true);
  const email = $("ramEmail").value.trim();
  const password = $("ramPassword").value;
  if (!email || !/^\S+@\S+\.\S+$/.test(email)) return setMsg("Enter a valid email address.", true);
  if (password.length < 6) return setMsg("Password must be at least 6 characters.", true);
  try {
    let cred;
    try { cred = await signInWithEmailAndPassword(auth, email, password); }
    catch (e) {
      if (e.code !== "auth/user-not-found" && e.code !== "auth/invalid-credential") throw e;
      cred = await createUserWithEmailAndPassword(auth, email, password);
    }
    if (!cred.user.emailVerified) await sendEmailVerification(cred.user);
    const p = profile();
    p.agentEmail = email;
    p.firebaseUid = cred.user.uid;
    p.emailVerified = !!cred.user.emailVerified;
    saveProfile(p);
    if (cred.user.emailVerified) {
      setVerification(undefined, true);
      closeModal();
      toast("Email verified successfully. Broker profile review is still pending.");
    } else {
      setMsg("Verification email sent. Open the email, click Verify Email, then return to Realynk.", false, true);
    }
    if (typeof window.realynkRefreshAccount === "function") window.realynkRefreshAccount();
  } catch (e) { setMsg(e?.message || "Email verification could not be completed.", true); }
}
function refreshStatus() {
  const p = profile();
  const m = $("mobileVerifyStatus");
  const e = $("emailVerifyStatus");
  if (m) { m.textContent = p.mobileVerified ? "Verified" : "Not verified"; }
  if (e) { e.textContent = p.emailVerified ? "Verified" : "Not verified"; }
}
function injectVerificationButtons() {
  const box = document.querySelector(".verifyBox");
  if (!box || $("realynkVerifyActions")) return;
  const row = document.createElement("div");
  row.id = "realynkVerifyActions";
  row.style.cssText = "display:grid;grid-template-columns:1fr 1fr;gap:9px;margin-top:12px";
  row.innerHTML = `<button class="primary" id="verifyMobileBtn" type="button">📱 Verify Mobile OTP</button><button class="back" id="verifyEmailBtn" type="button">✉️ Verify Email</button>`;
  box.appendChild(row);
  const erow = document.createElement("div");
  erow.className = "verifyRow";
  erow.innerHTML = `<span>✉️ Email verification</span><span id="emailVerifyStatus" class="tag"></span>`;
  box.insertBefore(erow, row);
  $("verifyMobileBtn").onclick = () => { openModal(); switchPane("phone"); };
  $("verifyEmailBtn").onclick = () => { openModal(); switchPane("email"); };
  refreshStatus();
}
function init() {
  injectVerificationButtons();
  window.realynkRefreshAccount = refreshStatus;
  if (!configured) return;
  try {
    const app = getApps().length ? getApps()[0] : initializeApp(firebaseConfig);
    auth = getAuth(app);
    onAuthStateChanged(auth, user => {
      if (!user) return;
      const p = profile();
      p.firebaseUid = user.uid;
      if (user.phoneNumber) { p.mobileVerified = true; p.firebasePhone = user.phoneNumber; }
      if (user.email && user.emailVerified) { p.emailVerified = true; p.agentEmail = user.email; }
      saveProfile(p); refreshStatus();
    });
  } catch (e) { console.warn("Realynk Firebase initialization failed", e); }
}
if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", init); else init();
