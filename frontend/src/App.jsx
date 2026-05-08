import { useState } from 'react';
import './index.css';

const API_BASE = 'http://localhost:8080/api/automata/evaluate';

const EXERCISES = [
  { 
    id: 1, 
    title: 'IDS - Detección de Ataques (AFND 1)',
    description: 'Se busca detectar un patrón específico de ataque: Un intento de conexión (s), seguido de uno o más respuestas (a), y un reset abrupto (r).',
    alphabet: '{s, a, r}',
    states: '{q0, q1, q2, q3}',
    initial: 'q0',
    final: '{q3}',
    placeholder: 'Ej: saar',
    examples: "Ingresa la secuencia de logs. Ejemplo válido: 'sar', 'saar'."
  },
  { 
    id: 2, 
    title: 'Protocolo de Telemetría IoT (AFND 2)',
    description: 'Un dispositivo IoT envía paquetes de datos. El paquete debe empezar con un encabezado HDR (h), seguido de cualquier cantidad de lecturas TEMP (t) o HUM (m), y finalizar exclusivamente con un código CRC (c).',
    alphabet: '{h, t, m, c}',
    states: '{q0, q1, q2}',
    initial: 'q0',
    final: '{q2}',
    placeholder: 'Ej: httmc',
    examples: "Ingresa la secuencia del protocolo. Ejemplo válido: 'hc', 'httmc', 'htmc'."
  },
  { 
    id: 3, 
    title: 'Reconocimiento de Secuencias Genéticas (AFND 3)',
    description: 'Buscamos identificar un patrón en una cadena de aminoácidos: Una Lysina (k), seguida de una Glicina (g), seguida de cualquier aminoácido (x) repetido 0 o más veces, terminando en Fenilalanina (f).',
    alphabet: '{k, g, f, x}',
    states: '{q0, q1, q2, q3}',
    initial: 'q0',
    final: '{q3}',
    placeholder: 'Ej: kgxf',
    examples: "Ingresa la secuencia de aminoácidos. Ejemplo válido: 'kgf', 'kgxf', 'kggfff'."
  },
];

function App() {
  const [activeExercise, setActiveExercise] = useState(1);
  const [viewMode, setViewMode] = useState('simulator'); 
  const [inputString, setInputString] = useState('');
  const [results, setResults] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleEvaluate = async (e) => {
    e.preventDefault();
    if (!inputString.trim()) return;
    
    setLoading(true);
    setResults(null);
    try {
      const res = await fetch(`${API_BASE}/${activeExercise}?input=${inputString.trim()}`);
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

  const handleExerciseChange = (id) => {
    setActiveExercise(id);
    setResults(null);
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
          <button 
            className={`tab-btn ${viewMode === 'simulator' ? 'active' : ''}`}
            onClick={() => setViewMode('simulator')}
          >
            Simulador
          </button>
          <button 
            className={`tab-btn ${viewMode === 'theory' ? 'active' : ''}`}
            onClick={() => setViewMode('theory')}
          >
            Detalles Teóricos
          </button>
        </div>

        <div className="card-content">
          {viewMode === 'simulator' ? (
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
                  {loading ? 'Evaluando...' : 'Evaluar'}
                </button>
              </form>

              {results && (
                <div className="results-container">
                  <h3 className="results-title">Resultados de Equivalencia</h3>
                  <div className="results-grid">
                    <ResultBox title="AFND Original" isAccepted={results.afndResult} />
                    <ResultBox title="AFD (Subconjuntos)" isAccepted={results.afdResult} />
                    <ResultBox title="AFD Minimizado" isAccepted={results.minimizedAfdResult} />
                  </div>
                  <div className="conclusion-box">
                    <strong>¡Equivalencia Comprobada!</strong> Los tres modelos arrojaron el mismo resultado para esta cadena.
                  </div>
                  
                  {results.minimizedAfdPath && (
                    <div className="path-tracker">
                      <h4 style={{marginBottom: '1rem', color: 'var(--primary)', textAlign: 'left', borderBottom: '1px solid var(--border)', paddingBottom: '0.5rem'}}>
                        Traza de Ejecución (AFD Reducido)
                      </h4>
                      <div className="path-nodes">
                        {results.minimizedAfdPath.map((node, index) => (
                          <div key={index} className="path-step">
                            <span className={`node ${index === results.minimizedAfdPath.length - 1 ? (results.minimizedAfdResult ? 'final-accepted' : 'final-rejected') : ''}`}>
                              {node}
                            </span>
                            {index < results.minimizedAfdPath.length - 1 && <span className="arrow">➔</span>}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          ) : (
            <div className="theory-view">
              <h2>Base Teórica: {currentExercise.title}</h2>
              <p style={{marginBottom: '1rem', color: 'var(--text-muted)'}}>{currentExercise.description}</p>
              
              <div className="theory-scroll-area">
                <section className="theory-section" style={{backgroundColor: '#f8fafc', padding: '1.5rem', borderRadius: '0.5rem', border: '1px solid #e2e8f0'}}>
                  <h3 style={{color: '#1d4ed8'}}>Autómata Finito No Determinista (AFND)</h3>
                  <p><strong>Alfabeto (Σ):</strong> {currentExercise.alphabet}</p>
                  <p><strong>Estados (Q):</strong> {currentExercise.states}</p>
                  <p><strong>Estado Inicial:</strong> {currentExercise.initial} | <strong>Estados de Aceptación (F):</strong> {currentExercise.final}</p>
                  
                  <details style={{marginTop: '1rem', backgroundColor: 'white', padding: '0.5rem 1rem', borderRadius: '0.25rem', border: '1px solid #cbd5e1'}}>
                    <summary style={{cursor: 'pointer', fontWeight: 'bold', color: '#2563eb'}}>Ver Tabla de Transiciones δ(Q, Σ)</summary>
                    <div style={{marginTop: '1rem', padding: '1rem', textAlign: 'center', color: '#64748b'}}>
                      <em>[Aquí se inyectará la tabla de transiciones del documento]</em>
                    </div>
                  </details>
                </section>

                <section className="theory-section" style={{marginTop: '2rem'}}>
                  <h3>Método de Construcción de Subconjuntos</h3>
                  <p style={{color: '#64748b'}}><em>[Aquí irá la tabla de generación de subconjuntos]</em></p>
                </section>
                
                <section className="theory-section" style={{marginTop: '2rem'}}>
                  <h3>AFD Minimizado</h3>
                  <div className="placeholder-image">
                    <em>[Diagrama JFLAP del autómata]</em>
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

function ResultBox({ title, isAccepted }) {
  const statusClass = isAccepted ? 'accepted' : 'rejected';
  return (
    <div className={`result-box ${statusClass}`}>
      <h4>{title}</h4>
      <div className="status-label">
        {isAccepted ? '✓ ACEPTADA' : '✗ RECHAZADA'}
      </div>
    </div>
  );
}

export default App;
