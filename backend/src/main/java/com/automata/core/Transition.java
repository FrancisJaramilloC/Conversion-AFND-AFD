package com.automata.core;

import lombok.Data;

@Data
public class Transition {
    private final State source;
    private final String symbol;
    private final State destination;
}
