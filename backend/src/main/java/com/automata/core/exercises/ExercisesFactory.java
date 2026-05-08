package com.automata.core.exercises;

import com.automata.core.AFND;
import com.automata.core.State;
import com.automata.core.Transition;

import java.util.*;

public class ExercisesFactory {

    public static AFND getExercise(int id) {
        switch (id) {
            case 1: return createIDS();
            case 2: return createIoT();
            case 3: return createGenetics();
            default: throw new IllegalArgumentException("Invalid exercise ID");
        }
    }

    private static AFND createIDS() {
        State q0 = new State("q0", false);
        State q1 = new State("q1", false);
        State q2 = new State("q2", false);
        State q3 = new State("q3", true);

        Set<State> states = new HashSet<>(Arrays.asList(q0, q1, q2, q3));
        Set<String> alphabet = new HashSet<>(Arrays.asList("s", "a", "r"));

        List<Transition> transitions = new ArrayList<>();
        transitions.add(new Transition(q0, "s", q1));
        transitions.add(new Transition(q1, "a", q1));
        transitions.add(new Transition(q1, "a", q2));
        transitions.add(new Transition(q2, "r", q3));

        return new AFND(states, alphabet, q0, Collections.singleton(q3), transitions);
    }

    private static AFND createIoT() {
        State q0 = new State("q0", false);
        State q1 = new State("q1", false);
        State q2 = new State("q2", true);

        Set<State> states = new HashSet<>(Arrays.asList(q0, q1, q2));
        Set<String> alphabet = new HashSet<>(Arrays.asList("h", "t", "m", "c"));

        List<Transition> transitions = new ArrayList<>();
        transitions.add(new Transition(q0, "h", q1));
        transitions.add(new Transition(q1, "t", q1));
        transitions.add(new Transition(q1, "m", q1));
        transitions.add(new Transition(q1, "c", q2));

        return new AFND(states, alphabet, q0, Collections.singleton(q2), transitions);
    }

    private static AFND createGenetics() {
        State q0 = new State("q0", false);
        State q1 = new State("q1", false);
        State q2 = new State("q2", false);
        State q3 = new State("q3", true);

        Set<State> states = new HashSet<>(Arrays.asList(q0, q1, q2, q3));
        Set<String> alphabet = new HashSet<>(Arrays.asList("k", "g", "f", "x"));

        List<Transition> transitions = new ArrayList<>();
        transitions.add(new Transition(q0, "k", q1));
        transitions.add(new Transition(q1, "g", q2));
        transitions.add(new Transition(q2, "k", q2));
        transitions.add(new Transition(q2, "g", q2));
        transitions.add(new Transition(q2, "f", q2));
        transitions.add(new Transition(q2, "f", q3));
        transitions.add(new Transition(q2, "x", q2));

        return new AFND(states, alphabet, q0, Collections.singleton(q3), transitions);
    }
}
