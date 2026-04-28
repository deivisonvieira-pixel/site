// Step 1 — Indicações
const { useState: useS1, useEffect: useE1, useMemo: useM1 } = React;

function Step1({ data, setData, onBack, onNext }) {
  const update = (k, v) => setData((d) => ({ ...d, [k]: v }));

  const r = useM1(() => {
    const elegivel = n(data.baseClientes) * (n(data.percentualElegivel) / 100);
    const indic = elegivel * n(data.taxaIndicacao);
    const conv = Math.round(indic * (n(data.conversaoIndicados) / 100));
    const rec = conv * n(data.ticketMedioIndicacao);
    return { indic: Math.round(indic), conv, rec };
  }, [data]);

  const valid = n(data.baseClientes) > 0 && n(data.taxaIndicacao) > 0 && n(data.ticketMedioIndicacao) > 0;
  const [bumped, setBumped] = useS1(false);
  useE1(() => { setBumped(true); const t = setTimeout(()=>setBumped(false),300); return ()=>clearTimeout(t); }, [r.rec]);

  // Build live mini-chart
  const barHeights = useM1(() => {
    const max = Math.max(r.rec, 100000);
    return Array.from({length: 12}, (_, i) => {
      const t = (i + 1) / 12;
      return Math.min(100, (r.rec * t / max) * 100 * (0.7 + 0.3 * Math.sin(i)));
    });
  }, [r.rec]);

  return (
    <div className="wizard">
      <div className="wizard-head">
        <Progress step={1} />
      </div>

      <div className="wizard-grid">
        <div>
          <div className="eyebrow"><span className="dot"></span>Etapa 1 de 2 · Indicações</div>
          <div className="wizard-title">
            <h2>Vamos falar da sua <span className="ital">base</span> de clientes.</h2>
            <p className="sub">Você já tem clientes. Eles podem indicar outros — esse é o canal mais barato e eficiente que existe. Vamos calcular quanto isso vale.</p>
          </div>

          <div className="form-stack">
            <NumberField
              label="Base de clientes ativos"
              badge="01"
              value={data.baseClientes}
              onChange={(v) => update('baseClientes', v)}
              placeholder="Ex: 500"
              hint="Clientes pagando ou ativos neste momento."
              min={1}
            />

            <SliderField
              label="% da base que pode indicar"
              badge="02"
              value={data.percentualElegivel}
              onChange={(v) => update('percentualElegivel', v)}
              hint="Pense nos clientes satisfeitos e engajados. Média do mercado: 15–30%."
            />

            <NumberField
              label="Indicações por cliente em 90 dias"
              badge="03"
              value={data.taxaIndicacao}
              onChange={(v) => update('taxaIndicacao', v)}
              placeholder="Ex: 2"
              hint="Seja realista. Média brasileira: 1 a 3 indicações."
              step={0.1}
            />

            <SliderField
              label="% de conversão de indicados"
              badge="04"
              value={data.conversaoIndicados}
              onChange={(v) => update('conversaoIndicados', v)}
              hint="Indicações costumam converter entre 20–30% (vs. 1–3% de tráfego pago)."
            />

            <NumberField
              label="Ticket médio de indicação"
              badge="05"
              value={data.ticketMedioIndicacao}
              onChange={(v) => update('ticketMedioIndicacao', v)}
              placeholder="500"
              prefix="R$"
              hint="Valor que você cobra (recorrente ou não)."
              step={0.01}
            />
          </div>

          <div className="wizard-nav">
            <button className="btn btn-ghost" onClick={onBack}>← Voltar</button>
            <button className="btn btn-primary" onClick={onNext} disabled={!valid}>
              Próximo: Potencial de Expansão <span className="arr">→</span>
            </button>
          </div>
        </div>

        <aside className="preview">
          <div className="preview-head">
            <h4>Projeção Preliminar de Indicações
              <small>ATUALIZA EM TEMPO REAL · 90 DIAS</small>
            </h4>
          </div>

          <div className={`preview-big ${bumped ? 'bump' : ''}`}>
            <span className="currency">R$</span>{Math.round(r.rec).toLocaleString('pt-BR')}
          </div>
          <div className="preview-big-label">RECEITA POTENCIAL EM INDICAÇÕES</div>

          <div className="preview-rows">
            <div className="preview-row">
              <span className="lbl"><span className="arrow">→</span> Indicações qualificadas</span>
              <span className="val">{fmtNum(r.indic)}</span>
            </div>
            <div className="preview-row">
              <span className="lbl"><span className="arrow">→</span> Novos clientes fechados</span>
              <span className="val">{fmtNum(r.conv)}</span>
            </div>
            <div className="preview-row">
              <span className="lbl"><span className="arrow">→</span> Receita potencial</span>
              <span className="val accent">{fmtBRL(r.rec)}</span>
            </div>
          </div>

          <div className="preview-chart">
            <div className="preview-chart-title">
              <span>RECEITA ACUMULADA · 90 DIAS</span>
              <span style={{color:'var(--accent)'}}>●  INDICAÇÕES</span>
            </div>
            <div className="bars-row">
              {barHeights.map((h, i) => (
                <div className="bcol" key={i}>
                  <div className="bar-stack">
                    <div className="bar-seg indic first" style={{height: h + '%'}}></div>
                  </div>
                  <div className="lbl">D{(i+1)*7}</div>
                </div>
              ))}
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}

window.Step1 = Step1;
