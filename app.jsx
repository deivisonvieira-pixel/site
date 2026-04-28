// Main app
const { useState: useSA, useEffect: useEA } = React;

function App() {
  const [scene, setScene] = useSA('landing'); // landing | step1 | step2 | results
  const [data, setData] = useSA(loadData);
  const [modalOpen, setModalOpen] = useSA(false);

  // Persist on every change
  useEA(() => { saveData(data); }, [data]);

  const handleStart = () => {
    clearData();
    setData({ ...DEFAULT_DATA });
    setScene('step1');
    window.scrollTo(0, 0);
  };

  const handleBack1 = () => {
    if (window.confirm('Tem certeza que deseja voltar? Os dados preenchidos serão perdidos.')) {
      setScene('landing');
      window.scrollTo(0, 0);
    }
  };

  const handleNext1 = () => {
    saveData(data);
    setScene('step2');
    window.scrollTo(0, 0);
  };

  const handleBack2 = () => {
    setScene('step1');
    window.scrollTo(0, 0);
  };

  const handleSubmitStep2 = () => {
    saveData(data);
    setModalOpen(true);
  };

  const handleModalSubmit = () => {
    saveData(data);
    setModalOpen(false);
    setScene('results');
    window.scrollTo(0, 0);
  };

  const handleModalSkip = () => {
    const updated = { ...data, nome: data.nome || 'Anônimo', empresa: data.empresa || '' };
    setData(updated);
    saveData(updated);
    setModalOpen(false);
    setScene('results');
    window.scrollTo(0, 0);
  };

  const handleReset = () => {
    if (window.confirm('Tem certeza? Isso vai limpar todos os dados.')) {
      clearData();
      setData({ ...DEFAULT_DATA });
      setScene('landing');
      window.scrollTo(0, 0);
    }
  };

  const totalCalc = calc(data);

  return (
    <div className="app">
      <Topbar
        scene={scene}
        totalDailyLoss={totalCalc.diario}
        onReset={handleReset}
      />

      <main className="stage" data-screen-label={`Cena ${scene}`}>
        <section
          className={`scene ${scene === 'landing' ? 'active' : ''}`}
          data-screen-label="01 Landing"
        >
          {scene === 'landing' && <Landing onStart={handleStart} />}
        </section>

        <section
          className={`scene ${scene === 'step1' ? 'active' : ''}`}
          data-screen-label="02 Passo 1 Indicações"
        >
          {scene === 'step1' && (
            <Step1 data={data} setData={setData} onBack={handleBack1} onNext={handleNext1} />
          )}
        </section>

        <section
          className={`scene ${scene === 'step2' ? 'active' : ''}`}
          data-screen-label="03 Passo 2 Expansão"
        >
          {scene === 'step2' && (
            <Step2 data={data} setData={setData} onBack={handleBack2} onSubmit={handleSubmitStep2} />
          )}
        </section>

        <section
          className={`scene ${scene === 'results' ? 'active' : ''}`}
          data-screen-label="04 Resultados"
        >
          {scene === 'results' && (
            <Results data={data} onReset={handleReset} />
          )}
        </section>
      </main>

      <footer className="footer">
        <span>© 2026 ENGAGE · CALCULADORA DE FORECAST</span>
        <span>FEITO COM OBSESSÃO EM LTV 🧲</span>
      </footer>

      <IdentifyModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        onSubmit={handleModalSubmit}
        onSkip={handleModalSkip}
        data={data}
        setData={setData}
      />
    </div>
  );
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<App />);
