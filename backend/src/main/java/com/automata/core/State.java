package com.automata.core;

import lombok.Data;
import lombok.EqualsAndHashCode;

@Data
@EqualsAndHashCode(of = "name")
public class State {
    private final String name;
    private final boolean isFinal;
    
    public State(String name, boolean isFinal) {
        this.name = name;
        this.isFinal = isFinal;
    }
}
