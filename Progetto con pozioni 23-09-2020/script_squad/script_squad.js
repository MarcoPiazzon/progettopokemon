//pokemon gif
var baseUrl = 'http://play.pokemonshowdown.com/sprites/xyani/';
var extension = '.gif';
var turn = "";
var a;

var cl = 0;
var cr = 0;

var pokemonumber = 1;

function loadFirst() {
    let l = document.getElementsByClassName("left-buttons");
    for (let i = 0; i < l.length; i++) {
        l[i].disabled = true;
    }
    let r = document.getElementsByClassName("right-buttons");
    for (let i = 0; i < r.length; i++) {
        r[i].disabled = true;
    }

    flipCard('left');
    flipCard('right');

    setTurn();

}

function setTurn() {
    let b = Math.floor(Math.random() * 2);
    //console.log(b);
    if (b == 0) {
        turn = "left";
    } else {
        turn = "right";
    }
    document.getElementById(turn + "-turn").style.visibility = "visible";
    a = document.getElementsByClassName(turn + "-buttons");
    for (let i = 0; i < a.length; i++) {
        a[i].disabled = false;
    }
}

function changeTurn() {
    switch (turn) {
        case "left":
            a = document.getElementsByClassName(turn + "-buttons");
            for (let i = 0; i < a.length; i++) {
                a[i].disabled = true;
            }
            document.getElementById(turn + "-turn").style.visibility = "hidden";
            turn = "right";

            a = document.getElementsByClassName(turn + "-buttons");
            for (let i = 0; i < a.length; i++) {
                a[i].disabled = false;
            }
            document.getElementById(turn + "-turn").style.visibility = "visible";
            break;
        case "right":
            a = document.getElementsByClassName(turn + "-buttons");
            for (let i = 0; i < a.length; i++) {
                a[i].disabled = true;
            }
            document.getElementById(turn + "-turn").style.visibility = "hidden";
            turn = "left";

            a = document.getElementsByClassName(turn + "-buttons");
            for (let i = 0; i < a.length; i++) {
                a[i].disabled = false;
            }
            document.getElementById(turn + "-turn").style.visibility = "visible";
    }//switch

}//End ChangeTurn


function loadPokemon(pokemonName, target) {

    let xhr = new XMLHttpRequest();
    xhr.onreadystatechange = function () {
        if (this.readyState == 4 && this.status == 200) {
            let jsonObject = JSON.parse(this.responseText);
            document.getElementById(target + pokemonumber + "__card__name").innerHTML = jsonObject.forms[0].name;
            switch (target) {
                case "left":
                    leftSquad[pokemonumber - 1].name = jsonObject.forms[0].name;
                    //console.log(leftSquad[pokemonumber - 1].name);
                    // Store
                    localStorage.setItem(((target) + "-name" + (pokemonumber - 1)), jsonObject.forms[0].name);
                    //console.log("prova pokemon " + localStorage.getItem(((target) + "-name" + (pokemonumber - 1))));
                    break;
                case "right":
                    rightSquad[pokemonumber - 1].name = jsonObject.forms[0].name;
                    //console.log(rightSquad[pokemonumber - 1].name);
                    // Store
                    localStorage.setItem(((target) + "-name" + (pokemonumber - 1)), jsonObject.forms[0].name);
                    //console.log("prova pokemon " + localStorage.getItem(((target) + "-name" + (pokemonumber - 1))));
                    break;
            }

            document.getElementById(target + pokemonumber + "-imagine").src = jsonObject.sprites.front_default;
            //sfondo

            if (pokemonumber == 6) {
                pokemonumber = 1;
                if (target == 'left' && cr == 0 || target == 'right' && cl == 0) {
                    changeTurn();
                }
            } else {
                pokemonumber++;
            }
        }

    };
    xhr.open("GET", `https://pokeapi.co/api/v2/pokemon/${pokemonName}/`, true);
    xhr.send();

}//End LoadPokemon

function getGifByPokemonName(pokemonName) {
    var lowercasePokemonName = pokemonName.toLowerCase();
    if (lowercasePokemonName.includes("mega-x")) {
        lowercasePokemonName = lowercasePokemonName.replace("-x", "x");
    }
    if (lowercasePokemonName.includes("mega-y")) {
        lowercasePokemonName = lowercasePokemonName.replace("-y", "y");
    }
    var pokemonUrlName = lowercasePokemonName
        .replace(/\./g, '')
        .replace(/'/g, '')
        .replace(/\s/g, "-");
    return baseUrl + pokemonUrlName + extension;

}//End getGifByPokemonName

function genRandom(target) {
    for (let i = pokemonumber - 1; i < 6; i++) {
        let b = Math.floor(Math.random() * pokedex.length - 1);
        while (pokedex[b].name.includes("-mega")) {
            b = Math.floor(Math.random() * pokedex.length - 1);
        }
        loadPokemon(pokedex[b].name, target)
    }

}//End genRandom

function startBattle(target) {
    console.log("a<kakakak");
    document.getElementById("left-turn").style.visibility = "hidden";
    document.getElementById("right-turn").style.visibility = "hidden";
    a = document.getElementsByClassName("left-buttons");
    for (let i = 0; i < a.length; i++) {
        a[i].disabled = true;
    }
    a = document.getElementsByClassName("right-buttons");
    for (let i = 0; i < a.length; i++) {
        a[i].disabled = true;
    }
    switch (target) {
        case "left":
            cl = 1;
            if (cr == 0) {
                changeTurn();
            }
            break;
        case "right":
            cr = 1;
            if (cl == 0) {
                changeTurn();
            }
            break;
    }//End Switch

    if (cl == 1 && cr == 1) {
        console.log("battle");
        window.open("pokemon_battle.html");
        // caricare l'altra pagina
    }
    console.log(cr);
    console.log(cl);

}//End startBatte

function flipCard(target){
    for(let i = 1; i< 7; i++){
        console.log("target: "+target +"int: "+i);
        let bl = document.querySelector('#'+target+i+'-imagine')
        bl.addEventListener('click', function () {
            console.log("ok");
            document.querySelector('#'+target+i+'__card__type').classList.toggle('flipped');
        });

        let b2 = document.querySelector('#'+target+i+'__card__type')
        b2.addEventListener('click',function(){
            document.querySelector('#'+target+i+'-imagine').classList.toggle('flipped');
        });
    }

    
}

function ReLoadPokemonByClick(ele){
    let int = ele.charAt((ele.split("-")[0]).length-1);
    console.log("prova ele: "+int);
    let target = ele.split("-")[1];
    document.querySelector('#'+target+int+'__card__type').classList.toggle('flipped');
    
    //get random pokemon
    let b = Math.floor(Math.random() * pokedex.length - 1);
        while (pokedex[b].name.includes("-mega")) {
            b = Math.floor(Math.random() * pokedex.length - 1);
    }
    AnotherLoadPokemon(pokedex[b].name,target,int);
}

//Unire 2 loadPokemon!!!
function AnotherLoadPokemon(pokemonName, target, int){
    console.log("int: "+int);
    let xhr = new XMLHttpRequest();
    xhr.onreadystatechange = function () {
        if (this.readyState == 4 && this.status == 200) {
            let jsonObject = JSON.parse(this.responseText);
            document.getElementById(target + int + "__card__name").innerHTML = jsonObject.forms[0].name;
            switch (target) {
                case "left":
                    leftSquad[int-1].name = jsonObject.forms[0].name;
                    //console.log(leftSquad[pokemonumber - 1].name);
                    // Store
                    localStorage.setItem(((target) + "-name" + int), jsonObject.forms[0].name);
                    //console.log("prova pokemon " + localStorage.getItem(((target) + "-name" + (pokemonumber - 1))));
                    break;
                case "right":
                    rightSquad[int-1].name = jsonObject.forms[0].name;
                    //console.log(rightSquad[pokemonumber - 1].name);
                    // Store
                    localStorage.setItem(((target) + "-name" + int), jsonObject.forms[0].name);
                    //console.log("prova pokemon " + localStorage.getItem(((target) + "-name" + (pokemonumber - 1))));
                    break;
            }

            document.getElementById(target + int + "-imagine").src = jsonObject.sprites.front_default;
            //sfondo

            //Controllare se interferisce con avanzo gioco
            /*if (pokemonumber == 6) {
                pokemonumber = 1;
                if (target == 'left' && cr == 0 || target == 'right' && cl == 0) {
                    changeTurn();
                }
            } else {
                pokemonumber++;
            }*/
        }

    };
    xhr.open("GET", `https://pokeapi.co/api/v2/pokemon/${pokemonName}/`, true);
    xhr.send();
}

function getStats(){

}

function ReLoadPokemonByName(ele){

    //get number from ele
    let int = ele.charAt((ele.split("__")[0]).length-1);

    //get target from ele
    let target = ele.split("__")[0].substring(0, ele.split("__")[0].length-1);

    //create text input
    var para = document.createElement("input");
    para.setAttribute("id","input-right");

    //check if input already exists
    var element = document.getElementById(target+int+"__card__name");
    if(document.getElementById("input-right") == null){
        element.appendChild(para);
    }else{
        console.log("Esiste gia");
        
        
        if(document.getElementById("pagewrap") == null){
            //creatre div match-list
            console.log("creo match-list"); 
            var autocomplete = document.createElement("div");
            autocomplete.setAttribute("id","pagewrap");
            
        }
        
            console.log("Creo gallery");
            //create class gallery
            
            var gallery = document.createElement("div");
            gallery.setAttribute("class", "gallery");
            autocomplete.appendChild(gallery);

            element.appendChild(autocomplete);

        
            
        
        AutoComplete(element);

        //Commentato per il autocomplete
        document.getElementById("input-right").addEventListener("keyup", function(event) {
            // Number 13 is the "Enter" key on the keyboard
            if (event.keyCode === 13) {
                // Cancel the default action, if needed
                event.preventDefault();
                // Load pokemon
                //AnotherLoadPokemon(document.getElementById("input-right").value, target, int);
                
                //delete input text
                document.getElementById("input-right").remove();
                document.getElementById("prova1").remove();
                document.getElementById("pagewrap").remove();
            }
          });
    }
    
    //loadPokemon()
}//End ReLoadPokemonByName

function AutoComplete(element){
    

    //autocomplete.appendChild(gallery);
    
    
    //element.appendChild(gallery);
    const search= document.getElementById('input-right');
    console.log("Prendo cose");
    const matchList = document.getElementsByClassName("gallery");

    const searchStates = async searchText => {
        const res = await fetch('script/pokedex.json');
        const states = await res.json();

        //get matches
        let matches = states.filter(name => {
            const regex = new RegExp(`^${searchText}`, 'gi');
            return name.name.match(regex) || name.name == (regex);
        });

        if(searchText.length == 0){
            matches = [];
        }


        outputHtml(matches);
    };

    const outputHtml = matches => {
        if(matches.length > 0){
            const html = matches.map(match =>`
                <article class="image">
                <img "https://res.cloudinary.com/dnroxbmjk/image/upload/v1462049388/img01_wqwpnu.jpg" >
                    <p>${match.name}</p>
                </article>
            `).join('');

            matchList[0].appendChild(html);
        }
    }
    //usare leveshtein
    search.addEventListener('input', () => searchStates(search.value));

}




