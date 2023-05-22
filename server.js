// Définir l'URL de l'API de FoodFact
"use strict"

let express = require('express');
let mustache = require('mustache-express');
let app = express();
app.engine('html', mustache());
app.set('view engine', 'html');
app.set('views', './views');
var model = require('./model');

const Sqlite = require('better-sqlite3');

let db = new Sqlite('db.sqlite'); 

// parse form arguments in POST requests
const bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({ extended: false }));

const cookieSession = require('cookie-session');
const {Console}=require('console');
const { getDefaultSettings } = require('http2');


// Methode 

function is_authenticated(req, res, next) {
  if (req.session.user!==undefined){
    res.locals.allergenListen = req.session.allergenListen;
    res.locals.is_authenticated=true;
    res.locals.name=req.session.user;
    res.locals.username = req.session.username;
    res.locals.commonAllergyList=req.session.commonAllergyList;
    can_I_Eat_It(req,res);
    is_guest(req,res);
    // if(req.session.username==="guest"){
    //   req.session.isGuest = true;
    //   res.locals.isGuest = req.session.isGuest;

    // }
   
    // L'utilisateur est authentifié : on continue l'exécution des routes

  } 
  return next();
}
function is_guest(req,res){
  if(req.session.username==="guest"){
    req.session.isGuest = true;
    res.locals.isGuest = req.session.isGuest;

  }
 


}


function can_I_Eat_It(req,res){
 
  if(req.session.allergens_tags===undefined){
    res.locals.can_I_Eat_It=true;
  }
  else{
    let commonAllergyList1 = model.commonAllergyList(req.session.allergenListen,req.session.allergens_tags);
  

    if (commonAllergyList1.length === 0) {
      res.locals.can_I_Eat_It=true;
    } else {
      res.locals.can_I_Eat_It=false;
    }
  }

}

app.use(cookieSession({
secret: 'mot-de-passe-du-cookie',
}));

app.get('/', (req, res) => {
  res.render('pageDacceuil');
});

app.post('/',is_authenticated,(req,res)=>{
  let id = model.login(req.body.name,req.body.password) ;
  if( id !==-1){
    req.session.allergenListen = model.getMyallergy(id); 
    req.session.user = id ;
    req.session.username = req.body.name ;
    res.locals.allergenListen = req.session.allergenListen;
    res.locals.is_authenticated=true;
    res.locals.name=req.session.user;
    res.locals.username = req.session.username;
    res.locals.commonAllergyList=req.session.commonAllergyList;
    if(req.session.username==="guest"){
      req.session.isGuest = true;
      res.locals.isGuest = req.session.isGuest;

    }



    res.render('acceuil');
  }
  else{

    res.redirect('/');
  }
});


app.post('/acceuil', is_authenticated,(req, res) => {
  res.render('acceuil');
});


app.get('/FoodAllergens', is_authenticated,(req, res) => {
    let produit = "https://world.openfoodfacts.org/cgi/search.pl?search_terms={"+req.query.title+"}&search_simple=1&action=process&json=1";
    fetch(produit+".json")
    .then(response=>response.json())
    .then(data=>  {
      req.session.allergens_tags=data["products"][0]["allergens_tags"];
      res.render('FoodAllergens',data["products"][0]);
      
    });
    req.session.commonAllergyList=model.commonAllergyList(req.session.allergenListen,req.session.allergens_tags);
    res.locals.commonAllergyList=req.session.commonAllergyList;

  });

  
  app.get('/FoodCards', is_authenticated, (req, res) => {
    const produit = `https://world.openfoodfacts.org/cgi/search.pl?search_terms=${req.query.title}&search_simple=1&page_size=9&action=process&json=1`;
    fetch(produit)
        .then(response => response.json())
        .then(data => {
            const products = data.products.slice(0, 9); // Récupère les 9 premiers produits
            req.session.allergens_tags = products[0].allergens_tags;
            req.session.commonAllergyList = model.commonAllergyList(req.session.allergenListen, req.session.allergens_tags);
            res.render('acceuil', { products, commonAllergyList: req.session.commonAllergyList });
        })
        .catch(error => {
            console.error(error);
            res.render('error', { message: 'Une erreur est survenue lors de la récupération des produits.' });
        });
});


  app.get('/new_user',(req,res)=>{
    res.render('new_user');
  });
  
  app.post('/new_user',(req,res)=>{
    let user = model.login(req.body.name,req.body.password) ;
    if( (user === -1) && (req.body.password === req.body.Confirm_password) && (req.body.Confirm_password!=="") && req.body.name!==req.body.password   ){
      model.new_user(req.body.name,req.body.password)
      let id = model.login(req.body.name,req.body.password) ;
      if( id !==-1){
        req.session.allergenListen = model.getMyallergy(id); 
        req.session.user = id ;
        req.session.username = req.body.name ;
        res.locals.allergenListen = req.session.allergenListen;
        res.locals.is_authenticated=true;
        res.locals.name=req.session.user;
        res.locals.username = req.session.username;
        res.locals.commonAllergyList=req.session.commonAllergyList;
    
        res.render('acceuil');
      }
    }
    else{
      if(user !== -1){
        
        if(req.body.name===req.body.password){
          res.send("name and password can not be the same");
        }

        res.send("User already logged in");
      }
      if(req.body.Confirm_password===""){
        res.send("we can not accepte empty password");
      }
      
      
      else{
        res.send("Password and Confirm password do not match");
      }
    }
  });  

  app.post('/createGuess',(req,res)=>{
    let id = model.guessAccount();
    req.session.allergenListen = model.getMyallergy(id);
    req.session.user = id ;
    req.session.username = "guest" ;
    res.locals.allergenListen = req.session.allergenListen;
    res.locals.is_authenticated=true;
    res.locals.name=req.session.user;
    res.locals.username = req.session.username;
    res.locals.commonAllergyList=req.session.commonAllergyList;
    req.session.isGuest = true;
    res.locals.isGuest = req.session.isGuest;
    res.render('acceuil');
  });
  
  app.post('/logout',is_authenticated,(req,res)=>{
    
    if(req.session.username==="guest"){
      req.session.isGuest = false;
      res.locals.isGuest = req.session.isGuest;
     
      req.allergenListen=null;
      let id = model.getId(req.session.username);
      model.deleteAccount(id);
     
    }  
    req.session=null;
    res.redirect('/');
  });


  app.get('/profile' ,is_authenticated,(req,res)=>{
    res.render('profile');
  });


 
  app.get('/addAllergy/:user',is_authenticated ,(req, res) => {
    // Get the selected option from the query string
    const selectedOption = req.query.options;
    //console.log(selectedOption);
    //console.log(req.params.user);
    model.AddMyAllergy(req.params.user,selectedOption);
    req.session.allergenListen=model.getMyallergy(req.params.user);
    res.redirect('/profile');
    
    
    // Redirect back to the index page
    
  });











  app.get('/deleteAllergy/:user',(req,res)=>{


    const selectedOption = req.query.options;





    model.deleteAllergy(req.params.user,selectedOption);
    req.session.allergenListen=model.getMyallergy(req.params.user);
    res.redirect('/profile');
  });

  //done
  app.get('/deleteAllAllergy/:user',is_authenticated,(req,res)=>{


   


    console.log(req.params.user);
    model.deleteAllAllergy(req.params.user);
    refreshList(req, res);
    res.redirect('/profile');
  });
  function refreshList(req, res) {
    req.session.allergenListen=model.getMyallergy(req.session.user);
  }


  // done
  app.get('/deleteThisAllergen/:allergy',is_authenticated,(req,res)=>{


    


    let idAllergie = model.getIDAbyAllergy(req.params.allergy);
    console.log(req.session.user);
    console.log(req.params.allergy);
    console.log(idAllergie);
 
    model.deleteAllergy(req.session.user,idAllergie);
    refreshList(req, res);
    
    res.redirect('/profile');
  });

  app.get('/SearchThisProduct/:product_name',is_authenticated,(req,res)=>{
    console.log(req.params.product_name);

    let produit = "https://world.openfoodfacts.org/cgi/search.pl?search_terms={"+req.params.product_name+"}&search_simple=1&action=process&json=1";
    fetch(produit+".json")
    .then(response=>response.json())
    .then(data=>  {
      req.session.allergens_tags=data["products"][0]["allergens_tags"];
      res.render('FoodAllergens',data["products"][0]);
      
    });
    req.session.commonAllergyList=model.commonAllergyList(req.session.allergenListen,req.session.allergens_tags);
    res.locals.commonAllergyList=req.session.commonAllergyList;



  });


  app.get('/deleteUseraccount/:user',is_authenticated,(req,res)=>{
    model.deleteAccount(res.locals.name)
    res.redirect('/');
  });


  app.get('/can_I_Eat_It',is_authenticated,(req,res)=>{
    req.session.commonAllergyList=model.commonAllergyList(req.session.allergenListen,req.session.allergens_tags);
    res.locals.commonAllergyList=req.session.commonAllergyList;




    res.render('FoodAllergens');
  });



  app.listen(8000, () => console.log('movie server at http://localhost:8000'));
  




 
