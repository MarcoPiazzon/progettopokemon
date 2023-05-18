var baseUrlpokemons = 'https://img.pokemondb.net/sprites/sword-shield/icon/';
var extensionpokemons = '.png';
var baseUrl = 'https://projectpokemon.org/images/normal-sprite/';
var extension = '.gif';
var turn = "";
var b;
var m;
var pokemonNameLeft = "";
var pokemonNameRight = "";
var globalTarget = "";




//Function for getting and loading information and start the battle
function loadFirst() {

    //Animaion of start Match
    AnimationStartMatch();

    //Create 2 object Pokemon to interact with 2 cards
    loadPokemonAsConstructor();

    //get and load information for prevoius page (pokemon squad)
    loadSquadPokemon('left');
    loadSquadPokemon('right');
    console.log(document.getElementById("pokemonsr1").getAttribute("hp_remain") + " hp remain right");


    //set buttons and image property correctly
    let l = document.getElementsByClassName("left-buttons");
    for (let i = 0; i < l.length; i++) {
        l[i].disabled = true;
    }
    let r = document.getElementsByClassName("right-buttons");
    for (let i = 0; i < r.length; i++) {
        r[i].disabled = true;
    }

    for (let i = 1; i < 7; i++) {
        document.getElementById('left' + i + "-imagine").draggable = false;
    }
    for (let i = 1; i < 7; i++) {
        document.getElementById('right' + i + "-imagine").draggable = false;
    }

    //set the card flipped
    flipCard();

    //set the moves's pokemon
    setMoves();

    //set automatically first turn
    setTurn();

}//End loadFirst

//Function that create 2 object Pokemon
function loadPokemonAsConstructor() {
    pokemonLeft = new Pokemon("", "", 'left', "");
    pokemonRight = new Pokemon("", "", 'right', "");
}

class Pokemon {
    constructor(name, url, target, hp, id) {
        this.name = name;
        this.url = url;
        this.target = target;
        this.hp = hp;
        this.id = id;
    }
}

// handle turns game functions //

function setTurn() {
    let bool = Math.floor(Math.random() * 2);
    //console.log(b);
    if (bool == 0) {
        turn = "left";
    } else {
        turn = "right";
    }

    document.getElementById(turn + "-turn").style.visibility = "visible";
    b = document.getElementsByClassName(turn + "-buttons");
    for (let i = 0; i < b.length; i++) {
        b[i].disabled = false;
    }

    for (let i = 1; i < 7; i++) {
        document.getElementById(turn + i + "-imagine").draggable = true;
    }

}//End setTurn

function changeTurn() {
    switch (turn) {
        case "left":
            b = document.getElementsByClassName(turn + "-buttons");
            for (let i = 0; i < b.length; i++) {
                b[i].disabled = true;
            }
            m = document.getElementsByClassName(turn + "-move");
            for (let i = 0; i < m.length; i++) {
                m[i].disabled = true;
            }
            for (let i = 1; i < 7; i++) {
                document.getElementById(turn + i + "-imagine").draggable = false;
            }
            document.getElementById(turn + "-turn").style.visibility = "hidden";
            turn = "right";
            b = document.getElementsByClassName(turn + "-buttons");
            for (let i = 0; i < b.length; i++) {
                b[i].disabled = false;
            }
            m = document.getElementsByClassName(turn + "-move");
            for (let i = 0; i < m.length; i++) {
                m[i].disabled = false;
            }
            for (let i = 1; i < 7; i++) {
                document.getElementById(turn + i + "-imagine").draggable = true;
            }
            document.getElementById(turn + "-turn").style.visibility = "visible";
            break;
        case "right":
            b = document.getElementsByClassName(turn + "-buttons");
            for (let i = 0; i < b.length; i++) {
                b[i].disabled = true;
            }
            m = document.getElementsByClassName(turn + "-move");
            for (let i = 0; i < m.length; i++) {
                m[i].disabled = true;
            }
            for (let i = 1; i < 7; i++) {
                document.getElementById(turn + i + "-imagine").draggable = false;
            }
            document.getElementById(turn + "-turn").style.visibility = "hidden";
            turn = "left";
            b = document.getElementsByClassName(turn + "-buttons");
            for (let i = 0; i < b.length; i++) {
                b[i].disabled = false;
            }
            m = document.getElementsByClassName(turn + "-move");
            for (let i = 0; i < m.length; i++) {
                m[i].disabled = false;
            }
            for (let i = 1; i < 7; i++) {
                document.getElementById(turn + i + "-imagine").draggable = true;
            }
            document.getElementById(turn + "-turn").style.visibility = "visible";
            break;
    }

}//End changeTurn

// handle turns game functions //


//-------------------------------------------------------------------------------//


// get, set, load information of pokemons functions //

function loadSquadPokemon(target) {
    for (let i = 0; i < 6; i++) {
        let xhr = new XMLHttpRequest();
        xhr.onreadystatechange = function () {
            if (this.readyState == 4 && this.status == 200) {
                let jsonObject = JSON.parse(this.responseText);
                switch (target) {
                    case 'left':
                        leftPokemons[i] = jsonObject;
                        document.getElementById("pokemonsl" + (i + 1)).setAttribute("hp_remain", jsonObject.stats[5].base_stat);

                        //Load the first pokemon's squad                        
                        if (i == 0)
                            loadPokemon(leftPokemons[i].forms[0].name, 'left');
                        break;

                    case 'right':
                        rightPokemons[i] = jsonObject;

                        document.getElementById("pokemonsr" + (i + 1)).setAttribute("hp_remain", jsonObject.stats[5].base_stat);

                        //Load the first pokemon's squad
                        if (i == 0)
                            loadPokemon(rightPokemons[i].forms[0].name, 'right');
                        break;
                }
                document.getElementById(target + (i + 1) + "__pokemons__name").innerHTML = jsonObject.forms[0].name;
                document.getElementById(target + (i + 1) + "-imagine").src = getpngByPokemonName(jsonObject.forms[0].name);

            }

        };
        switch (target) {
            case 'left':
                xhr.open("GET", `https://pokeapi.co/api/v2/pokemon/${leftSquad[i].name}/`, true);
                break;
            case 'right':
                xhr.open("GET", `https://pokeapi.co/api/v2/pokemon/${rightSquad[i].name}/`, true);
                break;
        }
        xhr.send();
    }

}//End loadSquadPokemon

function loadPokemon(pokemonName, target) {
    leftattacks = [];
    rightattacks = [];
    var jsonObject = {};

    switch (target) {
        case 'left':
            for (let i = 0; i < leftPokemons.length; i++) {
                console.log(pokemonName + " " + leftPokemons[i].forms[0].name + " aaaaaa");
                if (pokemonName == leftPokemons[i].forms[0].name) {

                    //get information of pokemon from array leftPokemons
                    jsonObject = leftPokemons[i];
                    leftpokemon = jsonObject;


                    //load information into constructor
                    pokemonLeft.name = pokemonName;
                    pokemonLeft.hp = jsonObject.stats[5].base_stat;
                    pokemonLeft.id = i + 1;
                    pokemonLeft.url = getpngByPokemonName(jsonObject.forms[0].name);

                    //load full information of pokemon
                    loadAnotherInformation(target, leftpokemon);
                    break;
                }
            }
            break;

        case 'right':
            for (let i = 0; i < rightPokemons.length; i++) {
                if (pokemonName == rightPokemons[i].forms[0].name) {
                    console.log("Dentro a loadPkemon");
                    //get information of pokemon from array rightPokemons
                    jsonObject = rightPokemons[i];
                    rightpokemon = jsonObject;

                    //load information into constructor
                    pokemonRight.name = pokemonName;
                    pokemonRight.hp = jsonObject.stats[5].base_stat;
                    pokemonRight.id = i + 1;
                    pokemonRight.url = getpngByPokemonName(jsonObject.forms[0].name);

                    //load full information of pokemon
                    loadAnotherInformation(target, rightpokemon);
                }

            }
            break;
    }
    //load moves of pokemon
    loadMovesPokemon(target, jsonObject, pokemonName);

    //set color of the card
    setCardColor(target);

    //check if the pokemon can mega-evolve 
    megaEvo(pokemonName, target);
    if (!pokemonName.includes("-mega")) {
        changeTurn();
    }

    SetProgerssBar(target);

}//End loadPokemon

function loadAnotherInformation(target, jsonObject) {
    let name = (jsonObject.forms[0].name);
    document.getElementById(target + "-pokemon-hp").innerHTML = jsonObject.stats[5].base_stat;
    switch (target) {
        case 'left':
            document.getElementById("hp-" + target + "Pokemon").innerHTML = document.getElementById("pokemonsl" + pokemonLeft.id).getAttribute("hp_remain") + "/" + jsonObject.stats[5].base_stat;
            break;

        case 'right':
            document.getElementById("hp-" + target + "Pokemon").innerHTML = document.getElementById("pokemonsr" + pokemonRight.id).getAttribute("hp_remain") + "/" + jsonObject.stats[5].base_stat;
            break;
    }

    document.getElementById(target + "-pokemon-attack").innerHTML = jsonObject.stats[4].base_stat;
    document.getElementById(target + "-pokemon-defense").innerHTML = jsonObject.stats[3].base_stat;
    document.getElementById(target + "-pokemon-special-attack").innerHTML = jsonObject.stats[2].base_stat;
    document.getElementById(target + "-pokemon-special-defense").innerHTML = jsonObject.stats[1].base_stat;
    document.getElementById(target + "-pokemon-speed").innerHTML = jsonObject.stats[0].base_stat;
    document.getElementById(target + "__card__name").innerHTML = name.replace(name.charAt(0), name.charAt(0).toUpperCase());
    document.getElementById(target + "-imagine").src = getGifByPokemonName(jsonObject.forms[0].name);
    document.getElementById(target + "-myBar").style.width = "100%";


    //abilità
    if (jsonObject.abilities[1] == null) {
        document.getElementById(target + "-pokemon-ability").innerHTML = jsonObject.abilities[0].ability.name;
    } else {
        document.getElementById(target + "-pokemon-ability").innerHTML = jsonObject.abilities[0].ability.name;
        document.getElementById(target + "-ability-hidden").innerHTML = jsonObject.abilities[1].ability.name;
    }
    //tipo
    if (jsonObject.types[1] == null) {
        document.getElementById(target + "-pokemon-type").setAttribute("first-type", jsonObject.types[0].type.name);
        document.getElementById(target + "-pokemon-type").setAttribute("second-type", "");
        document.getElementById(target + "-pokemon-type").innerHTML = jsonObject.types[0].type.name;
    } else {
        document.getElementById(target + "-pokemon-type").setAttribute("first-type", jsonObject.types[0].type.name);
        document.getElementById(target + "-pokemon-type").setAttribute("second-type", jsonObject.types[1].type.name);
        document.getElementById(target + "-pokemon-type").innerHTML = jsonObject.types[0].type.name + "/" + jsonObject.types[1].type.name;
    }

    //sfondo
    if (jsonObject.types[1] == null) {
        document.getElementById(target + "__card__type").setAttribute("first-type", jsonObject.types[0].type.name);
        document.getElementById(target + "__card__type").setAttribute("second-type", "");
        document.getElementById(target + "__card__type").className = "card card--" + jsonObject.types[0].type.name;
    } else {
        document.getElementById(target + "__card__type").setAttribute("first-type", jsonObject.types[0].type.name);
        document.getElementById(target + "__card__type").setAttribute("second-type", jsonObject.types[1].type.name);
        document.getElementById(target + "__card__type").className = "card card--" + jsonObject.types[0].type.name + "--" + jsonObject.types[1].type.name;
    }

}//End loadAnotherInformation

function loadMovesPokemon(target, jsonObject, pokemonName) {
    switch (target) {
        case 'left':
            for (let i = 0; i < leftmoveset.length; i++) {
                let m = i + 1;
                document.getElementById(target + "-move" + m).remove();
            }
            leftmoveset = [];
            break;
        case 'right':
            for (let i = 0; i < rightmoveset.length; i++) {
                let m = i + 1;
                document.getElementById(target + "-move" + m).remove();
            }
            rightmoveset = [];
            break;
    }

    for (let i = 0; i < jsonObject.moves.length; i++) {
        let m = i + 1;
        var button = document.createElement("button");
        button.setAttribute("id", target + "-move" + m);
        button.setAttribute("class", target + "-move");
        button.setAttribute("color", "");
        var node = document.createTextNode(jsonObject.moves[i].move.name);
        button.appendChild(node);
        button.addEventListener("click", function () {
            loadMove(m, target, url);
        });
        let url = jsonObject.moves[i].move.url;
        switch (target) {
            case 'left':
                leftmoveset[i] = {
                    name: jsonObject.moves[i].move.name,
                    url: url,
                };
                break;
            case 'right':
                rightmoveset[i] = {
                    name: jsonObject.moves[i].move.name,
                    url: url,
                };
                break;
        }

        var div = document.getElementById(target + "-moves");
        div.appendChild(button);
        if (!pokemonName.includes("-mega")) {
            document.getElementById(target + "-move" + m).disabled = true;
        }
    }
}//End loadMovesPokemon

function loadMove(movenumber, target, url) {
    document.getElementById(target + "-filter").value = "";
    let xhr = new XMLHttpRequest();
    xhr.onreadystatechange = function () {
        if (xhr.readyState == 4) {
            let jsonObject = JSON.parse(xhr.responseText);
            switch (target) {
                case 'left':
                    leftmove = jsonObject;
                    if (!leftattacks.includes(leftmove)) {
                        leftattacks.push(leftmove);
                    }
                    break;
                case 'right':
                    rightmove = jsonObject;
                    if (!rightattacks.includes(rightmove)) {
                        rightattacks.push(rightmove);
                    }
                    break;

            }//Switch

            document.getElementById(target + "-move" + movenumber).setAttribute("color", jsonObject.type.name);
            document.getElementById(target + "-move" + movenumber).setAttribute('style', 'background-color: ' + TypesColor.types[document.getElementById(target + "-move" + movenumber).getAttribute("color")].color_type);
        }
    };
    xhr.open("GET", url, false);
    xhr.send();
    damagec(document.getElementById(target + "-move" + movenumber).innerHTML, target);

}//End loadMove

function loadMega(pokemonName, target) {
    let xhr = new XMLHttpRequest();
    xhr.onreadystatechange = function () {
        if (this.readyState == 4) {
            let jsonObject = JSON.parse(this.responseText);
            switch (target) {
                case 'left':
                    leftPokemons.push(jsonObject);
                    break;
                case 'right':
                    rightPokemons.push(jsonObject);
                    break;
            }//Switch
        };
    }
    xhr.open("GET", `https://pokeapi.co/api/v2/pokemon/${pokemonName}/`, false);
    xhr.send();

}//End loadMega

function loadPokemonFromSquad(target) {
    for (let i = 0; i < 6; i++) {
        switch (target) {
            case 'left':
                leftSquad[i].name = localStorage.getItem(((target) + "-name" + (i)));
                //console.log(leftSquad[i].name);
                break;
            case 'right':
                rightSquad[i].name = localStorage.getItem(((target) + "-name" + (i)));
                //console.log(rightSquad[i].name);
                break;

        }//Switch
    }

}//End loadPokemonFromSquad

function evolution(pokemonName, target) {
    let b = Math.floor(Math.random() * 100) + 1;
    pokemonName = pokemonName + "-mega";
    for (let i = 0; i < pokedex.length; i++) {
        if (pokedex[i].name == pokemonName + "-x" || pokedex[i].name == pokemonName + "-y") {
            if (b <= 50) {
                pokemonName = pokemonName + "-x";
                i = pokedex.length;
            } else {
                pokemonName = pokemonName + "-y";
                i = pokedex.length;
            }
        }
    }
    loadMega(pokemonName, target);
    loadPokemon(pokemonName, target);
    // bottoni mosse

}//End evolution

function setMoves() {
    var leftfilter = document.getElementById('left-filter');
    var leftlistItems = document.getElementsByClassName('left-move');

    leftfilter.addEventListener('keyup', function (e) {
        var val = new RegExp(e.target.value, 'gi');
        for (var i = 0; i < leftlistItems.length; i++) {
            let m = i + 1;
            if (e.target.value.length > 0) {
                var text = leftlistItems[i].innerHTML;

                if (!text.match(val)) {
                    leftlistItems[i].classList.add('is-hidden');
                } else {
                    leftlistItems[i].classList.remove('is-hidden');
                }
            } else {
                leftlistItems[i].classList.remove('is-hidden');
            }

        }
    });

    var rightfilter = document.getElementById('right-filter');
    var rightlistItems = document.getElementsByClassName('right-move');

    rightfilter.addEventListener('keyup', function (e) {
        var val = new RegExp(e.target.value, 'gi');
        for (var i = 0; i < rightlistItems.length; i++) {
            let m = i + 1;
            if (e.target.value.length > 0) {
                var text = rightlistItems[i].innerHTML;

                if (!text.match(val)) {
                    rightlistItems[i].classList.add('is-hidden');
                } else {
                    rightlistItems[i].classList.remove('is-hidden');
                }
            } else {
                rightlistItems[i].classList.remove('is-hidden');
            }

        }
    });
}//End setMoves


// get, set, load information of pokemons functions //


//-------------------------------------------------------------------------------//


//Modal's function //

function SelectAnotherPokemonModal(target, choose) {
    // Get the modal
    var modal = document.getElementById("myModal");

    // Get the button that opens the modal
    var btn = document.getElementById("myBtn");


    // Get the <span> element that closes the modal
    var span = document.getElementsByClassName("close")[0];

    switch (choose) {
        //Normal
        case 1:
            // When the user clicks the button, open the modal
            modal.style.display = "block";
            loadPokemonInModal(target);
            break;
        //Poision
        case 2:
            modal.style.display = "block";
            loadPokemonInModal(target);
            CreateSpotPoison(target);
            break;
    }
    // When the user clicks on <span> (x), close the modal

    span.onclick = function () {
        switch (choose) {
            case 1:
                modal.style.display = "none";
                break;
            case 2:
                modal.style.display = "none";
                document.getElementById("poison-div").remove();
                break;

        }
    }
    // When the user clicks anywhere outside of the modal, close it
    window.onclick = function (event) {
        switch (choose) {
            case 1:
                if (event.target == modal) {
                    modal.style.display = "none";
                }
                break;
            case 2:
                if (event.target == modal) {
                    modal.style.display = "none";
                }
                document.getElementById("poison-div").remove();
                break;

        }

    }
}//End SelectAnotehrPokemonInModal

function loadPokemonInModal(target) {

    //try to get pokemon's hp 
    switch (target) {
        case 'left':
            for (let i = 0; i < leftPokemons.length; i++) {

                //get information of pokemon from array leftPokemons
                jsonObject = leftPokemons[i];
                leftpokemon = jsonObject;

                //load full information of pokemon
                loadAnotherInformationInModal(target, leftpokemon, i);

                //set ProgerssBar
                globalTarget = target;
                SetProgerssBarModal(target, i, leftpokemon);

                //set color
                //console.log(document.getElementById("pokemonsl" + (i + 1)).getAttribute("hp_remain") + " hp remain modal");
                if(document.getElementById("pokemonsl"+(i+1)).getAttribute("hp_remain") > 0){
                    setColorModal(i);
                }else{
                    console.log("pokrmon esausto");
                }

            }
            break;

        case 'right':
            for (let i = 0; i < rightPokemons.length; i++) {

                //get information of pokemon from array rightPokemons
                jsonObject = rightPokemons[i];
                rightpokemon = jsonObject;

                //load full information of pokemon
                globalTarget = target;
                loadAnotherInformationInModal(target, rightpokemon, i);

                //set ProgerssBar
                SetProgerssBarModal(target, i, rightpokemon);

                //set color
                if (document.getElementById("pokemonsr" + (i + 1)).getAttribute("hp_remain") > 0) {
                    setColorModal(i);
                } else {
                    console.log("pokrmon esausto");
                }
            }
            break;
    }
}//End loadPokemonInModal

//Function that load another pokemon's information
function loadAnotherInformationInModal(target, jsonObject, number) {

    //load pokemon's name and imagine
    let name = (jsonObject.forms[0].name);
    //console.log("name; "+name+ " number; "+number);
    document.getElementById(number + "__cardm__name").innerHTML = name.replace(name.charAt(0), name.charAt(0).toUpperCase());
    document.getElementById(number + "-imaginem").src = getGifByPokemonName(jsonObject.forms[0].name);
    document.getElementById(number + "__cardm__name").setAttribute("target", target);
    switch (target) {
        case 'left':
            document.getElementById("hp" + number + "-Pokemon").innerHTML = document.getElementById("pokemonsl" + (number + 1)).getAttribute("hp_remain") + "/" + leftPokemons[number].stats[5].base_stat;
            break;
        case 'right':
            document.getElementById("hp" + number + "-Pokemon").innerHTML = document.getElementById("pokemonsr" + (number + 1)).getAttribute("hp_remain") + "/" + rightPokemons[number].stats[5].base_stat;
            break;

    }


    //load background and pokemon's type
    //tipo
    if (jsonObject.types[1] == null) {
        document.getElementById(number + "-pokemon-type").setAttribute("first-type", jsonObject.types[0].type.name);
        document.getElementById(number + "-pokemon-type").setAttribute("second-type", "");
        document.getElementById(number + "-pokemon-type").innerHTML = jsonObject.types[0].type.name;
    } else {
        document.getElementById(number + "-pokemon-type").setAttribute("first-type", jsonObject.types[0].type.name);
        document.getElementById(number + "-pokemon-type").setAttribute("second-type", jsonObject.types[1].type.name);
        document.getElementById(number + "-pokemon-type").innerHTML = jsonObject.types[0].type.name + "/" + jsonObject.types[1].type.name;
    }

    //sfondo
    if (jsonObject.types[1] == null) {
        //console.log("carico0"+ " prova name: "+jsonObject.types[0].type.name);
        document.getElementById(number + "__cardm__type").setAttribute("first-type", jsonObject.types[0].type.name);
        document.getElementById(number + "__cardm__type").setAttribute("second-type", "");
        document.getElementById(number + "__cardm__type").className = "card-modal card--" + jsonObject.types[0].type.name;
    } else {
        //console.log("carico1"+jsonObject.types[0].type.name);
        document.getElementById(number + "__cardm__type").setAttribute("first-type", jsonObject.types[0].type.name);
        document.getElementById(number + "__cardm__type").setAttribute("second-type", jsonObject.types[1].type.name);
        document.getElementById(number + "__cardm__type").className = "card-modal card--" + jsonObject.types[0].type.name + "--" + jsonObject.types[1].type.name;
    }
}//End loadAnotherInfomrationInModal

//get id from card and load pokemon
function loadPokemonByClick(ele) {

    //get the number
    let number = parseInt(ele.charAt(0));

    //check if pokemon is alive or not
    switch (globalTarget) {
        case 'left':
            if (document.getElementById("pokemonsl" + (number + 1)).getAttribute("hp_remain") <= 0) {

                alert("Il pokemon è esausto");
            } else {
                loadPokemon(leftPokemons[number].forms[0].name, document.getElementById(ele.charAt(0) + "__cardm__name").getAttribute("target"));

                //close the modal
                document.getElementById("myModal").style.display = "none";
            }
            break;
        case 'right':
            if (document.getElementById("pokemonsr" + (number + 1)).getAttribute("hp_remain") <= 0) {

                alert("Il pokemon è esausto");
            } else {
                loadPokemon(rightPokemons[number].forms[0].name, document.getElementById(ele.charAt(0) + "__cardm__name").getAttribute("target"));

                //close the modal
                document.getElementById("myModal").style.display = "none";
            }
            break;
    }
    //console.log("alala: "+document.getElementById("pokemonsr"+(number+1)).getAttribute("hp_remain"));

    //load the Pokemon on PokemonLeft



}//End loadPokemonByClick

function SetProgerssBarModal(target, number, jsonObject) {
    let new_width = 0;
    let hp_remain = 0;
    switch (target) {
        case 'left':
            hp_remain = document.getElementById("pokemonsl" + (number + 1)).getAttribute("hp_remain");
            new_width = Math.round(((((hp_remain) * 100) / jsonObject.stats[5].base_stat) + Number.EPSILON) * 1) / 1;

            //setthe PorgressBar
            document.getElementById("-myBar" + number).style.width = new_width + "%";
            return new_width;
        case 'right':
            hp_remain = document.getElementById("pokemonsr" + (number + 1)).getAttribute("hp_remain");
            new_width = Math.round(((((hp_remain) * 100) / jsonObject.stats[5].base_stat) + Number.EPSILON) * 1) / 1;

            //set the ProgressBar
            document.getElementById("-myBar" + number).style.width = new_width + "%";
            return new_width;
    }
}//End SetProgerssBarModal

function setColorModal(number) {
    console.log("Number: "+number);
    if (!document.getElementById(number + '-pokemon-type').getAttribute('second-type') == "") {
        document.getElementById(number + "-pokemon-type").setAttribute('style', 'background: linear-gradient(to right,' + TypesColor.types[document.getElementById(number + '-pokemon-type').getAttribute("first-type")].color_type + ',' +
            TypesColor.types[document.getElementById(number + '-pokemon-type').getAttribute("second-type")].color_type + ');');
    } else {//un tipo
        document.getElementById(number + "-pokemon-type").setAttribute('style', 'background-color: ' + TypesColor.types[document.getElementById(number + '-pokemon-type').getAttribute("first-type")].color_type);

    }

    if (!document.getElementById(number + "__cardm__type").getAttribute('second-type') == "") {

        document.getElementById(number + "__cardm__type").setAttribute('style', 'background: linear-gradient(to right,' + TypesColor.types[document.getElementById(number + '__cardm__type').getAttribute("first-type")].color_type + ',' +
        TypesColor.types[document.getElementById(number + '__cardm__type').getAttribute("second-type")].color_type + ');');

    } else {//un tipo
        document.getElementById(number + "__cardm__type").setAttribute('style', 'background-color: ' + TypesColor.types[document.getElementById(number + '__cardm__type').getAttribute("first-type")].color_type);

    }
}//End setColor

function loadPokemonModalForPoison(target) {
    //try to get pokemon's hp 
    switch (target) {
        case 'left':
            for (let i = 0; i < leftPokemons.length; i++) {

                //get information of pokemon from array leftPokemons
                jsonObject = leftPokemons[i];
                leftpokemon = jsonObject;

                //load full information of pokemon
                loadAnotherInformationInModal(target, leftpokemon, i);

                //set ProgerssBar
                globalTarget = target;
                SetProgerssBarModal(target, i, leftpokemon);

                //set color
                console.log(document.getElementById("pokemonsl" + (i + 1)).getAttribute("hp_remain") + " hp remain modal");
                if (document.getElementById("pokemonsl" + (i + 1)).getAttribute("hp_remain") > 0) {
                    setColorModal(target, i);
                } else {
                    console.log("pokrmon esausto");
                }

            }
            break;

        case 'right':
            for (let i = 0; i < rightPokemons.length; i++) {

                //get information of pokemon from array rightPokemons
                jsonObject = rightPokemons[i];
                rightpokemon = jsonObject;

                //load full information of pokemon
                globalTarget = target;
                loadAnotherInformationInModal(target, rightpokemon, i);

                //set ProgerssBar
                SetProgerssBarModal(target, i, rightpokemon);

                //set color
                if (document.getElementById("pokemonsr" + (i + 1)).getAttribute("hp_remain") > 0) {
                    setColorModal(target, i);
                } else {
                    console.log("pokrmon esausto");
                }
            }
            break;
    }
}//End loadPokemonModalForPoison

function CreateSpotPoison(target) {
    let div_poison = document.createElement("div");
    div_poison.setAttribute("id", "poison-div");

    let img = document.createElement("img");
    img.setAttribute("class", "tool_image-container");
    img.setAttribute("id", "super-poison2");
    img.src = "https://media.pokemoncentral.it/wiki/thumb/f/f8/GO_Superpozione.png/200px-GO_Superpozione.png";
    img.addEventListener("dragstart", function (event) {
        // The dataTransfer.setData() method sets the data type and the value of the dragged data
        event.dataTransfer.setData('Text/html', event.target.id);
    });
    div_poison.appendChild(img);

    let img1 = document.createElement("img");
    img1.setAttribute("class", "tool_image-container");
    img1.setAttribute("id", "normal-poison1");

    img1.src = "https://digilander.libero.it/antares73bo/images/pozione.png";
    img1.addEventListener("dragstart", function (event) {
        // The dataTransfer.setData() method sets the data type and the value of the dragged data
        event.dataTransfer.setData('Text/html', event.target.id);
    });

    div_poison.appendChild(img1);

    let img2 = document.createElement("img");
    img2.setAttribute("class", "tool_image-container");
    img2.setAttribute("id", "revive-poison3");

    img2.src = "https://media.pokemoncentral.it/wiki/thumb/7/7d/GO_Revitalizzante_Max.png/200px-GO_Revitalizzante_Max.png";
    img2.addEventListener("dragstart", function (event) {
        // The dataTransfer.setData() method sets the data type and the value of the dragged data
        event.dataTransfer.setData('Text/html', event.target.id);
    });

    div_poison.appendChild(img2);


    document.getElementById("div1").appendChild(div_poison);

    //Listener poison


}//End CreateSpotPoison

function UsePoison(target, choose, position) {
    let elem = document.getElementById("hp" + position + "-Pokemon").innerText;
    switch (choose) {
        //normal poision
        case "1":
            //check all life
            //check if user has another poison
            document.getElementById("hp" + position + "-Pokemon").innerText = (parseInt(elem.split("/")[0]) + 20) + "/" + (elem.split("/")[1]);
            break;
        //super poison
        case "2":
            document.getElementById("hp" + position + "-Pokemon").innerText = (parseInt(elem.split("/")[0]) + 50) + "/" + (elem.split("/")[1]);
            break;
        //revive
        case "3":
            console.log("cxcc");
            document.getElementById("hp" + position + "-Pokemon").innerText = (elem.split("/")[1]) + "/" + (elem.split("/")[1]);
            break;
    }
}//End UsePoison
//Modal's function //


//-------------------------------------------------------------------------------//


// ProgressBar, Winner check functions //

//Function for all the animation's attack
function DamageLifePokemon(target, damage) {
    AnimationAttack(target, damage);
  
}//End DamageLifePokemon

function DisableDeadPokemon(target) {
    //console.log("pokemonName: "+pokemonLeft.name);
    //console.log("target: "+target);
    for (let i = 0; i < 6; i++) {
        switch (target) {
            case 'left':
                if (pokemonLeft.name == leftPokemons[i].forms[0].name) {
                    document.getElementById(target + (i + 1) + "-imagine").draggable = false;
                    document.getElementById("pokemonsl" + (i + 1)).style.backgroundColor = "grey";
                    if (CheckIfAnotherPokemonALive(target)) {
                        SelectAnotherPokemonModal(target, 1);
                    } else {
                        SetWinner(target);
                    }
                }
                break;
            case 'right':
                if (pokemonRight.name == rightPokemons[i].forms[0].name) {
                    document.getElementById(target + (i + 1) + "-imagine").draggable = false;
                    document.getElementById("pokemonsr" + (i + 1)).style.backgroundColor = "grey";
                    if (CheckIfAnotherPokemonALive(target)) {
                        //SelectAnotherPokemon(target); 
                        SelectAnotherPokemonModal(target, 1);
                    } else {
                        SetWinner(taregt);
                    }
                }
                break;

        }

    }
}//End CheckIfAnotherPokemonALive

function CheckIfAnotherPokemonALive(target) {

    //check if there is another live pokemon in the squad
    switch (target) {
        case 'left':
            for (let i = 0; i < 6; i++) {
                if (document.getElementById("pokemonsl" + (i + 1)).style.backgroundColor != "grey") {
                    return true;
                }
            }
            return false;
        case 'right':
            for (let i = 0; i < 6; i++) {
                if (document.getElementById("pokemonsr" + (i + 1)).style.backgroundColor != "grey") {
                    return true;
                }
            }
            return false;
    }

}//End CheckIfAnotherPokemonALive

function SetProgerssBar(target) {
    let new_width = 0;
    let hp_remain = 0;
    switch (target) {
        case 'left':
            hp_remain = document.getElementById("pokemonsl" + (pokemonLeft.id)).getAttribute("hp_remain");
            //console.log("hp remain: "+((hp_remain)*100)/pokemonLeft.hp);
            new_width = Math.round(((((hp_remain) * 100) / pokemonLeft.hp) + Number.EPSILON) * 1) / 1;
            //console.log("new width: "+new_width);
            document.getElementById(target + "-myBar").style.width = new_width + "%";
            break;
        case 'right':
            hp_remain = document.getElementById("pokemonsr" + (pokemonRight.id)).getAttribute("hp_remain");
            //console.log("hp remain: "+((hp_remain)*100)/pokemonRight.hp);
            new_width = Math.round(((((hp_remain) * 100) / pokemonRight.hp) + Number.EPSILON) * 1) / 1;
            document.getElementById(target + "-myBar").style.width = new_width + "%";
            break;
    }
}//End SetProgerssBar

function SelectAnotherPokemon(target) {

    //set another pokemon after the pokemon deads
    out: for (let i = 0; i < 6; i++) {
        switch (target) {
            case 'left':
                console.log("Prova bool: " + document.getElementById("pokemonsl" + (i + 1)).style.backgroundColor != "grey");
                if (document.getElementById("pokemonsl" + (i + 1)).style.backgroundColor != "grey") {
                    console.log("Por va carico: " + leftPokemons[i].forms[0].name);
                    loadPokemon(leftPokemons[i].forms[0].name, target);
                    break;
                }
                break out;
            case 'right':
                if (document.getElementById("pokemonsr" + (i + 1)).style.backgroundColor != "grey") {
                    console.log("rigth selectanother pokemon");
                    loadPokemon(rightPokemons[i].forms[0].name, target);
                    break;
                }
                break out;
        }

    }
}//End SelectAnotherPokemon

function SetProgressBarAfterAttack(target, attack) {
    //set the progressbar after the opponent attack
    let new_width = 0;
    let hp_remain = 0;
    switch (target) {
        case 'left':
            //console.log("prova progressbar: "+ (((hp_remain-attack)*100) / pokemonLeft.hp));
            hp_remain = document.getElementById("pokemonsl" + (pokemonLeft.id)).getAttribute("hp_remain");
            new_width = Math.round(((((hp_remain - attack) * 100) / pokemonLeft.hp) + Number.EPSILON) * 1) / 1;


            //console.log("provas hp remain attribute"+document.getElementById("hp-"+target+"Pokemon").getAttribute("hp_remain"));
            if ((hp_remain - attack) > 0) {
                hp_remain = hp_remain - attack;
                document.getElementById("pokemonsl" + pokemonLeft.id).setAttribute("hp_remain", hp_remain);
                document.getElementById("hp-" + target + "Pokemon").innerHTML = hp_remain + "/" + pokemonLeft.hp;
            } else {
                document.getElementById("hp-" + target + "Pokemon").innerHTML = 0 + "/" + pokemonLeft.hp;
                document.getElementById("pokemonsl" + pokemonLeft.id).setAttribute("hp_remain", 0);
            }


            return new_width;
        case 'right':
            //console.log("prova progressbar: "+ (((document.getElementById("hp-"+target+"Pokemon").innerHTML-attack)*100) / pokemonRight.hp));
            hp_remain = document.getElementById("pokemonsr" + (pokemonRight.id)).getAttribute("hp_remain");
            new_width = Math.round(((((hp_remain - attack) * 100) / pokemonRight.hp) + Number.EPSILON) * 1) / 1;
            if ((hp_remain - attack) > 0) {
                hp_remain = hp_remain - attack;
                document.getElementById("pokemonsr" + pokemonRight.id).setAttribute("hp_remain", hp_remain);
                document.getElementById("hp-" + target + "Pokemon").innerHTML = hp_remain + "/" + pokemonRight.hp;
            } else {
                document.getElementById("hp-" + target + "Pokemon").innerHTML = 0 + "/" + pokemonRight.hp;
                document.getElementById("pokemonsr" + pokemonRight.id).setAttribute("hp_remain", 0);
            }
            return new_width;
    }



    /* switch(target){
         case 'left':
             console.log("progress abr: "+document.getElementById("left-myBar").style.width.replace("%",""));
             console.log("hp: "+(pokemonLeft.hp*100));
             let final_value = ((100*pokemonLeft.hp) / (document.getElementById("right-myBar").style.width.replace("%","")-attack));
             console.log("valore left: "+final_value);
             return final_value;
         case 'right':
             console.log("hp 2:"+pokemonRight.hp);
             console.log("Valore right: " +((100*pokemonRight.hp) / document.getElementById("left-myBar").style.width.replace("%","")));
             return ((100*pokemonRight.hp) / document.getElementById("left-myBar").style.width);
     }*/

}//End SetProgressBarAfterAttack

function SetWinner(target) {
    alert("Perde il player di " + target + "!!!!");
    location.reload();
}//End SetWinner

// ProgressBar, Winner check functions //


//-------------------------------------------------------------------------------//

// Set Card Style //

function getpngByPokemonName(pokemonName) {
    let lowercasePokemonName = pokemonName.toLowerCase();
    let pokemonUrlName = lowercasePokemonName
        .replace(/\./g, '')
        .replace(/'/g, '')
        .replace(/\s/g, "-");
    return baseUrlpokemons + pokemonUrlName + extensionpokemons;

}//End getpngByPokemonName

function setCardColor(target) {
    if (!document.getElementById(target + '-pokemon-type').getAttribute('second-type') == "") {
        document.getElementById(target + "-pokemon-type").setAttribute('style', 'background: linear-gradient(to right,' + TypesColor.types[document.getElementById(target + '-pokemon-type').getAttribute("first-type")].color_type + ',' +
            TypesColor.types[document.getElementById(target + '-pokemon-type').getAttribute("second-type")].color_type + ');');
    } else {//un tipo
        document.getElementById(target + "-pokemon-type").setAttribute('style', 'background-color: ' + TypesColor.types[document.getElementById(target + '-pokemon-type').getAttribute("first-type")].color_type);

    }

    if (!document.getElementById(target + '__card__type').getAttribute('second-type') == "") {

        document.getElementById(target + "__card__type").setAttribute('style', 'background: linear-gradient(to right,' + TypesColor.types[document.getElementById(target + '__card__type').getAttribute("first-type")].color_type + ',' +
            TypesColor.types[document.getElementById(target + '__card__type').getAttribute("second-type")].color_type + ');');

    } else {//un tipo
        document.getElementById(target + "__card__type").setAttribute('style', 'background-color: ' + TypesColor.types[document.getElementById(target + '__card__type').getAttribute("first-type")].color_type);

    }

}//End setColor

function getGifByPokemonName(pokemonName) {
    var lowercasePokemonName = pokemonName.toLowerCase();
    if (lowercasePokemonName.includes("mega-x")) {
        lowercasePokemonName = lowercasePokemonName.replace("-x", "x");
    }
    if (lowercasePokemonName.includes("mega-y")) {
        lowercasePokemonName = lowercasePokemonName.replace("-y", "y");
    }
    // if (lowercasePokemonName.includes("-") && !lowercasePokemonName.includes("mega")) {
    //     lowercasePokemonName = lowercasePokemonName.replace("-", "");
    // }
    var pokemonUrlName = lowercasePokemonName
        .replace(/\./g, '')
        .replace(/'/g, '')
        .replace(/\s/g, "-");
    return baseUrl + pokemonUrlName + extension;

}//End getGifByPokemonName

function megaEvo(pokemonName, target) {
    for (let i = 0; i < pokedex.length; i++) {
        if (pokedex[i].name == pokemonName + "-mega" || pokedex[i].name == pokemonName + "-mega-x" || pokedex[i].name == pokemonName + "-mega-y") {
            document.getElementById("mega-evo-" + target).style.visibility = "visible";
            i = pokedex.length;
        } else {
            document.getElementById("mega-evo-" + target).style.visibility = "hidden";
        }
    }

}//End megaEvo


// Set Card Style //


//-------------------------------------------------------------------------------//

// Drag and Drop functions //
function allowDrop(ev) {
    ev.preventDefault();

}//End allowDrop

function drag(ev) {
    ev.dataTransfer.setData('Text/html', ev.target.id);

}//End drag

function drop(ev, target_data, target) {
    ev.preventDefault();

    var data = ev.dataTransfer.getData("text/html");
    //alert(data);

    if (data.includes("poison")) {
        target_data.id.charAt(0); //Position pokemon
        UsePoison("", data.charAt(data.length - 1), target_data.id.charAt(0));
    } else {
        let name = (ev.dataTransfer.getData("text/html")); //prende il id dell'immagine da cui ricaverà il nome del pokemon

        //get name Pokemon
        name = name.split('-')[0];

        if ((document.getElementById(name + "__pokemons__name").innerText != "")) {
            loadPokemon((document.getElementById(name + "__pokemons__name").innerText), turn);
            switch (turn) {
                case 'left':
                    pokemonNameLeft = (document.getElementById(name + "__pokemons__name").innerText);
                    break;
                case 'right':
                    pokemonNameRight = (document.getElementById(name + "__pokemons__name").innerText);
            }
        }
    }



}//End drop

function flipCard() {
    //console.log("ok");
    let bl = document.querySelector('#left-imagine')
    bl.addEventListener('click', function () {
        console.log("ok");
        document.querySelector('#left__card__type').classList.toggle('flipped');
    });
    //console.log("ok");
    let br = document.querySelector('#right-imagine')
    br.addEventListener('click', function () {
        console.log("ok");
        document.querySelector('#right__card__type').classList.toggle('flipped');
    });
}
// Drag and Drop functions //


//-------------------------------------------------------------------------------//

function AnimationAttack(target, damage) {
    //target è il bersaglio da colpire

    var offsets = document.getElementById(target + "-imagine").getBoundingClientRect();

    document.getElementById(target + "__card__type").style.zIndex = 0;

    var new_target = "";
    //change target
    switch (target) {
        case 'left':
            new_target = "right";
            break;
        case 'right':
            new_target = "left";
            break;
    }
    var offsets1 = document.getElementById(new_target + "-imagine").getBoundingClientRect();
    //set principal card z-index = 1
    var elem = document.getElementById(new_target + "-imagine");
    document.getElementById(new_target + "__card__type").style.zIndex = 1;

    var percorso = Math.round(((offsets.left - offsets1.left) + Number.EPSILON) * 1) / 1;

    $("#" + new_target + "-imagine").animate({
        left: percorso,
    }, {
        duration: 1000,
        complete: function () {
            elem.style.left = 0;
            AnimationDamage(target, damage);

            //Todo DisappearAttack
            DisappaerAttack(target);
            
            AnimationProgressBar(target, damage);
        }
    });

}//End AnimationAttack

//Disappaer and reappaer pokemon when under attack
function DisappaerAttack(target) {

    target = ((target == "left") ? "left" : "right");

    $("#"+target+"-imagine").animate({

    }, {
        duration: 1000,
        complete: function () {
        }
    });


}//End DisappearAttack

function AnimationDeadPokemon(target) {
    console.log("Tagret in Animation Dead Pokemon: "+target);
    $("#"+target+"-imagine").animate({
        top: "50px",
        opacity: 0
    }, {
        duration: "slow",
        complete: function () {
            DisableDeadPokemon(target);
            document.getElementById(target + "-imagine").style.opacity = 1;
            document.getElementById(target + "-imagine").style.top = "0px";
            
        }
    })
    //oncomplete

}//End AnimationDeadPokemon
//Create the damage "subito" over pokemon's image
function AnimationDamage(target, attack) {
    //AnimationSostitutePokemon(target);

    let damage = document.createElement("div");
    damage.setAttribute("class", "text-block");
    damage.setAttribute("id", "damagepokemon");
    damage.innerHTML = "-" + attack;

    console.log("creo p");
    //document.getElementById("prova"+target).appendChild(damage);

    $("#damagepokemon").animate({
        top: "-50px",
        left: "50px",
        fontSize: "30px"
    },
        {
            duration: "slow",
            complete: function () {
                document.getElementById("damagepokemon").remove();
            }
        });

}//End AnimationDamage

function AnimationSostitutePokemon(target, pokemonName) {

    let position = findIntPokemonSquad(target, pokemonName);

    let dimension = document.getElementById(target + "-imagine").getBoundingClientRect();
    let dimension1 = document.getElementById("pokemons" + target.charAt(0) + position).getBoundingClientRect();

    document.getElementById("pokemons" + target.charAt(0) + position).style.zIndex = 100;

    let difference_top = dimension.top - dimension1.top;
    let differnce_left = dimension.left - dimension1.left;

    //try to make bigger the image
    $("#pokemons" + target.charAt(0) + position).animate({
        left: (differnce_left),
        top: (difference_top),
        width: "50px",
        height: "50px"
    },
        {
            duration: "slow",
            complete: function () {
                loadPokemon(pokemonName, target);
                $("#pokemons" + target.charAt(0) + position).animate({
                    left: 0,
                    top: 0,
                },
                    {
                        duration: "slow"
                    });
            }
        });

    document.getElementById("pokemons" + target.charAt(0) + position).style.zIndex = 0;
}//End AnimationSostitutePokemon

//Return the position of pokemon into the squad
function findIntPokemonSquad(target, pokemonName) {
    switch (target) {
        case 'right':
            for (let i = 0; i < 6; i++) {
                if (rightPokemons[i].forms[0].name == pokemonName) {
                    return (i + 1);
                }
            }
            return 0;
        case 'left':
            for (let i = 0; i < 6; i++) {
                if (leftPokemons[i].forms[0].name == pokemonName) {
                    return (i + 1);
                }
            }
            return 0;
    }
    // to implement with target


}//End findIntPokemonSquad

function AnimationStartMatch() {
    $("#start").animate({
        height: "1000px",
        width: "1000px",
    },
        {
            duration: 3000,
            complete: function () {
                document.getElementById("start").remove();
                document.getElementById("overlay").style.display = "none";
                loadFirst();
            }
        });
}//End AnimationStartMatch

function AnimationProgressBar(target, damage) {
    var elem = document.getElementById(target + "-myBar");
    var width_bar = elem.style.width.replace("%", "");

    //set Animation
    //AnimationAttack(target);
    //get life remain of pokemon
    let life_remain = SetProgressBarAfterAttack(target, damage);
    console.log("width: " + width_bar + " life_remain: " + life_remain);
    $("#" + target + "-myBar").animate({
        width: life_remain + "%",
    }, {
        duration: 1500,
        complete: function () {
            //rendere query AnimationAttack


            if (elem.style.width.replace("%", "") <= 0) {
                AnimationDeadPokemon(target);
                
            }
        }
    });
}//End AnimationProgressBar
//-------------------------------------------------------------------------------//


// Calculate damage functions //
let leftdamage = 0;
let rightdamage = 0;
let ld = 0;
let rd = 0;

function damagec(move, target) {
    console.log(move);
    let damage = 0;
    let level = 110;
    let power = 0;
    // let modifier = 0;
    let A = 0;
    let B = 0;
    switch (target) {
        case 'left':
            power = leftmove.power;
            if (leftmove.damage_class.name == 'physical') {
                A = leftpokemon.stats[4].base_stat;
                B = rightpokemon.stats[3].base_stat;
            } else {
                A = leftpokemon.stats[2].base_stat;
                B = rightpokemon.stats[1].base_stat;
            }
            break;
        case 'right':
            power = rightmove.power;
            if (rightmove.damage_class.name == 'physical') {
                A = rightpokemon.stats[4].base_stat;
                B = leftpokemon.stats[3].base_stat;
            } else {
                A = rightpokemon.stats[2].base_stat;
                B = leftpokemon.stats[1].base_stat;
            }
            break;
    }
    damage = ((level * power * A) / (250 * B)) + 2

    // modifier
    let efficency = 0;
    var e1 = 0;
    var e2 = 0;
    var movetype = "";
    let stab = 1;

    var TYPES = ["normal", "fire", "water", "electric", "grass", "ice", "fighting", "poison", "ground", "flying", "psychic", "bug", "rock", "ghost", "dragon", "dark", "steel"];

    var TYPE_CHART = {
        normal: [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0.5, 0, 1, 1, 0.5],
        fire: [1, 0.5, 0.5, 1, 2, 2, 1, 1, 1, 1, 1, 2, 0.5, 1, 0.5, 1, 2],
        water: [1, 2, 0.5, 1, 0.5, 1, 1, 1, 2, 1, 1, 1, 2, 1, 0.5, 1, 1],
        electric: [1, 1, 2, 0.5, 0.5, 1, 1, 1, 0, 2, 1, 1, 1, 1, 0.5, 1, 1],
        grass: [1, 0.5, 2, 1, 0.5, 1, 1, 0.5, 2, 0.5, 1, 0.5, 2, 1, 0.5, 1, 0.5],
        ice: [1, 0.5, 0.5, 1, 2, 0.5, 1, 1, 2, 2, 1, 1, 1, 1, 2, 1, 0.5],
        fighting: [2, 1, 1, 1, 1, 2, 1, 0.5, 1, 0.5, 0.5, 0.5, 2, 0, 1, 2, 2],
        poison: [1, 1, 1, 1, 2, 1, 1, 0.5, 0.5, 1, 1, 1, 0.5, 0.5, 1, 1, 0],
        ground: [1, 2, 1, 2, 0.5, 1, 1, 2, 1, 0, 1, 0.5, 2, 1, 1, 1, 2],
        flying: [1, 1, 1, 0.5, 2, 1, 2, 1, 1, 1, 1, 2, 0.5, 1, 1, 1, 0.5],
        psychic: [1, 1, 1, 1, 1, 1, 2, 2, 1, 1, 0.5, 1, 1, 1, 1, 0, 0.5],
        bug: [1, 0.5, 1, 1, 2, 1, 0.5, 0.5, 1, 0.5, 2, 1, 1, 0.5, 1, 2, 0.5],
        rock: [1, 2, 1, 1, 1, 2, 0.5, 1, 0.5, 2, 1, 2, 1, 1, 1, 1, 0.5],
        ghost: [0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 2, 1, 1, 2, 1, 0.5, 0.5],
        dragon: [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 2, 1, 0.5],
        dark: [1, 1, 1, 1, 1, 1, 0.5, 1, 1, 1, 2, 1, 1, 2, 1, 0.5, 0.5],
        steel: [1, 0.5, 0.5, 0.5, 1, 2, 1, 1, 1, 1, 1, 1, 2, 1, 1, 1, 0.5]
    };
    switch (target) {
        case 'left':
            movetype = leftmove.type.name;
            if (rightpokemon.types[1] == null) {
                for (let j = 0; j < TYPES.length; j++) {
                    if (TYPES[j] == rightpokemon.types[0].type.name) {
                        efficency = TYPE_CHART[movetype][j];
                        if (TYPES[j] == TYPE_CHART[movetype]) {
                            stab = 1.5;
                        }
                    }
                }
            } else {
                for (let k = 0; k < TYPES.length; k++) {
                    if (TYPES[k] == rightpokemon.types[0].type.name) {
                        e1 = TYPE_CHART[movetype][k];
                    }
                    if (TYPES[k] == rightpokemon.types[1].type.name) {
                        //console.log(k);
                        e2 = TYPE_CHART[movetype][k];
                    }
                }

                if (e1 >= e2) {
                    efficency = e2;
                } else {
                    efficency = e1;
                }

            }

            damage = damage * efficency * stab;
            DamageLifePokemon('right', Math.round((damage + Number.EPSILON) * 1) / 1);
            break;
        case 'right':
            movetype = rightmove.type.name;
            if (leftpokemon.types[1] == null) {
                for (let j = 0; j < TYPES.length; j++) {
                    if (TYPES[j] == leftpokemon.types[0].type.name) {
                        efficency = TYPE_CHART[movetype][j];
                        if (TYPES[j] == TYPE_CHART[movetype]) {
                            stab = 1.5;
                        }
                    }
                }
            } else {
                for (let k = 0; k < TYPES.length; k++) {
                    if (TYPES[k] == leftpokemon.types[0].type.name) {
                        e1 = TYPE_CHART[movetype][k];
                    }
                    if (TYPES[k] == leftpokemon.types[1].type.name) {
                        //console.log(k);
                        e2 = TYPE_CHART[movetype][k];
                    }
                }

                if (e1 >= e2) {
                    efficency = e2;
                } else {
                    efficency = e1;
                }

            }
            damage = damage * efficency * stab;
            DamageLifePokemon('left', Math.round((damage + Number.EPSILON) * 1) / 1);
            break;

    }//Switch

    //console.log(efficency);

    switch (target) {
        case 'left':
            leftdamage = damage;
            break;
        case 'right':
            rightdamage = damage;
            break;

    }

    /*  if (ld == 1) {
          if (leftpokemon.stats[0].base_stat > rightpokemon.stats[0].base_stat) {
              console.log( Math.round((leftdamage+Number.EPSILON)*1)/1+ " leftdamage");
              // left attacca right
              
              console.log(Math.round((rightdamage+Number.EPSILON)*1)/1+ " rightdamage");
              //right attacca left
              //DamageLifePokemon('left',Math.round((rightdamage+Number.EPSILON)*1)/1);
              leftdamage = 0;
              rightdamage = 0;
              ld = 0;
          } else if(rd == 1){
              console.log("rightdamage "+Math.round((rightdamage+Number.EPSILON)*1)/1);
              
              //right attacca left
              console.log("leftdamage "+Math.round((leftdamage+Number.EPSILON)*1)/1);
              // left attacca right
              //DamageLifePokemon('right', Math.round((leftdamage+Number.EPSILON)*1)/1);
              leftdamage = 0;
              rightdamage = 0;
              rd = 0;
          }
      }*/

    changeTurn();

}//End damagec

// Calculate damage functions //