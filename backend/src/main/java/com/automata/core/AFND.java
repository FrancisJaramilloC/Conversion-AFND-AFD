package com.automata.core;

import lombok.Getter;
import java.util.Set;
import java.util.List;
import java.util.HashSet;

@Getter
public class AFND implements Automaton {
    private final Set<State> states;
    private final Set<String> alphabet;
    private final State initialState;
    private final Set<State> finalStates;
    private final List<Transition> transitions;

    public AFND(Set<State> states, Set<String> alphabet, State initialState, Set<State> finalStates, List<Transition> transitions) {
        this.states = states;
        this.alphabet = alphabet;
        this.initialState = initialState;
        this.finalStates = finalStates;
        this.transitions = transitions;
    }

    @Override
    public boolean accepts(String input) {
        Set<State> currentStates = new HashSet<>();
        currentStates.add(initialState);
        
        for (char c : input.toCharArray()) {
            String symbol = String.valueOf(c);
            Set<State> nextStates = new HashSet<>();
            
            for (State state : currentStates) {
                for (Transition t : transitions) {
                    if (t.getSource().equals(state) && t.getSymbol().equals(symbol)) {
                        nextStates.add(t.getDestination());
                    }
                }
            }
            currentStates = nextStates;
            if (currentStates.isEmpty()) {
                return false;
            }
        }
        
        return currentStates.stream().anyMatch(State::isFinal);
    }
}
