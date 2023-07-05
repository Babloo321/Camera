let db;
let openRequest = indexedDB.open('myDataBase', 1);
openRequest.addEventListener("success", ()=>{
    console.log('db connect');
    db = openRequest.result;
})
openRequest.addEventListener("upgradeneeded", ()=>{
    console.log("db upgrade or initilized db");
    db = openRequest.result;

    // create object store for dataBase
    db.createObjectStore("video", {keyPath:"id"});
    db.createObjectStore("image", {keyPath: 'id'});
})
openRequest.addEventListener('error', ()=>{
    console.log("getting error", openRequest.error);
})