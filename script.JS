// ══════════════════════════════════════
//   PORTAL DO ALUNO — script.js
// ══════════════════════════════════════

// ── USUÁRIOS (simulação) ──
let currentRole = 'student';

const USERS = {
  student: { user: 'aluno',     pass: 'senha123' },
  teacher: { user: 'professor', pass: 'senha123' }
};

// ── DADOS COMPARTILHADOS ──
const shared = {
  avisos: [
    {
      titulo: 'Reunião de pais e mestres',
      msg: 'Informamos que a reunião de pais e mestres está marcada para o dia 20/05. Presença obrigatória.',
      cat: 'blue',
      data: '08/05/2025'
    },
    {
      titulo: 'Semana de provas – Atenção ao calendário',
      msg: 'A semana de avaliações do 3º bimestre ocorrerá entre os dias 18 e 22 de junho. Confira o boletim de provas.',
      cat: 'yellow',
      data: '05/05/2025'
    },
    {
      titulo: 'Feriado municipal – Sem aulas',
      msg: 'Na próxima segunda-feira (13/05) não haverá aulas em razão do feriado municipal.',
      cat: 'green',
      data: '03/05/2025'
    }
  ],
  provas: [
    { disc: 'Matemática', data: '18/06/2025', dia: '18', mes: 'JUN', hora: '07:30', obs: 'Álgebra e funções' },
    { disc: 'Português',  data: '19/06/2025', dia: '19', mes: 'JUN', hora: '07:30', obs: 'Interpretação e redação' },
    { disc: 'Física',     data: '20/06/2025', dia: '20', mes: 'JUN', hora: '09:15', obs: 'Mecânica clássica' },
    { disc: 'Química',    data: '21/06/2025', dia: '21', mes: 'JUN', hora: '07:30', obs: 'Estequiometria' }
  ]
};

// ── NAVEGAÇÃO ──
function goTo(screen) {
  document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
  document.getElementById('screen-' + screen).classList.add('active');
}

function goToLogin(role) {
  currentRole = role;

  const badge = document.getElementById('login-badge');
  const btn   = document.getElementById('login-btn');
  const hint  = document.getElementById('login-hint');

  if (role === 'student') {
    badge.className  = 'login-badge student';
    badge.innerHTML  = '👨‍🎓 &nbsp;Área do Aluno';
    btn.className    = 'btn-primary student';
    hint.textContent = 'Dica: aluno / senha123';
  } else {
    badge.className  = 'login-badge teacher';
    badge.innerHTML  = '👩‍🏫 &nbsp;Área do Professor';
    btn.className    = 'btn-primary teacher';
    hint.textContent = 'Dica: professor / senha123';
  }

  document.getElementById('login-user').value = '';
  document.getElementById('login-pass').value = '';
  document.getElementById('error-msg').style.display = 'none';
  goTo('login');
}

function doLogin() {
  const u     = document.getElementById('login-user').value.trim();
  const p     = document.getElementById('login-pass').value.trim();
  const creds = USERS[currentRole];

  if (u === creds.user && p === creds.pass) {
    renderAvisos();
    renderProvas();
    goTo(currentRole);
  } else {
    document.getElementById('error-msg').style.display = 'block';
  }
}

// Login com tecla Enter
document.addEventListener('keydown', function(e) {
  const ls = document.getElementById('screen-login');
  if (ls.classList.contains('active') && e.key === 'Enter') {
    doLogin();
  }
});

// ── TROCA DE PÁGINAS NO DASHBOARD ──
function showPage(role, page, el) {
  const prefix = role + '-';

  document.querySelectorAll('#screen-' + role + ' .page').forEach(function(p) {
    p.classList.remove('active');
  });

  document.getElementById(prefix + page).classList.add('active');

  document.querySelectorAll('#screen-' + role + ' .nav-item').forEach(function(n) {
    n.classList.remove('active', 'student-nav', 'teacher-nav');
  });

  el.classList.add('active', role + '-nav');
}

// ── CORES DOS AVISOS ──
const dotColors = {
  blue:   '#3b82f6',
  yellow: '#f59e0b',
  green:  '#10b981',
  red:    '#ef4444'
};

// ── RENDERIZAR AVISOS ──
function renderAvisos() {
  ['student', 'teacher'].forEach(function(role) {
    var el = document.getElementById(role + '-avisos-list');
    if (!el) return;

    el.innerHTML = shared.avisos.map(function(a) {
      return '<div class="notice-card">' +
        '<div class="notice-top">' +
          '<div class="notice-dot" style="background:' + dotColors[a.cat] + '"></div>' +
          '<div class="notice-title">' + a.titulo + '</div>' +
          '<div class="notice-date">' + a.data + '</div>' +
        '</div>' +
        '<div class="notice-body">' + a.msg + '</div>' +
      '</div>';
    }).join('');
  });
}

// ── RENDERIZAR PROVAS ──
function renderProvas() {
  ['student-provas-list', 'teacher-provas-list'].forEach(function(id) {
    var el = document.getElementById(id);
    if (!el) return;

    el.innerHTML = shared.provas.map(function(p) {
      return '<div class="prova-card">' +
        '<div class="prova-date">' +
          '<div class="prova-day">' + p.dia + '</div>' +
          '<div class="prova-month">' + p.mes + '</div>' +
        '</div>' +
        '<div class="prova-divider"></div>' +
        '<div class="prova-info">' +
          '<div class="prova-name">' + p.disc + '</div>' +
          '<div class="prova-meta">⏰ ' + p.hora + ' &nbsp;|&nbsp; 📌 ' + p.obs + '</div>' +
        '</div>' +
        '<span class="badge badge-blue">Agendada</span>' +
      '</div>';
    }).join('');
  });
}

// ── MOSTRAR TOAST ──
function showToast(id) {
  var t = document.getElementById(id);
  t.style.display = 'block';
  setTimeout(function() {
    t.style.display = 'none';
  }, 3000);
}

// ── SALVAR NOTA ──
function salvarNota() {
  var disc  = document.getElementById('nota-disc').value;
  var bim   = document.getElementById('nota-bim').value;
  var aluno = document.getElementById('nota-aluno').value;
  var nota  = document.getElementById('nota-valor').value;

  if (!nota) return;

  var today = new Date().toLocaleDateString('pt-BR');
  var tbody = document.getElementById('notas-recentes');
  var row = '<tr>' +
    '<td>' + aluno + '</td>' +
    '<td>' + disc + '</td>' +
    '<td>' + bim + '</td>' +
    '<td><b>' + parseFloat(nota).toFixed(1) + '</b></td>' +
    '<td>' + today + '</td>' +
  '</tr>';

  tbody.insertAdjacentHTML('afterbegin', row);
  document.getElementById('nota-valor').value = '';
  showToast('nota-toast');
}

// ── AGENDAR PROVA ──
function salvarProva() {
  var disc     = document.getElementById('prova-disc').value;
  var dataVal  = document.getElementById('prova-data').value;
  var hora     = document.getElementById('prova-hora').value;
  var obs      = document.getElementById('prova-obs').value || 'Sem observação';

  if (!dataVal) return;

  var d       = new Date(dataVal + 'T12:00:00');
  var dia     = String(d.getDate()).padStart(2, '0');
  var mes     = d.toLocaleString('pt-BR', { month: 'short' }).toUpperCase().replace('.', '');
  var dataFmt = d.toLocaleDateString('pt-BR');

  shared.provas.unshift({ disc: disc, data: dataFmt, dia: dia, mes: mes, hora: hora, obs: obs });
  renderProvas();

  document.getElementById('prova-data').value = '';
  document.getElementById('prova-obs').value  = '';
  showToast('prova-toast');
}

// ── PUBLICAR AVISO ──
function salvarAviso() {
  var titulo = document.getElementById('aviso-titulo').value.trim();
  var msg    = document.getElementById('aviso-msg').value.trim();
  var cat    = document.getElementById('aviso-cat').value;

  if (!titulo || !msg) return;

  var today = new Date().toLocaleDateString('pt-BR');
  shared.avisos.unshift({ titulo: titulo, msg: msg, cat: cat, data: today });
  renderAvisos();

  document.getElementById('aviso-titulo').value = '';
  document.getElementById('aviso-msg').value    = '';
  showToast('aviso-toast');
}
