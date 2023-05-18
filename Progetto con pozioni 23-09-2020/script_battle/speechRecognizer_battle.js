export function SpeechRecognizer(outputSelector, automaton, target) {

    let callTrace = [];
    let callCounter = 0;

    let recognizer = new webkitSpeechRecognition()
        || new SpeechRecognition()
        || null;

    if (recognizer != null) {
        recognizer.continuous = true;
        recognizer.interimResults = true;
        recognizer.active = false;
        recognizer.ignore_onend = false;
        recognizer.final_transcript = '';
        recognizer.interim_transcript = '';
        recognizer.lang = 'en-EN';

        recognizer.onstart = () => {
            callTrace[callCounter] = "onstart";
            callCounter++;
            recognizer.active = true;
            console.log("recognizer.onstart called");
        };

        recognizer.onerror = (event) => {
            callTrace[callCounter] = "onerror";
            callCounter++;
            console.log(event.error);
            recognizer.ignore_onend = true;
            console.log("recognizer.onerror called");
        };

        recognizer.onend = () => {
            callTrace[callCounter] = "onend";
            callCounter++;
            recognizer.active = false;
            recognizer.stop();
            if (recognizer.ignore_onend) {
                document.querySelector(outputSelector).innerHTML = "ignore onend";
            }
            console.log("recognizer.onend called");
        };

        // event.results è una matrice 
        // la riga event.results[i] è una colonna 
        // la cui cella event.results[i][j] contiene un oggetto
        // rappresentante molte possibilità per la stessa parte di frase riconosciuta
        // event.results[i][j].transcript è il testo corrispondente alla 
        // j-esima possibilità per la i-esima parte di frase riconosciuta
        // event.results[i][0] è la più probabile tra le possibilità per 
        // la i-esima parte di frase
        // ATTENZIONE: event.results[i][j].transcript può essere una stringa 
        // con spazi all'interno, quindi composta di più parole

        recognizer.onresult = (event) => {
            callTrace[callCounter] = "onresult";
            callCounter++;
            console.log("recognizer.onresult called");
            console.log(typeof (event.results));
            console.log(event.results);
            if (typeof (event.results) == 'undefined') {
                recognizer.ignore_onend = true;
            } else {
                for (let i = event.resultIndex; i < event.results.length; i++) {
                    if (event.results[i].isFinal) {
                        recognizer.final_transcript += event.results[i][0].transcript;
                    } else {
                        recognizer.interim_transcript += event.results[i][0].transcript;
                    }
                }
                console.log(recognizer.final_transcript);
                automaton.run(recognizer.final_transcript);
                checkAccepted();
                recognizer.interim_transcript="";
                recognizer.final_transcript="";
            }
            //guarda sta roba

            
        };

        let checkAccepted = () => {
            let finalMessage = `'${recognizer.final_transcript}': `;
            if (automaton.accepted()) {
                finalMessage += " sentence accepted by the automaton.";
                if(finalMessage.includes("use")){
                    let movename=automaton.getMove();
                    let url="";
                    let m=0;
                    switch(target){
                        case "left":
                        for(let i=0; i<leftmoveset.length; i++){
                            m=i+1;
                            if(leftmoveset[i].name==movename){
                                url=leftmoveset[i].url;
                                i=leftmoveset.length;
                            }
                        }
                        break;
                        case "right":
                        for(let i=0; i<rightmoveset.length; i++){
                                m=i+1;
                                if(rightmoveset[i].name==movename){
                                    url=rightmoveset[i].url;
                                    i=rightmoveset.length;
                            }
                         }   
                        break
                    }
                    loadMove(m, target, url);
                }else if(finalMessage.includes("apply")){
                    //Apply tools
                }else if(finalMessage.includes("substitute")){
                    
                }else{
                    //AnimationSostitutePokemon(target,automaton.getPokemon());//loadPokemon è stato inserito in questo metodo
                    document.getElementById("pokemon"+target).value=automaton.getPokemon();
                }
                recognizer.onend();
            } else {
                finalMessage += " sentence not accepted by the automaton.";
            }
            document.querySelector(outputSelector).innerHTML = finalMessage;
        };
    }


    // fine if (recognizer != null)
    return { // esponiamo il campo pubblico
        "recognizer": recognizer,
        "callTrace": callTrace
    }
}

/* document.getElementById("start"+target).removeEventListener("click", recognizer.start());
   document.getElementById("start"+target).addEventListener("click", function () {
   recognizer.onend();
}); */