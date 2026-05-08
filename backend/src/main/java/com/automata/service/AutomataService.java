package com.automata.service;

import com.automata.core.AFD;
import com.automata.core.AFND;
import com.automata.core.algorithms.HopcroftMinimizer;
import com.automata.core.algorithms.SubsetConstructor;
import com.automata.core.exercises.ExercisesFactory;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.Map;

@Service
public class AutomataService {

    public Map<String, Object> evaluateEquivalence(int exerciseId, String input) {
        // 1. Obtener el AFND original
        AFND afnd = ExercisesFactory.getExercise(exerciseId);
        
        // 2. Convertir a AFD (Subconjuntos)
        AFD afd = SubsetConstructor.convert(afnd);
        
        // 3. Minimizar AFD resultante (Hopcroft)
        AFD minimizedAfd = HopcroftMinimizer.minimize(afd);

        // 4. Evaluar la misma cadena en los 3 autómatas
        var afndRes = afnd.evaluate(input);
        var afdRes = afd.evaluate(input);
        var minRes = minimizedAfd.evaluate(input);

        Map<String, Object> result = new HashMap<>();
        result.put("input", input);
        
        result.put("afndResult", afndRes.isAccepted());
        result.put("afndPath", afndRes.getPath());
        
        result.put("afdResult", afdRes.isAccepted());
        result.put("afdPath", afdRes.getPath());
        
        result.put("minimizedAfdResult", minRes.isAccepted());
        result.put("minimizedAfdPath", minRes.getPath());
        
        return result;
    }
}
