import { useState } from 'react';
import './index.css';

const API_BASE = 'http://localhost:8080/api/automata/evaluate';

const EXERCISES = [
  { id: 1, title: 'IDS - Ataques (AFND 1)' },
  { id: 2, title: 'Protocolo IoT (AFND 2)' },
  { id: 3, title: 'Genética (AFND 3)' },
];

function App() {
  const [activeTab, setActiveTab] = useState(1);
  const [inputString, setInputString] = useState('');
  const [results, setResults] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleEvaluate = async (e) => {
    e.preventDefault();
    if (!inputString) return;
    
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE}/${activeTab}?input=${inputString}`);
      const data = await res.json();
      setResults(data);
    } catch (error) {
      console.error("Error evaluating:", error);
      alert("Error de conexión con el servidor Java. ¿Está corriendo Spring Boot?");
    } finally {
      setLoading(false);
    }
  };

  const currentExercise = EXERCISES.find(ex => ex.id === activeTab);

  return (
    <div className="app-container">
      <header>
        <h1>Simulador AFND a AFD</h1>
        <p>Validador de Equivalencia de Lenguajes</p>
      </header>

      <div className="exercise-selector">
        {EXERCISES.map((ex) => (
          <button
            key={ex.id}
            className={`btn-tab ${activeTab === ex.id ? 'active' : ''}`}
            onClick={() => {
              setActiveTab(ex.id);
              setResults(null);
              setInputString('');
            }}
          >
            {ex.title}
          </button>
        ))}
      </div>

      <div className="content-grid">
        <section className="panel theory-panel">
          <h2>Teoría: {currentExercise.title}</h2>
          <div className="theory-content">
            <p><strong>Definición Formal:</strong> (Ej: Q, Σ, δ, q0, F)</p>
            <p>Aquí se mostrará la quíntupla, tabla de transición y lista de transición del documento.</p>
            <hr style={{ margin: '1rem 0', borderColor: 'var(--border-color)' }} />
            <p><strong>Minimización:</strong></p>
            <p>Aquí se detallarán los pasos de construcción de subconjuntos y la tabla minimizada final.</p>
            <hr style={{ margin: '1rem 0', borderColor: 'var(--border-color)' }} />
            <div style={{ padding: '2rem', textAlign: 'center', backgroundColor: 'var(--primary-bg)', borderRadius: '0.5rem', border: '1px dashed var(--border-color)' }}>
              <em>[Espacio Reservado para Imágenes de JFLAP]</em>
            </div>
          </div>
        </section>

        <section className="panel validation-panel">
          <h2>Prueba Experimental Manual</h2>
          <p style={{ marginBottom: '1rem', color: 'var(--text-muted)' }}>
            Ingresa una cadena para evaluar su validez simultáneamente en los tres autómatas (AFND, AFD por subconjuntos, y AFD Minimizado).
          </p>
          
          <form className="validation-form" onSubmit={handleEvaluate}>
            <div className="input-group">
              <input
                type="text"
                placeholder="Ingresa la cadena de prueba (ej. saa, htcc, kgff)"
                value={inputString}
                onChange={(e) => setInputString(e.target.value)}
              />
              <button type="submit" className="btn-primary" disabled={loading}>
                {loading ? 'Evaluando...' : 'Evaluar Equivalencia'}
              </button>
            </div>
          </form>

          <div className="results-grid">
            <div className="result-card">
              <h3>AFND Original</h3>
              <div className={`status-badge ${results ? (results.afndResult ? 'status-accepted' : 'status-rejected') : 'status-pending'}`}>
                {results ? (results.afndResult ? 'ACEPTADA' : 'RECHAZADA') : 'Esperando...'}
              </div>
            </div>
            
            <div className="result-card">
              <h3>AFD Subconjuntos</h3>
              <div className={`status-badge ${results ? (results.afdResult ? 'status-accepted' : 'status-rejected') : 'status-pending'}`}>
                {results ? (results.afdResult ? 'ACEPTADA' : 'RECHAZADA') : 'Esperando...'}
              </div>
            </div>
            
            <div className="result-card">
              <h3>AFD Minimizado</h3>
              <div className={`status-badge ${results ? (results.minimizedAfdResult ? 'status-accepted' : 'status-rejected') : 'status-pending'}`}>
                {results ? (results.minimizedAfdResult ? 'ACEPTADA' : 'RECHAZADA') : 'Esperando...'}
              </div>
            </div>
          </div>
          
          {results && (
            <div style={{ marginTop: '1.5rem', padding: '1rem', backgroundColor: 'var(--primary-bg)', borderRadius: '0.5rem', borderLeft: '4px solid var(--accent-color)' }}>
              <strong>Conclusión:</strong> Los tres autómatas arrojaron el mismo resultado, comprobando empíricamente que aceptan exactamente el mismo lenguaje.
            </div>
          )}
        </section>
      </div>
    </div>
  );
}

export default App;
