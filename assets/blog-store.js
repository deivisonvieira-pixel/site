// ════════════════════════════════════════════════════
//  ENGAGE — Blog store (CMS client-side / protótipo)
//  Persiste em localStorage. Exporta/importa JSON.
// ════════════════════════════════════════════════════
(function () {
  var KEY = 'engage_blog_posts_v1';

  var SEED = [
    {
      id: 'seed-cac',
      slug: 'por-que-o-cac-nao-vai-parar-de-subir',
      title: 'Por que o CAC não vai parar de subir — e o que fazer a respeito',
      excerpt: 'O custo de adquirir clientes sobe há uma década e não há sinal de trégua. A boa notícia: a saída não é gastar mais em mídia.',
      category: 'Aquisição vs. Retenção',
      author: 'Deivison Vieira',
      date: '2026-05-28',
      cover: 1,
      status: 'published',
      body: [
        'Toda empresa que depende de mídia paga sente o mesmo aperto: o leilão fica mais caro, a concorrência aumenta e cada real comprado rende menos. Não é impressão — é estrutura de mercado.',
        '## A conta que ninguém quer fazer',
        'Quando o CAC sobe e a taxa de conversão fica estável, a única forma de manter o crescimento é injetar mais orçamento. É uma esteira que acelera sozinha, e quem está em cima precisa correr cada vez mais rápido só para ficar no mesmo lugar.',
        '> O problema não é o tráfego pago. É depender **só** dele.',
        'A saída não é abandonar a aquisição — é parar de tratá-la como o único motor. Quem já comprou de você é o ativo mais barato e mais previsível que existe, e quase sempre está sem operação nenhuma.',
        '## Três movimentos que mudam o jogo',
        '- Reativar a base com réguas de recompra desenhadas por comportamento, não por calendário.',
        '- Estruturar expansão (upsell e cross-sell) como processo, não como sorte.',
        '- Transformar clientes satisfeitos em canal de indicação previsível.',
        'Nenhum desses movimentos exige aumentar o investimento em mídia. Todos exigem método — e é exatamente isso que a parte 2 do funil entrega.'
      ].join('\n\n')
    },
    {
      id: 'seed-nrr',
      slug: 'nrr-a-metrica-que-separa-quem-cresce',
      title: 'NRR: a métrica que separa empresas que crescem das que apenas correm',
      excerpt: 'Net Revenue Retention é o termômetro mais honesto da saúde de um negócio recorrente. Acima de 100%, você cresce mesmo sem vender para ninguém novo.',
      category: 'Métricas',
      author: 'Deivison Vieira',
      date: '2026-05-12',
      cover: 2,
      status: 'published',
      body: [
        'Existe uma métrica que, sozinha, conta se o seu negócio tem um motor de crescimento sustentável ou se está apenas tapando buraco com aquisição: o NRR — Net Revenue Retention.',
        '## O que o NRR realmente mede',
        'Ele compara a receita da sua base hoje com a receita dessa mesma base 12 meses atrás — somando expansões e subtraindo churn e contrações. Acima de 100%, a base cresce sozinha. Abaixo, você precisa de aquisição só para repor o que perde.',
        '> Uma base com NRR de 115% dobra de tamanho a cada cinco anos sem um único cliente novo.',
        'Esse é o tipo de composição que muda a avaliação de uma empresa — e o sono do fundador.',
        '## Como sair de 90% para 110%',
        '- Mapear os sinais de churn antes que ele aconteça (health score).',
        '- Criar gatilhos de expansão atrelados ao sucesso do cliente, não ao fim do contrato.',
        '- Tratar onboarding como o momento mais importante da jornada, porque é onde o NRR começa.',
        'NRR não é um número de slide. É a consequência de operar a base com a mesma seriedade que se opera o comercial.'
      ].join('\n\n')
    },
    {
      id: 'seed-parte2',
      slug: 'a-parte-2-do-funil-onde-mora-o-ltv',
      title: 'A parte 2 do funil: onde mora o LTV',
      excerpt: 'Todo mundo conhece o funil de aquisição. Quase ninguém opera o que vem depois da venda — e é exatamente ali que o valor de um cliente é construído ou perdido.',
      category: 'Estratégia',
      author: 'Deivison Vieira',
      date: '2026-04-30',
      cover: 3,
      status: 'published',
      body: [
        'Desenhe o funil da sua empresa numa folha. Provavelmente você vai parar na venda. É aí que mora o ponto cego mais caro do mercado.',
        '## Onde a venda termina, o LTV começa',
        'A parte 1 do funil — marketing, mídia, prospecção, comercial — é o território que todo o mercado já cobre. A parte 2 — onboarding, sucesso, relacionamento, expansão, indicação — é onde o valor de um cliente é de fato construído. E está quase sempre sem dono.',
        '> Empresas gastam 80% do orçamento conquistando clientes e quase nada operando os que já têm.',
        'Esse desequilíbrio é a maior oportunidade não explorada da maioria dos negócios brasileiros de médio porte.',
        '## Operar, não torcer',
        'A diferença entre uma base que gera receita previsível e uma que apenas existe é operação: processos, tecnologia e método rodando todos os dias sobre os dados dos clientes. É disso que a Engage trata — e é por isso que começamos exatamente onde a venda termina.'
      ].join('\n\n')
    }
  ];

  function load() {
    try {
      var raw = localStorage.getItem(KEY);
      if (!raw) return null;
      return JSON.parse(raw);
    } catch (e) { return null; }
  }
  function persist(posts) {
    try { localStorage.setItem(KEY, JSON.stringify(posts)); } catch (e) {}
  }
  function seedIfEmpty() {
    var p = load();
    if (!p) { persist(SEED.slice()); return SEED.slice(); }
    return p;
  }
  function getAll() {
    var p = seedIfEmpty();
    return p.slice().sort(function (a, b) { return (b.date || '').localeCompare(a.date || ''); });
  }
  function getPublished() { return getAll().filter(function (p) { return p.status === 'published'; }); }
  function get(slug) { return getAll().filter(function (p) { return p.slug === slug; })[0] || null; }
  function getById(id) { return getAll().filter(function (p) { return p.id === id; })[0] || null; }

  function slugify(s) {
    return (s || '').toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-z0-9\s-]/g, '').trim().replace(/\s+/g, '-').replace(/-+/g, '-').slice(0, 80);
  }
  function uid() { return 'p-' + Date.now().toString(36) + '-' + Math.random().toString(36).slice(2, 6); }

  function save(post) {
    var posts = seedIfEmpty();
    if (!post.id) post.id = uid();
    if (!post.slug) post.slug = slugify(post.title) || post.id;
    // ensure unique slug
    var base = post.slug, n = 2;
    while (posts.some(function (p) { return p.slug === post.slug && p.id !== post.id; })) { post.slug = base + '-' + n++; }
    var idx = posts.findIndex(function (p) { return p.id === post.id; });
    if (idx >= 0) posts[idx] = post; else posts.push(post);
    persist(posts);
    return post;
  }
  function remove(id) {
    var posts = seedIfEmpty().filter(function (p) { return p.id !== id; });
    persist(posts);
  }
  function setStatus(id, status) {
    var p = getById(id); if (!p) return;
    p.status = status; save(p);
  }
  function exportJSON() { return JSON.stringify(getAll(), null, 2); }
  function importJSON(str) {
    var data = JSON.parse(str);
    if (!Array.isArray(data)) throw new Error('JSON inválido: esperado um array de artigos.');
    persist(data); return data;
  }
  function resetToSeed() { persist(SEED.slice()); return SEED.slice(); }

  function readingTime(body) {
    var words = (body || '').replace(/[#>*\-\[\]()]/g, ' ').split(/\s+/).filter(Boolean).length;
    return Math.max(1, Math.round(words / 200));
  }

  function fmtDate(iso) {
    if (!iso) return '';
    var m = ['jan', 'fev', 'mar', 'abr', 'mai', 'jun', 'jul', 'ago', 'set', 'out', 'nov', 'dez'];
    var d = new Date(iso + 'T12:00:00');
    if (isNaN(d)) return iso;
    return d.getDate() + ' ' + m[d.getMonth()] + ' ' + d.getFullYear();
  }

  // ── markdown-lite → HTML ──
  function esc(s) { return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;'); }
  function inline(s) {
    return s
      .replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>')
      .replace(/(^|[^*])\*([^*]+)\*/g, '$1<em>$2</em>')
      .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2">$1</a>');
  }
  function renderMarkdown(md) {
    var blocks = (md || '').split(/\n\s*\n/);
    var html = '';
    blocks.forEach(function (b) {
      b = b.trim(); if (!b) return;
      if (/^###\s/.test(b)) { html += '<h3>' + inline(esc(b.replace(/^###\s/, ''))) + '</h3>'; return; }
      if (/^##\s/.test(b)) { html += '<h2>' + inline(esc(b.replace(/^##\s/, ''))) + '</h2>'; return; }
      if (/^#\s/.test(b)) { html += '<h2>' + inline(esc(b.replace(/^#\s/, ''))) + '</h2>'; return; }
      if (/^>\s/.test(b)) { html += '<blockquote>' + inline(esc(b.replace(/^>\s?/gm, '').replace(/\n/g, ' '))) + '</blockquote>'; return; }
      if (/^[-*]\s/.test(b)) {
        var items = b.split(/\n/).filter(function (l) { return /^[-*]\s/.test(l); })
          .map(function (l) { return '<li>' + inline(esc(l.replace(/^[-*]\s/, ''))) + '</li>'; }).join('');
        html += '<ul>' + items + '</ul>'; return;
      }
      html += '<p>' + inline(esc(b)).replace(/\n/g, '<br>') + '</p>';
    });
    return html;
  }

  window.BlogStore = {
    getAll: getAll, getPublished: getPublished, get: get, getById: getById,
    save: save, remove: remove, setStatus: setStatus, slugify: slugify,
    exportJSON: exportJSON, importJSON: importJSON, resetToSeed: resetToSeed,
    readingTime: readingTime, fmtDate: fmtDate, renderMarkdown: renderMarkdown,
    seedIfEmpty: seedIfEmpty
  };
})();
