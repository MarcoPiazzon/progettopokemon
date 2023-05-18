export function Automaton(target) {
    // Definiamo gli stati dell'automa
    let _START = { "final": false, "name": "START" };
    let _SOGG = { "final": false, "name": "SOGG" };
    let _ATT = { "final": false, "name": "ATT" };

    let _TOOLS = { "final": false, "name": "TOOLS" };
    let _P = { "final": false, "name": "P" };

    let _VERBO = { "final": false, "name": "VERBO" };
    let _END = { "final": true, "name": "END" };
    let _ERROR = { "final": false, "name": "ERROR" };

    let currentState = _START;
    let pokemonName = "";
    let move = "";
    let tool ="";

    _START.transitions = function (input) {
        //console.log(_START);
        input = input.toLowerCase();
        switch (input) {
            case "i":
                //console.log(pokemonName);
                if (target == 'left') {
                    pokemonName = bestMatch(pokemonName, leftSquad);
                }
                if (target == 'right') {
                    pokemonName = bestMatch(pokemonName, rightSquad);
                }
                //console.log(bestMatch("epseon")); //la prova che il bestMatch è accessibile da questa parte di codice.
                return _SOGG;
            case "substitute":
                SelectAnotherPokemonModal(target,1);
                return _START;
            case "use":  // probabile problema con maiuscole
                pokemonName = document.getElementById(target + "__card__name").innerHTML;
                return _ATT;
            case "used": //Qualche volta capisce used al posto di use
                pokemonName = document.getElementById(target + "__card__name").innerHTML;
                return _ATT;
            case "open":
                SelectAnotherPokemonModal(target,2);
                console.log("sei dentro open");
                pokemonName = document.getElementById(target + "__card__name").innerHTML;
                return _START;
            case "apply":
                console.log("sei dentro apply");
                return _TOOLS;
            case "stop":
                return _END;
            default:
                pokemonName = pokemonName + " " + input;
                return _START;
        }
    }

    _SOGG.transitions = function (input) {
        input = input.toLowerCase();
        switch (input) {
            case "choose":
                //console.log("END")
                return _VERBO;
            default:
                return _ERROR;
        }
    }

    _ATT.transitions = function (input) {
        input = input.toLowerCase();
        switch(target){
            case 'left':
                move = bestMatch(input, leftmoveset);
                for(let i=0; i<leftmoveset.length; i++){
                    if(move == leftmoveset[i].name){
                        loadMove(i+1, target, leftmoveset[i].url);
                       i=leftmoveset.length;
                    }
            }
            break;
            
            case 'right':
                move = bestMatch(input, rightmoveset);
                for(let i=0; i<rightmoveset.length; i++){
                    if(move == rightmoveset[i].name){
                        loadMove(i+1, target, rightmoveset[i].url);
                        i=rightmoveset.length;
                    }
                }    
            break;
        }
        console.log(move);
        // scorri classe bottoni per index
        // moveset == array mosse del pokemon
        // chiama funzione di attacco
        return _END;
    }

// ------------------------------------------------------------

    _TOOLS.transitions = function (input) {
        input = input.toLowerCase();
        console.log("input di tools:" + input);
        switch (input) {
            case "revive":
                console.log("Hai scelto revive");
                UsePoison(target,3);
                return _END;
            case "normal":
                console.log("Hai scelto normal");
                UsePoison(target,1);
            //tool=input;
              //  return _P;
              return _END;
            case "super":
                console.log("Hai scelto super");
                UsePoison(target,2);
                tool=input;
                return _P;
            default:
                return _ERROR;
        }
    }


    _P.transitions = function (input) {
        input = input.toLowerCase();
        switch (input) {
            case "potion":
                tool+="-"+input;
                //console.log("END")
                console.log(tool);
                return _END;
            default:
                return _ERROR;
        }
    }

    // ---------------------------------------------------------------

    _VERBO.transitions = function (input) {
        input = input.toLowerCase();
        switch (input) {
            case "you":
                //Check if modal is open
                if(document.getElementById("myModal").style.display == "block"){
                    //Close the modal
                    document.getElementById("myModal").style.display = "none";
                }
                AnimationSostitutePokemon(target, pokemonName);
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

    let getTool = () => {
        return tool;
    }

    let getMove = () => {
        return move;
    };

    let setPokemon = () => {
        //console.log("ANNULLATO");
        pokemonName = "";
    };

    return { // esponiamo i metodi pubblici
        "step": step,
        "accepted": accepted,
        "run": run,
        "getPokemon": getPokemon,
        "setPokemon": setPokemon,
        "getMove": getMove,
        "getTool": getTool
    }
} // fine modulo Automaton // fine modulo Automaton