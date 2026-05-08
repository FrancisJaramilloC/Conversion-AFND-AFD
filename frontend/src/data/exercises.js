export const EXERCISES = [
  { 
    id: 1, 
    title: 'IDS - Detección de Ataques',
    description: 'Se busca detectar un patrón específico de ataque: Un intento de conexión (s), seguido de uno o más respuestas (a), y un reset abrupto (r).',
    alphabet: '{s, a, r}',
    states: '{q0, q1, q2, q3}',
    initial: 'q0',
    final: '{q3}',
    placeholder: 'Ej: saar',
    examples: "Ingresa la secuencia de logs. Ejemplo válido: 'sar', 'saar'.",
    subsetHeaders: ['Estado AFD', 'AFND Original', 's', 'a', 'r'],
    subsetTable: [
      ['S0', '{q0}', '{q1}', '∅', '∅'],
      ['S1', '{q1}', '∅', '{q1,q2}', '∅'],
      ['S2', '{q1,q2}', '∅', '{q1,q2}', '{q3}'],
      ['S3 (Final)', '{q3}', '∅', '∅', '∅']
    ],
    hopcroftSteps: [
      "1. Partición inicial: P0 = { {S0, S1, S2}, {S3} }",
      "2. Evaluando transición con 'r': S2 va a S3, pero S0 y S1 van a ∅.",
      "3. Nueva partición: P1 = { {S0, S1}, {S2}, {S3} }",
      "4. Evaluando transición con 'a': S1 va a S2, pero S0 va a ∅.",
      "5. Partición final: P2 = { {S0}, {S1}, {S2}, {S3} }",
      "Conclusión: Todos los estados son distinguibles. El AFD ya es mínimo."
    ],
    mermaidCode: `
      stateDiagram-v2
        direction LR
        [*] --> M0
        M0 --> M1 : s
        M1 --> M2 : a
        M2 --> M2 : a
        M2 --> M3 : r
        M3 --> [*]
    `,
    testBattery: ['sar', 'saar', 'saaar', 's', 'a', 'r', 'sr', 'ssr', 'saarr', 'ssar', 'asaar', 'sars', 'sa', 'saa', 'sara', 'saara', 'saarm', 's_a_r', 'sarar', 'ssaar']
  },
  { 
    id: 2, 
    title: 'Protocolo de Telemetría IoT',
    description: 'Un dispositivo IoT envía paquetes de datos. El paquete debe empezar con un encabezado HDR (h), seguido de cualquier cantidad de lecturas TEMP (t) o HUM (m), y finalizar exclusivamente con un código CRC (c).',
    alphabet: '{h, t, m, c}',
    states: '{q0, q1, q2}',
    initial: 'q0',
    final: '{q2}',
    placeholder: 'Ej: httmc',
    examples: "Ingresa la secuencia del protocolo. Ejemplo válido: 'hc', 'httmc', 'htmc'.",
    subsetHeaders: ['Estado AFD', 'AFND Original', 'h', 't', 'm', 'c'],
    subsetTable: [
      ['S0', '{q0}', '{q1}', '∅', '∅', '∅'],
      ['S1', '{q1}', '∅', '{q1}', '{q1}', '{q2}'],
      ['S2 (Final)', '{q2}', '∅', '∅', '∅', '∅']
    ],
    hopcroftSteps: [
      "1. Partición inicial: P0 = { {S0, S1}, {S2} }",
      "2. Evaluando transiciones con 'h', 't', 'm', 'c': S0 y S1 tienen comportamientos distintos.",
      "3. Nueva partición: P1 = { {S0}, {S1}, {S2} }",
      "Conclusión: No hay estados equivalentes. AFD ya mínimo."
    ],
    mermaidCode: `
      stateDiagram-v2
        direction LR
        [*] --> M0
        M0 --> M1 : h
        M1 --> M1 : t, m
        M1 --> M2 : c
        M2 --> [*]
    `,
    testBattery: ['hc', 'htc', 'hmc', 'httmc', 'hmmc', 'hmtmc', 'h', 'c', 'tc', 'mc', 'hhc', 'hcc', 'ht', 'hm', 'httm', 'htmc', 'htcm', 'hcm', 'hmct', 'htttc']
  },
  { 
    id: 3, 
    title: 'Reconocimiento de Secuencias Genéticas',
    description: 'Buscamos identificar un patrón en una cadena de aminoácidos: Una Lysina (k), seguida de una Glicina (g), seguida de cualquier aminoácido (x) repetido 0 o más veces, terminando en Fenilalanina (f).',
    alphabet: '{k, g, f, x}',
    states: '{q0, q1, q2, q3}',
    initial: 'q0',
    final: '{q3}',
    placeholder: 'Ej: kgxf',
    examples: "Ingresa la secuencia de aminoácidos. Ejemplo válido: 'kgf', 'kgxf', 'kggfff'.",
    subsetHeaders: ['Estado AFD', 'AFND Original', 'k', 'g', 'f', 'x'],
    subsetTable: [
      ['S0', '{q0}', '{q1}', '∅', '∅', '∅'],
      ['S1', '{q1}', '∅', '{q2}', '∅', '∅'],
      ['S2', '{q2}', '{q2}', '{q2}', '{q2,q3}', '{q2}'],
      ['S3 (Final)', '{q2,q3}', '{q2}', '{q2}', '{q2,q3}', '{q2}']
    ],
    hopcroftSteps: [
      "1. Partición inicial: P0 = { {S0, S1, S2}, {S3} }",
      "2. Evaluando transición con 'f': S2 va a S3, S0 y S1 van a ∅.",
      "3. Nueva partición: P1 = { {S0, S1}, {S2}, {S3} }",
      "4. Al evaluar el bloque {S2} y {S3}, se comprueba su equivalencia para todos los símbolos.",
      "5. Partición final: P2 = { {S0}, {S1}, {S2, S3} }",
      "Conclusión: S2 y S3 son equivalentes y se fusionan en el estado M2."
    ],
    mermaidCode: `
      stateDiagram-v2
        direction LR
        [*] --> M0
        M0 --> M1 : k
        M1 --> M2 : g
        M2 --> M2 : k,g,f,x
        M2 --> [*]
    `,
    testBattery: ['kgf', 'kgxf', 'kggf', 'kgkkf', 'kgxff', 'k', 'kg', 'kf', 'gf', 'kgxx', 'kkgf', 'kgg', 'kgfx', 'kgffx', 'xkgf', 'kgfxk', 'kgfg', 'kg', 'kgxfx', 'kgxffff']
  }
];

export const JAVA_CODE = `
// 1. Evaluación de AFND
public class AFND implements Automaton {
    @Override
    public EvaluationResult evaluate(String input) {
        Set<State> currentStates = new HashSet<>();
        currentStates.add(initialState);
        List<String> path = new ArrayList<>();
        path.add(generateName(currentStates));

        for (char c : input.toCharArray()) {
            Set<State> nextStates = new HashSet<>();
            for (State state : currentStates) {
                nextStates.addAll(getTransitions(state, String.valueOf(c)));
            }
            if (nextStates.isEmpty()) {
                path.add("SError");
                return new EvaluationResult(false, path);
            }
            currentStates = nextStates;
            path.add(generateName(currentStates));
        }
        boolean isAccepted = currentStates.stream().anyMatch(State::isFinal);
        return new EvaluationResult(isAccepted, path);
    }
}

// 2. Construcción de Subconjuntos
public class SubsetConstructor {
    public static AFD convert(AFND afnd) {
        // Inicializar cola y mapeo
        Set<State> initialSet = new HashSet<>();
        initialSet.add(afnd.getInitialState());
        // ... Lógica de subconjuntos
        return new AFD(newStates, alphabet, newInitialState, newFinalStates, newTransitions);
    }
}

// 3. Minimización de Hopcroft
public class HopcroftMinimizer {
    public static AFD minimize(AFD afd) {
        // Dividir particiones iniciales (finales y no finales)
        List<Set<State>> partitions = new ArrayList<>();
        partitions.add(afd.getFinalStates());
        partitions.add(getNonFinalStates(afd));
        
        // ... Lógica iterativa de marcar pares y refinar
        return new AFD(minStates, afd.getAlphabet(), minInitial, minFinals, minTransitions);
    }
}
`;
