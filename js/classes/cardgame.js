class CardGame {

    cardlist;                   //array met 'Card' objecten
    cardimageprinter;           //bevat een 'UniqueCardPrinter' object

    constructor() {
    }

    Init(number) {
        return new Promise((resolve, reject) => {
                
            let array = [];
            let counter = number;
            let x;
            
            this.cardimageprinter = new CardImagePrinter(number);
            this.cardimageprinter.Init()
                .then(() => {
                    for(x=0 ; x<counter ; x++) {
                        array.push(new Card(x,this.cardimageprinter.UniqueCharacter));
                    }
                    this.cardlist = array;
                    resolve();
                });
        });
    }

    get CardList() {
        return this.cardlist;
    }

    get CardAmount() {
        return this.cardlist.length;
    }

    get OpenCardAmount() {
        let x = 0;
        this.cardlist.forEach(card => {
            if(card.State === 1) {
                x++;
            }
        });
        return x;
    }

    get OpenedCards() {
        let openedcards = [];
        this.cardlist.forEach(card => {
            if(card.State === 1) {
                openedcards.push(card);
            }
        });
        return openedcards;
    }

    get FoundCards() {
        if (!this.cardlist) return console.log("No cards found");
        let foundcards = [];
        this.cardlist.forEach(card => {
            if(card.State === 2) {
                foundcards.push(card);
            }
        });
        return foundcards;
    }
}