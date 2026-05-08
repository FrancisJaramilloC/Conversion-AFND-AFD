package com.automata.core;

import java.util.List;

public class EvaluationResult {
    private final boolean accepted;
    private final List<String> path;

    public EvaluationResult(boolean accepted, List<String> path) {
        this.accepted = accepted;
        this.path = path;
    }

    public boolean isAccepted() {
        return accepted;
    }

    public List<String> getPath() {
        return path;
    }
}
