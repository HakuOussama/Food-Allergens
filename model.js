"use strict"
/* Module de recherche dans une base de recettes de cuisine */
const Sqlite = require('better-sqlite3');

let db = new Sqlite('db.sqlite');





exports.getAllergyById = function( idallergy) {
  let result =db.prepare('SELECT allergy FROM Allergy WHERE idallergy =? ').get(idallergy);
  return result



}


exports.getMyallergy = function(userID){
  let result =db.prepare('SELECT allergy FROM Allergy a,UserAllergy u WHERE a.idallergy=u.idallergy  and    u.id =?   ').all(userID);
  return result


}

exports.getIDAbyAllergy = function(allergy) {
  if(allergy==="sulphur-dioxide-and-sulphites"){
    return '15';
   }
  const stmt = db.prepare('SELECT idallergy FROM Allergy WHERE allergy = ?');
  const result = stmt.get(allergy);
 
  if (!result) {
    return null;
  }
  return result.idallergy;
}


exports.AddMyAllergy = function(userID , idallergy){
  let usera = {
    id : userID ,
    idallergy : idallergy 
  
  };
  

  let insert = db.prepare('INSERT OR IGNORE INTO UserAllergy (id,idallergy) VALUES (@id , @idallergy)' ).run(usera) ;
  return insert.changes > 0  ;


}

exports.commonAllergyList = function(UserAllergy, productAllergy){ 
  let liste =[];
  
  for(let i = 0; i < UserAllergy.length; i++){
    for(let j = 0; j < productAllergy.length; j++){
      if(UserAllergy[i].allergy === productAllergy[j].substring(3)){
        liste.push(UserAllergy[i]);
        
      }
      
    }
  }
  return liste ;
  
}






exports.login =function(name,password){
  let data = [name , password]
  let result =db.prepare('SELECT id FROM user WHERE name =? and password=?').get(data);
  if(result===undefined){
    return -1;
  }
  return result.id;


  
}

exports.deleteAllergy = function(id, idallergy) {
  const stmt = db.prepare('DELETE FROM UserAllergy WHERE id = ? AND idallergy = ?');
  const result = stmt.run(id, idallergy);
  if (result.changes === 0) {
    throw new Error('No rows were deleted');
  }
}
exports.deleteAllAllergy = function(id) {
  const result = db.prepare('DELETE FROM UserAllergy WHERE id = ? ').run(id);
  return result.changes === 0;
}


exports.deleteAccount =function(userID){

  try { 
    let result = db.prepare('DELETE FROM user WHERE id = ?').run(userID);
    let Dalg = db.prepare('DELETE FROM UserAllergy WHERE id = ? ').run(userID);
    if (result.changes > 0 && Dalg.changes > 0) {
      console.log(`Deleted ${result.changes} row(s)
      Deleted ${Dalg.changes} row(s)`);
    } else {
      console.log(`No rows were deleted`);
    }
  } catch (error) {
    console.error(`Error deleting user: ${error}`);
  }
}
exports.getId = function(name){
  let result =db.prepare('SELECT id FROM user WHERE name =?').get(name);
  if(result===undefined){
    return -1;
  }
  return result.id;
}

exports.addAllergy = function addAllergy(allergy) {
  // Insert a new row into the Allergy table with the provided allergy name
  db.run('INSERT INTO Allergy (allergy) VALUES (?)', allergy, function(err) {
    if (err) {
      console.error('Error adding allergy:', err.message);
    } else {
      console.log('Allergy added successfully with ID:', this.lastID);
    }
  });
}






exports.new_user = function(name, password){
  let ousa = {
    name : name ,
    password : password
  }
  db.prepare('INSERT INTO  user (name,password) VALUES (@name , @password)' ).run(ousa) ;

}


  exports.guessAccount= function(){
    let user = {
      name : "guest" ,
      password : "123"
    }
    let result =db.prepare('INSERT OR IGNORE INTO user (name,password) VALUES (@name , @password)' ).run(user);
    return result.lastInsertRowid;
  } 
  // exports.deleteGuessAccount= function(){
  //   console.log("hello");
  //   let user = {
  //     name : "guest",
  //     password : "123"
  //   }

  //   let id =db.prepare('SELECT id FROM user WHERE name =? and password=?').get(user);
  //   console.log(id);
  //   let result =db.prepare('DELETE FROM user WHERE name =?').run("guest");
  //   let res =db.prepare('DELETE FROM UserAllergy WHERE name =?').run(id);
  //   return (result.changes&&res.changes) > 0;
  // }

 
