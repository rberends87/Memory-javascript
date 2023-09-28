//declareren variabelen
const gametime = 180;
const intervalspeed = 1000;
var myInterval = false;
var passedtime = 0;
var lefttime = 0;
var theme = "LoremApi";
var cardgame;
var cardclosedcolor;
var cardopencolor;
var cardfoundcolor;



//maakt een nieuw spel met kaarten aan
function createGame() {
    clearCards();
    resetTimer();
    cardgame = new CardGame();
    cardgame.Init(getBoardsize())

    .then(() => {
        
        printFoundPairs();
        refreshCards();
    })
}

//scherm wat wordt weergegeven zolang het spel geladen wordt
function clearCards() {
    document.getElementById("speelveld").innerHTML = "<h1>Aan het laden...</h1>";
}

//functie welke vanuit de interval (elke seconde) doorlopen wordt
function gameTimer() {
    document.getElementById("timepassed").innerHTML = timePassed();
    document.getElementById("timeleft").innerHTML = timeLeft();
    document.getElementById("timerpassedtime").style.width = timePassedBar();
    document.getElementById("timerlefttime").style.width = timeLeftBar();
    if (lefttime == 0) {
        clearInterval(myInterval);
        setTimeout(timeOver, 100);
    }
}

//start de timer
function startTimer() {
    myInterval = setInterval(gameTimer, intervalspeed);
}

//stopt de timer
function stopTimer() {
    clearInterval(myInterval);
}

//reset de timer
function resetTimer() {
    stopTimer();
    myInterval = false;
    passedtime = 0;
    lefttime = gametime;
    let passedtimetext ="Verlopen tijd: "+passedtime;
    let lefttimetext = "Resterende tijd: "+lefttime;
    document.getElementById("timepassed").innerHTML = passedtimetext;
    document.getElementById("timeleft").innerHTML = lefttimetext;
    document.getElementById("timerpassedtime").style.width = timePassedBar();
    document.getElementById("timerlefttime").style.width = timeLeftBar();
}

//functie welke de output voor de verlopen tijd genereerd
function timePassed() {
    passedtime = passedtime +1;
    let passedtimetext ="Verlopen tijd: "+passedtime;
    return passedtimetext;
}

//functie welke de output voor de resterende tijd genereerd
function timeLeft() {
    lefttime = lefttime -1;
    let lefttimetext = "Resterende tijd: "+lefttime;
    return lefttimetext;
}

//functie welke de output voor de verlopen tijd genereerd in de tijdsbalk
function timePassedBar() {
    let percentagepassed = Math.round(passedtime/gametime*98)+'%';
    return percentagepassed;
}

//functie welke de output voor de resterende tijd genereerd in de tijdsbalk
function timeLeftBar() {
    let percentageleft = Math.round(lefttime/gametime*98)+'%';
    return percentageleft;
}

//acties die worden uitgevoerd wanneer de tijd om is
function timeOver() {
    closeCards();
    refreshCards();
    setTimeout(endGame, 10);
}

//alert welke verschijnt wanneer de tijd om is
function endGame(){
    alert("De tijd is om");
}

//functie die het aantal gevonden paren naar het scherm print
function printFoundPairs() {
    let foundpairs = cardgame.FoundCards.length/2;
    let foundpairstext = "Gevonden paren: "+foundpairs;
    document.getElementById("foundpairs").innerHTML = foundpairstext;
}

//leest uit hoeveel kaarten er gemaakt moeten worden bij het starten van een nieuw spel
function getBoardsize() {
    let x = document.getElementById("boardsize").value;
    return x;
}

//leest uit welk thema moet worden toegepast bij het starten van een nieuw spel
function getTheme() {
    theme = document.getElementById("theme").value;
}

//wijzigd kaartkleur gesloten kaarten
function setColorCardClosed() {
    cardclosedcolor = document.getElementById("kaartgeslotenselector").value;
    let divNode = document.createElement("div");
    divNode.innerHTML = "<br><style>.kaartgesloten { background: "+cardclosedcolor+"; }</style>";
    document.body.appendChild(divNode);
}

//wijzigd kaartkleur open kaarten
function setColorCardOpened() {
    cardopencolor = document.getElementById("kaartopenselector").value;
    let divNode = document.createElement("div");
    divNode.innerHTML = "<br><style>.kaartopen { background: "+cardopencolor+"; }</style>";
    document.body.appendChild(divNode);
    
}

//wijzigd kaartkleur gevonden kaarten
function setColorCardFound() {
    cardfoundcolor = document.getElementById("kaartgevondenselector").value;
    let divNode = document.createElement("div");
    divNode.innerHTML = "<br><style>.kaartgevonden { background: "+cardfoundcolor+"; }</style>";
    document.body.appendChild(divNode);
    
}

//ververst de kaarten op het scherm met de juiste (status)weergave
function refreshCards() {
    let divs = "";    
        cardgame.CardList.forEach(card => {
            switch(card.State) {
                case 0:
                    if(lefttime === 0) {
                        divs +='<div id=' + card.Id + ' class="kaartgeslotendisabled" ><h1 class="vraagteken">?</h1></div>';   
                    }
                    else {
                        divs +='<div id=' + card.Id + ' class="kaartgesloten" tabindex="0" onclick="cardClicked(this.id)" ><h1 class="vraagteken">?</h1></div>';
                    }
                    break;
                case 1:
                    divs +='<div id=' + card.Id + ' class="kaartopen" ><img src="' + card.Image + '"></div>';
                    break;
                case 2:
                    divs +='<div id=' + card.Id + ' class="kaartgevonden" ><img src="' + card.Image + '"></div>';
                    break;
            } 
        });
        document.getElementById("speelveld").innerHTML = divs;
}

//acties na het selecteren van een kaart
function cardClicked(id) {

    if(myInterval == false) {
        resetTimer();
        startTimer();
    }

    let card;

    switch(cardgame.OpenCardAmount) {
        case 0:
            card = cardgame.CardList[id];
            card.State = 1;
            refreshCards();
            break;
        case 1:
            card = cardgame.CardList[id];
            card.State = 1;
            refreshCards();
            matchCards();
            break;
    }
    printFoundPairs();
}

//checkt of 2 geopende kaarten matchen
function matchCards() {
    let card1 = cardgame.OpenedCards[0];
    let card2 = cardgame.OpenedCards[1];
    if(card1.Image == card2.Image) {
        winCards();
    }
    else {
        closeCards();
    }
}

//wijzigd status van kaarten die matchen
function winCards() {
    let card1 = cardgame.OpenedCards[0];
    let card2 = cardgame.OpenedCards[1];
    card1.State = 2;
    card2.State = 2;
    refreshCards();
    if(cardgame.CardAmount == cardgame.FoundCards.length) {
        stopTimer();
        setTimeout(winGame, 200);
    }
}

//wordt uitgevoerd als alle kaarten gevonden zijn
function winGame() {
    alert("Je hebt gewonnen")
}

//wijzigd status van kaarten die niet matchen
function closeCards() {
    cardgame.OpenedCards.forEach(card => {
        card.State = 0;
    });
}