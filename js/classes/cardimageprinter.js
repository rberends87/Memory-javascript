class CardImagePrinter {

    images;                 //array met image URLs naar afbeeldingen
    length;                 //variabele bevat het aantal te printen images

    constructor(length) {
        this.length = length;
    }

    Init() {
        return new Promise((resolve, reject) => {
            let amount = this.length / 2;
            let api;
            
            switch(theme) {
                case "LoremApi":
                    api = new LoremApi();
                    break;
                case "DogApi":
                    api = new DogApi();
                    break;
                case "CatApi":
                    api = new CatApi();
                    break;
            }
            
            let fetchAll = api.getAll(amount);

            fetchAll.then((responses) => {
                let imagesarray = api.processAll(responses);
                this.images = this.ShuffleImages(imagesarray);
                resolve();
            });
        });
    }

    ShuffleImages(array) {
        let unshuffled = array;
        let shuffled = unshuffled
            .map(value => ({ value, sort: Math.random() }))
            .sort((a, b) => a.sort - b.sort)
            .map(({ value }) => value)
        return shuffled;
    }

    get UniqueCharacter() {
        let imagesarray = this.images;
        let imageurl = imagesarray[0];
        imagesarray = imagesarray.slice(1);
        this.images = imagesarray;
        return imageurl;
    }
}