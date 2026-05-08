package com.automata.core.exercises;

import com.automata.core.AFND;

public class ExercisesFactory {

    public static AFND getExercise(int id) {
        switch (id) {
            case 1: return IDSExercise.create();
            case 2: return IoTExercise.create();
            case 3: return GeneticsExercise.create();
            default: throw new IllegalArgumentException("Invalid exercise ID");
        }
    }
}
