import { Automaton } from './automaton_battle.js';
import { SpeechRecognizer } from './speechRecognizer_battle.js';


let automatonl = Automaton('left');
let l = SpeechRecognizer("#control", automatonl, 'left');

document.getElementById("startleft").addEventListener("click", function () {
    document.getElementById("control").innerHTML="Listening..."
    l.recognizer.start();
    console.log("Call trace logged from script.js:" + l.callTrace);
});

let automatonr = Automaton('right');
let r = SpeechRecognizer("#control",automatonr, 'right');

document.getElementById("startright").addEventListener("click", function () {
    document.getElementById("control").innerHTML="Listening..."
    r.recognizer.start();
    console.log("Call trace logged from script.js:" + r.callTrace);
});

//--------------------------------------------------------------------------


