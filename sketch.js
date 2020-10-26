//Global variables
let monkey, monkey_running, monkey_end;
let banana, bananaImage, obstacle, obstacleImage;
let foodGroup, obstacleGroup;
let invisible_ground, back, backImg;
let gameOver, gameOverImg;
let score = 0;;
play = 1;
end = 0;
let gamestate = play;
let foodGroupAssign = 1;
let fg1, fg2, fg3;

//Loading Images
function preload() {
    monkey_running = loadAnimation("sprite_0.png", "sprite_1.png", "sprite_2.png", "sprite_3.png", "sprite_4.png", "sprite_5.png", "sprite_6.png", "sprite_7.png", "sprite_8.png");
    monkey_end = loadAnimation("sprite_5.png");
    bananaImage = loadImage("banana.png");
    obstacleImage = loadImage("obstacle.png");
    backImg = loadImage("forest.jpg");
    gameOverImg = loadImage("gameover.png");
}

//Creating sprites and setting them on the canvas
function setup() {
    createCanvas(800, 400);
    back = createSprite(400, 200);
    back.addImage(backImg);
    monkey = createSprite(50, 330);
    monkey.addAnimation("monkeyrunning", monkey_running);
    monkey.addAnimation("monkeyEnd", monkey_end);
    monkey.scale = 0.1;
    monkey.debug = true;
    invisible_ground = createSprite(400, 370, 800, 10);
    gameOver = createSprite(400, 200);
    gameOver.addImage(gameOverImg);
    gameOver.scale = 0.5;

    foodGroup = createGroup();
    obstacleGroup = createGroup();
    fg1 = createGroup();
    fg2 = createGroup();
    fg3 = createGroup();
}

//Drawing Elements
function draw() {
    background("white");

    //Calling functions
    playstate();
    endstate();
    drawSprites();
    //Score
    fill("red");
    textSize(20);
    text("Score" + " " + ":" + score, 700, 45);
}

//Processes to be done in play state
function playstate() {
    if (gamestate === play) {
        gameOver.visible = false;
        bananaSpawn();
        obstacleSpawn();
        monkeyMovement();
        scoreCalculator();
        endgame();
        bananaeat();
    }
}

//Processes to be done in end state
function endstate() {
    if (gamestate === end) {
        gameOver.visible = true;
        gamestateend();
    }
}

//Spawning banana according to the frame count
function bananaSpawn() {

    if (frameCount % 150 === 0) {
        //Defining proprties for banana
        banana = createSprite(820, 225);
        banana.addImage("bananaimage", bananaImage);
        banana.scale = 0.1;
        banana.velocityX = -(7 + (score / 4));
        banana.lifetime = 200;

        //Adding banana to groups and adding collides
        foodGroup.add(banana);
        foodGroup.setColliderEach("rectangle", 0, 0, 500, 200);

        //Assigning banana separate groups to prevent computer to choose wrong sprite according to our game
        switch (foodGroupAssign) {
            case 1:
                fg1.add(banana);
                break;
            case 2:
                fg2.add(banana);
                break;
            case 3:
                fg3.add(banana);
                break;
            default:
                break;
        }
        assignreset();
        foodGroupAssign = foodGroupAssign + 1;
    }

}

//Spawning the obstacles according to the framecount
function obstacleSpawn() {

    if (frameCount % 150 === 0) {
        obstacle = createSprite(820, 350);
        //Properties of obstacles
        obstacle.addImage("obstacleimage", obstacleImage);
        obstacle.scale = 0.1;
        obstacle.velocityX = -(4 + (score / 2));
        obstacle.lifetime = 400;

        //Addind obstacles to a group
        obstacleGroup.add(obstacle);
        obstacleGroup.setColliderEach("circle", 0, 0, 200);

        //Making our monkey visible at the top
        obstacle.depth = monkey.depth;
        monkey.depth = monkey.depth + 1;
    }

}

//Calculating score according to the number of banana touched
function scoreCalculator() {
    if (foodGroup.isTouching(monkey)) {
        score = score + 1;
    }
}

//Assigning gravity and controls to our monkey
function monkeyMovement() {
    monkey.collide(invisible_ground);

    if (keyWentDown("space") && monkey.y >= 330) {
        monkey.velocityY = -10;
    }
    monkey.velocityY = monkey.velocityY + 0.4;;

}

//Position where the game will finish
function endgame() {
    if (obstacleGroup.isTouching(monkey)) {
        gamestate = end;
    }
}

//Processes to be done in game state end
function gamestateend() {
    obstacleGroup.setVelocityXEach(0);
    foodGroup.setVelocityXEach(0);
    obstacleGroup.setLifetimeEach(-1);
    foodGroup.setLifetimeEach(-1);
    monkey.changeAnimation("monkeyEnd", monkey_end);
    monkey.velocityY = 0;
}

//Recomputing the value of the variable which is responsibble to assign diffrent groups to our banana
function assignreset() {
    if (foodGroupAssign === 3) {
        foodGroupAssign = 1;
    }
}

//Destroying our banana as the monkey touches it
function bananaeat() {
    if (monkey.isTouching(fg1)) {
        fg1.destroyEach();
    }
    if (monkey.isTouching(fg2)) {
        fg2.destroyEach();
    }
    if (monkey.isTouching(fg3)) {
        fg3.destroyEach();
    }
}
