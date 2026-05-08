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
        State currentState = initialState;
        
        for (char c : input.toCharArray()) {
            String symbol = String.valueOf(c);
            State nextState = null;
            
            for (Transition t : transitions) {
                if (t.getSource().equals(currentState) && t.getSymbol().equals(symbol)) {
                    nextState = t.getDestination();
                    break;
                }
            }
            
            if (nextState == null) {
                return false; // Autómata muere si no hay transición explícita
            }
            currentState = nextState;
        }
        
        return currentState.isFinal();
    }
}
