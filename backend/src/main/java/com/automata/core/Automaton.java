package com.automata.core;

import java.util.Set;

public interface Automaton {
    Set<State> getStates();
    Set<String> getAlphabet();
    State getInitialState();
    Set<State> getFinalStates();
    
    /**
     * Evalúa si la cadena de entrada es aceptada por el autómata.
     */
    EvaluationResult evaluate(String input);
}
