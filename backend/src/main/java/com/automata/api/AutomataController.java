package com.automata.api;

import com.automata.core.AFD;
import com.automata.core.AFND;
import com.automata.core.algorithms.HopcroftMinimizer;
import com.automata.core.algorithms.SubsetConstructor;
import com.automata.core.exercises.ExercisesFactory;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/automata")
@CrossOrigin(origins = "*")
public class AutomataController {

    @GetMapping("/evaluate/{id}")
    public Map<String, Object> evaluate(@PathVariable int id, @RequestParam String input) {
        AFND afnd = ExercisesFactory.getExercise(id);
        AFD afd = SubsetConstructor.convert(afnd);
        AFD minimizedAfd = HopcroftMinimizer.minimize(afd);

        Map<String, Object> result = new HashMap<>();
        result.put("input", input);
        result.put("afndResult", afnd.accepts(input));
        result.put("afdResult", afd.accepts(input));
        result.put("minimizedAfdResult", minimizedAfd.accepts(input));
        
        return result;
    }
}
