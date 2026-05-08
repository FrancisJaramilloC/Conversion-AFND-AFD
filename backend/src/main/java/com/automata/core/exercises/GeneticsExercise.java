package com.automata.core.exercises;

import com.automata.core.AFND;
import com.automata.core.State;
import com.automata.core.Transition;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.Collections;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

public class GeneticsExercise {

    public static AFND create() {
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
