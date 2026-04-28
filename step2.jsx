// Step 2 — Expansão
const { useState: useS2, useEffect: useE2, useMemo: useM2 } = React;

function Step2({ data, setData, onBack, onSubmit }) {
  const update = (k, v) => setData((d) => ({ ...d, [k]: v }));

  const r = useM2(() => {
    const pot = n(data.baseClientes) * (n(data.percentualExpansao) / 100);
    const exp = Math.round(pot * (n(data.propensaoExpansao) / 100));
    const rec = exp * n(data.ticketMedioExpansao);
    return { exp, rec, recur: n(data.servicosRecorrentes), quedas: n(data.quedasPrevistas) };
  }, [data]);

  const valid = n(data.ticketMedioExpansao) >= 0 && data.ticketMedioExpansao !== '';
  const [bumped, setBumped] = useS2(false);
  useE2(() => { setBumped(true); const t = setTimeout(()=>setBumped(false),300); return ()=>clearTimeout(t); }, [r.rec]);

  // Stacked bars for chart
  const segments = useM2(() => {
    return Array.from({length: 12}, (_, i) => {
      const t = (i + 1) / 12;
      return {
        expand: r.rec * t,
        recur: r.recur * t,
      };
    });
  }, [r.rec, r.recur]);

  const maxVal = Math.max(...segments.map(s => s.expand + s.recur), 1);

  return (
    <div className="wizard">
      <div className="wizard-head">
        <Progress step={2} />
      </div>

      <div className="wizard-grid">
        <div>
          <div className="eyebrow"><span className="dot"></span>Etapa 2 de 2 · Expansão</div>
          <div className="wizard-title">
            <h2>Agora, o potencial de <span className="ital">crescer</span> com quem já é cliente.</h2>
            <p className="sub">Seus clientes atuais podem comprar mais, fazer upgrade ou contratar novos serviços. Vamos quantificar esse potencial silencioso.</p>
          </div>

          <div className="form-stack">
            <SliderField
              label="% da base com potencial de expansão"
              badge="01"
              value={data.percentualExpansao}
              onChange={(v) => update('percentualExpansao', v)}
              hint="Quem pode comprar mais, fazer upgrade ou contratar novos serviços."
            />

            <SliderField
              label="% que deve expandir em 90 dias"
              badge="02"
              value={data.propensaoExpansao}
              onChange={(v) => update('propensaoExpansao', v)}
              hint="Seja conservador. Pense na capacidade real do seu time de CS/Vendas."
            />

            <NumberField
              label="Ticket médio de expansão"
              badge="03"
              value={data.ticketMedioExpansao}
              onChange={(v) => update('ticketMedioExpansao', v)}
              placeholder="500"
              prefix="R$"
              hint="Valor médio do upgrade, upsell ou cross-sell."
              step={0.01}
            />

            <NumberField
              label="Receita recorrente esperada em 90 dias"
              badge="04"
              value={data.servicosRecorrentes}
              onChange={(v) => update('servicosRecorrentes', v)}
              placeholder="10000"
              prefix="R$"
              hint="Pagamentos recorrentes já garantidos (pode ser zero)."
              step={0.01}
            />

            <NumberField
              label="Quedas previstas"
              badge="05"
              value={data.quedasPrevistas}
              onChange={(v) => update('quedasPrevistas', v)}
              placeholder="0"
              prefix="R$"
              hint="Clientes que devem sair ou reduzir contrato (pode ser zero se não sabe)."
              step={0.01}
            />
          </div>

          <div className="wizard-nav">
            <button className="btn btn-ghost" onClick={onBack}>← Voltar</button>
            <button className="btn btn-primary" onClick={onSubmit} disabled={!valid}>
              ✨ Calcular meu Forecast <span className="arr">→</span>
            </button>
          </div>
        </div>

        <aside className="preview">
          <div className="preview-head">
            <h4>Projeção Preliminar de Expansão
              <small>ATUALIZA EM TEMPO REAL · 90 DIAS</small>
            </h4>
          </div>

          <div className={`preview-big ${bumped ? 'bump' : ''}`}>
            <span className="currency">R$</span>{Math.round(r.rec).toLocaleString('pt-BR')}
          </div>
          <div className="preview-big-label">RECEITA POTENCIAL EM EXPANSÕES</div>

          <div className="preview-rows">
            <div className="preview-row">
              <span className="lbl"><span className="arrow">→</span> Expansões concretizadas</span>
              <span className="val">{fmtNum(r.exp)}</span>
            </div>
            <div className="preview-row">
              <span className="lbl"><span className="arrow">→</span> Receita nova de expansão</span>
              <span className="val accent">{fmtBRL(r.rec)}</span>
            </div>
            <div className="preview-row">
              <span className="lbl"><span className="arrow">→</span> Receita recorrente confirmada</span>
              <span className="val">{fmtBRL(r.recur)}</span>
            </div>
            <div className="preview-row">
              <span className="lbl"><span className="arrow" style={{color:'var(--danger)'}}>→</span> Perda prevista</span>
              <span className="val danger">−{fmtBRL(r.quedas)}</span>
            </div>
          </div>

          <div className="preview-chart">
            <div className="preview-chart-title">
              <span>RECEITA ACUMULADA · 90 DIAS</span>
              <span>
                <span style={{color:'#b89dff'}}>● EXPANSÃO</span>
                <span style={{marginLeft:8,color:'var(--accent-light)'}}>● RECORRENTE</span>
              </span>
            </div>
            <div className="bars-row">
              {segments.map((s, i) => {
                const expH = (s.expand / maxVal) * 100;
                const recH = (s.recur / maxVal) * 100;
                return (
                  <div className="bcol" key={i}>
                    <div className="bar-stack">
                      <div className="bar-seg expand" style={{height: expH + '%'}}></div>
                      <div className="bar-seg recur first" style={{height: recH + '%'}}></div>
                    </div>
                    <div className="lbl">D{(i+1)*7}</div>
                  </div>
                );
              })}
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}

window.Step2 = Step2;
