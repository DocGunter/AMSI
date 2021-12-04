function setup() {
    // create a canvas the size of the window
    createCanvas(windowWidth, windowHeight);
}
// create a dot class
class Dot {
    // constructor
    constructor(x, y, target,speed,road) {
        this.x = x;
        this.y = y;
        this.target = target;
        this.speed = speed;
        this.road = road;
    }
    // draw the dot
    draw() {
        // set the fill color to white
        fill(255);
        // draw a circle at the dot's location
        ellipse(this.x, this.y, 10, 10);
    }
    // move the dot to a new location
    move() {
        // find vector from dot to target
        let v = createVector(this.target.x - this.x, this.target.y - this.y);
        // normalize the vector
        v.normalize();
        // multiply the vector by the speed
        v.mult(this.speed);
        // add the vector to the dot's location
        this.x += v.x;
        this.y += v.y;
    }
}
// create a road class
class Road {
    // constructor
    constructor(intersection1,intersection2,id,speed) {
        this.x1 = intersection1.x;
        this.y1 = intersection1.y;
        this.x2 = intersection2.x;
        this.y2 = intersection2.y;
        this.id = id;
        this.speed = speed;
    }
    // draw the road
    draw() {
        // set the fill color to black
        fill(0);
        // draw a line between the two points
        line(this.x1, this.y1, this.x2, this.y2);
    }
}

// create an intersection class
class intersection {
    constructor(x, y, connections, type, isSelected,id) {  
        this.x = x;
        this.y = y;
        this.connections = connections;
        this.type = type;
        this.isSelected = isSelected;
        this.id = id;
    }
    // create a function to draw the intersection
    draw() {
        // if the type is a circle
        if (this.isSelected) {
            fill(255, 0, 0);
        }else{
        // draw in white
            fill(255);
        }
        if (this.type == "roundabout") {
            // draw a circle at the location
            ellipse(this.x, this.y, 20, 20);
        }else if (this.type == "giveway" || this.type == "stop" || this.type == "traffic light") {
            // draw a square at the location
            rect(this.x-10, this.y-10, 20, 20);
        }  
    }
}

// create an empty road array
let roads = [];
// create a roadId
let roadId = 0;

// empty array to hold dots
let dots = [];

// empty array to hold intersections
let intersections = [];

// create a dist function
function dist(x1, y1, x2, y2) {
    // return the distance between two points
    return Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2));
}
//Update road function
function updateRoad(carList,roadID){
    // create a new array to hold cars
    let newCarList = [];
    // check the distance to the previous dot
    for (let i = 1; i < carList.length; i++) {
        // check the dot has the right roadId
        if (carList[i].road == roadID) {
            // add the dot to the new array
            newCarList.push(carList[i]);
        }
    }
    // loop the new array
    for (let i = 1; i < newCarList.length; i++) {
        if (dist(newCarList[i].x, newCarList[i].y, newCarList[i - 1].x, newCarList[i - 1].y) < 10) {
            // set the previous dots speed to 0
            newCarList[i].speed = 0;
        }else{
            // set the previous dots speed to 1
            newCarList[i].speed = 1;
        }
    }
    // loop through the dots array
    for (let i = 0; i < newCarList.length; i++) {
        // draw the dot
        newCarList[i].draw();
        // move the dot
        newCarList[i].move();
    }
}

// create a dist function
function dist(x1, y1, x2, y2) {
    // return the distance between two points
    return Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2));
}



// draw function
function draw() {
    // background
    
    background(200);
    mouseClicked = function() {
        // if the n key is pressed
        if (keyCode == 78) {
            // create a new intersection at the mouse location
            intersections.push(new intersection(mouseX, mouseY, [], "roundabout", false,[intersections.length]));
        }
        // if the c key is pressed
        if (keyCode == 67) {
            for (let i = 0; i < intersections.length; i++) {
                // if the mouse is over the intersection
                if (dist(intersections[i].x, intersections[i].y, mouseX, mouseY) < 20) {
                    // set the intersection to be selected or not
                    if(intersections[i].isSelected){
                        intersections[i].isSelected = false;
                    }else{
                        intersections[i].isSelected = true;
                    }

                }
                
            }
            // connect selected intersections
            // create a variable of selected intersections
            let selectedIntersections = [];
            for (let i = 0; i < intersections.length; i++) {
                // if the intersection is selected
                if (intersections[i].isSelected) {
                    // add it to the selectedIntersections array
                    selectedIntersections.push(intersections[i]);
                }
            }

            // connect all selected intersections
            for (let i = 0; i < selectedIntersections.length; i++) {
                // for each selected intersection
                for (let j = 0; j < selectedIntersections.length; j++) {
                    // if the selected intersection is not the same as the current selected intersection
                    if (selectedIntersections[i] != selectedIntersections[j] && selectedIntersections[i].connections.includes(selectedIntersections[j]) == false) {
                        //connect the selected intersection to the current selected intersection
                        selectedIntersections[i].connections.push(selectedIntersections[j]);
                    }
                }
            }

            // for each intersection
            for (let i = 0; i < intersections.length; i++) {
                // for each connection
                for (let j = 0; j < intersections[i].connections.length; j++) {
                    // draw a road between the two intersections
                    roadId = intersections[i].id+j;
                    roads.push(new Road(intersections[i], intersections[i].connections[j], roadId,1));
                }
            }
        }
        // if the d key is pressed
        if (keyIsDown(68)) {
            // for each intersection
            for (let i = 0; i < intersections.length; i++) {
                // if the mouse is over the intersection
                if (dist(intersections[i].x, intersections[i].y, mouseX, mouseY) < 20) {
                    // remove the intersection from the array
                    intersections.splice(i, 1);
                }
            }

        }
        //if right click is pressed
        // if b key is pressed
        if (keyIsDown(66)) {
            // for each intersection
            for (let i = 0; i < intersections.length; i++) {
                // if the mouse is over the intersection
                if (dist(intersections[i].x, intersections[i].y, mouseX, mouseY) < 20) {
                    // cycle the type of intersection
                    if(intersections[i].type == "roundabout"){
                        intersections[i].type = "giveway";
                    }
                    else if(intersections[i].type == "giveway"){
                        intersections[i].type = "stop";
                    }
                    else if(intersections[i].type == "stop"){
                        intersections[i].type = "traffic light";
                    }
                    else if(intersections[i].type == "traffic light"){
                        intersections[i].type = "roundabout";
                    }
                }
            }
        }

    }   
    // if m key is pressed
    if (keyIsDown(77)) {
        // create a new dot
        //dots.push(new Dot(100, 100, createVector(width-200, 100),1,roadId));
        // select a random intersection
        let randomIntersection = intersections[Math.floor(Math.random() * intersections.length)];
        // select a random connection
        let randomConnection = randomIntersection.connections[Math.floor(Math.random() * randomIntersection.connections.length)];
        // find the road between the two intersections
        let road;
        //loop roads
        for (let i = 0; i < roads.length; i++) {
            // if the road is at the same location as the random intersection
            if (roads[i].x1 == randomIntersection.x && roads[i].y1 == randomIntersection.y && roads[i].x2 == randomConnection.x && roads[i].y2 == randomConnection.y) {
                road = roads[i];
            }
        }
        // create a new dot
        dots.push(new Dot(randomIntersection.x, randomIntersection.y, createVector(randomConnection.x, randomConnection.y),1,road.id));
    }
    // if p key is pressed
    if (keyIsDown(80)) {
        // for each intersection
        for (let i = 0; i < intersections.length; i++) {
            // set to unseleted
            intersections[i].isSelected = false;
        }
    }
    
    // if the r key is pressed
    if (keyIsDown(82)) {
        // clear the roads
        roads = [];
        // clear the dots
        dots = [];
    }
    // set colour to black
    fill(0);
    // write the intersections id above the intersection
    for (let i = 0; i < intersections.length; i++) {
        // write the id of the intersection
        text(intersections[i].id, intersections[i].x, intersections[i].y - 20);
    }
    // remove duplicate roads based of the roadId
    roads = roads.filter(function(item, pos, self) {
        return self.map(function(mapItem) {
            return mapItem.id;
        }).indexOf(item.id) == pos;
    });
    textSize(20);
    // write the number of intersections top left
    text("Number of intersections: " + intersections.length, 10, 20);
    // write the number of roads top left
    text("Number of roads: " + roads.length, 10, 50);
    // write the number of dots top left
    text("Number of cars: " + dots.length, 10, 80);
    //draw the roads
    for (let i = 0; i < roads.length; i++) {
        roads[i].draw();
    }
    //draw the intersections
    for (let i = 0; i < intersections.length; i++) {
        intersections[i].draw();
    }

    // creat an array of unique road ids
    let uniqueRoadIds = [];
    for (let i = 0; i < roads.length; i++) {
        // if the road id is not in the array
        if (uniqueRoadIds.includes(roads[i].id) == false) {
            // add it to the array
            uniqueRoadIds.push(roads[i].id);
        }
    }
    // loop unique road ids
    for (let i = 0; i < uniqueRoadIds.length; i++) {
        updateRoad(dots,uniqueRoadIds[i]);
    }
    fill(0);
    // at the bottom left write 'press m to add dots'
    text("press m to add dots", 10, height - 20);
    // at the bottom left write 'press p to deselect all intersections'    
    text("press p to deselect all intersections", 10, height - 40);
    // at the bottom left write 'press e to show info'
    text("press e to show info", 10, height - 60);
    // at the bottom left write 'press b and click to change intersection type'
    text("press b to change intersection type", 10, height - 80);
    // at the bottom left write 'press r to reset'
    text("press r to reset", 10, height - 100);
    // at the bottom left write 'press d and click to delete an intersection'
    text("press d to delete an intersection", 10, height - 120);
    // at the bottom left write 'press n and click to add an intersection'
    text("press n to add an intersection", 10, height - 140);
    
    //if the e key is pressed
    if (keyIsDown(69)) {
        // for each intersection
        for (let i = 0; i < intersections.length; i++) {
            // if the mouse is over the intersection
            if (dist(intersections[i].x, intersections[i].y, mouseX, mouseY) < 20) {
                // show a box in the top right with the type of intersection inside
                fill(255);
                rect(mouseX + 20, mouseY - 20, 200, 200);
                fill(0);
                text(intersections[i].type, mouseX + 30, mouseY );
                // make the text smaller
                textSize(10);
                // list current connections of the intersection
                text("Current connections: "+ intersections[i].connections.length, mouseX + 30, mouseY + 20);

                // list the number of cars in the intersection
                let carsInIntersection = 0;
                //loop cars
                for (let j = 0; j < dots.length; j++) {
                    // if the dot has the intersection as target
                    if (dots[j].target.x == intersections[i].x && dots[j].target.y == intersections[i].y) {
                        // add 1 to the carsInIntersection
                        carsInIntersection++;
                    }
                }
                text("Number of cars on road: " + carsInIntersection, mouseX + 30, mouseY + 40);
                textSize(20);
            }
        }
    }
    
}
