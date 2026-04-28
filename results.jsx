// Results scene
const { useState: useSR, useEffect: useER, useMemo: useMR, useRef: useRefR } = React;

function useCountUp(target, duration = 1800, deps = []) {
  const [val, setVal] = useSR(0);
  useER(() => {
    let start = null;
    let raf;
    const from = 0;
    const step = (t) => {
      if (start === null) start = t;
      const p = Math.min(1, (t - start) / duration);
      const eased = 1 - Math.pow(1 - p, 3);
      setVal(from + (target - from) * eased);
      if (p < 1) raf = requestAnimationFrame(step);
    };
    raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf);
  }, deps);
  return val;
}

function Results({ data, onReset }) {
  const r = useMR(() => calc(data), [data]);
  const animTotal = useCountUp(r.total, 1800, [r.total]);
  const empresa = data.empresa || 'Sua Empresa';
  const nomePrimeiro = (data.nome || '').split(' ')[0] || '';

  // Daily live counter
  const [perdidoHoje, setPerdidoHoje] = useSR(0);
  useER(() => {
    const start = Date.now();
    const id = setInterval(() => {
      const elapsedSec = (Date.now() - start) / 1000;
      const perDay = r.diario;
      const perSec = perDay / 86400;
      setPerdidoHoje(perSec * elapsedSec);
    }, 80);
    return () => clearInterval(id);
  }, [r.diario]);

  // Bar chart segments
  const segs = [
    { key: 'indic', val: r.receitaIndicacoes, label: 'Indicações', cls: 'indic' },
    { key: 'expand', val: r.receitaExpansoes, label: 'Expansões', cls: 'expand' },
    { key: 'recur', val: r.recorrente, label: 'Recorrente', cls: 'recur' },
  ];
  const positiveTotal = segs.reduce((s, x) => s + x.val, 0);

  const handleAgendar = () => {
    window.open('https://useengage.com.br/contato', '_blank');
  };

  const totalSplit = splitBRL(animTotal);

  return (
    <div className="results-wrap">
      <div className="grid-bg"></div>

      <header className="results-head">
        <div className="company-tag">
          <span style={{width:6,height:6,borderRadius:'50%',background:'var(--accent)'}}></span>
          {empresa.toUpperCase()} · DIAGNÓSTICO 90 DIAS
        </div>
        <h1>
          {nomePrimeiro && <>{nomePrimeiro}, seu </>}
          {!nomePrimeiro && <>Seu </>}
          potencial de receita <span className="ital">escondido</span>.
        </h1>
        <p className="sub">
          Preparamos uma análise personalizada com base nos seus números. Esses são os <strong style={{color:'var(--text)'}}>R$ que estão parados</strong> na sua base hoje.
        </p>
      </header>

      <section className="hero-number">
        <div className="hero-number-inner">
          <div className="label">▲ RECEITA TOTAL POTENCIAL · 90 DIAS</div>
          <div className="total">
            <span className="currency">R$</span>{totalSplit.main}<span className="cents">,{totalSplit.cents}</span>
          </div>
          <p className="msg">
            Esse é o dinheiro que está <span className="ital">escondido</span> na sua base hoje. Você está deixando isso na mesa <strong>todos os trimestres</strong> — e cada dia que passa sem ação é receita que não volta.
          </p>
        </div>
      </section>

      <section className="urg-banner">
        <div>
          <div className="lbl">▲ PERDIDO DESDE QUE ABRIU ESTA PÁGINA</div>
          <div className="val">
            <span className="currency">−R$ </span>{perdidoHoje.toLocaleString('pt-BR', {minimumFractionDigits: 2, maximumFractionDigits: 2})}
          </div>
        </div>
        <div className="right-text">
          A cada dia sem agir, sua empresa deixa <strong>{fmtBRL(r.diario)}</strong> na mesa. <br/>São <strong>{fmtBRL(r.diario * 30)}</strong> por mês de receita potencial não capturada.
        </div>
      </section>

      <section className="metrics-grid">
        <div className="metric-card accent">
          <div className="head">
            <span className="tag">01 / INDICAÇÕES</span>
            <div className="icon">↗</div>
          </div>
          <div className="val"><span className="currency">R$</span>{fmtNum(r.receitaIndicacoes)}</div>
          <div className="name">Receita por Indicações</div>
          <div className="detail">{fmtNum(r.conversoes)} novos clientes</div>
        </div>

        <div className="metric-card accent">
          <div className="head">
            <span className="tag">02 / EXPANSÕES</span>
            <div className="icon">⤴</div>
          </div>
          <div className="val"><span className="currency">R$</span>{fmtNum(r.receitaExpansoes)}</div>
          <div className="name">Receita por Expansões</div>
          <div className="detail">{fmtNum(r.expansoes)} expansões previstas</div>
        </div>

        <div className="metric-card">
          <div className="head">
            <span className="tag">03 / RECORRENTE</span>
            <div className="icon">↻</div>
          </div>
          <div className="val"><span className="currency">R$</span>{fmtNum(r.recorrente)}</div>
          <div className="name">Receita Recorrente</div>
          <div className="detail">Já garantida nos próximos 90 dias</div>
        </div>

        <div className="metric-card danger">
          <div className="head">
            <span className="tag">04 / RISCO</span>
            <div className="icon">↘</div>
          </div>
          <div className="val"><span className="currency">R$</span>{fmtNum(r.quedas)}</div>
          <div className="name">Quedas Previstas</div>
          <div className="detail">Precisa atenção urgente</div>
        </div>
      </section>

      <section className="breakdown">
        <div className="breakdown-head">
          <div>
            <h3>Composição da receita potencial</h3>
            <div style={{fontSize:13,color:'var(--text-muted)'}}>Quebra por canal de receita · próximos 90 dias</div>
          </div>
          <div className="legend">
            <div className="legend-item"><span className="swatch" style={{background:'var(--accent)'}}></span> Indicações</div>
            <div className="legend-item"><span className="swatch" style={{background:'#b89dff'}}></span> Expansões</div>
            <div className="legend-item"><span className="swatch" style={{background:'var(--accent-light)'}}></span> Recorrente</div>
            <div className="legend-item"><span className="swatch" style={{background:'var(--danger)'}}></span> Quedas</div>
          </div>
        </div>

        <div className="bar-chart">
          {segs.map(s => s.val > 0 && (
            <div key={s.key} className={`seg ${s.cls}`} style={{flex: s.val}}>
              {((s.val / Math.max(positiveTotal, 1)) * 100) > 6 ? `${fmtBRL(s.val)}` : ''}
            </div>
          ))}
        </div>
        {r.quedas > 0 && (
          <div style={{display:'flex', marginTop: 8}}>
            <div style={{
              flex: r.quedas, background: 'rgba(255,107,92,0.15)',
              border: '1px dashed rgba(255,107,92,0.4)', color: 'var(--danger)',
              padding: '8px 14px', borderRadius: 8, fontSize: 12, fontFamily: 'Geist Mono', maxWidth: '50%'
            }}>
              ↘ −{fmtBRL(r.quedas)} de perda prevista
            </div>
          </div>
        )}

        <div style={{marginTop:24, paddingTop:24, borderTop:'1px dashed var(--border)', display:'flex', justifyContent:'space-between', alignItems:'baseline', flexWrap:'wrap', gap: 16}}>
          <span style={{fontFamily:'Geist Mono', fontSize:11, letterSpacing:'0.1em', color:'var(--text-muted)', textTransform:'uppercase'}}>RECEITA TOTAL LÍQUIDA</span>
          <span style={{fontFamily:'Instrument Serif', fontSize:36, color:'var(--accent)', letterSpacing:'-0.02em'}}>
            {fmtBRL(r.total)}
          </span>
        </div>
      </section>

      <section className="interpretation">
        Em 90 dias, sua base de <strong>{fmtNum(n(data.baseClientes))} clientes</strong> pode gerar aproximadamente <strong>{fmtBRL(r.receitaIndicacoes)}</strong> em indicações, <strong>{fmtBRL(r.receitaExpansoes)}</strong> em expansões e <strong>{fmtBRL(r.recorrente)}</strong> em receita recorrente, com quedas previstas de <span className="danger">{fmtBRL(r.quedas)}</span>. Isso leva a uma <strong>receita total estimada de {fmtBRL(r.total)}</strong> no período.
      </section>

      <section className="cta-grid">
        <div className="cta-card">
          <div className="icon">✦</div>
          <h4>Quer uma análise estratégica personalizada?</h4>
          <p>Receba recomendações específicas baseadas nos seus números para maximizar receita e minimizar riscos com IA.</p>
          <button className="btn btn-ghost" onClick={() => alert('🤖 Análise com IA chegando em breve! Em breve você receberá recomendações personalizadas baseadas nos seus números.')}>
            Gerar análise com IA <span className="arr">→</span>
          </button>
        </div>
        <div className="cta-card">
          <div className="icon">⬇</div>
          <h4>Baixe seu relatório completo em PDF</h4>
          <p>Inclui todos os números, gráficos e insights. Perfeito para apresentar para sócios ou equipe.</p>
          <button className="btn btn-ghost" onClick={() => alert('📄 Download de PDF chegando em breve! Em breve você poderá baixar seu relatório completo.')}>
            Download Relatório PDF <span className="arr">→</span>
          </button>
        </div>
      </section>

      <section className="cta-final">
        <div className="cta-final-inner">
          <div style={{fontFamily:'Geist Mono', fontSize:11, letterSpacing:'0.16em', textTransform:'uppercase', marginBottom:16, opacity:0.7}}>
            ▲ Próximo passo
          </div>
          <h3>E agora? Como transformar <span className="ital">{fmtBRL(r.total)}</span> em receita real?</h3>
          <p>
            Nossa metodologia <strong>Engage</strong> implementa estratégia, tecnologia e processos para sua empresa capturar essa receita escondida em <strong>90 dias</strong>. <br/>
            Em uma call de 30 minutos, mostramos o caminho exato para sua base virar motor de crescimento previsível.
          </p>
          <button className="btn btn-primary" onClick={handleAgendar}>
            Agendar diagnóstico gratuito da minha base <span className="arr">→</span>
          </button>
          <div className="meta">
            <span style={{display:'inline-flex', gap:4}}>★★★★★</span>
            <span>+200 empresas transformaram bases em motores de receita</span>
          </div>
        </div>
      </section>

      <div className="results-bottom">
        <button className="btn-link" onClick={onReset}>
          ← Fazer nova calculação
        </button>
      </div>
    </div>
  );
}

window.Results = Results;
