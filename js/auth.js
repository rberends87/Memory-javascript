//window.onload=function (){setNavbarLinks()};

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

// Return of token aanwezig is of niet (boolean)
function hasToken() {
    let token = getLocalToken();
    if (token !== null) {
        return true;
    }
    else {
        return false;
    }
}

//functie voor het afmelden van de gebruiker (JWT weggooien uit localstorage)
function logout() {
    localStorage.clear();
    window.location.href="memory.html";
}

//Genereer de juiste links in de NavBar (afhankelijk van de staat van inloggen)
function setNavbarLinks() {
    if (!hasToken()) {
        var loginLink = document.createElement("a");
        loginLink.href = "login.html"; // Hier is de verwijzing naar login.html
        loginLink.textContent = "Inloggen"; // Hier is de linktekst voor Inloggen
        loginLink.style.marginRight="1%";
        document.querySelector("nav ul").appendChild(loginLink);

        var registerLink = document.createElement("a");
        registerLink.href = "register.html"; // Hier is de verwijzing naar register.html
        registerLink.textContent = "Registreer"; // Hier is de linktekst voor Registreer
        registerLink.style.marginRight="1%";
        document.querySelector("nav ul").appendChild(registerLink);
    } else {
        var settingsLink = document.createElement("a");
        settingsLink.href = "settings.html"; // Hier is de verwijzing naar settings.html
        settingsLink.textContent = "Instellingen"; // Hier is de linktekst voor Instellingen
        settingsLink.style.marginRight="1%";
        document.querySelector("nav ul").appendChild(settingsLink);

        var logoffLink = document.createElement("a");
        logoffLink.href = "#";
        logoffLink.addEventListener("click", function(e){e.preventDefault(); logout();});
        logoffLink.textContent = "Afmelden";
        logoffLink.style.float="right";
        logoffLink.style.marginRight="1%";
        document.querySelector("nav ul").appendChild(logoffLink);
        
        var username = document.createElement("a");
        username.textContent = getPlayerName();
        username.style.float="right";
        username.style.marginRight="1%";
        document.querySelector("nav ul").appendChild(username);

    }
}

//haal de naam op van de inlogde speler. als er geen speler is ingelogd geef dan niets weer
function getPlayerName() {
    if (hasToken) {
        let payload = getPayload(getLocalToken());
        return payload.username;
    }
    else {
        return null;
    }
}