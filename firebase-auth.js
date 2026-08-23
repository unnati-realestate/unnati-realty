/* REALYNK BROKER AUTO-VERIFICATION
   Mobile OTP is not required for Broker Verified status.
   A broker is verified when the required profile is complete and the declaration is accepted,
   OR when the account already has a verified email.
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
      if (status) {
        status.textContent = '✓ Verified Broker';
        status.className = 'badge';
      }
      if (mobile) mobile.textContent = 'Not required';
      if (review) review.textContent = 'Verified';

      var card = document.getElementById('brokerProfileCard');
      if (card) {
        var badge = card.querySelector('.badge');
        if (badge) {
          badge.textContent = 'Verified';
          badge.className = 'badge';
        }
      }
    }

    /* Verification controls are no longer required for broker approval. */
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
      setTimeout(function () {
        var p = getProfile();
        if (isComplete(p) || p.emailVerified === true) {
          p.status = 'verified';
          saveProfile(p);
        }
        refreshVerifiedUI(p);
      }, 80);
    });
  }

  function addLogoutButton() {
    if (document.getElementById('realynkLogout')) return;
    var account = document.getElementById('account');
    if (!account) return;

    var page = account.querySelector('.page');
    var panel = account.querySelector('.panel');
    if (!page || !panel) return;

    var btn = document.createElement('button');
    btn.id = 'realynkLogout';
    btn.type = 'button';
    btn.className = 'back full';
    btn.style.marginTop = '10px';
    btn.style.color = '#b42318';
    btn.textContent = '↪ Logout / Switch Account';

    btn.onclick = function () {
      var ok = window.confirm('Logout from this broker account?');
      if (!ok) return;
      localStorage.removeItem('realynkBrokerProfile');
      localStorage.removeItem('realynkLang');
      window.location.reload();
    };

    panel.appendChild(btn);
  }

  function init() {
    hookSaveButton();
    autoVerify();
    addLogoutButton();
    setTimeout(function () {
      hookSaveButton();
      autoVerify();
      addLogoutButton();
    }, 300);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
