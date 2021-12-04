function setup() {
    // create a canvas the size of the window
    createCanvas(windowWidth, windowHeight);
}
let circles = []; 
let x = random(width/2-len/2, width/2+len/2);
let y = random(100, 100+len);

  function draw() {
    let inside = 0;
    let outside = 0; 
    background(220);
    // draw a square in the middle of the frame and 40 pixels from the edge
    // find the max of height and width
    let minim = min(width, height);
    let len = minim-400;
    fill(255);
    rect(width/2-len/2, 100, len, len);
    stroke(255, 0, 0);

    ellipse(width/2, len/2+100, len, len);
    
    rect(width/2-50, len+200, 100, 50);
    textSize(15);
    textAlign(CENTER, CENTER);
    fill(0);
    stroke(0);
    text('New Point', width/2, len+225);
    
    
    textSize(35);
    textAlign(CENTER, CENTER);
    fill(0);
    stroke(0);
    text('Pi Estimator', width/2, 50);
    
    mouseClicked = function(){
      if ( mouseX > width/2-50 && mouseX < width/2+50 && mouseY > len +200 && mouseY < len+250) {
        let x = random(width/2-len/2, width/2+len/2);
        let y = random(100, 100+len);
        col = 0;
        fill(0);
        text('New Point', width/2, len+225);
        circles.push(createVector(x, y));
      }
    }

    
    // loop through the array and draw each circle
    for (let i = 0; i < circles.length; i++) {
   
      if(sqrt(sq(circles[i].x-width/2)+sq(circles[i].y-(len/2+100)))<len/2){
        fill(255,0,0);
        inside = inside + 1;
      }else{
        fill(0);
        outside += 1;
      }
      ellipse(circles[i].x, circles[i].y, len/50, len/50);
    }
    
    let myText = "Points Inside: " + inside + "  Points Outside: " + outside;
    fill(255);
    rect(width/2-len/2, len+100, len, 50);
    textSize(15);
    textAlign(CENTER, CENTER);
    fill(0);
    text(myText, width/2, len+125);
    //Esti ate of pi
    let myPi = "Pi Estimate: " + 4*inside/(inside+outside) ;
    fill(255);
    rect(width/2-len/2, len+150, len, 50);
    textSize(15);
    textAlign(CENTER, CENTER);
    fill(0);
    text(myPi, width/2, len+175);
    
}   