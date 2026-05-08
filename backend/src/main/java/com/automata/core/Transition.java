package com.automata.core;

public class Transition {
    private final State source;
    private final String symbol;
    private final State destination;

    public Transition(State source, String symbol, State destination) {
        this.source = source;
        this.symbol = symbol;
        this.destination = destination;
    }

    public State getSource() {
        return source;
    }

    public String getSymbol() {
        return symbol;
    }

    public State getDestination() {
        return destination;
    }
}
