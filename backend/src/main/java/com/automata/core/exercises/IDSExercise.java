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

public class IDSExercise {

    public static AFND create() {
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
}
