//Klasse Card waarin de individuele kaartobjecten gedefineerd zijn
class Card {

    id;                         //uniek (index)nummer
    image;                      //afbeelding op de voorzijde
    state;                      //status 0=gesloten, 1=open, 2=gevonden

    constructor(id, image) {
        this.state = 0;
        this.id = id;
        this.image = image;
    }

    get Id() {
        return this.id;
    }

    get Image() {
        return this.image;
    }

    get State() {
        return this.state;
    }

    set State(int) {
        if((int === 0) || (int === 1) || (int === 2)) {
            this.state = int;
        }
        else {
            throw alert("Status onjuist. Dit moet 0, 1 of 2 zijn");
        }
    }
}