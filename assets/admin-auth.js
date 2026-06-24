// ════════ ENGAGE ADMIN — trava de acesso (client-side) ════════
// AVISO DE SEGURANÇA: site estático não tem servidor. Esta trava é um
// DISSUASOR — impede acesso casual e indexação, mas não é segurança forte.
// Para proteção real (dados sensíveis / múltiplos editores), use backend.
(function () {
  var HASH_KEY = 'engage_admin_hash';     // hash da senha (override do usuário)
  var SESSION_KEY = 'engage_admin_session';
  var SESSION_HOURS = 8;                   // sessão expira em 8h
  // hash padrão = SHA-256 de 'engage::' + senha. Senha inicial: Engage@2026
  var DEFAULT_HASH = '2f9e709d27fdaca135f9f231e46403c7024c1fa15ca694f1aae6ae5f036e3a47';

  async function sha256(str) {
    var buf = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(str));
    return Array.prototype.map.call(new Uint8Array(buf), function (b) {
      return b.toString(16).padStart(2, '0');
    }).join('');
  }
  function currentHash() { return localStorage.getItem(HASH_KEY) || DEFAULT_HASH; }
  function hashOf(pw) { return sha256('engage::' + pw); }

  function isValidSession() {
    try {
      var s = JSON.parse(sessionStorage.getItem(SESSION_KEY));
      return s && s.exp && Date.now() < s.exp;
    } catch (e) { return false; }
  }
  function grant() {
    sessionStorage.setItem(SESSION_KEY, JSON.stringify({ exp: Date.now() + SESSION_HOURS * 3600 * 1000 }));
  }
  function revoke() { sessionStorage.removeItem(SESSION_KEY); }

  // ── overlay de login ──
  function buildGate() {
    var ov = document.createElement('div');
    ov.id = 'adminGate';
    ov.innerHTML =
      '<div class="ag-card">' +
        '<div class="ag-brand">Engage<span>.</span></div>' +
        '<h2>Área administrativa</h2>' +
        '<p>Acesso restrito. Informe a senha para continuar.</p>' +
        '<form id="agForm">' +
          '<div class="ag-field">' +
            '<input type="password" id="agPw" placeholder="Senha" autocomplete="current-password" autofocus />' +
            '<button type="button" id="agToggle" aria-label="Mostrar senha">👁</button>' +
          '</div>' +
          '<div class="ag-err" id="agErr">Senha incorreta.</div>' +
          '<button type="submit" class="ag-btn">Entrar</button>' +
        '</form>' +
        '<a class="ag-back" href="index.html">← Voltar ao site</a>' +
      '</div>';
    document.body.appendChild(ov);

    var form = document.getElementById('agForm');
    var pw = document.getElementById('agPw');
    var err = document.getElementById('agErr');
    var fails = 0, lockUntil = 0;

    document.getElementById('agToggle').addEventListener('click', function () {
      pw.type = pw.type === 'password' ? 'text' : 'password'; pw.focus();
    });
    form.addEventListener('submit', async function (e) {
      e.preventDefault();
      if (Date.now() < lockUntil) {
        err.textContent = 'Muitas tentativas. Aguarde alguns segundos.'; err.classList.add('show'); return;
      }
      var h = await hashOf(pw.value);
      if (h === currentHash()) {
        grant(); ov.classList.add('ag-out');
        setTimeout(function () { ov.remove(); document.documentElement.classList.remove('admin-locked'); }, 280);
      } else {
        fails++;
        err.textContent = 'Senha incorreta.'; err.classList.add('show');
        pw.value = ''; pw.focus();
        if (fails >= 5) { lockUntil = Date.now() + 15000; err.textContent = 'Muitas tentativas. Aguarde 15 segundos.'; }
      }
    });
  }

  // ── API global p/ logout e troca de senha (usada no admin) ──
  window.AdminAuth = {
    logout: function () { revoke(); location.reload(); },
    changePassword: async function (atual, nova) {
      if ((await hashOf(atual)) !== currentHash()) return { ok: false, msg: 'Senha atual incorreta.' };
      if (!nova || nova.length < 6) return { ok: false, msg: 'A nova senha deve ter ao menos 6 caracteres.' };
      localStorage.setItem(HASH_KEY, await hashOf(nova));
      return { ok: true, msg: 'Senha alterada com sucesso.' };
    },
    isDefaultPassword: function () { return currentHash() === DEFAULT_HASH; }
  };

  // ── inicialização: trava antes de qualquer render do admin ──
  document.documentElement.classList.add('admin-locked');
  if (isValidSession()) {
    document.documentElement.classList.remove('admin-locked');
  } else {
    if (document.body) buildGate();
    else document.addEventListener('DOMContentLoaded', buildGate);
  }
})();
