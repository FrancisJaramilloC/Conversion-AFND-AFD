package com.automata.core;

import lombok.Getter;
import java.util.Set;
import java.util.List;

@Getter
public class AFD implements Automaton {
    private final Set<State> states;
    private final Set<String> alphabet;
    private final State initialState;
    private final Set<State> finalStates;
    private final List<Transition> transitions;

    public AFD(Set<State> states, Set<String> alphabet, State initialState, Set<State> finalStates, List<Transition> transitions) {
        this.states = states;
        this.alphabet = alphabet;
        this.initialState = initialState;
        this.finalStates = finalStates;
        this.transitions = transitions;
    }

    @Override
    public boolean accepts(String input) {
        // Lógica a implementar en el Sprint 2
        return false;
    }
}
