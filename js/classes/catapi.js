class CatApi {
    constructor(){
       this.url = 'https://aws.random.cat/meow';
    }

    get(){
        return fetch(this.url)
        .then((response) => response.json());
    }

    getAll(count){
        let fetchRequests =[];
        for (var i =0; i <count; i++){
            fetchRequests.push(this.get());
        }
        return Promise.all(fetchRequests);
    }

    processAll(responses) {
        let imagesarray = [];
        responses.forEach((response) => {
            let imageurl = response.file;
            imagesarray.push(imageurl, imageurl);
        });
        return imagesarray;
    }
}