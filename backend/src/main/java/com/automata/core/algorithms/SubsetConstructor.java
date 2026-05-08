package com.automata.core.algorithms;

import com.automata.core.AFD;
import com.automata.core.AFND;
import com.automata.core.State;
import com.automata.core.Transition;

import java.util.*;
import java.util.stream.Collectors;

public class SubsetConstructor {

    public static AFD convert(AFND afnd) {
        Set<State> newStates = new HashSet<>();
        List<Transition> newTransitions = new ArrayList<>();
        
        Set<State> initialSet = new HashSet<>(Collections.singleton(afnd.getInitialState()));
        Map<Set<State>, State> stateMap = new HashMap<>();
        Queue<Set<State>> queue = new LinkedList<>();
        
        queue.add(initialSet);
        
        boolean isInitialFinal = initialSet.stream().anyMatch(State::isFinal);
        State newInitialState = new State(generateName(initialSet), isInitialFinal);
        stateMap.put(initialSet, newInitialState);
        newStates.add(newInitialState);
        
        State errorState = new State("SError", false);
        boolean errorStateUsed = false;

        while (!queue.isEmpty()) {
            Set<State> currentSet = queue.poll();
            State currentNewState = stateMap.get(currentSet);
            
            for (String symbol : afnd.getAlphabet()) {
                Set<State> nextSet = new HashSet<>();
                
                for (State state : currentSet) {
                    for (Transition t : afnd.getTransitions()) {
                        if (t.getSource().equals(state) && t.getSymbol().equals(symbol)) {
                            nextSet.add(t.getDestination());
                        }
                    }
                }
                
                if (nextSet.isEmpty()) {
                    newTransitions.add(new Transition(currentNewState, symbol, errorState));
                    errorStateUsed = true;
                } else {
                    if (!stateMap.containsKey(nextSet)) {
                        boolean isFinal = nextSet.stream().anyMatch(State::isFinal);
                        State newState = new State(generateName(nextSet), isFinal);
                        stateMap.put(nextSet, newState);
                        newStates.add(newState);
                        queue.add(nextSet);
                    }
                    newTransitions.add(new Transition(currentNewState, symbol, stateMap.get(nextSet)));
                }
            }
        }
        
        if (errorStateUsed) {
            newStates.add(errorState);
            for (String symbol : afnd.getAlphabet()) {
                newTransitions.add(new Transition(errorState, symbol, errorState));
            }
        }
        
        Set<State> finalStates = newStates.stream().filter(State::isFinal).collect(Collectors.toSet());
        return new AFD(newStates, afnd.getAlphabet(), newInitialState, finalStates, newTransitions);
    }
    
    private static String generateName(Set<State> states) {
        return "{" + states.stream()
                .map(State::getName)
                .sorted()
                .collect(Collectors.joining(",")) + "}";
    }
}
