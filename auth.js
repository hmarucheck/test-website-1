/* Sign in with Google, using Google Identity Services.
 *
 * Google authenticates the user and hands back a signed JWT ID token. A real
 * deployment must send that token to a server and verify its signature, `aud`
 * and `iss` against Google's public keys before trusting it — decoding a JWT in
 * the browser proves nothing, since anyone can craft one. This site has no
 * backend, so the token is decoded here purely to display the signed-in name.
 */
(function () {
  'use strict';

  var config = window.VEYLORO_CONFIG || {};
  var clientId = String(config.googleClientId || '').trim();

  var buttonEl = document.querySelector('[data-google-button]');
  var setupEl = document.querySelector('[data-google-setup]');
  var statusEl = document.querySelector('[data-auth-status]');
  var profileEl = document.querySelector('[data-signed-in]');
  var signOutEl = document.querySelector('[data-signout]');
  if (!buttonEl) return;

  var SESSION_KEY = 'veyloro.session';

  function setStatus(message, tone) {
    if (!statusEl) return;
    statusEl.textContent = message || '';
    statusEl.className = 'auth__status' + (tone ? ' is-' + tone : '');
  }

  /* Decode a JWT payload. Display only — see the note above. */
  function decodePayload(token) {
    var part = String(token).split('.')[1];
    if (!part) throw new Error('malformed token');
    var base64 = part.replace(/-/g, '+').replace(/_/g, '/');
    while (base64.length % 4) base64 += '=';
    var json = decodeURIComponent(atob(base64).split('').map(function (c) {
      return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
    }).join(''));
    return JSON.parse(json);
  }

  function showProfile(profile) {
    if (!profileEl) return;
    var nameEl = profileEl.querySelector('[data-profile-name]');
    var mailEl = profileEl.querySelector('[data-profile-email]');
    var picEl = profileEl.querySelector('[data-profile-picture]');
    if (nameEl) nameEl.textContent = profile.name || 'Signed in';
    if (mailEl) mailEl.textContent = profile.email || '';
    if (picEl && profile.picture) {
      picEl.src = profile.picture;
      picEl.alt = '';
      picEl.referrerPolicy = 'no-referrer';
    }
    profileEl.hidden = false;
    buttonEl.hidden = true;
    setStatus('Signed in with Google.', 'success');
  }

  function clearProfile() {
    if (profileEl) profileEl.hidden = true;
    buttonEl.hidden = false;
    try { sessionStorage.removeItem(SESSION_KEY); } catch (e) { /* private mode */ }
    setStatus('Signed out.');
  }

  function onCredential(response) {
    if (!response || !response.credential) {
      setStatus('Google did not return a credential. Please try again.', 'error');
      return;
    }
    var profile;
    try {
      profile = decodePayload(response.credential);
    } catch (e) {
      setStatus('That sign-in response could not be read. Please try again.', 'error');
      return;
    }
    try {
      sessionStorage.setItem(SESSION_KEY, JSON.stringify({
        name: profile.name, email: profile.email, picture: profile.picture
      }));
    } catch (e) { /* storage unavailable — the page still works */ }
    showProfile(profile);
  }

  /* Restore the greeting if the visitor already signed in this tab. */
  try {
    var saved = sessionStorage.getItem(SESSION_KEY);
    if (saved) showProfile(JSON.parse(saved));
  } catch (e) { /* ignore */ }

  if (signOutEl) {
    signOutEl.addEventListener('click', function () {
      if (window.google && google.accounts && google.accounts.id) {
        google.accounts.id.disableAutoSelect();
      }
      clearProfile();
    });
  }

  if (!clientId) {
    if (setupEl) setupEl.hidden = false;
    buttonEl.hidden = true;
    setStatus('Sign-in is not configured yet.', 'error');
    return;
  }

  window.veyloroGsiReady = function () {
    if (!window.google || !google.accounts || !google.accounts.id) {
      setStatus('Google sign-in could not start. Please reload the page.', 'error');
      return;
    }
    try {
      google.accounts.id.initialize({
        client_id: clientId,
        callback: onCredential,
        ux_mode: 'popup',
        auto_select: false,
        cancel_on_tap_outside: true,
        itp_support: true
      });
      google.accounts.id.renderButton(buttonEl, {
        type: 'standard',
        theme: 'outline',
        size: 'large',
        shape: 'pill',
        text: 'signin_with',
        logo_alignment: 'left',
        width: 300
      });
      setStatus('');
    } catch (e) {
      setStatus('Google rejected this client ID. Check that the ID in config.js is correct and that this site’s origin is listed in the Google Cloud console.', 'error');
    }
  };

  window.veyloroGsiFailed = function () {
    setStatus('Google’s sign-in script could not be loaded. Check your connection, or any extension blocking accounts.google.com.', 'error');
  };

  /* If the SDK was already cached and fired before this ran, start it now. */
  if (window.google && google.accounts && google.accounts.id) window.veyloroGsiReady();
  setStatus('Loading Google sign-in…');
})();
