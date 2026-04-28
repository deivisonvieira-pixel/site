// Shared UI primitives
const { useState, useEffect, useRef, useMemo } = React;

function Topbar({ totalDailyLoss, onReset, scene }) {
  return (
    <header className="topbar">
      <div className="brand">
        <div className="logo">E</div>
        <div className="brand-mark">
          <span>Engage <span style={{color:'var(--text-muted)', fontWeight:400}}>· Forecast</span></span>
          <small>Calculadora de Receita Escondida</small>
        </div>
      </div>
      <div className="right">
        {scene === 'results' && totalDailyLoss > 0 && (
          <div className="urg-pill">
            <span className="blink"></span>
            <span>−{fmtBRL(totalDailyLoss)} / dia perdidos</span>
          </div>
        )}
        <button className="btn-link" onClick={onReset}>Reiniciar</button>
      </div>
    </header>
  );
}

function Slider({ value, min = 0, max = 100, step = 1, onChange, suffix = '%' }) {
  const pct = ((value - min) / (max - min)) * 100;
  return (
    <div className="slider-row">
      <div className="slider-wrap">
        <div className="slider-track-bg">
          <div className="slider-fill" style={{ width: pct + '%' }}></div>
        </div>
        <input
          type="range"
          min={min} max={max} step={step}
          value={value}
          onChange={(e) => onChange(parseFloat(e.target.value))}
        />
        <div className="slider-value">
          <span>{min}{suffix}</span>
          <span className="max">{max}{suffix}</span>
        </div>
      </div>
      <div className="slider-display">
        {value}<span className="pct">{suffix}</span>
      </div>
    </div>
  );
}

function NumberField({ value, onChange, placeholder, hint, prefix, step = 1, min = 0, label, badge }) {
  return (
    <div className="field">
      <label>
        <span>{label}</span>
        {badge && <span className="badge">{badge}</span>}
      </label>
      <div className={prefix ? 'field-prefix' : ''}>
        {prefix && <span className="prefix">{prefix}</span>}
        <input
          type="number"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          step={step}
          min={min}
          inputMode="decimal"
        />
      </div>
      {hint && <div className="hint">{hint}</div>}
    </div>
  );
}

function SliderField({ value, onChange, label, badge, hint, min = 0, max = 100 }) {
  return (
    <div className="field">
      <label>
        <span>{label}</span>
        {badge && <span className="badge">{badge}</span>}
      </label>
      <Slider value={value} onChange={onChange} min={min} max={max} />
      {hint && <div className="hint">{hint}</div>}
    </div>
  );
}

function Progress({ step }) {
  return (
    <div className="progress">
      <div className={`step ${step === 1 ? 'active' : 'done'}`}>
        <div className="num">{step === 1 ? <span>1</span> : ''}</div>
        <span>INDICAÇÕES</span>
      </div>
      <div className={`connector ${step >= 2 ? 'done' : ''}`}></div>
      <div className={`step ${step === 2 ? 'active' : ''}`}>
        <div className="num"><span>2</span></div>
        <span>EXPANSÃO</span>
      </div>
    </div>
  );
}

function CurrencyDisplay({ value, big = false, danger = false }) {
  const { sign, main, cents } = splitBRL(value);
  return (
    <span className={`preview-big ${big ? 'big' : ''}`} style={ danger ? { color: 'var(--danger)'} : {} }>
      <span className="currency">{sign}R$</span>{main}
      {big && <span style={{fontSize:'0.4em',opacity:0.5}}>,{cents}</span>}
    </span>
  );
}

Object.assign(window, { Topbar, Slider, NumberField, SliderField, Progress, CurrencyDisplay });
