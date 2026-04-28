// Modal de identificação
const { useState: useSM, useEffect: useEM, useRef: useRefM } = React;

function IdentifyModal({ open, onClose, onSubmit, onSkip, data, setData }) {
  const update = (k, v) => setData((d) => ({ ...d, [k]: v }));
  const [emailErr, setEmailErr] = useSM('');
  const [tried, setTried] = useSM(false);
  const firstRef = useRefM(null);

  useEM(() => {
    if (open) {
      document.body.style.overflow = 'hidden';
      setTimeout(() => firstRef.current && firstRef.current.focus(), 350);
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [open]);

  const validateEmail = (val) => {
    if (!val) return '';
    if (!isCorporateEmail(val)) return 'Por favor, use um e-mail corporativo válido.';
    return '';
  };

  const onEmailChange = (v) => {
    update('email', v);
    if (tried) setEmailErr(validateEmail(v));
  };

  const valid =
    (data.nome || '').trim().length >= 3 &&
    isCorporateEmail(data.email || '') &&
    (data.empresa || '').trim().length >= 2 &&
    !!data.tamanho;

  const handleSubmit = () => {
    setTried(true);
    setEmailErr(validateEmail(data.email));
    if (valid) onSubmit();
  };

  return (
    <div className={`modal-overlay ${open ? 'open' : ''}`} role="dialog" aria-modal="true">
      <div className="modal">
        <div className="modal-emoji">🎉</div>
        <h3>Quase lá! Para onde enviamos seus <span className="ital">resultados</span>?</h3>
        <p className="sub">Preencha seus dados para receber o relatório completo com a análise do seu potencial de receita escondida.</p>

        <div className="form-stack">
          <div className="field">
            <label><span>Nome completo</span><span className="badge">01</span></label>
            <input
              ref={firstRef}
              type="text"
              value={data.nome || ''}
              onChange={(e) => update('nome', e.target.value)}
              placeholder="Seu nome completo"
              className={tried && (data.nome || '').trim().length < 3 ? 'invalid' : ''}
            />
          </div>

          <div className="field">
            <label><span>E-mail corporativo</span><span className="badge">02</span></label>
            <input
              type="email"
              value={data.email || ''}
              onChange={(e) => onEmailChange(e.target.value)}
              placeholder="seu.email@empresa.com.br"
              className={emailErr ? 'invalid' : ''}
            />
            <div className="hint" style={emailErr ? {color:'var(--danger)'} : {}}>
              {emailErr || 'Use o e-mail da empresa (não aceitamos Gmail, Hotmail, etc.)'}
            </div>
          </div>

          <div className="field">
            <label><span>Nome da empresa</span><span className="badge">03</span></label>
            <input
              type="text"
              value={data.empresa || ''}
              onChange={(e) => update('empresa', e.target.value)}
              placeholder="Nome da sua empresa"
              className={tried && (data.empresa || '').trim().length < 2 ? 'invalid' : ''}
            />
          </div>

          <div className="field">
            <label><span>Tamanho da empresa</span><span className="badge">04</span></label>
            <select
              value={data.tamanho || ''}
              onChange={(e) => update('tamanho', e.target.value)}
              className={tried && !data.tamanho ? 'invalid' : ''}
            >
              <option value="">Selecione o tamanho da empresa…</option>
              <option value="ate-10">Até 10 funcionários</option>
              <option value="11-50">11 a 50 funcionários</option>
              <option value="51-200">51 a 200 funcionários</option>
              <option value="201-500">201 a 500 funcionários</option>
              <option value="500+">Mais de 500 funcionários</option>
            </select>
          </div>
        </div>

        <div className="modal-actions">
          <button className="btn btn-primary" onClick={handleSubmit}>
            Ver meus resultados <span className="arr">→</span>
          </button>
          <button className="btn-link" onClick={onSkip}>
            Prefiro não informar agora
          </button>
        </div>

        <div className="modal-privacy">
          🔒 Seus dados estão seguros. Não compartilhamos com terceiros.
        </div>
      </div>
    </div>
  );
}

window.IdentifyModal = IdentifyModal;
