//Create variables here
var dog,dogimg,dogimg1;
var database;
var foodStock,foods;
var lastFed,fedTime;
var bedroom,washroom,garden;
var currentTime;

function preload(){
  dogimg=loadImage("images/dogImg.png");
  dogimg1=loadImage("images/dogImg1.png");
  bedroom=loadImage("images/Bed Room.png");
  garden=loadImage("images/Garden.png");
  washroom=loadImage("images/Wash Room.png");

	//load images here
}

function setup() {
database=firebase.database();
	createCanvas(500,500);

  foodObj=new Food();    
  
foodStock=database.ref('Food');
foodStock.on("value",readStock);

fedTime=database.ref('FeedTme');
fedTime.on("value",function(data){
  lastFed=data.val();
});

readState=database.ref('gameState');
readState.on("value",function(data){
  gameState=data.val();
});

dog=createSprite(250,300,150,150);
  dog.addImage(dogimg);
  dog.scale=0.15;

feed=createButton("Feed the Dog");
feed.position(600,95);
feed.mousePressed(feedDog);

addFood=createButton("Add Food");
addFood.position(700,95);
addFood.mousePressed(addFoods);

}


function draw() {  

currentTime=hour();
if(currentTime===(lastFed+1)){
  update("playing");
  foodObj.garden();
}
else if(currentTime===(lastFed+2)){
  update("sleeping");
  foodObj.bedroom();
}
else if(currentTime>(lastFed+2) && currentTime<=(lastFed+4)){
  update("bathing");
  foodObj.washroom();
}
else{
  update("hungry");
  foodObj.display();
}

if(gameState!="hungry"){
feed.hide();
addFood.hide();
dog.remove();
}
else {
feed.show();
addFood.show();
dog.addImage(dogimg);
}

drawSprites();
}

function readStock(data){
foods=data.val();
foodObj.updateFoodStock(foods);
}

//function writeStock(x){
 // if(x<=0){
 // x=0;
 // }
  //else{
  //  x=x-1;
  //}
  //database.ref('/').update({
  //  Food:x
 // })
//}

function feedDog(){
  dog.addImage(dogimg1);
 
  foodObj.updateFoodStock(foodObj.getFoodStock()-1);

  database.ref('/').update({
    Food:foodObj.getFoodStock(),
FeedTme:hour(),
gameState:"hungry"
  })
}

function addFoods(){
  foods++;
  database.ref('/').update({
    Food:foods
  })
}

function update(state){
  database.ref('/').update({
    gameState:state
  })
}