export function Automaton() {
    // Definiamo gli stati dell'automa
    let _START = {"final": false, "name": "START"};
    let _SOGG = {"final": false, "name": "SOGG"}; 

    let _VERBO = {"final": false,"name": "VERBO"};
    let _END = { "final": true,"name": "END"};
    let _ERROR = { "final": false,"name": "ERROR"};

    let currentState = _START;
    let pokemonName = "";

 
    _START.transitions = function (input) {
        //console.log(_START);
        switch (input) {
            case "I":
                //console.log(pokemonName);
                pokemonName = bestMatch(pokemonName, pokedex);
                //console.log(bestMatch("epseon")); //la prova che il bestMatch è accessibile da questa parte di codice.
                return _SOGG;
            default:
                pokemonName = pokemonName + " " + input;
                return _START;
        }
    }

    _SOGG.transitions = function (input) {
        input=input.toLowerCase();
        switch (input) {
            case "choose":
                //console.log("END")
                return _VERBO;
            default:
                return _ERROR;
        }
    }



    _VERBO.transitions = function (input) {
        input=input.toLowerCase();
        switch (input) {
            case "you":
                //console.log("END")
                return _END;
            default:
                return _ERROR;
        }
    }

    _ERROR.transitions = function (input) {
                return _ERROR;
    }

    _END.transitions = function (input) {
        return _END;
    }

    let step = (input) => {
        currentState = currentState.transitions(input);
    };

    let run = (input) => { // input è una frase intera con parole divise da spazi
        let sequence = input.split(" ");
        for (let i = 0; i < sequence.length; i++) {
            let word = sequence[i];
            step(word);
            //transition += currentState.name;
            //console.log(transition);
        }
        //console.log(sequence + "  \n" + currentState.name)
    };

    function accepted() {
        //console.log("Accepted request");
        if (currentState.name === _END.name) {
            currentState = _START;
            return true;
        } else
            return false;
    }

    let getPokemon = () => {
        return pokemonName;
    };



    let setPokemon = () => {
        //console.log("ANNULLATO");
         pokemonName="";
    };

    return { // esponiamo i metodi pubblici
        "step": step,
        "accepted": accepted,
        "run": run,
        "getPokemon": getPokemon,
        "setPokemon": setPokemon,
    }
} // fine modulo Automaton // fine modulo Automaton