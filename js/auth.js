//window.onload=function (){setNavbarLinks()};


//
/*
JWT van 19-10 rond 16:00 voor testdoeleinden
eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiIsInN1YiI6NCwiaXNzIjoibWVtb3J5IGJhY2tlbmQifQ.eyJpYXQiOjE2OTc3MjQyODUsImV4cCI6MTY5NzcyNzg4NSwic3ViIjoiNCIsImlzcyI6Im1lbW9yeSBiYWNrZW5kIiwicm9sZXMiOlsiUk9MRV9VU0VSIiwiUk9MRV9BRE1JTiJdLCJ1c2VybmFtZSI6IkhlbmsifQ.hqZ6FkjO8iXWK_49oa8bZZ8uB85Ip05ySNVpSmYb6FWBtJjOpCuloA0YP7sSuw0Bh6zZKyNuf8dinwz3eTXbmhPppDqgZrIDDXI_M28A_UtTGy4zYmsd_mqIlrqpMFcnua9BYT4HKD6YDJo9A5e2fShX4aGX9i1sdAofLexEzWw6ISHLajWhv6kvHneng1Dd_0PLvEsIC9m88BcWKBL8Glpx77STRkalx0-6EiH4Yh5FUM5S13vCcB216BNMNB5nigvn82NlqlqmfrROLCZsSsu3WWNKz4DDRgcT2UveomKUBt_hHoxN04SjntyduO3no1JbHvOw8V1d-W86pq_d9bkAnFf-qH1Vnc10yceMD3VxKCr3x5bYRx-v_52aX1z0-bqgBjj7LYMcDoEEpHp6HgFk6xxjSnuG_bSWinWK_KGwkwPhTdtcgqH5__Sb3dnVLoImctPYVqN3xK5aWkqGhXckvOhfmj2pRGJ7JBQhqCp7QtF5KjZrv8XlJkIffzrY9PE-A33qUbH4MCHkE4QB2RfbEE8h6nz47Fc4mrHCFgYJZ1Ewaimbwc1hgBxqAHNQpQGbBz2_rpUsR9sfszEy3w_vfY-StLhhsYRJIFmtVstttr3nmvPglrghZU34HCokbXQFKpcoDQj85uLupnBxmNrrLrAXmXSGLRpgc56V5gY
*/

// Haalt de informatie uit de gehashde token
function getPayload(token) {
    let base64Url = token.split('.')[1];
    let base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    let jsonPayload = decodeURIComponent(window.atob(base64).split('').map(function (c) {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
    }).join(''));

    return JSON.parse(jsonPayload);
}

// Leest het JWT token uit de localstorage
function getLocalToken() {
    return localStorage.getItem("JWT");
}

function removeLocalToken() {
    localStorage.removeItem("JWT");
}

// Return of token aanwezig is of niet (boolean)
function hasToken() {
    let token = getLocalToken();
    if (token !== null) {
        //return true;
        let payload = getPayload(getLocalToken());
        let id = payload.sub;
        fetch("http://localhost:8000/api/player/" + id, {
            headers: {
                'Content-Type': 'application/json;charset=utf-8',
                'Authorization': 'Bearer ' + getLocalToken()
            }
        })
            .then(resp => {
                if (resp.status === 401) {

                    removeLocalToken();
                    alert("Token verlopen. meldt opnieuw aan");
                    window.location.href = "./login.html";

                }

            }

            )

        return true;

    }
    else {
        return false;
    }
}

//functie voor het afmelden van de gebruiker (JWT weggooien uit localstorage)
function logout() {
    localStorage.clear();
    window.location.href = "memory.html";
}

//Genereer de juiste links in de NavBar (afhankelijk van de staat van inloggen)
function setNavbarLinks() {
    if (!hasToken()) {
        var loginLink = document.createElement("a");
        loginLink.href = "login.html"; // Hier is de verwijzing naar login.html
        loginLink.textContent = "Inloggen"; // Hier is de linktekst voor Inloggen
        loginLink.style.marginRight = "1%";
        document.querySelector("nav ul").appendChild(loginLink);

        var registerLink = document.createElement("a");
        registerLink.href = "register.html"; // Hier is de verwijzing naar register.html
        registerLink.textContent = "Registreer"; // Hier is de linktekst voor Registreer
        registerLink.style.marginRight = "1%";
        document.querySelector("nav ul").appendChild(registerLink);
    } else {
        var settingsLink = document.createElement("a");
        settingsLink.href = "settings.html"; // Hier is de verwijzing naar settings.html
        settingsLink.textContent = "Instellingen"; // Hier is de linktekst voor Instellingen
        settingsLink.style.marginRight = "1%";
        document.querySelector("nav ul").appendChild(settingsLink);

        var logoffLink = document.createElement("a");
        logoffLink.href = "#";
        logoffLink.addEventListener("click", function (e) { e.preventDefault(); logout(); });
        logoffLink.textContent = "Afmelden";
        logoffLink.style.float = "right";
        logoffLink.style.marginRight = "1%";
        document.querySelector("nav ul").appendChild(logoffLink);

        var username = document.createElement("a");
        username.textContent = getPlayerName();
        username.style.float = "right";
        username.style.marginRight = "1%";
        document.querySelector("nav ul").appendChild(username);

    }
}

//haal de naam op van de inlogde speler. als er geen speler is ingelogd return null
function getPlayerName() {
    if (hasToken) {
        let payload = getPayload(getLocalToken());
        return payload.username;
    }
    else {
        return null;
    }
}

//haal de id op van de ingelogde speler. aks er geen speler is ingelogd return null
function getPlayerID() {
    if (hasToken) {
        let payload = getPayload(getLocalToken());
        return payload.sub;
    }
    else {
        return null;
    }
}

//update het e-mailadres van account
function updateEmail() {
    let emailadres = document.getElementById("email").value;

    fetch("http://localhost:8000/api/player/" + getPlayerID() + "/email", {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json;charset=utf-8',
            'Authorization': 'Bearer ' + getLocalToken()
        },
        body: JSON.stringify({
            email: emailadres
        })
    })
        .then(resp => {
            if (resp.status === 401) {
                window.location.href = "./login.html";
            }
            if (!resp.ok) {
                throw new Error("Er is iets fout gegaan");
            }
        }).catch(
            error => {
                console.log(error);
                window.location.href = "./login.html";
            }
        )
}

//functie om kaartkleur en api naar backend te schrijven
function updateCardPreferences() {

    let closedcardcolor = document.getElementById("closedcardcolor").value;
    //let opencardcolor = document.getElementById("closedcardcolor").value;
    let foundcardcolor = document.getElementById("closedcardcolor").value;
    let apipref = document.getElementById("theme").value;

    //console.log(foundcardcolor);
    //console.log(apipref);

    fetch("http://localhost:8000/api/player/" + getPlayerID() + "/preferences", {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json;charset=utf-8',
            'Authorization': 'Bearer ' + getLocalToken()
        },
        body: JSON.stringify({
            color_found: foundcardcolor,
            color_closed: closedcardcolor,
            api: apipref
        })
    })
        .then(resp => {
            if (resp.status === 401) {
                window.location.href = "./login.html";
            }
            if (!resp.ok) {
                throw new Error("Er is iets fout gegaan");
            }
        }).catch(
            error => {
                console.log(error);
                window.location.href = "./login.html";
            }
        )
}

//functie welke de top 5 scores ophaalt
function getTopfive() {

    fetch("http://localhost:8000/scores/")
        .then(resp => resp.json())
        .then(scorelist => {

            //hier komt de code om de list een top 5 html te maken
            //stap1 loopje maken met console log voor top 5 (data juist binnenkrijgen)
            //stap2 pas na stap 1 met de html bezig gaan

            //sorteert de scorelist van hoog naar laag en selecteerd de hoogste 5 scores
            let sortedscorelist = scorelist.sort((a, b) => b.score - a.score)
                .slice(0, 5);

            //

            // Get the "top5list" element by its id
            const top5list = document.getElementById('top5list');

            if (sortedscorelist.length === 0) {
                const listItem = document.createElement('li');
                listItem.textContent = `Geen scores`;
                top5list.appendChild(listItem);//

            }

            else {


                // Loop through the items and create list items
                sortedscorelist.forEach((item, index) => {
                    // Create a list item element
                    let name = item.username;
                    let score = item.score;

                    const listItem = document.createElement('li');

                    // Set the text content of the list item
                    listItem.textContent = `${name}:   ${score}`;

                    // Append the list item to the "top5list" element
                    top5list.appendChild(listItem);
                });
            }


        }).catch(
            error => {
                console.log(error);
            }
        )
}