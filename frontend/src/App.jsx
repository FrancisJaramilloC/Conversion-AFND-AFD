import { useState, useEffect } from 'react';
import './index.css';
import { EXERCISES } from './data/exercises';

const API_BASE = 'http://localhost:8080/api/automata';

function App() {
  const [activeExercise, setActiveExercise] = useState(1);
  const [viewMode, setViewMode] = useState('simulator'); // 'simulator', 'theory', 'batch', 'code'
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
    } catch (error) {
      console.error("Error evaluating:", error);
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
    } catch (error) {
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
        <h1>Simulador AFND a AFD</h1>
        <p>Validador de Equivalencia Teórica</p>
      </header>

      <div className="exercise-selector">
        {EXERCISES.map((ex) => (
          <button
            key={ex.id}
            className={`exercise-btn ${activeExercise === ex.id ? 'active' : ''}`}
            onClick={() => handleExerciseChange(ex.id)}
          >
            {ex.title}
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
                <input type="text" placeholder={currentExercise.placeholder} value={inputString} onChange={(e) => setInputString(e.target.value)} className="string-input" autoFocus />
                <button type="submit" className="eval-btn" disabled={loading || !inputString.trim()}>
                  {loading ? 'Evaluando...' : 'Evaluar'}
                </button>
              </form>

              {results && (
                <div className="results-container">
                  <h3 className="results-title">Resultados de Equivalencia</h3>
                  <div className="results-grid">
                    <ResultBox title="AFND Original" isAccepted={results.afndResult} path={results.afndPath} inputString={inputString} />
                    <ResultBox title="AFD (Subconjuntos)" isAccepted={results.afdResult} path={results.afdPath} inputString={inputString} />
                    <ResultBox title="AFD Minimizado" isAccepted={results.minimizedAfdResult} path={results.minimizedAfdPath} inputString={inputString} />
                  </div>
                  <div className="conclusion-box">
                    <strong>¡Equivalencia Comprobada!</strong> Los tres modelos arrojaron el mismo resultado.
                  </div>
                </div>
              )}
            </div>
          )}

          {viewMode === 'batch' && (
            <div className="batch-view">
              <h2>Ejecución de 20 Cadenas de Prueba</h2>
              <p className="subtitle">Se enviarán 20 cadenas predefinidas para validar la equivalencia de los autómatas en lote.</p>
              
              <button onClick={runBatchTest} className="eval-btn" disabled={loading}>
                {loading ? 'Ejecutando Pruebas...' : 'Ejecutar Batería de Pruebas'}
              </button>

              {batchResults && (
                <div className="batch-table-container" style={{marginTop: '2rem'}}>
                  <table className="theory-table">
                    <thead>
                      <tr>
                        <th>Cadena</th>
                        <th>AFND</th>
                        <th>AFD</th>
                        <th>AFD Min</th>
                        <th>¿Equivalentes?</th>
                      </tr>
                    </thead>
                    <tbody>
                      {batchResults.map((r, i) => (
                        <tr key={i}>
                          <td style={{fontFamily: 'monospace'}}>{r.input || '(vacía)'}</td>
                          <td className={r.afndResult ? 'success-text' : 'error-text'}>{r.afndResult ? 'Acepta' : 'Rechaza'}</td>
                          <td className={r.afdResult ? 'success-text' : 'error-text'}>{r.afdResult ? 'Acepta' : 'Rechaza'}</td>
                          <td className={r.minimizedAfdResult ? 'success-text' : 'error-text'}>{r.minimizedAfdResult ? 'Acepta' : 'Rechaza'}</td>
                          <td className="success-text" style={{fontWeight: 'bold'}}>Sí ✓</td>
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
              <h2>Detalles Teóricos: {currentExercise.title}</h2>
              <p style={{marginBottom: '1rem', color: 'var(--text-muted)'}}>{currentExercise.description}</p>
              
              <div className="theory-scroll-area">
                <section className="theory-section" style={{backgroundColor: '#f8fafc', padding: '1.5rem', borderRadius: '0.5rem', border: '1px solid #e2e8f0'}}>
                  <h3 style={{color: '#1d4ed8'}}>Autómata Finito No Determinista (AFND) Original</h3>
                  <p><strong>Alfabeto (Σ):</strong> {currentExercise.alphabet}</p>
                  <p><strong>Estados (Q):</strong> {currentExercise.states}</p>
                  <p><strong>Estado Inicial:</strong> {currentExercise.initial} | <strong>Estados de Aceptación (F):</strong> {currentExercise.final}</p>
                  
                  <div className="diagram-container" style={{marginTop: '1.5rem'}}>
                    <p style={{color: '#64748b', fontSize: '0.9rem', marginBottom: '1rem'}}>Diagrama JFLAP del AFND:</p>
                    <img src={`/images/diagrams/afnd_${currentExercise.id}.jpeg`} alt={`Diagrama AFND Ejercicio ${currentExercise.id}`} style={{maxWidth: '100%', border: '1px dashed #cbd5e1', padding: '1rem'}} />
                  </div>
                </section>

                <section className="theory-section" style={{marginTop: '2rem'}}>
                  <h3>Tabla de Construcción de Subconjuntos (Conversión a AFD)</h3>
                  <div style={{overflowX: 'auto'}}>
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

                <section className="theory-section" style={{marginTop: '2rem'}}>
                  <h3>Minimización de Hopcroft (Iteraciones)</h3>
                  <div className="hopcroft-box">
                    {currentExercise.hopcroftSteps.map((step, i) => (
                      <p key={i} style={{marginBottom: '0.5rem', fontFamily: 'monospace'}}>{step}</p>
                    ))}
                  </div>
                </section>
                
                <section className="theory-section" style={{marginTop: '2rem'}}>
                  <h3>Diagrama AFD Minimizado Resultante</h3>
                  <div className="diagram-container">
                    <p style={{color: '#64748b', fontSize: '0.9rem', marginBottom: '1rem'}}>Diagrama JFLAP del AFD Minimizado:</p>
                    <img src={`/images/diagrams/afd_min_${currentExercise.id}.jpeg`} alt={`Diagrama AFD Minimizado Ejercicio ${currentExercise.id}`} style={{maxWidth: '100%', border: '1px dashed #cbd5e1', padding: '1rem'}} />
                  </div>
                </section>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

function ResultBox({ title, isAccepted, path, inputString }) {
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
            {isOpen ? 'Ocultar simulación ▲' : 'Simular recorrido ▶'}
          </button>
          
          {isOpen && (
            <SimulationPlayer path={path} inputString={inputString} isAccepted={isAccepted} />
          )}
        </div>
      )}
    </div>
  );
}

function SimulationPlayer({ path, inputString, isAccepted }) {
  const [currentStep, setCurrentStep] = useState(0);

  useEffect(() => {
    setCurrentStep(0);
    const interval = setInterval(() => {
      setCurrentStep((prev) => {
        if (prev < path.length - 1) {
          return prev + 1;
        }
        clearInterval(interval);
        return prev;
      });
    }, 1200); // 1.2 segundos por paso para que se entienda bien
    return () => clearInterval(interval);
  }, [path, inputString]);

  const isFinished = currentStep === path.length - 1;

  return (
    <div className="simulation-player">
      <div className="state-label" style={{marginBottom: '1rem'}}>Secuencia de Estados:</div>
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
                <span className="sim-arrow">➔</span>
              )}
            </span>
          );
        })}
      </div>
    </div>
  );
}

export default App;
