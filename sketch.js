var trex, trex_running, trex_collided;
var ground, invisibleGround, groundImage;
var ob1,ob2,ob3,ob4,ob5,ob6;
var obstaclesGroup,cloudsGroup;
var gameState,PLAY,END;
var score,count;
var gameOver,gameOver_img,reset_img,reset;
var die,jump,checkpoint;

function preload(){
  trex_running=loadAnimation("trex1.png","trex3.png","trex4.png");
  trex_collided = loadAnimation("trex_collided.png");
  
  groundImage = loadImage("ground2.png")
  
  ob1=loadImage("obstacle1.png");
  ob2=loadImage("obstacle2.png");
  ob3=loadImage("obstacle3.png");
  ob4=loadImage("obstacle4.png");
  ob5=loadImage("obstacle5.png");
  ob6=loadImage("obstacle6.png");
  
  cloud=loadImage("cloud.png");
  
  gameOver_img=loadImage("gameOver.png");
  reset_img=loadImage("restart.png");
  
  die=loadSound("die.mp3");
  jump=loadSound("jump.mp3");
  checkpoint=loadSound("checkPoint.mp3");
}

function setup() {
  createCanvas(600, 200);
  
  trex = createSprite(50,180,20,50);
  trex.addAnimation("running", trex_running);
  trex.scale = 0.5;
  
  trex.addAnimation("collide",trex_collided);
  
  ground = createSprite(200,180,400,20);
  ground.addImage("ground",groundImage);
  ground.x = ground.width /2;
  
  
  invisibleGround = createSprite(200,190,400,10);
  invisibleGround.visible = false;
  
  ObstaclesGroup=new Group();
  CloudsGroup=new Group();
  
  PLAY=1;
  END=0;
  gameState=PLAY;
  
  count=0;
  score=0;
  
  gameOver= createSprite(300,80,10,10);
  gameOver.visible=false;
  gameOver.addImage(gameOver_img);
  gameOver.scale=0.5;
  
  reset=createSprite(300,120,10,10);
  reset.visible=false;
  reset.addImage(reset_img);
  reset.scale=0.5;
}

function draw() {
  background(180);
  
  if(gameState===PLAY){
    if(score%100==0 &&  score>0){
      checkpoint.play();
    }
    ground.velocityX = -(6+(score/100));
    
    if(keyDown("space") && trex.y>160) {
    trex.velocityY = -12;
      jump.play();
  }
  
  trex.velocityY = trex.velocityY + 0.8
  
  if (ground.x < 0){
    ground.x = ground.width/2;
  }
    clouds();
  obstacles();
    
    count=count+1;
    score=Math.round(count/5);
    if(ObstaclesGroup.isTouching(trex)){
      gameState=END;
      die.play();
    }
  }
  if(gameState===END){
     gameOver.visible=true;
     reset.visible=true;
     
     ground.velocityX=0;
     ObstaclesGroup.setVelocityXEach(0);
     CloudsGroup.setVelocityXEach(0);
     ObstaclesGroup.setLifetimeEach(-1);
     CloudsGroup.setLifetimeEach(-1);
    
     trex.velocityY=0;
     trex.changeAnimation("collide",trex_collided);
    if(mousePressedOver(reset)){
      restart();
    }
  }
  
  
  textSize(20);
  fill("black");
  text("Score:"+score,400,50);
  
  
  trex.collide(invisibleGround);
  
  
  
  drawSprites();
}
function obstacles(){
  if(frameCount%80==0){
    var r=Math.round(random(1,6));
    
      var ob10=createSprite(620,170,10,10);
 switch(r){
   case 1:ob10.addImage(ob1);
     break;
     case 2:ob10.addImage(ob2);
     break;
     case 3:ob10.addImage(ob3);
     break;
     case 4:ob10.addImage(ob4);
     break;
     case 5:ob10.addImage(ob5);
     break;
     case 6:ob10.addImage(ob6);
     break;
     
     default:break;
 }
     
     ob10.lifetime=200;
     ob10.velocityX=-(6+(score/100));
    ob10.scale=0.5;
     
     ObstaclesGroup.add(ob10);
 
  
}
}
  function clouds(){
    if(frameCount%100==0){
      var cl= createSprite(620,100,10,10);
      cl.y=Math.round(random(60,120));
      cl.addImage(cloud);
      cl.velocityX=-5;
      cl.lifetime=200;
      
      cl.depth=trex.depth;
      trex.depth=trex.depth+1;
      
      cl.scale=0.7;
      
      CloudsGroup.add(cl);
    }
  }
function restart(){
  gameState=PLAY;
  trex.changeAnimation("running",trex_running);
  score=0;
  count=0;
  ObstaclesGroup.destroyEach();
  CloudsGroup.destroyEach();
  gameOver.visible=false;
  reset.visible=false;
  ground.velocityX=-5;
}