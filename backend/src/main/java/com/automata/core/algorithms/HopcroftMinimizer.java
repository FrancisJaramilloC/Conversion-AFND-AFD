package com.automata.core.algorithms;

import com.automata.core.AFD;
import com.automata.core.State;
import com.automata.core.Transition;

import java.util.*;
import java.util.stream.Collectors;

public class HopcroftMinimizer {

    public static AFD minimize(AFD afd) {
        Set<State> reachable = getReachableStates(afd);
        
        Set<State> finals = reachable.stream().filter(State::isFinal).collect(Collectors.toSet());
        Set<State> nonFinals = reachable.stream().filter(s -> !s.isFinal()).collect(Collectors.toSet());
        
        Set<Set<State>> partitions = new HashSet<>();
        if (!finals.isEmpty()) partitions.add(finals);
        if (!nonFinals.isEmpty()) partitions.add(nonFinals);
        
        boolean changed = true;
        while (changed) {
            changed = false;
            Set<Set<State>> newPartitions = new HashSet<>();
            
            for (Set<State> partition : partitions) {
                Map<Map<String, Set<State>>, Set<State>> grouped = new HashMap<>();
                
                for (State state : partition) {
                    Map<String, Set<State>> signature = new HashMap<>();
                    for (String symbol : afd.getAlphabet()) {
                        State dest = getDestination(afd, state, symbol);
                        signature.put(symbol, getPartitionOf(partitions, dest));
                    }
                    grouped.computeIfAbsent(signature, k -> new HashSet<>()).add(state);
                }
                
                newPartitions.addAll(grouped.values());
                if (grouped.size() > 1) {
                    changed = true;
                }
            }
            partitions = newPartitions;
        }
        
        return buildMinimizedAFD(afd, partitions);
    }
    
    private static Set<State> getPartitionOf(Set<Set<State>> partitions, State target) {
        for (Set<State> p : partitions) {
            if (p.contains(target)) return p;
        }
        return null;
    }
    
    private static State getDestination(AFD afd, State source, String symbol) {
        for (Transition t : afd.getTransitions()) {
            if (t.getSource().equals(source) && t.getSymbol().equals(symbol)) {
                return t.getDestination();
            }
        }
        return null; // En un AFD válido y completo, nunca debería ocurrir.
    }
    
    private static Set<State> getReachableStates(AFD afd) {
        Set<State> reachable = new HashSet<>();
        Queue<State> queue = new LinkedList<>();
        queue.add(afd.getInitialState());
        reachable.add(afd.getInitialState());
        
        while (!queue.isEmpty()) {
            State curr = queue.poll();
            for (String symbol : afd.getAlphabet()) {
                State dest = getDestination(afd, curr, symbol);
                if (dest != null && !reachable.contains(dest)) {
                    reachable.add(dest);
                    queue.add(dest);
                }
            }
        }
        return reachable;
    }
    
    private static AFD buildMinimizedAFD(AFD original, Set<Set<State>> partitions) {
        Map<Set<State>, State> stateMap = new HashMap<>();
        Set<State> minStates = new HashSet<>();
        State minInitial = null;
        
        int counter = 0;
        for (Set<State> partition : partitions) {
            boolean isFinal = partition.stream().anyMatch(State::isFinal);
            
            String name = partition.size() == 1 ? partition.iterator().next().getName() : "Min" + counter++;
            if (partition.stream().anyMatch(s -> s.getName().equals("SError"))) {
                name = "SError";
            }
            
            State newState = new State(name, isFinal);
            stateMap.put(partition, newState);
            minStates.add(newState);
            
            if (partition.contains(original.getInitialState())) {
                minInitial = newState;
            }
        }
        
        List<Transition> minTransitions = new ArrayList<>();
        for (Set<State> partition : partitions) {
            State rep = partition.iterator().next(); 
            State newSource = stateMap.get(partition);
            for (String symbol : original.getAlphabet()) {
                State oldDest = getDestination(original, rep, symbol);
                State newDest = stateMap.get(getPartitionOf(partitions, oldDest));
                minTransitions.add(new Transition(newSource, symbol, newDest));
            }
        }
        
        Set<State> minFinals = minStates.stream().filter(State::isFinal).collect(Collectors.toSet());
        return new AFD(minStates, original.getAlphabet(), minInitial, minFinals, minTransitions);
    }
}
