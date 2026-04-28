// Landing scene
const { useState: useStateL, useEffect: useEffectL, useRef: useRefL } = React;

function Landing({ onStart }) {
  const [counter, setCounter] = useStateL(2847593);
  const heroBars = [42, 65, 38, 78, 56, 88, 72, 95, 68, 82, 90, 76];

  useEffectL(() => {
    const id = setInterval(() => {
      setCounter((c) => c + Math.round(Math.random() * 47) + 12);
    }, 1500);
    return () => clearInterval(id);
  }, []);

  return (
    <div className="landing-wrap">
      <div className="grid-bg"></div>

      <section className="hero">
        <div className="hero-left">
          <div className="eyebrow"><span className="dot"></span>Diagnóstico de Receita · 3 minutos</div>
          <h1>
            Quanto você está <span className="ital">deixando</span> na <span className="accent">mesa</span>?
          </h1>
          <p className="lead">
            A maioria das empresas B2B deixa <strong style={{color:'var(--text)'}}>30% a 50%</strong> da receita potencial parada na própria base de clientes. Vamos calcular o seu número real — em 90 dias, sem suposições.
          </p>
          <div className="cta-row">
            <button className="btn btn-primary" onClick={onStart}>
              Calcular meu potencial escondido
              <span className="arr">→</span>
            </button>
            <span style={{fontSize:13,color:'var(--text-muted)'}}>~3 minutos · sem cadastro</span>
          </div>
          <div className="meta">
            <div className="avatars">
              <span>CM</span><span>AF</span><span>RS</span>
            </div>
            <span>+200 empresas já descobriram seu potencial escondido</span>
          </div>
        </div>

        <div className="hero-right">
          <div className="live-card">
            <div className="live-card-head">
              <h3>Receita perdida em B2B Brasil<br/><small style={{color:'var(--text-dim)',fontSize:10,fontFamily:'Geist Mono'}}>Estimativa em tempo real · base 200 empresas</small></h3>
              <div className="live-tag"><span className="blink"></span>AO VIVO</div>
            </div>
            <div className="live-counter">
              <span className="currency">R$</span>{counter.toLocaleString('pt-BR')}
            </div>
            <div className="live-counter-label">DESDE QUE VOCÊ ABRIU ESTA PÁGINA</div>
            <div className="live-bars">
              {heroBars.map((h, i) => (
                <div key={i} className="bar" style={{ height: h + '%', animationDelay: (i * 0.05) + 's' }}></div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <div className="divider-headline">
        <div className="line"></div>
        <span>Por que isso importa</span>
        <div className="line"></div>
      </div>

      <section className="insights">
        <div className="insight-card">
          <div className="corner">01 / INDICAÇÕES</div>
          <div className="num"><span className="small">R$</span>500K</div>
          <div className="label">em média de receita escondida em <strong style={{color:'var(--text)',fontWeight:500}}>indicações não exploradas</strong> por base de 500 clientes.</div>
        </div>
        <div className="insight-card">
          <div className="corner">02 / RETORNO</div>
          <div className="num">3-5<span className="small" style={{fontSize:'0.4em',marginLeft:8}}>×</span></div>
          <div className="label">ROI médio ao investir na <strong style={{color:'var(--text)',fontWeight:500}}>base existente</strong> versus aquisição de novos clientes.</div>
        </div>
        <div className="insight-card">
          <div className="corner">03 / TEMPO</div>
          <div className="num">90<span className="small" style={{fontSize:'0.3em',marginLeft:6}}>DIAS</span></div>
          <div className="label">para ver os <strong style={{color:'var(--text)',fontWeight:500}}>primeiros resultados concretos</strong> na sua operação, com método estruturado.</div>
        </div>
      </section>

      <div className="divider-headline" style={{marginTop:80,marginBottom:0}}>
        <div className="line"></div>
        <span>Pronto para começar?</span>
        <div className="line"></div>
      </div>
      <div style={{display:'flex',justifyContent:'center',marginTop:32}}>
        <button className="btn btn-primary" onClick={onStart}>
          Descobrir meu potencial escondido <span className="arr">→</span>
        </button>
      </div>
    </div>
  );
}

window.Landing = Landing;
