package com.automata.core;


import java.util.Set;
import java.util.List;
import java.util.ArrayList;

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

    public Set<State> getStates() { return states; }
    public Set<String> getAlphabet() { return alphabet; }
    public State getInitialState() { return initialState; }
    public Set<State> getFinalStates() { return finalStates; }
    public List<Transition> getTransitions() { return transitions; }

    @Override
    public EvaluationResult evaluate(String input) {
        State currentState = initialState;
        List<String> path = new ArrayList<>();
        path.add(currentState.getName());
        
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
                return new EvaluationResult(false, path); // Autómata muere si no hay transición explícita
            }
            currentState = nextState;
            path.add(currentState.getName());
        }
        
        return new EvaluationResult(currentState.isFinal(), path);
    }
}
