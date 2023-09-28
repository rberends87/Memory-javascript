class LoremApi {
    constructor(){
       this.url = 'https://picsum.photos/140';
    }

    get(){
        return fetch(this.url);
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
            let imageurl = response.url;
            imagesarray.push(imageurl, imageurl);
        });
        return imagesarray;
    }
}