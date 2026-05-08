package com.automata.api;

import com.automata.service.AutomataService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.Map;
import java.util.List;

@RestController
@RequestMapping("/api/automata")
@CrossOrigin(origins = "*")
public class AutomataController {

    private final AutomataService automataService;

    @Autowired
    public AutomataController(AutomataService automataService) {
        this.automataService = automataService;
    }

    @GetMapping("/evaluate/{id}")
    public Map<String, Object> evaluate(@PathVariable int id, @RequestParam String input) {
        return automataService.evaluateEquivalence(id, input);
    }

    @PostMapping("/batch/{id}")
    public List<Map<String, Object>> evaluateBatch(@PathVariable int id, @RequestBody List<String> inputs) {
        return automataService.evaluateBatch(id, inputs);
    }
}
