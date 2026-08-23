/* REALYNK BROKER ACCOUNT CONTROLS
   Broker profile verification is automatic when the required profile is complete
   or when emailVerified is true. Mobile OTP is not required.
*/
(function () {
  'use strict';

  function getProfile() {
    try {
      return JSON.parse(localStorage.getItem('realynkBrokerProfile') || '{}') || {};
    } catch (_) {
      return {};
    }
  }

  function saveProfile(profile) {
    localStorage.setItem('realynkBrokerProfile', JSON.stringify(profile));
  }

  function isComplete(p) {
    return !!(
      String(p.agentName || '').trim() &&
      /^\d{10}$/.test(String(p.accountPhone || '').replace(/\D/g, '')) &&
      String(p.city || '').trim() &&
      String(p.state || '').trim() &&
      p.declaration === true
    );
  }

  function refreshVerifiedUI(p) {
    var status = document.getElementById('accountStatus');
    var mobile = document.getElementById('mobileVerifyStatus');
    var review = document.getElementById('profileVerifyStatus');
    if (p.status === 'verified') {
      if (status) { status.textContent = '✓ Verified Broker'; status.className = 'badge'; }
      if (mobile) mobile.textContent = 'Not required';
      if (review) review.textContent = 'Verified';
    }
    var box = document.querySelector('.verifyBox');
    if (box) box.style.display = 'none';
  }

  function autoVerify() {
    var p = getProfile();
    if (!p.agentName) return;
    if (isComplete(p) || p.emailVerified === true) {
      p.status = 'verified';
      saveProfile(p);
    }
    refreshVerifiedUI(p);
  }

  function hookSaveButton() {
    var btn = document.getElementById('saveAccount');
    if (!btn || btn.getAttribute('data-auto-verify-hook') === '1') return;
    btn.setAttribute('data-auto-verify-hook', '1');
    btn.addEventListener('click', function () {
      setTimeout(autoVerify, 150);
    });
  }

  function addAccountControls() {
    var account = document.getElementById('account');
    if (!account || document.getElementById('realynkAccountControls')) return;

    var page = account.querySelector('.page');
    if (!page) return;

    var box = document.createElement('div');
    box.id = 'realynkAccountControls';
    box.className = 'panel';
    box.style.marginTop = '14px';
    box.innerHTML =
      '<b style="display:block;font-size:18px;color:#0b3768;margin-bottom:10px">Account Access</b>' +
      '<button id="realynkLogin" type="button" class="primary full" style="margin-bottom:10px">Login / Switch Broker</button>' +
      '<button id="realynkLogout" type="button" class="back full" style="color:#b42318">Logout / New Broker</button>' +
      '<div class="small" style="margin-top:8px">Logout clears this device’s broker profile so another broker can create their own profile.</div>';

    page.appendChild(box);

    document.getElementById('realynkLogout').onclick = function () {
      if (!window.confirm('Logout this broker account and allow another broker to use this device?')) return;
      localStorage.removeItem('realynkBrokerProfile');
      window.location.href = window.location.pathname + '?account=new';
    };

    document.getElementById('realynkLogin').onclick = function () {
      localStorage.removeItem('realynkBrokerProfile');
      window.location.href = window.location.pathname + '?account=new';
    };
  }

  function init() {
    hookSaveButton();
    autoVerify();
    addAccountControls();
    setTimeout(function () {
      hookSaveButton();
      autoVerify();
      addAccountControls();
    }, 500);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();