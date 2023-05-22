"use strict"

const fs = require('fs');
const Sqlite = require('better-sqlite3');

let db = new Sqlite('db.sqlite');





  db.prepare('DROP TABLE IF EXISTS UserAllergy').run();
  db.prepare('DROP TABLE IF EXISTS Allergy').run();




/////////////////////////////////////////////////

let redo = {
  name : 'redo' ,
  password : '123'
}
let ousa = {
  name : 'oussa' ,
  password : '321'
}






db.prepare('DROP TABLE IF EXISTS user').run();
db.prepare('CREATE TABLE user (id INTEGER PRIMARY KEY AUTOINCREMENT,  name TEXT, password TEXT)').run();
db.prepare('INSERT INTO user (name,password) VALUES (@name , @password)' ).run(redo) ;
db.prepare('INSERT INTO user (name,password) VALUES (@name , @password)' ).run(ousa) ;

db.prepare('CREATE TABLE UserAllergy (id INTEGER  ,  idallergy INTEGER   ,  PRIMARY KEY (idallergy, id))').run();
db.prepare('CREATE TABLE Allergy (idallergy INTEGER PRIMARY KEY  ,  allergy text   )').run();


// let useralg = {
//   id : '1' ,
//   idallergy : '12'
// }
// let sueraa = {
//   id : '1' ,
//   idallergy : '11'
// }



let alg1 = {
  idallergy : '1' ,
  allergy : 'arachide'
}
let alg2 = {
  idallergy : '2' ,
  allergy : 'celery'
}
let alg3 = {
  idallergy : '3' ,
  allergy : 'crustaceans'
}
let alg4 = {
  idallergy : '4' ,
  allergy : 'eggs'
}
let alg5 = {
  idallergy : '5' ,
  allergy : 'fish'
}
let alg6 = {
  idallergy : '6' ,
  allergy : 'gluten'
}
let alg7 = {
  idallergy : '7' ,
  allergy : 'lupin'
}
let alg8 = {
  idallergy : '8' ,
  allergy : 'milk'
}
let alg9 = {
  idallergy : '9' ,
  allergy : 'molluscs'
}
let alg10 = {
  idallergy : '10' ,
  allergy : 'mustard'
}
let alg11 = {
  idallergy : '11' ,
  allergy : 'nuts'
}
let alg12 = {
  idallergy : '12' ,
  allergy : 'peanuts'
}
let alg13 = {
  idallergy : '13' ,
  allergy : 'sesame-seeds'
}
let alg14 = {
  idallergy : '14' ,
  allergy : 'soybeans'
}
let alg15 = {
  idallergy : '15' ,
  allergy : 'sulphur-dioxide-and-sulphites'
}




// db.prepare('INSERT INTO UserAllergy (id,idallergy) VALUES (@id , @idallergy)' ).run(useralg) ;
// db.prepare('INSERT INTO UserAllergy (id,idallergy) VALUES (@id , @idallergy)' ).run(sueraa) ;
db.prepare('INSERT INTO Allergy (idallergy,allergy) VALUES (@idallergy , @allergy)' ).run(alg1) ;
db.prepare('INSERT INTO Allergy (idallergy,allergy) VALUES (@idallergy , @allergy)' ).run(alg2) ;
db.prepare('INSERT INTO Allergy (idallergy,allergy) VALUES (@idallergy , @allergy)' ).run(alg3) ;
db.prepare('INSERT INTO Allergy (idallergy,allergy) VALUES (@idallergy , @allergy)' ).run(alg4) ;
db.prepare('INSERT INTO Allergy (idallergy,allergy) VALUES (@idallergy , @allergy)' ).run(alg5) ;
db.prepare('INSERT INTO Allergy (idallergy,allergy) VALUES (@idallergy , @allergy)' ).run(alg6) ;
db.prepare('INSERT INTO Allergy (idallergy,allergy) VALUES (@idallergy , @allergy)' ).run(alg7) ;
db.prepare('INSERT INTO Allergy (idallergy,allergy) VALUES (@idallergy , @allergy)' ).run(alg8) ;
db.prepare('INSERT INTO Allergy (idallergy,allergy) VALUES (@idallergy , @allergy)' ).run(alg9) ;
db.prepare('INSERT INTO Allergy (idallergy,allergy) VALUES (@idallergy , @allergy)' ).run(alg10) ;
db.prepare('INSERT INTO Allergy (idallergy,allergy) VALUES (@idallergy , @allergy)' ).run(alg11) ;
db.prepare('INSERT INTO Allergy (idallergy,allergy) VALUES (@idallergy , @allergy)' ).run(alg12) ;
db.prepare('INSERT INTO Allergy (idallergy,allergy) VALUES (@idallergy , @allergy)' ).run(alg13) ;
db.prepare('INSERT INTO Allergy (idallergy,allergy) VALUES (@idallergy , @allergy)' ).run(alg14) ;
db.prepare('INSERT INTO Allergy (idallergy,allergy) VALUES (@idallergy , @allergy)' ).run(alg15) ;















