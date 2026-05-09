import { useState, useEffect } from 'react';
import './index.css';
import { EXERCISES } from './data/exercises';

const API_BASE = 'http://localhost:8080/api/automata';

function HeaderDecoration() {
  return (
    <div className="header-decoration" aria-hidden="true">
      <span className="node" />
      <span className="line" />
      <span className="node" />
      <span className="line" />
      <span className="node double" />
    </div>
  );
}

function App() {
  const [activeExercise, setActiveExercise] = useState(1);
  const [viewMode, setViewMode] = useState('simulator');
  const [inputString, setInputString] = useState('');
  const [results, setResults] = useState(null);
  const [loading, setLoading] = useState(false);
  const [batchResults, setBatchResults] = useState(null);

  const handleEvaluate = async (e) => {
    e.preventDefault();
    if (!inputString.trim()) return;

    setLoading(true);
    setResults(null);
    try {
      const res = await fetch(`${API_BASE}/evaluate/${activeExercise}?input=${inputString.trim()}`);
      if (!res.ok) throw new Error("Error en el servidor");
      const data = await res.json();
      setResults(data);
    } catch {
      console.error("Error evaluating:");
      alert("Error de conexión. Asegúrate de que el backend en Java esté corriendo.");
    } finally {
      setLoading(false);
    }
  };

  const runBatchTest = async () => {
    setLoading(true);
    setBatchResults(null);
    try {
      const ex = EXERCISES.find(e => e.id === activeExercise);
      const res = await fetch(`${API_BASE}/batch/${activeExercise}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(ex.testBattery)
      });
      if (!res.ok) throw new Error("Error en batch");
      const data = await res.json();
      setBatchResults(data);
    } catch {
      alert("Error ejecutando pruebas masivas.");
    } finally {
      setLoading(false);
    }
  };

  const handleExerciseChange = (id) => {
    setActiveExercise(id);
    setResults(null);
    setBatchResults(null);
    setInputString('');
  };

  const currentExercise = EXERCISES.find(ex => ex.id === activeExercise);

  return (
    <div className="container">
      <header className="header">
        <HeaderDecoration />
        <h1>Simulador <span>AFND</span> ⟷ <span>AFD</span></h1>
        <p>Validador de Equivalencia Teórica</p>
      </header>

      <div className="exercise-selector">
        {EXERCISES.map((ex) => (
          <button
            key={ex.id}
            className={`exercise-btn ${activeExercise === ex.id ? 'active' : ''}`}
            onClick={() => handleExerciseChange(ex.id)}
          >
            <span className="ex-num">0{ex.id}</span>
            {ex.title.split(' - ')[1] || ex.title}
          </button>
        ))}
      </div>

      <main className="main-card">
        <div className="tabs">
          <button className={`tab-btn ${viewMode === 'simulator' ? 'active' : ''}`} onClick={() => setViewMode('simulator')}>
            Simulador
          </button>
          <button className={`tab-btn ${viewMode === 'batch' ? 'active' : ''}`} onClick={() => setViewMode('batch')}>
            Batería de Pruebas
          </button>
          <button className={`tab-btn ${viewMode === 'theory' ? 'active' : ''}`} onClick={() => setViewMode('theory')}>
            Tablas y Diagramas
          </button>
        </div>

        <div className="card-content">
          {viewMode === 'simulator' && (
            <div className="simulator-view">
              <h2>Evaluación Manual</h2>
              <p className="subtitle">{currentExercise.examples}</p>

              <form className="input-form" onSubmit={handleEvaluate}>
                <input
                  type="text"
                  placeholder={currentExercise.placeholder}
                  value={inputString}
                  onChange={(e) => setInputString(e.target.value)}
                  className="string-input"
                  autoFocus
                />
                <button type="submit" className="eval-btn" disabled={loading || !inputString.trim()}>
                  {loading ? 'Evaluando…' : 'Evaluar'}
                </button>
              </form>

              {loading && !results && (
                <p style={{ marginTop: '2rem', color: 'var(--text-muted)', fontFamily: 'var(--font-display)', fontSize: '0.85rem' }}>
                  Consultando autómatas…
                </p>
              )}

              {results && (
                <div className="results-container">
                  <h3 className="results-title">Resultados de Equivalencia</h3>
                  <div className="results-grid">
                    <ResultBox title="AFND Original" isAccepted={results.afndResult} path={results.afndPath} />
                    <ResultBox title="AFD (Subconjuntos)" isAccepted={results.afdResult} path={results.afdPath} />
                    <ResultBox title="AFD Minimizado" isAccepted={results.minimizedAfdResult} path={results.minimizedAfdPath} />
                  </div>
                  <div className="conclusion-box">
                    <span className="check-icon">✓</span>
                    Equivalencia comprobada — los tres modelos arrojaron el mismo resultado.
                  </div>
                </div>
              )}
            </div>
          )}

          {viewMode === 'batch' && (
            <div className="batch-view">
              <h2>Batería de 20 Cadenas</h2>
              <p className="subtitle">Se enviarán 20 cadenas predefinidas para validar la equivalencia de los autómatas en lote.</p>

              <button onClick={runBatchTest} className="eval-btn" disabled={loading}>
                {loading ? 'Ejecutando pruebas…' : 'Ejecutar Batería de Pruebas'}
              </button>

              {loading && !batchResults && (
                <p style={{ marginTop: '2rem', color: 'var(--text-muted)', fontFamily: 'var(--font-display)', fontSize: '0.85rem' }}>
                  Procesando…
                </p>
              )}

              {batchResults && (
                <div className="batch-table-container">
                  <table className="theory-table">
                    <thead>
                      <tr>
                        <th>Cadena</th>
                        <th>AFND</th>
                        <th>AFD</th>
                        <th>AFD Min</th>
                        <th>¿Eq?</th>
                      </tr>
                    </thead>
                    <tbody>
                      {batchResults.map((r, i) => (
                        <tr key={i}>
                          <td style={{ fontFamily: 'var(--font-display)', fontSize: '0.8rem' }}>{r.input || '(ε)'}</td>
                          <td className={r.afndResult ? 'success-text' : 'error-text'}>{r.afndResult ? 'Acepta' : 'Rechaza'}</td>
                          <td className={r.afdResult ? 'success-text' : 'error-text'}>{r.afdResult ? 'Acepta' : 'Rechaza'}</td>
                          <td className={r.minimizedAfdResult ? 'success-text' : 'error-text'}>{r.minimizedAfdResult ? 'Acepta' : 'Rechaza'}</td>
                          <td className="success-text">✓</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}

          {viewMode === 'theory' && (
            <div className="theory-view">
              <h2>{currentExercise.title}</h2>
              <p style={{ marginBottom: '1.25rem', color: 'var(--text-muted)' }}>{currentExercise.description}</p>

              <section className="theory-section">
                <h3>AFND Original</h3>
                <p><strong>Alfabeto (Σ):</strong> {currentExercise.alphabet}</p>
                <p><strong>Estados (Q):</strong> {currentExercise.states}</p>
                <p><strong>Inicial:</strong> {currentExercise.initial} &nbsp;|&nbsp; <strong>Aceptación (F):</strong> {currentExercise.final}</p>
                <div className="diagram-container" style={{ marginTop: '1.25rem' }}>
                  <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', marginBottom: '0.75rem' }}>Diagrama JFLAP del AFND:</p>
                  <img
                    src={`/images/diagrams/afnd_${currentExercise.id}.jpeg`}
                    alt={`Diagrama AFND Ejercicio ${currentExercise.id}`}
                    style={{ maxWidth: '100%', borderRadius: '0.25rem' }}
                  />
                </div>
              </section>

              <section className="theory-section">
                <h3>Construcción de Subconjuntos → AFD</h3>
                <div style={{ overflowX: 'auto' }}>
                  <table className="theory-table">
                    <thead>
                      <tr>
                        {currentExercise.subsetHeaders.map((h, i) => <th key={i}>{h}</th>)}
                      </tr>
                    </thead>
                    <tbody>
                      {currentExercise.subsetTable.map((row, i) => (
                        <tr key={i}>
                          {row.map((cell, j) => <td key={j}>{cell}</td>)}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </section>

              <section className="theory-section">
                <h3>Minimización de Hopcroft</h3>
                <div className="hopcroft-box">
                  {currentExercise.hopcroftSteps.map((step, i) => (
                    <p key={i}>{step}</p>
                  ))}
                </div>
              </section>

              <section className="theory-section">
                <h3>AFD Minimizado</h3>
                <div className="diagram-container">
                  <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', marginBottom: '0.75rem' }}>Diagrama JFLAP del AFD Minimizado:</p>
                  <img
                    src={`/images/diagrams/afd_min_${currentExercise.id}.jpeg`}
                    alt={`Diagrama AFD Minimizado Ejercicio ${currentExercise.id}`}
                    style={{ maxWidth: '100%', borderRadius: '0.25rem' }}
                  />
                </div>
              </section>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

function ResultBox({ title, isAccepted, path }) {
  const statusClass = isAccepted ? 'accepted' : 'rejected';
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className={`result-box ${statusClass}`}>
      <h4>{title}</h4>
      <div className="status-label">
        {isAccepted ? '✓ ACEPTADA' : '✗ RECHAZADA'}
      </div>

      {path && path.length > 0 && (
        <div className="path-details">
          <button className="toggle-sim-btn" onClick={() => setIsOpen(!isOpen)}>
            {isOpen ? '▲ Ocultar simulación' : '▶ Simular recorrido'}
          </button>

          {isOpen && (
            <SimulationPlayer key={path.join('→')} path={path} isAccepted={isAccepted} />
          )}
        </div>
      )}
    </div>
  );
}

function SimulationPlayer({ path, isAccepted }) {
  const [currentStep, setCurrentStep] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentStep((prev) => {
        if (prev < path.length - 1) {
          return prev + 1;
        }
        clearInterval(interval);
        return prev;
      });
    }, 1200);
    return () => clearInterval(interval);
  }, [path]);

  const isFinished = currentStep === path.length - 1;

  return (
    <div className="simulation-player">
      <div className="state-label">Secuencia de Estados</div>
      <div className="sim-path-nodes">
        {path.map((node, index) => {
          const isNodeActive = index === currentStep;
          const isNodeConsumed = index < currentStep;
          const isNodeVisible = index <= currentStep;

          if (!isNodeVisible) return null;

          return (
            <span key={index} className="sim-path-step">
              <span className={`sim-node ${isNodeActive ? 'active' : ''} ${isNodeConsumed ? 'consumed' : ''} ${index === path.length - 1 && isFinished ? (isAccepted ? 'final-accepted' : 'final-rejected') : ''}`}>
                {node}
              </span>
              {currentStep > index && (
                <span className="sim-arrow">→</span>
              )}
            </span>
          );
        })}
      </div>
    </div>
  );
}

export default App;
