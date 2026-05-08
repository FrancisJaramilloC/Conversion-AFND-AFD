package com.automata.core;


import java.util.Set;
import java.util.List;
import java.util.HashSet;
import java.util.ArrayList;
import java.util.stream.Collectors;

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

    public Set<State> getStates() { return states; }
    public Set<String> getAlphabet() { return alphabet; }
    public State getInitialState() { return initialState; }
    public Set<State> getFinalStates() { return finalStates; }
    public List<Transition> getTransitions() { return transitions; }

    @Override
    public EvaluationResult evaluate(String input) {
        Set<State> currentStates = new HashSet<>();
        currentStates.add(initialState);
        
        List<String> path = new ArrayList<>();
        path.add(stateSetToString(currentStates));
        
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
            path.add(stateSetToString(currentStates));
            
            if (currentStates.isEmpty()) {
                return new EvaluationResult(false, path);
            }
        }
        
        boolean accepted = currentStates.stream().anyMatch(State::isFinal);
        return new EvaluationResult(accepted, path);
    }
    
    private String stateSetToString(Set<State> states) {
        if (states.isEmpty()) return "∅";
        return "{" + states.stream().map(State::getName).sorted().collect(Collectors.joining(",")) + "}";
    }
}
