// ════════ ENGAGE BLOG — camada de dados (localStorage) ════════
// Persistência client-side. Os posts ficam no navegador do dispositivo.
(function (global) {
  var KEY = 'engage_blog_posts_v1';

  function slugify(str) {
    return (str || '').toString().toLowerCase()
      .normalize('NFD').replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-z0-9\s-]/g, '').trim()
      .replace(/\s+/g, '-').replace(/-+/g, '-').slice(0, 70);
  }

  function read() {
    try { return JSON.parse(localStorage.getItem(KEY)) || []; }
    catch (e) { return []; }
  }
  function write(list) { localStorage.setItem(KEY, JSON.stringify(list)); }

  // seed de exemplo na primeira visita (para o blog não nascer vazio)
  function seedIfEmpty() {
    if (localStorage.getItem(KEY) !== null) return;
    var now = Date.now();
    var seed = [
      {
        id: 'seed-1', slug: 'por-que-o-cac-sobe-e-o-que-fazer',
        title: 'Por que o CAC sobe todo ano — e o que fazer com a sua base',
        category: 'Estratégia',
        excerpt: 'O custo de adquirir clientes não para de crescer. A saída mais barata e previsível já está dentro de casa: a parte 2 do funil.',
        cover: 'gradient-1', author: 'Deivison Vieira', minutes: 6,
        date: now - 86400000 * 2, status: 'published',
        body: '## O custo de crescer só por aquisição\n\nA cada ano, mídia paga fica mais cara e mais disputada. O CAC sobe, a margem aperta e o crescimento vira refém de um orçamento que precisa ser sempre maior.\n\nO problema não é a aquisição em si — é depender **só** dela.\n\n## A base já levantou a mão\n\nVender para quem já confia em você tem até 65% de chance de conversão, contra 5 a 20% na prospecção fria. Mesmo assim, a maior parte do orçamento continua indo para conquistar clientes novos.\n\n> Ninguém acorda pensando em LTV. As pessoas acordam pensando em vender mais.\n\n## O que fazer hoje\n\n1. Meça o LTV e o churn atuais da sua base.\n2. Identifique os clientes prontos para recompra e expansão.\n3. Instale uma operação contínua — não um esforço pontual.\n\nÉ exatamente isso que a parte 2 do funil resolve: transformar a base em receita previsível.'
      },
      {
        id: 'seed-2', slug: 'nrr-o-indicador-que-importa',
        title: 'NRR: o indicador que separa quem cresce de quem corre atrás',
        category: 'Métricas',
        excerpt: 'Net Revenue Retention acima de 100% significa que sua base cresce sozinha, mesmo sem clientes novos. Veja como chegar lá.',
        cover: 'gradient-2', author: 'Deivison Vieira', minutes: 5,
        date: now - 86400000 * 8, status: 'published',
        body: '## O que é NRR\n\nNet Revenue Retention mede quanta receita a sua base atual gera ao longo do tempo, considerando expansão, recompra e churn.\n\nAcima de 100%, sua base **cresce sozinha** — mesmo que você não conquiste nenhum cliente novo.\n\n## Por que ele importa mais que MRR novo\n\nMRR novo é caro e volátil. NRR alto é composto: cresce sobre si mesmo e reduz a pressão sobre aquisição.\n\n## Como melhorar o NRR\n\n- Antecipe o churn com health score.\n- Crie esteiras de expansão (upsell e cross-sell) no momento certo.\n- Opere relacionamento de forma contínua, com método.'
      },
      {
        id: 'seed-3', slug: 'comunidade-como-canal-de-receita',
        title: 'Comunidade não é engajamento. É canal de receita.',
        category: 'Comunidade',
        excerpt: 'Tratar comunidade como métrica de vaidade é desperdício. Conectada ao LTV, ela vira um dos canais mais previsíveis da base.',
        cover: 'gradient-3', author: 'Deivison Vieira', minutes: 4,
        date: now - 86400000 * 15, status: 'published',
        body: '## O erro de medir comunidade por engajamento\n\nCurtidas e mensagens não pagam a conta. O que importa é o que a comunidade gera em recompra, retenção e indicação.\n\n## Comunidade ligada ao LTV\n\nQuando cada membro é acompanhado por RFV e health score, a comunidade deixa de ser custo e vira um dos canais mais previsíveis de receita da base.\n\n## Por onde começar\n\nDiagnóstico, canvas de comunidade e um nível de tecnologia adequado ao seu momento — da plataforma pronta ao app proprietário.'
      }
    ];
    write(seed);
  }

  var BlogStore = {
    slugify: slugify,
    all: function () { return read().sort(function (a, b) { return b.date - a.date; }); },
    published: function () { return this.all().filter(function (p) { return p.status === 'published'; }); },
    getBySlug: function (slug) { return read().filter(function (p) { return p.slug === slug; })[0] || null; },
    getById: function (id) { return read().filter(function (p) { return p.id === id; })[0] || null; },
    save: function (post) {
      var list = read();
      if (!post.id) {
        post.id = 'p-' + Date.now() + '-' + Math.random().toString(36).slice(2, 7);
        post.date = post.date || Date.now();
        post.slug = slugify(post.title) || post.id;
        // garante slug único
        var base = post.slug, n = 2;
        while (list.some(function (p) { return p.slug === post.slug; })) { post.slug = base + '-' + n++; }
        list.push(post);
      } else {
        var idx = list.findIndex(function (p) { return p.id === post.id; });
        if (idx >= 0) list[idx] = Object.assign(list[idx], post);
        else list.push(post);
      }
      write(list);
      return post;
    },
    remove: function (id) { write(read().filter(function (p) { return p.id !== id; })); },
    seedIfEmpty: seedIfEmpty
  };

  // markdown mínimo → HTML (h2, h3, listas, citação, negrito, parágrafos)
  BlogStore.renderMarkdown = function (md) {
    if (!md) return '';
    var esc = function (s) { return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;'); };
    var lines = md.replace(/\r\n/g, '\n').split('\n');
    var html = '', i = 0;
    function inline(t) {
      return esc(t)
        .replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>')
        .replace(/\*([^*]+)\*/g, '<em>$1</em>');
    }
    while (i < lines.length) {
      var line = lines[i];
      if (/^###\s+/.test(line)) { html += '<h3>' + inline(line.replace(/^###\s+/, '')) + '</h3>'; i++; }
      else if (/^##\s+/.test(line)) { html += '<h2>' + inline(line.replace(/^##\s+/, '')) + '</h2>'; i++; }
      else if (/^>\s?/.test(line)) { html += '<blockquote>' + inline(line.replace(/^>\s?/, '')) + '</blockquote>'; i++; }
      else if (/^\s*[-*]\s+/.test(line)) {
        html += '<ul>';
        while (i < lines.length && /^\s*[-*]\s+/.test(lines[i])) { html += '<li>' + inline(lines[i].replace(/^\s*[-*]\s+/, '')) + '</li>'; i++; }
        html += '</ul>';
      }
      else if (/^\s*\d+\.\s+/.test(line)) {
        html += '<ol>';
        while (i < lines.length && /^\s*\d+\.\s+/.test(lines[i])) { html += '<li>' + inline(lines[i].replace(/^\s*\d+\.\s+/, '')) + '</li>'; i++; }
        html += '</ol>';
      }
      else if (line.trim() === '') { i++; }
      else { html += '<p>' + inline(line) + '</p>'; i++; }
    }
    return html;
  };

  // formata data
  BlogStore.fmtDate = function (ts) {
    try { return new Date(ts).toLocaleDateString('pt-BR', { day: '2-digit', month: 'long', year: 'numeric' }); }
    catch (e) { return ''; }
  };

  seedIfEmpty();
  global.BlogStore = BlogStore;
})(window);
