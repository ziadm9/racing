let carX = 400
let carY = 400
let coinXPos, coinYPos;
let oil1X, oil1Y;
let redCar, blueCar, greenCar, yellowCar;
let coin;
let oil1;
let score = 0;
let check1Y
let check2Y
let finishLine;
let finish
let carSound;
let roadLines = []
let npcs =[]
let myLeft = 350
let myRight = 450
let myTop = 325
let myBottom = 475
let coinLeft, coinRight, coinTop, coinBottom;
let oil1Left, oil1Right, oil1Top, oil1Bottom;
let carTypes = []
let state = "menu"
let checkScore = 0
let gameSpeed = 0
let crash
let totalScore

function preload(){
   redCar = loadImage("images/redcar.png");
   blueCar = loadImage("images/bluecar.png");
   greenCar = loadImage("images/greencar.png");
   yellowCar = loadImage("images/yellowcar.png");
   carTypes.push(blueCar, greenCar, yellowCar)
   coin = loadImage("images/coin.png");
   oil1 = loadImage("images/oilspill1.png");
   finishLine = loadImage("images/finish.png")
   crash = loadSound("sounds/crash.mp3")
   carSound = loadSound("sounds/carsound.mp3")
}

function setup() {
    finish = -10000;
    check1Y = -3333;
    check2Y = -6666;
    coinXPos = random(200, 600);
    coinYPos = random(-50, -100);
    oil1X = random(200, 600);
    oil1Y = random(-75, -150);
   createCanvas(800,800)
   background(0)
   imageMode(CENTER)
   rectMode(CENTER)
   angleMode(DEGREES)
   //create road lines and npc cars
   roadLines.push(new roadLine(50,150))
   roadLines.push(new roadLine(250,350))
   roadLines.push(new roadLine(450,550))
   roadLines.push(new roadLine(650,750))
   roadLines.push(new roadLine(850,950))
   npcs.push(new npc(carTypes[Math.floor(random(0,3))], -100))
   npcs.push(new npc(carTypes[Math.floor(random(0,3))], -300))
   npcs.push(new npc(carTypes[Math.floor(random(0,3))], -500))
   npcs.push(new npc(carTypes[Math.floor(random(0,3))], -700))
   npcs.push(new npc(carTypes[Math.floor(random(0,3))], -900))
}

class roadLine{
    constructor(y1,y2){
        this.startY = y1
        this.endY = y2
    }
    move(){
        this.startY+=gameSpeed
        this.endY+=gameSpeed
    } 
}

class npc{
    constructor(carColor, y1){
        this.color = carColor
        this.y = y1
        let number = random(225,575)
        this.x = number
        this.left = this.x-37.5
        this.right = this.x+37.5
        this.top = this.y-62.5
        this.bottom = this.y+62.5
    }
    move(){
        this.y+=gameSpeed
        this.top+=gameSpeed
        this.bottom+=gameSpeed
    }   
}

function draw(){
   background(0)
   
   if (state == "menu"){
    fill(0,255,0)
    rect(400,250,300,100)
    fill(255,0,0)
    rect(400,550,300,100)
    fill(255,255,0)
    rect(400,400,300,100)
    fill(0,0,0)
    textSize(50)
    text("Easy", 340, 270)
    text("Medium", 310, 420)
    text("Hard", 340, 565)
   }
   else if (state=="playing"){
   //road
   fill(50,50,50)
   noStroke()
   rect(400,400,450,800)
   stroke(255,255,255)
   strokeWeight(10)
   line(200,0,200,800)
   line(600,0,600,800)
   stroke(227, 187, 30)

   //road lines
   for (i=0; i<roadLines.length; i++){
    roadLines[i].move()
    if (roadLines[i].startY >= 950){
        roadLines.splice(i,1)
        roadLines.push(new roadLine(-50,50))
    }
    line(466,roadLines[i].startY,466,roadLines[i].endY)
    line(333,roadLines[i].startY,333,roadLines[i].endY)
   }
   strokeWeight(1)

    //Checkpoints
    fill(255, 255, 0);
    rect(400, check1Y, 400, -50);
    rect(400, check2Y, 400, -50);
    check1Y +=gameSpeed;
    check2Y +=gameSpeed;

   //npc cars
   for (i=0; i<npcs.length; i++){
    npcs[i].move()
    if (npcs[i].y >= 900){
        npcs.splice(i,1)
        npcs.push(new npc(carTypes[Math.floor(random(0,3))], -100))
    }
    if (!(myLeft > npcs[i].right || myRight < npcs[i].left || myTop > npcs[i].bottom || myBottom < npcs[i].top)) {
        let oldY = (npcs[i].y)
        npcs.splice(i,1)
        npcs.push(new npc(carTypes[Math.floor(random(0,3))], (-100-(900-oldY))))
        //crash.play()
        score-=1
    }
    image(npcs[i].color,npcs[i].x,npcs[i].y, 75, 125)
   }
   
   //player's car
   image(redCar, carX, carY, 75, 125);
   myLeft = carX - 37.5;
   myRight = carX + 37.5;
   myTop = carY - 62.5;
   myBottom = carY + 62.5;
   
   //Coins
   image(coin, coinXPos, coinYPos, 50, 50);

   //Obstacles
   image(oil1, oil1X, oil1Y, 100, 100);

   //Finish line
   image(finishLine, 400, finish, 400, 100);
   
   //Object movement
   coinYPos += gameSpeed;
   oil1Y += gameSpeed;
   finish +=gameSpeed;

   //player movement
   if (keyIsDown(LEFT_ARROW)) { 
    carX -= gameSpeed+0.5;
   }
   if (keyIsDown(RIGHT_ARROW)) { 
    carX += gameSpeed+0.5;
   }
   if (keyIsDown(UP_ARROW)) { 
    carY -= gameSpeed+1;
   }
   if (keyIsDown(DOWN_ARROW)) { 
    carY += gameSpeed;
   }

   //Score board
   fill(255, 255, 255);
   stroke(255,255,255)
   textSize(22);
   text("Score: " + (totalScore) , 50, 75)

   //checkpoint score
   if (check1Y >= 400){
    checkScore = 10
   }
   if (check2Y >= 400){
    checkScore = 20
   }
   
   
   //walls
   if (carX<=225){
    carX=225
   }
   if (carX>=575){
    carX=575
   }
   if (carY<=50){
    carY=50
   }
   if (carY>=750){
    carY=750
   }

   //hitboxes
   coinLeft = coinXPos - 25;
   coinRight = coinXPos + 25;
   coinTop = coinYPos - 25;
   coinBottom = coinYPos + 25;

   oil1Left = oil1X - 25;
   oil1Right = oil1X + 25;
   oil1Top = oil1Y - 25;
   oil1Bottom = oil1Y + 25;
 
   //coin and obstacle spawning
   if (!(myLeft > coinRight || myRight < coinLeft || myTop > coinBottom || myBottom < coinTop)) {
      coinYPos = random(-50, -100);
      coinXPos = random(225, 575);
      score += 3;
   }
   if (coinYPos >= 850){
      coinYPos = random(-50, -100);
      coinXPos = random(225, 575);
   }

   for(i=0;i<npcs.length;i++){
   if (!(coinLeft > npcs[i].right || coinRight < npcs[i].left || coinTop > npcs[i].bottom || coinBottom < npcs[i].top)) {
    coinYPos = random(-50, -100);
    coinXPos = random(225, 575);
   }

   }
   if (!(myLeft > oil1Right || myRight < oil1Left || myTop > oil1Bottom || myBottom < oil1Top)) {
    oil1Y = random(-50, -100);
    oil1X = random(225, 575);
    score -= 1;
   }
    if (oil1Y >= 850){
        oil1Y = random(-50, -100);
        oil1X = random(225, 575);
    }
    for(i=0;i<npcs.length;i++){
    if (!(oil1Left > npcs[i].right || oil1Right < npcs[i].left || oil1Top > npcs[i].bottom || oil1Bottom < npcs[i].top)) {
    oil1Y = random(-50, -100);
    oi1X = random(225, 575);
    }
    }

    //finish line
    if (myTop < finish){
      state = "finished"
    }


    //keep score above 0
    totalScore = score + checkScore
    if(totalScore<=0){
        totalScore=0
    }
}
else if(state == "finished"){
    
    if(totalScore>=75){
      background(random(25, 255), random(25, 255), random(25, 255));
      fill(0, 0, 0);
      stroke(0,0,0);
      textSize(22);
      text("Congratulations you have " + (totalScore) + " points!", 200, 400);
      carX = 1000
    }
    else{
    background(255);
    fill(255, 0, 0)
    stroke(255,0,0)
    textSize(22);
    text("You only have " + (totalScore) + " points...", 200, 400)
    carX = 1000
    state = "finished"
    }
    fill(255,0,255)
    rect(325,600,300,100)
    fill(0,0,0)
    textSize(50)
    text("Play Again", 200, 620)
   
}
}

//annoying car sounds
function Sound(){
   carSound.play();
}
setInterval(Sound, 5000);

function mouseClicked(){
    if(state=="menu"){
        if (mouseX>=250 && mouseX<=550 && mouseY>=200 && mouseY<=300){
            gameSpeed = 2
            state = "playing"
        }
        else if (mouseX>=250 && mouseX<=550 && mouseY>=350 && mouseY<=450){
            gameSpeed = 4
            state = "playing"
        }
        else if (mouseX>=250 && mouseX<=550 && mouseY>=500 && mouseY<=600){
            gameSpeed = 6
            state = "playing"
        }
    }
    else if(state=="finished"){
        if (mouseX>=175 && mouseX<=475 && mouseY>=550 && mouseY<=650){
            carX=400
            carY=400
            finish = -10000;
            check1Y = -3333;
            check2Y = -6666;
            score = 0
            checkScore = 0
            state = "menu"
        } 
    }
}