import { Automaton } from './automaton_squad.js';
import { SpeechRecognizer } from './speechRecognizer_squad.js';

let automaton = Automaton();
let l = SpeechRecognizer("#control", automaton, 'left');

document.getElementById("startleft").addEventListener("click", function () {
    l.recognizer.start();
    document.getElementById("control").innerHTML="Listening"
    console.log("Call trace logged from script.js:" + l.callTrace);
});

let r = SpeechRecognizer("#control",automaton, 'right');

document.getElementById("startright").addEventListener("click", function () {
    r.recognizer.start();
    document.getElementById("control").innerHTML="Listening"
    console.log("Call trace logged from script.js:" + r.callTrace);
});

