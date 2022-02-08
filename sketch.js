function setup() {
    // create a canvas the size of the window
    createCanvas(windowWidth, windowHeight);
}
// create new empty arrays
// for intersections
var intersections = [];
var roundAbouts = [];
var spotsForTesting = [];
var collectedSpeedData = [];
// for the roads
var roads = [];
// for the cars
var cars = [];
// for lanes
var lanes = [];
// selected intersection
var selectedIntersection = [];
// let mode be set to   
let editingMode = 'Press Key To Change Mode';

// intersection types
let types = ['Giveway', 'Roundabout', 'Traffic Lights'];

// define some variables
var acceleration = 0.1;

// draw function
function draw() {
    // set the background to black
    background(200);

    // if n key is pressed
    if (keyCode == 78){
        editingMode = 'New Intersection Mode';
    }
    if (keyCode == 67){
        editingMode = 'Connection Mode';
    }
    if (keyCode == 77){
        editingMode = 'Add Cars Mode';
    }
    // if the t key is pressed
    if (keyCode == 84){
        editingMode = 'Intersection Type Mode';
    }
    // if the s key is pressed
    if (keyCode == 83) {
        editingMode = 'Single Connection Mode';
    }

    // if the d key is pressed
    if (keyCode == 68) {
        editingMode = 'Debug Mode';
    }
    // if the r key is pressed
    if (keyCode == 82) {
        editingMode = 'Reset Mode';
    }

    // if the g key is pressed
    if (keyCode == 71) {
        editingMode = 'Auto Test';
    }
    if(cars.length>0){
        if(collectedSpeedData.length<10000){
            // loop all cars
            var sped = 0;
            var len = 0;
            for (var i = 0; i < cars.length; i++) {
                // if the car has the traffic light intersection as a target
                if (cars[i].target == 'Traffic Lights') {
                    sped+=cars[i].speed;
                    len+=1;
                }
            }
            collectedSpeedData.push(sped/len);
            
        }else{
            // in the middle of the screen write "Data Collected"
            fill(0);
            textAlign(CENTER);
            text("Data Collected", width/2, 50);
            // reset textalign
            textAlign(LEFT);
        }
    }
    mouseClicked = function() {
        // if the n key is pressed
        // if (keyCode == 78) {
        if (editingMode == 'New Intersection Mode'){
            // create a new intersection at the mouse location
            console.log("New Intersection added with ID: "+intersections.length);
            intersections.push(new Intersection(createVector(mouseX, mouseY),'Roundabout',[],intersections.length,false,[],[]));
        }
        if(editingMode == "Reset Mode"){
            // reset the cars
            cars = [];
            // reset the collected speed data
            collectedSpeedData = [];
        }
        // if editingmode is auto test
        if (editingMode == 'Auto Test'){
            if(intersections.length == 0){
                flindersUniversityGrid(2);
            }
            else{
                if(cars.length == 0){
                    // loop through all the intersections
                    for (let i = 0; i < intersections.length; i++) {
                        for (let j = 0; j < 50; j++) {
                            addCarsToIntersection(intersections[i]);
                        }
                    }
                }else{
                    // write collected speed data as a csv
                    document.write(collectedSpeedData.join("<br>"));
                }
            }
        }
        // if the editing mode is types
        if (editingMode == 'Intersection Type Mode'){
            let rectWidth = 100;
            let rectHeight = 100;
            // for each intersection
            for (var i = 0; i < intersections.length; i++) {
                // if the mouse is above the rectangle
                if (mouseX > intersections[i].location.x-rectWidth/2 && mouseX < intersections[i].location.x+rectWidth/2 && mouseY > intersections[i].location.y-rectHeight-40 && mouseY < intersections[i].location.y-40) {
                    // find the section of the rectangle the mouse is over
                    let section = Math.floor((mouseY-intersections[i].location.y+40)/(rectHeight/3));
                    // make section positive
                    section = Math.abs(section)-1;
                    // set the type of the intersection to the type of the section
                    intersections[i].type = types[section];
                    // log the types
                    console.log(types[section]);
                    // log the section
                    console.log(section);
                    // log the change
                    console.log("Intersection "+intersections[i].id+" changed to "+intersections[i].type);
                }
                // if the mouse an intersection
                if (dist(intersections[i].location,createVector(mouseX,mouseY)) < 20) {
                    // set the selected intersection to the intersection
                    selectedIntersection = intersections[i];
                }
            }

        }
        
        if (editingMode == 'Single Connection Mode'){
            // loop through all the intersections
            for (var i = 0; i < intersections.length; i++) {
                // if the mouse is over the intersection
                if (distPoints(mouseX, mouseY, intersections[i].location.x, intersections[i].location.y) < 20) {
                    // set the intersection to be selected or not
                    if(intersections[i].isSelected){
                        // log the selected intersection
                        console.log("Intersection "+intersections[i].id+" is now deselected");
                        intersections[i].isSelected = false;
                    }else{
                        // log the selected intersection
                        console.log("Intersection "+intersections[i].id+" is now selected");
                        intersections[i].isSelected = true;
                    }
                    
                    // add the selected intersection to the selectedIntersection array
                    selectedIntersection.push(intersections[i]);
                }
            }
            // if two intersections are selected
            if (selectedIntersection.length == 2) {
                // if the two intersections are not connected
                if (!isSingleConnected(selectedIntersection[0], selectedIntersection[1])) {
                    // create 2 new lanes between the two intersections
                    console.log("New Lanes added between Intersections "+selectedIntersection[0].id+" and "+selectedIntersection[1].id);
                    console.log("Lane ID: "+selectedIntersection[0].id+'-'+selectedIntersection[1].id);
                    lanes.push(new Lane(selectedIntersection[0],selectedIntersection[1],1,selectedIntersection[0].id+'-'+selectedIntersection[1].id,[]));
                    //lanes.push(new Lane(selectedIntersection[1],selectedIntersection[0],1,selectedIntersection[1].id+'-'+selectedIntersection[0].id,[]));
                    // add the lanes to each intersection
                    selectedIntersection[0].roads.push(lanes[lanes.length-1]);
                    //selectedIntersection[0].roads.push(lanes[lanes.length-2]);
                    // loop the selectedIntersection array
                    for (var i = 0; i < selectedIntersection.length; i++) {
                        // deselect the intersectionc
                        selectedIntersection[i].isSelected = false;
                    }
                    // log the number of connected roads at each intersection
                    for (var i = 0; i < selectedIntersection.length; i++) {
                        console.log("Number of lanes at Intersection "+selectedIntersection[i].id+": "+selectedIntersection[i].roads.length);
                    }
                    // clear the selectedIntersection array
                    selectedIntersection = [];
                }else{
                    // log the two intersections are already connected
                    console.log("The two intersections are already connected");
                    // loop the selectedIntersection array
                    for (var i = 0; i < selectedIntersection.length; i++) {
                        // deselect the intersection
                        selectedIntersection[i].isSelected = false;
                    }
                    // clear the selectedIntersection array
                    selectedIntersection = [];
                }
            }
        }
        
        // // if the c key is pressed
        // if (keyCode == 67) {
        if (editingMode == 'Connection Mode'){
            // loop through all the intersections
            for (var i = 0; i < intersections.length; i++) {
                // if the mouse is over the intersection
                if (distPoints(mouseX, mouseY, intersections[i].location.x, intersections[i].location.y) < 20) {
                    // set the intersection to be selected or not
                    if(intersections[i].isSelected){
                        // log the selected intersection
                        console.log("Intersection "+intersections[i].id+" is now deselected");
                        intersections[i].isSelected = false;
                    }else{
                        // log the selected intersection
                        console.log("Intersection "+intersections[i].id+" is now selected");
                        intersections[i].isSelected = true;
                    }
                    
                    // add the selected intersection to the selectedIntersection array
                    selectedIntersection.push(intersections[i]);
                }
            }
            // if two intersections are selected
            if (selectedIntersection.length == 2) {
                // if the two intersections are not connected
                if (!isConnected(selectedIntersection[0], selectedIntersection[1])) {
                    // create 2 new lanes between the two intersections
                    console.log("New Lanes added between Intersections "+selectedIntersection[0].id+" and "+selectedIntersection[1].id);
                    console.log("Lane ID: "+selectedIntersection[0].id+'-'+selectedIntersection[1].id);
                    lanes.push(new Lane(selectedIntersection[0],selectedIntersection[1],1,selectedIntersection[0].id+'-'+selectedIntersection[1].id,[]));
                    lanes.push(new Lane(selectedIntersection[1],selectedIntersection[0],1,selectedIntersection[1].id+'-'+selectedIntersection[0].id,[]));
                    // add the lanes to each intersection
                    selectedIntersection[1].roads.push(lanes[lanes.length-1]);
                    selectedIntersection[0].roads.push(lanes[lanes.length-2]);
                    // loop the selectedIntersection array
                    for (var i = 0; i < selectedIntersection.length; i++) {
                        // deselect the intersectionc
                        selectedIntersection[i].isSelected = false;
                    }
                    // log the number of connected roads at each intersection
                    for (var i = 0; i < selectedIntersection.length; i++) {
                        console.log("Number of lanes at Intersection "+selectedIntersection[i].id+": "+selectedIntersection[i].roads.length);
                    }
                    // clear the selectedIntersection array
                    selectedIntersection = [];
                }else{
                    // log the two intersections are already connected
                    console.log("The two intersections are already connected");
                    // loop the selectedIntersection array
                    for (var i = 0; i < selectedIntersection.length; i++) {
                        // deselect the intersection
                        selectedIntersection[i].isSelected = false;
                    }
                    // clear the selectedIntersection array
                    selectedIntersection = [];
                }
            }
        }
        // test car performance
        // if the m key is pressed
        // if (keyCode == 77) {
        if(editingMode == 'Add Cars Mode'){
            // log m key pressed
            console.log("m key pressed");
            // add 10 cars to the cars array
            // select a random intersection
            var randomIntersection = random(intersections);
            for (var i = 0; i < 10; i++) {
                addCarsToIntersection(randomIntersection);
            }
        }
        if (editingMode == 'Debug Mode'){
            // for every intersection
            for (var i = 0; i < intersections.length; i++) {
                // log the priority diagram of the intersection
                console.log("Intersection "+intersections[i].id+" Priority Diagram: "+intersections[i].priorityDiagram);
            }
        }
    }
    // draw all roads
    drawRoads();
    // draw all intersections
    drawIntersections();
    // roundabout update
    roundAboutUpdate();
    //updateGiveWayIntersections();
    giveWayIntersectionUpdate();

    trafficLightsUpdate();
    //giveWayForRoundAbouts();
    // update the traffic
    updateTraffic();
    
    // draw all cars
    drawCars();
    // draw info
    intersectionInfo();
    // if the t key is pressed
    // if (keyCode == 84) {
    if (editingMode == 'Intersection Type Mode'){
        typeInfo();
    }

}

// create an intersection class
class Intersection {
    // constructor
    constructor(location, type,roads,id,isSelected,priorityDiagram,priorityList) {
        // set the location
        this.location = location;
        // set the type
        this.type = type;
        // set the roads
        this.roads = roads;
        // set the id
        this.id = id;
        // set the isSelected   
        this.isSelected = isSelected;
        // set the priority diagram
        this.priorityDiagram = priorityDiagram;
        // set the priority list
        this.priorityList = priorityList;
        this.phaseLength = [40,40,40,40,40];
        this.phaseCount = 0;
        this.trafficLightPhases = 0;

    }
    // draw function
    draw() {
        stroke(0);
        if (this.isSelected) {
            // set the color to red
            fill(255,0,0);
        }else{
            // set the color to white
            fill(255);
        }
        // if the type is roundabout
        if (this.type == 'Roundabout') {
            // draw a circle
            // roundAbouts.push(new RoundAbout(this.location.x,this.location.y,this.roads));
            // roundAbouts[roundAbouts.length-1].draw();
            ellipse(this.location.x, this.location.y, 20, 20);
        }else{
            // draw a rectangle
            rect(this.location.x-10, this.location.y-10, 20, 20);
        }
    }
}
// create a new lane class
class Lane {
    // constructor
    constructor(start,end,speed,id,traffic) {
        // set the start
        this.start = start;
        // set the end
        this.end = end;
        // set the speed
        this.speed = speed;
        // set the id
        this.id = id;
        // set the traffic
        this.traffic = traffic;
    }
    // draw function
    draw() {
        // find the orthogonal vector
        var orthogonalVector = new createVector(this.end.location.y - this.start.location.y, this.start.location.x - this.end.location.x);
        // normalize the vector
        orthogonalVector.normalize();
        // draw a line
        //line(this.start.location.x, this.start.location.y, this.end.location.x, this.end.location.y);
        // draw a line adding 5 times the orthogonal vector
        line(this.start.location.x+orthogonalVector.x*5, this.start.location.y+orthogonalVector.y*5, this.end.location.x+orthogonalVector.x*5, this.end.location.y+orthogonalVector.y*5);
    }
}


// create a road class
class Road {
    // constructor
    constructor(start, end, speed, id,traffic) {
        // set the start
        this.start = start;
        // set the end
        this.end = end;
        // set the speed
        this.speed = speed;
        // set the id
        this.id = id;
        // set the traffic
        this.traffic = traffic;
        this.isDominant = false;
    }
    // draw function
    draw() {
        // find the orthogonal vector
        var orthogonalVector = new createVector(this.end.location.y - this.start.location.y, this.start.location.x - this.end.location.x);
        // normalize the vector
        orthogonalVector.normalize();
        // draw a line
        line(this.start.location.x, this.start.location.y, this.end.location.x, this.end.location.y);
        // draw a line adding 5 times the orthogonal vector
        line(this.start.location.x+orthogonalVector.x*5, this.start.location.y+orthogonalVector.y*5, this.end.location.x+orthogonalVector.x*5, this.end.location.y+orthogonalVector.y*5);
        // same as above but with -5
        line(this.start.location.x-orthogonalVector.x*5, this.start.location.y-orthogonalVector.y*5, this.end.location.x-orthogonalVector.x*5, this.end.location.y-orthogonalVector.y*5);

    }
}
// create a roundabout class
class RoundAbout{
    constructor(x,y,connections){
        this.x = x;
        this.y = y;
        this.connections = connections;
    }
    draw(){
        var intersectionsHere = [];
        var vectorsToConnections = [];
        for (var i = 0; i < this.connections.length; i++){
            vectorsToConnections.push(createVector(this.connections[i].end.location.x-this.x,this.connections[i].end.location.y-this.y));
        }
        // sort the vectors by the angle
        vectorsToConnections.sort(function(a,b){
            return a.heading()-b.heading();
        });
        // normalize the vectors
        for (var i = 0; i < vectorsToConnections.length; i++){
            vectorsToConnections[i].normalize();
        }
        // loop the vectors
        for (var i = 0; i < vectorsToConnections.length; i++){
            // draw a circle
            ellipse(this.x,this.y,10,10);
            // at the edge of the circle place an intersection (location, type,roads,id,isSelected,priorityDiagram,priorityList) 
            intersectionsHere.push(new Intersection(createVector(this.x+vectorsToConnections[i].x*5,this.y+vectorsToConnections[i].y*5),'Giveway',[],false,[],[]));
            // draw the intersection
            //intersectionsHere[i].draw();
        }
        // loop intersections here
        for (var i = 0; i < intersectionsHere.length; i++){
            // create a lane (start,end,speed,id,traffic) between the intersection and the next intersection
            var lane = new Lane(intersectionsHere[i],intersectionsHere[(i+1)%intersectionsHere.length],1,i,[]);
            // add the lane to the road
            intersectionsHere[i].roads.push(lane);
        }
    }
}

// create a car class
class Car {
    // constructor otherIntersection,last,next
    constructor(x,y,target,lastIntersection,nextIntersection,speed,id) {
        // set the location
        this.x = x;
        this.y = y;
        // set the target
        this.target = target;
        // set the last intersection
        this.lastIntersection = lastIntersection;
        // set the next intersection
        this.nextIntersection = nextIntersection;
        // set the speed
        this.speed = speed;
        // set the id
        this.id = id;
        this.needsNewTarget = true;
        this.nextTarget = null;
    }
    // draw function
    draw() {
        // find the orthogonal vector
        var orthogonalVector = createVector(this.target.location.y - this.y, this.x - this.target.location.x);
        // normalize the vector
        orthogonalVector.normalize();
        // if the cars next target is and intersection
        if (this.nextTarget instanceof Intersection){
            // create a vector from the car to the next target
            var vectorToNextTarget = createVector(this.nextTarget.location.x-this.x,this.nextTarget.location.y-this.y);
            // normalize the vector
            vectorToNextTarget.normalize();
            // create an offset of half the orthogonal vector
            var offset = createVector(orthogonalVector.x/2,orthogonalVector.y/2);
            line(this.x+offset, this.y+offset, this.x+vectorToNextTarget.x*5+offset, this.y+vectorToNextTarget.y*5+offset);
        }
        // set the color to red
        fill(255,0,0);
        // draw a circle
        ellipse(this.x+5*orthogonalVector.x, this.y+5*orthogonalVector.y, 10, 10);
    }
    // move the car
    move() {
        // if the distance between the car and the target is less than the speed
        if (distPoints(this.x, this.y, this.target.location.x, this.target.location.y) > this.speed) {
            // create vector to target
            var vectorToTarget = createVector(this.target.location.x - this.x, this.target.location.y - this.y);
            // normalize the vector
            vectorToTarget.normalize();
            
            // set the vector to speed
            vectorToTarget.setMag(this.speed);
            // add the vector to the location
            this.x += vectorToTarget.x;
            this.y += vectorToTarget.y;
        }
    }
}

// create a function to draw all intersections
function drawIntersections() {
    // for each intersection
    for (var i = 0; i < intersections.length; i++) {
        // draw the intersection
        intersections[i].draw();
        fill(0);

        // write the id above the intersection
        text(intersections[i].id, intersections[i].location.x-3, intersections[i].location.y-15);
    }
}

// create a funnction to draw  all roads
function drawRoads() {
    // for each lane
    for (var i = 0; i < lanes.length; i++) {
        // draw the lane
        lanes[i].draw();
    }
}

// create a function to draw all cars
function drawCars() {
    // loop through all the cars
    for (var i = 0; i < cars.length; i++) {
        // draw the car
        cars[i].draw();
        // move the car
        cars[i].move();

    }
}
// create a function to determine if two intersections are connected
function isConnected(intersection1, intersection2) {
    // loop through all the lanes
    for (var i = 0; i < lanes.length; i++) {
        // if the lane is connected to the intersection
        if (lanes[i].start == intersection1 || lanes[i].end == intersection1) {
            // if the lane is connected to the intersection
            if (lanes[i].start == intersection2 || lanes[i].end == intersection2) {
                // return true
                return true;
            }
        }
    }
    // return false
    return false;
}
function isSingleConnected(intersection1, intersection2) {
    // loop through all the lanes
    for (var i = 0; i < lanes.length; i++) {
        // if the lane is connected to the intersection
        if (lanes[i].start == intersection1 && lanes[i].end == intersection2) {
            // if the lane is connected to the intersection
            return true;
        }
    }
    // return false
    return false;
}

//create a dist function
function dist(a,b) {
    // return the distance between two points
    return sqrt(sq(a.x-b.x)+sq(a.y-b.y));
}

// create a dist function
function distPoints(x1, y1, x2, y2) {
    // return the distance between two points
    return Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2));
}

// create a function to update traffic
function updateTraffic() {
    // loop through all the lanes
    for (var i = 0; i < lanes.length; i++) {
        // if there is traffic
        if (lanes[i].traffic.length > 0) {
            // create a sorted array based of distance to target of each car in traffic
            var sortedTraffic = lanes[i].traffic;
            if(sortedTraffic.length > 1){
                sortedTraffic = lanes[i].traffic.sort(function(a,b) {
                    return distPoints(a.x, a.y, a.target.location.x, a.target.location.y)-distPoints(b.x,b.y,b.target.location.x,b.target.location.y);
                });
            }
            // loop through all the cars in the sorted array
            for (var j = 0; j < sortedTraffic.length; j++) {
                // set the speed to 1
                if(sortedTraffic[j].speed <1){
                    sortedTraffic[j].speed += acceleration;
                }
                let speedMult = 1
                // if the distance from the car to the target is less than 20 set the speed to 0.5
                if(sortedTraffic[j].target.type == types[1]){
                    if (distPoints(sortedTraffic[j].x, sortedTraffic[j].y, sortedTraffic[j].target.location.x, sortedTraffic[j].target.location.y) < 20 ) {
                        // set the j speed to 0.5
                        speedMult = 0.8;
                    }
                }
                //     // if the distance from the car to the target is less than 10 set the speed to 0.25
                //     if (distPoints(sortedTraffic[j].x, sortedTraffic[j].y, sortedTraffic[j].target.location.x, sortedTraffic[j].target.location.y) < 15  ) {
                //         // set the j speed to 0.25
                //         speedMult = 0.7;
                //     }
                // }
                // if the distance from the car to the previous index car is less than 10 set the speed to 0
                if (j>0){
                    if (distPoints(sortedTraffic[j].x, sortedTraffic[j].y, sortedTraffic[j-1].x, sortedTraffic[j-1].y) < 12) {
                        // set the j speed to 0
                        sortedTraffic[j].speed = 0;
                    }else{
                        // set the j speed to 1
                        if(sortedTraffic[j].speed < 1){
                            sortedTraffic[j].speed = 1;
                        }
                    }
                }
                // set the cars speed to 1*speedMult
                sortedTraffic[j].speed = sortedTraffic[j].speed * speedMult;
            }
        }
    }
}

// create a function to add cars to traffic
function addCars() {
    for (var i = 0; i < intersections.length; i++) {
        // if the mouse is over the intersection
        if (distPoints(mouseX, mouseY, intersections[i].location.x, intersections[i].location.y) < 20) {
            // create a new car at the intersection
            console.log("New Car added at Intersection "+intersections[i].id);

            var randomRoad = Math.floor(Math.random()*intersections[i].roads.length);
            // log the road id
            console.log("Car will travel on lane "+intersections[i].roads[randomRoad].id);
            // find the other intersection
            var otherIntersection = intersections[i].roads[randomRoad].start;
            if(intersections[i].roads[randomRoad].start == intersections[i]){
                otherIntersection = intersections[i].roads[randomRoad].end;
            }
            let next = getRandomNextConnection(otherIntersection, intersections[i]);
            car = new Car(intersections[i].location.x,intersections[i].location.y,otherIntersection,intersections[i],next,1,intersections[i].roads[randomRoad].id);
            car.nextTarget = next;
            cars.push(car);
            // log the added car
            console.log("Car ID: "+cars[cars.length-1].id);
            // push the car to the intersections roads traffic
            intersections[i].roads[randomRoad].traffic.push(car);
            //log number of cars in traffic
            console.log("Number of cars in traffic on lane "+intersections[i].roads[randomRoad].id+": "+intersections[i].roads[randomRoad].traffic.length);
        }
    }
}

// create a function to add cars given an intersection
function addCarsToIntersection(intersection) {
    // create a new car at the intersection
    console.log("New Car added at Intersection "+intersection.id);

    var randomRoad = Math.floor(Math.random()*intersection.roads.length);
    // log the road id
    console.log("Car will travel on lane "+intersection.roads[randomRoad].id);
    // find the other intersection
    var otherIntersection = intersection.roads[randomRoad].start;
    if(intersection.roads[randomRoad].start == intersection){
        otherIntersection = intersection.roads[randomRoad].end;
    }
    let next = getRandomNextConnection(otherIntersection, intersection);
    car = new Car(intersection.location.x,intersection.location.y,otherIntersection,intersection,next,1,intersection.roads[randomRoad].id);
    car.nextTarget = next;
    cars.push(car);
    // log the added car
    console.log("Car ID: "+cars[cars.length-1].id);
    // push the car to the intersections roads traffic
    intersection.roads[randomRoad].traffic.push(car);
    //log number of cars in traffic
    console.log("Number of cars in traffic on lane "+intersection.roads[randomRoad].id+": "+intersection.roads[randomRoad].traffic.length);
}
// create a function for info
function intersectionInfo() {
    // fill black
    fill(0);
    textSize(20);
    // write the number of intersections top left
    text("Number of intersections: " + intersections.length, 10, 20);
    // write the number of roads top left
    text("Number of lanes: " + lanes.length, 10, 50);
    // write the number of dots top left
    text("Number of cars: " + cars.length, 10, 80);
    // in the center of the screen write the editingmode
    textAlign(CENTER);
    text(editingMode,width/2,20);
    textAlign(LEFT);
    // find the number of cars with speed less than 1
    var slowCars = 0;
    for (var i = 0; i < cars.length; i++) {
        if (cars[i].speed < 1) {
            slowCars++;
        }
    }
    let lengthOfBar = 200;
    // create a red rectangle to show the number of slow cars
    fill(255, 0, 0);
    rect(10, 110, (lengthOfBar*slowCars)/(cars.length), 10);
    // create a green rectangle to show the number of fast cars
    fill(0, 255, 0);
    rect(10+(lengthOfBar*slowCars)/(cars.length), 110, lengthOfBar-(lengthOfBar*slowCars)/(cars.length), 10);

    // if there are more than 0 cars
    if (cars.length > 0) {
        // text align center
        textAlign(CENTER);
        // below the red rectangle write the number of slow cars
        fill(0);
        text(slowCars, 10+(lengthOfBar*slowCars)/(cars.length)/2, 140);
        // below the green rectangle write the number of fast cars
        text((cars.length), 10+lengthOfBar, 140);
    }
    // reset text align
    textAlign(LEFT);
    // set the font smaller
    textSize(15);
    // set the color to black
    fill(0);
    // at the top right of the screen write the fps
    text("FPS: " + Math.round(frameRate()), width - 100, 20);
    text("Press t to edit intersection type", 10, height - 20);
    // at the bottom of the screen write
    // Press m and click to add a car
    text("Press m and click to add a car", 10, height - 40);
    // above this write
    // Press c and click on intersections to connect lanes
    text("Press c and click on intersections to connect lanes", 10, height - 60);
    // above this write
    // Press n and click to add an intersection
    text("Press n and click to add an intersection", 10, height - 80);
    // reset the font size  
    textSize(20);
    var indexOfMouse = 0;
    var isOverIntersection = false;
    var valuesToDisplay = [];
    // for each intersection
    for (let i = 0; i < intersections.length; i++) {
        // if the mouse is over the intersection
        let carsInIntersection = 0;
        let carInQueue = 0;

        //loop cars
        for (let j = 0; j < cars.length; j++) {
            // if the car has the intersection as target
            if (cars[j].target == intersections[i]) {
                // add one to the cars in intersection
                carsInIntersection++;
                // if speed is less than 1
                if(cars[j].speed < 1){
                    // add one to the cars in queue
                    carInQueue++;
                }
            }
        }
        if (distPoints(mouseX, mouseY, intersections[i].location.x, intersections[i].location.y) > 20) {
            // if editingmode is not type
            if (editingMode != "Intersection Type Mode") {
                //above each intersection
                let rangeOfRed = 60/(carsInIntersection);
                fill(255, 0, 0);
                rect(intersections[i].location.x-30, intersections[i].location.y - 50, rangeOfRed*carInQueue, 10);
                fill(0,255,0);
                rect(intersections[i].location.x-30+rangeOfRed*carInQueue , intersections[i].location.y - 50, rangeOfRed*(carsInIntersection-carInQueue), 10);
            }
        }else{
            // is over is true
            isOverIntersection = true;
            // set the index of mouse to the index of the intersection
            indexOfMouse = i;
            // set the values to display to the intersection id and the number of cars in intersection
            valuesToDisplay = [carInQueue, carsInIntersection];
            
        }
    }
    // if the mouse is not over an intersection
    if(isOverIntersection){
        // show a box in the top right with the type of intersection inside
        fill(255);
        rect(mouseX + 20, mouseY - 20, 200, 200);
        fill(0);
        text(intersections[indexOfMouse].type, mouseX + 30, mouseY );
        // make the text smaller
        textSize(10);
        // list current number of connected lanes
        text("Number of Connected Lanes: "+intersections[indexOfMouse].roads.length, mouseX + 30, mouseY + 20);
        // list the number of cars in the intersection
        text("Number of cars towards intersection: " + valuesToDisplay[1], mouseX + 30, mouseY + 40);
        text("Number of cars in queue: " + valuesToDisplay[0], mouseX + 30, mouseY + 60);
        // draw a red rectangle below the text of qued cars
        fill(255, 0, 0);
        let rangeOfRed = 180/(valuesToDisplay[1]);
        rect(mouseX + 30, mouseY +70, rangeOfRed*valuesToDisplay[0], 10);
        fill(0,255,0);
        rect(mouseX + 30+rangeOfRed*valuesToDisplay[0] , mouseY +70, rangeOfRed*(valuesToDisplay[1]-valuesToDisplay[0]), 10);
        textSize(20);
    }
     
}

function roundAboutGiveWayUpdate(){
    // loop intersections
    for (let i = 0; i < intersections.length; i++) {
        // if the intersection is a roundabout
        if (intersections[i].type == "Roundabout") {
            // loop all cars
            let carsInIntersection = [];
            for (let j = 0; j < cars.length; j++) {
                // if the car has the intersection as target
                if (cars[j].target == intersections[i]) {
                    // if the distance from the car to the target is less than 10
                    if (distPoints(cars[j].location.x, cars[j].location.y, intersections[i].location.x, intersections[i].location.y) < 10) {
                        // add the car to the cars in intersection
                        carsInIntersection.push(cars[j]);
                    }
                }
            }
            // sort the array by distance to the target
            carsInIntersection.sort(function(a, b){return distPoints(a.location.x, a.location.y, intersections[i].location.x, intersections[i].location.y) - distPoints(b.location.x, b.location.y, intersections[i].location.x, intersections[i].location.y)});
            // find the cars in the lane to the right
            let carsInRightLane = [];
            //for (let j = 0; j < carsInIntersection.length; j++) {
        }
    }


}   
// function to give way 
function giveWayIntersectionUpdate(){
    // loop all the intersections
    for (let i = 0; i < intersections.length; i++) {
        // if the intersection is giveway
        if (intersections[i].type == "Giveway") {
            // create and array of carIDs in intersection
            var carsInIntersection = [];
            // loop though all cars
            for (let j = 0; j < cars.length; j++) {
                // if the car has the intersection as target
                if (cars[j].target == intersections[i]) {
                    // if the car is in the intersection
                    if (distPoints(cars[j].x, cars[j].y, intersections[i].location.x, intersections[i].location.y) < 25) {
                        // push the car to the cars in intersection array
                        carsInIntersection.push(cars[j]);
                        // loop lanes
                        for (let k = 0; k < intersections[i].roads.length; k++) {
                            // if the car is in the lane
                            if (intersections[i].roads[k].traffic.includes(cars[j])) {
                                // if the lane is not dominant
                                if (intersections[i].priorityList.includes(intersections[i].roads[k].start)) {
                                    // set the cars speed to half
                                    cars[j].speed = cars[j].speed / 2;
                                }
                            }
                        }
                    }
                }
            }
            // sort the cars by distance to the target
            carsInIntersection.sort(function(a, b){return distPoints(a.x, a.y, intersections[i].location.x, intersections[i].location.y) - distPoints(b.x, b.y, intersections[i].location.x, intersections[i].location.y)});
            // loop all the cars in the intersection
            let roadsHere = [];
            // loop all roads
            //console.log(lanes);
            for (let j = 0; j < lanes.length; j++) {
                // if the road has the intersection as its end
                if (lanes[j].end == intersections[i]) {
                    // push the road to the roadsHere array
                    roadsHere.push(lanes[j]);
                }
            }
            // console.log(roadsHere);
            // console.log(carsInIntersection.length);
            // sort the roads by the angle with the intersection and the end of the road
            // loop the roads
            // for (let j = 0; j < roadsHere.length; j++) {
            //     // log the vector of the road
            //     let a = roadsHere[j];
            //     let v = createVector(intersections[i].location.x - a.start.location.x,  intersections[i].location.y-a.start.location.y).heading();
            //     console.log(a.id);
            //     console.log(v);
            // }
            roadsHere = roadsHere.sort(function(a, b){return createVector(intersections[i].location.x - a.start.location.x,  intersections[i].location.y-a.start.location.y).heading()- createVector(intersections[i].location.x - b.start.location.x,  intersections[i].location.y-b.start.location.y).heading()});
            // reverse the roads
            roadsHere.reverse();

            //console.log(roadsHere); 
            // //if A is not in the intersections priority list
            if(!intersections[i].priorityList.includes(roadsHere[0].start) && roadsHere.length > 3){
                // set A the the next eoad
                roadsHere.push(roadsHere.splice(0, 1)[0]);
            }
            //console.log(roadsHere);
            for (let j = 0; j < carsInIntersection.length; j++) {
                var randomRoad = getRandomIntersection(intersections[i],carsInIntersection[j]);
                if(carsInIntersection[j].needsNewTarget){
                    carsInIntersection[j].nextTarget = randomRoad;
                    carsInIntersection[j].needsNewTarget = false;
                }else{
                    randomRoad = carsInIntersection[j].nextTarget;
                }
                //console.log(randomRoad);
                var carIsFrom = null;
                // loop all the roads
                for (let k = 0; k < lanes.length; k++) {
                    //console.log(carsInIntersection[j]);
                    // if the car is in the roads traffic
                    if (lanes[k].traffic.includes(carsInIntersection[j])) {
                        carIsFrom = lanes[k];
                        // console.log('car is from');
                        // console.log(carIsFrom.id);
                        // console.log('car is going to');
                        // console.log(intersections[i].roads[randomRoad].id);
                    }
                }
                let roadsToGiveWay = theCarShouldGiveWayTo(carIsFrom, intersections[i].roads[randomRoad],roadsHere,intersections[i]);
                //console.log(roadsToGiveWay);
                // loop all the cars in the intersection
                let canTurn = true;
                for (let k = 0; k < carsInIntersection.length; k++) {
                    // if the cars are not the same
                    if (carsInIntersection[k] != carsInIntersection[j]) {
                        // loop roads to give way
                        for (let l = 0; l < roadsToGiveWay.length; l++) {
                            // if the car is in the roads traffic
                            if (roadsToGiveWay[l].traffic.includes(carsInIntersection[k])) {
                                canTurn = false;
                            }
                        }
                    }
                }
                // if the car is within 10 of the intersection
                if (distPoints(carsInIntersection[j].x, carsInIntersection[j].y, intersections[i].location.x, intersections[i].location.y) < 10) {
                    if(canTurn && roomOnRoad(intersections[i].roads[randomRoad]) ){
                        moveCarOneIntersectionToAnother(carsInIntersection[j], intersections[i],randomRoad);
                        carsInIntersection[j].needsNewTarget = true;
                        carsInIntersection.splice(j, 1);
                        console.log("Car has turned");
                        console.log(roadsHere);
                        //console.log(intersections[i].priorityList);
                        break;
                    }else{
                        // set the cars speed to zero
                        carsInIntersection[j].speed = 0;
                    }
                }

            }
        }
    }
}
function theCarShouldGiveWayTo(start,end,roads,intersection){
    let ret = []
    
   
    console.log(intersection.priorityList);
    
    let startPoint = roads.indexOf(start);
    let endPoint = roads.indexOf(end);
    // loop the roads
    for (let i = 0; i < roads.length; i++) {
        // if the roads end is the end
        if(roads[i] != null){
            if (roads[i].end == end.start) {
                endPoint = i;
            }
        }
    }
    // find the index of the first road in the intersections priority list
    let firstRoad = 0;
    for (let i = 0; i < roads.length; i++) {
        console.log(intersection.priorityList);
        if(intersection.priorityList.includes(roads[i].start)){   
            console.log(roads[i].start.id);
            firstRoad = i;
            
            //break;
        }
    }
    let rods = [];
    for (let i = 0; i < roads.length; i++) {
        rods.push(roads[i%roads.length]);
    }
    roads = rods
    if(roads.length == 3){
        if (intersection.priorityList.includes(roads[0].start) && intersection.priorityList.includes(roads[1].start) ) {
            roads = [roads[0],null,roads[1],roads[2]];
            //console.log(roads);
        }else{
            roads = [roads[0],roads[1],roads[2],null];
            //console.log(roads);
        }
    }
    // console.log(startPoint);
    // console.log(endPoint);
    if(roads.length == 4){
        if (startPoint == 0){
            if(endPoint == 1){
                ret = [roads[2]];
            }
        }
        if (startPoint == 1){
            if(endPoint == 2 || endPoint == 3){
                ret = [roads[0],roads[2]];
            }
            if(endPoint == 0){
                ret = [roads[2]];
            }
        }
        if (startPoint == 2){
            if(endPoint == 3){
                ret = [roads[0]];
            }
        }
        if (startPoint == 3){
            if(endPoint == 0 || endPoint == 1){
                ret = [roads[0],roads[2]];
            }
            if(endPoint == 2){
                ret = [roads[0]];
            }
        }
    }
    return ret;
}
// function to return the ids of cars it must give way to
function mustGiveWayTo(car){
    let intersection = car.target;
    let roadsHere = intersection.roads;
    // sort the roads by the angle with the intersection and the end of the road
    roadsHere.sort(function(a, b){return createVector(a.end.x - intersection.location.x, a.end.y - intersection.location.y).heading() - createVector(b.end.x - intersection.location.x, b.end.y - intersection.location.y).heading()});
    console.log(roadsHere); 
    // loop the roads
    for (let i = 0; i < roadsHere.length; i++) {
        // if the road is in the intersection prioritylist
        if (intersection.priorityList.includes(roadsHere[i])) {
           let A = i;
           break;
        }
    }


}

function trafficLightsUpdate(){
    // loop all intersections
    for (let i = 0; i < intersections.length; i++) {
        //console.log(intersections[i]);
        // if the intersectuib is a traffic light
        if (intersections[i].type == 'Traffic Lights') {
            var carsInIntersection = [];
            // loop all the cars
            for (let j = 0; j < cars.length; j++) {
                // if the car has the intersection as its target
                if (cars[j].target == intersections[i]) {
                    carsInIntersection.push(cars[j]);
                }
            }
            var roadsHere = [];
            // loop all the lanes
            for (let j = 0; j < lanes.length; j++) {
                // if the road has the intersection as its end
                if (lanes[j].end == intersections[i]) {
                    roadsHere.push(lanes[j]);
                }
            }   
            roadsHere = roadsHere.sort(function(a, b){return createVector(intersections[i].location.x - a.start.location.x,  intersections[i].location.y-a.start.location.y).heading()- createVector(intersections[i].location.x - b.start.location.x,  intersections[i].location.y-b.start.location.y).heading()});
            //console.log(roadsHere);
            // loop all cars in the intersection
            for (let j = 0; j < carsInIntersection.length; j++) {
                var randomRoad = getRandomIntersection(intersections[i],carsInIntersection[j]);
                if(carsInIntersection[j].needsNewTarget){
                    carsInIntersection[j].nextTarget = randomRoad;
                    carsInIntersection[j].needsNewTarget = false;
                }else{
                    randomRoad = carsInIntersection[j].nextTarget;
                }

                var carIsFrom = null;
                // loop all the roads
                for (let k = 0; k < lanes.length; k++) {
                    // if the car is in the roads traffic
                    if (lanes[k].traffic.includes(carsInIntersection[j])) {
                        carIsFrom = lanes[k].start;
                    }
                }
                var carIsGoingTo = intersections[i].roads[randomRoad].end;
                // if the car is within 10 of the intersection
                if (distPoints(carsInIntersection[j].x, carsInIntersection[j].y, intersections[i].location.x, intersections[i].location.y) < 10) {
                    console.log(carIsFrom);
                    console.log(carIsGoingTo);
                    let roadsToMove = theseRoadPhasesCanTurn(intersections[i]);
                    console.log(roadsToMove);
                    let hasRightToTurn = false;
                    // loop roads to move
                    for (let k = 0; k < roadsToMove.length; k++) {
                        console.log(roadsHere);
                        if (carIsFrom == roadsHere[roadsToMove[k][0]].start && carIsGoingTo == roadsHere[roadsToMove[k][1]].start) {
                            hasRightToTurn = true;
                            console.log('has right to turn');
                        }
                    }
                    if (hasRightToTurn && roomOnRoad(intersections[i].roads[randomRoad])) {
                        moveCarOneIntersectionToAnother(carsInIntersection[j], intersections[i],randomRoad);
                        carsInIntersection[j].needsNewTarget = true;
                        carsInIntersection.splice(j, 1);
                        console.log("Car has turned");
                        break;
                    }
                }
                
            }
            intersections[i].phaseCount++;
            if (intersections[i].phaseCount > intersections[i].phaseLength[intersections[i].trafficLightPhases%5]) {
                intersections[i].phaseCount = 0;
                intersections[i].trafficLightPhases++;
            }
            console.log(intersections[i].trafficLightPhases);
            
        }
    }
}

function theseRoadPhasesCanTurn(inter){
    var phases = inter.trafficLightPhases;
    let ret = [];
    if (inter.roads.length == 3) {
        // take the mod 2 of phases
        phases = phases%2;

        if (phases == 0){
            ret = [[1,0],[0,1],[0,2]];
        }else{
            ret = [[1,2],[1,0],[2,1]];
        }
    }else{
        // take the mod 5 of phases
        phases = phases%5;

        if (phases == 0){
            ret = [[0,2],[2,1],[2,0],[0,3]];
        }
        if(phases == 1){
            ret = [[0,1],[1,0],[2,3],[3,2]];
        }
        if(phases == 2){
            ret = [[3,1],[3,2],[1,3],[1,0]];
        }
        if(phases == 3){
            ret = [[3,0],[2,1],[1,2],[0,3]];
        }
        if(phases == 4){
            ret = [[0,1],[3,2],[2,3],[1,0]];
        }
    }
    return ret;
}

    
// create a function to move cars around the roundabouts
function roundAboutUpdate() {
    // loop through all the intersections
    for (let i = 0; i < intersections.length; i++) {
        // check if it is a roundabout
        if (intersections[i].type == "Roundabout") {
            // create an array of cars in the intersection
            var carsInIntersection = [];
            // loop though all cars
            for (let j = 0; j < cars.length; j++) {
                // if the car has the intersection as target
                if (cars[j].target == intersections[i]) {
                    // if the car is in the intersection
                    if (distPoints(cars[j].x, cars[j].y, intersections[i].location.x, intersections[i].location.y) < 5) {
                        // push the car to the cars in intersection array
                        carsInIntersection.push(cars[j]);
                    }
                }
            }
            let hasNotMoved = true;
            // sort the cars in the intersection by the distance to the intersection
            carsInIntersection.sort(function(a, b){return distPoints(a.x, a.y, intersections[i].location.x, intersections[i].location.y) - distPoints(b.x, b.y, intersections[i].location.x, intersections[i].location.y)});
            // loop the cars in the intersection
            for (let j = 0; j < carsInIntersection.length; j++) {
                // if j is less than the connected roads length
                var throughPut = intersections[i].roads.length;
                //throughPut = 2;
                if (j < throughPut) {
                    var randomRoad = getRandomIntersection(intersections[i],carsInIntersection[j]);
                    if(carsInIntersection[j].needsNewTarget){
                        carsInIntersection[j].nextTarget = randomRoad;
                        carsInIntersection[j].needsNewTarget = false;
                    }else{
                        randomRoad = carsInIntersection[j].nextTarget;
                    }
                    //console.log(carsInIntersection[j].nextTarget);

                    // if(carsInIntersection[j].nextTarget == null){
                    //     carsInIntersection[j].nextTarget = randomRoad;
                    //     console.log("next target set");
                    // }else{
                    //     randomRoad = carsInIntersection[j].nextTarget;
                    // }
                    // create a random int between 0 and the number of roads in the intersection
                    // set this as a random intersection    
                    // var randomIntersection = intersections[i].roads[randomRoad].end;

                    var doMove = roomOnRoad(intersections[i].roads[randomRoad]);
                    // loop the cars in the traffic between the intersections
                    // if ()
                    var giveWayValue = shouldGiveWayToRight(carsInIntersection,carsInIntersection[j]);
                    console.log(giveWayValue);
                    if (doMove && !shouldGiveWayToRight(carsInIntersection,carsInIntersection[j])) {
                        // // find the car in the lanes array
                        // for (let k = 0; k < lanes.length; k++) {
                        //     // if the car is in the lanes traffic   
                        //     if (lanes[k].traffic.includes(carsInIntersection[j])) {
                        //         // remove the car from the lanes traffic
                        //         lanes[k].traffic.splice(lanes[k].traffic.indexOf(carsInIntersection[j]), 1);
                        //     }
                        // }
                        // // set the cars target to the random intersection
                        // carsInIntersection[j].target = randomIntersection;
                        // // set the cars x and y to the intersection x and y
                        // carsInIntersection[j].x = intersections[i].location.x;
                        // carsInIntersection[j].y = intersections[i].location.y;
                        // // add the car to the roads traffic
                        // intersections[i].roads[randomRoad].traffic.push(carsInIntersection[j]);
                        // // set the cars id to the roads id
                        // carsInIntersection[j].id = intersections[i].roads[randomRoad].id;
                        // // set the car speed to 1
                        // carsInIntersection[j].speed = 1;
                        moveCarOneIntersectionToAnother(carsInIntersection[j], intersections[i],randomRoad);
                        carsInIntersection[j].needsNewTarget = true;
                        hasNotMoved = false;
                        // remove the car from the cars in intersection
                        carsInIntersection.splice(j, 1);
                    }else{
                        // set the speed to 0
                        carsInIntersection[j].speed = 0;
                    }
                }else{
                    // set the cars speed to 0
                    carsInIntersection[j].speed = 0;
                }
            }
        }
    }
}
// create a function to find the lane between two intersections
function findLane(intersection1, intersection2) {
    // loop through all the lanes
    for (let i = 0; i < lanes.length; i++) {
        // if the lane has the intersection1 as start and intersection2 as end
        if (lanes[i].start == intersection1 && lanes[i].end == intersection2) {
            // return the lane
            return lanes[i];
        }
        // if the lane has the intersection2 as start and intersection1 as end
        if (lanes[i].start == intersection2 && lanes[i].end == intersection1) {
            // return the lane
            return lanes[i];
        }
    }
}
// function to give way for cars

// create a function to update give way intersections
function updateGiveWayIntersections() {
    // loop through all the intersections
    for (let i = 0; i < intersections.length; i++) {
        // if the intersection is a give way intersection
        if (intersections[i].type == "Giveway") {
            let carsInIntersection = [];
            // loop through all the cars
            for (let j = 0; j < cars.length; j++) {
                // if the car has the intersection as target
                if (cars[j].target == intersections[i]) {
                    // if the car is in the intersection
                    if (distPoints(cars[j].x, cars[j].y, intersections[i].location.x, intersections[i].location.y) < 15) {
                        // push the car to the cars in intersection array
                        carsInIntersection.push(cars[j]);
                    }
                }
            }
            let newTargetsIndex = [];
            // loop through all the cars in the intersection
            for (let j = 0; j < carsInIntersection.length; j++) {
                var randomRoad = getRandomIntersection(intersections[i],carsInIntersection[j]);
                
                // set this as a random intersection    
                var randomIntersection = intersections[i].roads[randomRoad].end;
                newTargetsIndex.push(randomIntersection);
            }
            // sort the cars in the intersection by the distance to the intersection
            carsInIntersection.sort(function(a, b){return distPoints(a.x, a.y, intersections[i].location.x, intersections[i].location.y) - distPoints(b.x, b.y, intersections[i].location.x, intersections[i].location.y)});

            if (carsInIntersection.length > 0) {
                let orderedCars = [];
                let trafficFlowAtIntersection = [];
                let indexOfFirstMove = 0;
                // loop cars in intersection
                for (let j = 0; j < carsInIntersection.length; j++) {
                    let val = giveWayForRoundabouts(carsInIntersection[j]);
                    if(intersections[i].roads.length == 4){
                        val = findGivewayFour(carsInIntersection[j], newTargetsIndex[j]);
                    }
                    orderedCars.push(val);
                    // loop all lanes
                    for (let k = 0; k < lanes.length; k++) {
                        if (lanes[k].traffic.includes(carsInIntersection[j])) {
                            // remove the car from the lanes traffic
                            trafficFlowAtIntersection.push(lanes[k].end);
                        }
                    }  
                }
                let canMove = true;
                // loop traffic flow at intersection
                for (let j = 0; j < trafficFlowAtIntersection.length; j++) {
                    // loop ordered cars
                    for (let k = 0; k < orderedCars.length; k++) {
                        // if orderCars[k] is not []
                        if (orderedCars[k] != [] && orderedCars[k] != undefined) {
                            console.log(orderedCars[k]);
                            // loop ordered cars[k]
                            for (let l = 0; l < orderedCars[k].length; l++) {
                                // if the intersection is in the traffic flow at intersection
                                if (trafficFlowAtIntersection[j] == orderedCars[k][l]) {
                                    // set canMove to false
                                    canMove = false;
                                    // set the cars speed to 0
                                    carsInIntersection[k].speed = 0.5;
                                }
                            }
                        }
                    }
                    if(canMove ){
                        indexOfFirstMove = j;
                        // set cars speed to 1
                        carsInIntersection[j].speed = 1;
                        break;
                    }
                }
                var randomRoad = getRandomIntersection(intersections[i],carsInIntersection[indexOfFirstMove]);
                if(roomOnRoad(intersections[i].roads[randomRoad])){
                    // if the car is within 5 pixels of the target
                    moveCarOneIntersectionToAnother(carsInIntersection[indexOfFirstMove], intersections[i],randomRoad);
                    // log the priorityDiagram of the intersection
                    console.log(intersections[i].priorityDiagram);

                }
            }
        }    
    }
}

function giveWayForRoundAbouts(){
    // loop through all the intersections
    for (let i = 0; i < intersections.length; i++) {
        // if the intersection is a roundabout
        if (intersections[i].type == "Roundabout") {
            let carsInIntersection = [];
            // loop through all the cars
            for (let j = 0; j < cars.length; j++) {
                // if the car has the intersection as target
                if (cars[j].target == intersections[i]) {
                    // if the car is in the intersection
                    if (distPoints(cars[j].x, cars[j].y, intersections[i].location.x, intersections[i].location.y) < 15) {
                        // push the car to the cars in intersection array
                        carsInIntersection.push(cars[j]);
                    }
                }
            }
            // sort the cars by the distance to the target
            carsInIntersection.sort(function(a, b){return distPoints(a.x, a.y, intersections[i].location.x, intersections[i].location.y) - distPoints(b.x, b.y, intersections[i].location.x, intersections[i].location.y)});
            let vectorsToTarget = [];
            // loop through all the cars in the intersection
            for (let j = 0; j < carsInIntersection.length; j++) {
                // create vector from car to target
                let vectorToTarget = createVector(carsInIntersection[j].x - intersections[i].location.x, carsInIntersection[j].y - intersections[i].location.y);
                // normalize the vector
                vectorToTarget.normalize();
                //
                vectorsToTarget.push(vectorToTarget);
            }
            let hasMoved = false;
            // loop through all the cars in the intersection
            for (let j = 0; j < carsInIntersection.length; j++) {
                let giveWay = false;
                // loop all other cars in the intersection
                for (let k = 0; k < carsInIntersection.length; k++) {
                    // if there is a car to the righthand side within 10 pixels
                    if (distPoints(carsInIntersection[j].x+5*vectorsToTarget[j].y, carsInIntersection[j].y-5*vectorsToTarget[j].x, carsInIntersection[k].x, carsInIntersection[k].y) < 10) {
                        // draw the vector from the car
                        stroke(255,0,0);
                        line(carsInIntersection[j].x, carsInIntersection[j].y, carsInIntersection[j].x+20*vectorsToTarget[j].y, carsInIntersection[j].y-20*vectorsToTarget[j].x);
                        console.log("giveway - car to right");
                        // set the cars speed to 0
                        giveWay = true;
                    }
                }
                // if giveway is false
                if (!giveWay) {
                    // if there is room on the road to the cars next target
                    if (roomOnRoad(carsInIntersection[j].nextIntersection)) {
                        // move the car
                        moveCarOneIntersectionToAnother2(carsInIntersection[j], carsInIntersection[j].nextIntersection);
                        // set hasMoved to true
                        hasMoved = true;
                    }
                }
            }
            // if hasMoved is false
            if (!hasMoved && carsInIntersection.length > 0) {
                moveCarOneIntersectionToAnother2(carsInIntersection[0],  carsInIntersection[0].nextIntersection);
            }
        }
    }
}
// create a function called room on road
function roomOnRoad(road) {
    // check if the space from the start of the road to the last car is less than the car size 
    if (road.traffic.length > 0 ){
        if (distPoints(road.start.location.x, road.start.location.y, road.traffic[road.traffic.length-1].x, road.traffic[road.traffic.length-1].y) < 10) {
            return false
        }else{
            return true
        }
    }else{
        return true
    }
}

function shouldGiveWayToRight(cars,car){
    let vecForCar = createVector(car.x - car.target.location.x, car.y - car.target.location.y);
    // find the heading of the vector
    let header = vecForCar.heading();
    // loop all cars
    let ret = false;
    for (let i = 0; i < cars.length; i++) {
        // if the cars are different
        if (cars[i] != car) {
            // create a vector from the car to the target
            let vecToCar = createVector(cars[i].x - car.target.location.x, cars[i].y - car.target.location.y);
            // find the heading of the vector
            let headingToCar = vecToCar.heading();
            console.log("Assessing difference in angle");
            console.log(mod(headingToCar - header, Math.PI * 2));
            // if the heading of the vector is less than the heading of the vector for the car
            if ((headingToCar - header) > Math.PI/2)  {
                // return true
                ret = true;
                console.log("giveway - car to right");
            }
        }
    }
    return ret;
}
function mod(a,n){
    return a - (n * Math.floor(a/n));
}

// function called typeInfo
function typeInfo() {
    let sortedByDistance = [];
    
    // // sort intersections by distance to mouse
    // sortedByDistance = intersections.sort(function(a, b){return distPoints(a.location.x, a.location.y, mouseX, mouseY) - distPoints(b.location.x, b.location.y, mouseX, mouseY)});
    // // reverse the sorted intersections
    // sortedByDistance.reverse();
    // // if any of the intersections are selected
    // loop all intersections   
    for (let i = 0; i < intersections.length; i++) {
        // if the mouse is over the intersection
        if (distPoints(intersections[i].location.x, intersections[i].location.y, mouseX, mouseY) < 15) {
            // change selected to the opposite
            mouseClicked = function() {
                intersections[i].isSelected = !intersections[i].isSelected;
            }
        }
        // if the intersection is selected
        if (intersections[i].isSelected) {
            // add it to sortedByDistance
            sortedByDistance.push(intersections[i]);
        }
    }

    // above each intersection draw a rectangle
    for (var i = 0; i < sortedByDistance.length; i++) {
        // draw a rectangle at the location of the intersection
        // set the width and height of the rectangle
        let rectWidth = 100;
        let rectHeight = 100;
        fill(255);
        rect(sortedByDistance[i].location.x-rectWidth/2, sortedByDistance[i].location.y-rectHeight-40, rectWidth, rectHeight);
        // inside the rectangle have three ellipses
        // one for each type of intersection
        for (var j = 0; j < types.length; j++) {
            let fillColour = color(0,0,0);
            if (sortedByDistance[i].type == types[j]){
                // set the fill colour to dark green
                fillColour = color(0,255,0);
            }else{
                // set the fill colour to black
                fillColour = color(0,0,0);
            }
            // set the size of the ellipse
            let ellipseSize = 10;
            // set the color of the ellipse
            fill(fillColour);
            // draw the ellipse
            ellipse(sortedByDistance[i].location.x-rectWidth/2+10, sortedByDistance[i].location.y-40-rectHeight/6-(j)*rectHeight/3, ellipseSize, ellipseSize);
            // write the type of intersection
            // text size smaller
            textSize(10);
            text(types[j], sortedByDistance[i].location.x-rectWidth/2+10+ellipseSize, sortedByDistance[i].location.y-40-rectHeight/6-(j)*rectHeight/3+ellipseSize/2);
        }
        if (sortedByDistance[i].type == "Giveway"){
            // draw another rectangle to the side of the first rectangle
            fill(255);
            rect(sortedByDistance[i].location.x+rectWidth/2, sortedByDistance[i].location.y-rectHeight-40, rectWidth, rectHeight);

            // find the number of roads at this intersection
            let numberOfRoads = sortedByDistance[i].roads.length;
            // draw a dot for each road
            let vectorsToIntersections = [];
            let selectedIntersections = [];
            ellipse(sortedByDistance[i].location.x+rectWidth/2+rectWidth/2,sortedByDistance[i].location.y-rectHeight-40+rectHeight/2,10,10)
            for (var j = 0; j < sortedByDistance[i].roads.length; j++) {
                // find the vector to the intersection from the roads end
                vectorsToIntersections.push(createVector(sortedByDistance[i].location.x-sortedByDistance[i].roads[j].end.location.x, sortedByDistance[i].location.y-sortedByDistance[i].roads[j].end.location.y));
                // make the vector a unit vector
                vectorsToIntersections[j].normalize();
                // log the vector
                //console.log(vectorsToIntersections[j]);
                // let xSigns = [0,40,80,40];
                // let ySigns = [0,40,0,-40];
                // set the size of the dot
                let dotSize = 10;
                // set the color of the dot
                if(sortedByDistance[i].roads[j].end.isSelected){
                    fill(0,255,0);
                }else{
                    fill(0,0,0);
                }
                // draw the dot on each side of the box
                let xChange = sortedByDistance[i].location.x+rectWidth/2+rectWidth/2-vectorsToIntersections[j].x*30;
                let yChange = sortedByDistance[i].location.y-rectHeight-40+rectHeight/2-vectorsToIntersections[j].y*30;

                
                // if the mouse is over a dot
                let current = sortedByDistance[i];
                if (distPoints(mouseX, mouseY, xChange, yChange) < dotSize) {  
                    let closest = sortedByDistance[i].roads[j].end;
                    
                    mouseClicked = function() {
                        // console log the location
                        console.log("Mouse clicked");
                        // if closest is selected
                        if (closest.isSelected) {
                            // set closest to not selected
                            closest.isSelected = false;
                            // set current diagram to []
                            current.priorityDiagram = [];
                            current.priorityList = [];
                            // set all intersections to not selected
                            for (var k = 0; k < intersections.length; k++) {
                                intersections[k].isSelected = false;
                            }
                        }else{
                            // set closest to selected
                            
                            if(current.priorityDiagram.length < 2){
                                closest.isSelected = true;
                                current.priorityDiagram.push(createVector(xChange, yChange)); 
                                current.priorityList.push(closest);
                                closest.isDominant = true;
                                console.log(current.priorityList.length);
                            }
                        }
                    }
                }
                // draw the vector inside the box
                ellipse(xChange, yChange, dotSize, dotSize); 
                // log the length of selectedIntersections
                for (var k = 0; k < current.priorityDiagram.length; k++) {
                    // draw a line from the dot to the priority diagram
                    line(current.priorityDiagram[k].x, current.priorityDiagram[k].y, sortedByDistance[i].location.x+rectWidth/2+rectWidth/2, sortedByDistance[i].location.y-rectHeight-40+rectHeight/2);
                }
            }
        }
        // if the type is traffic light
        if (sortedByDistance[i].type == "Traffic Lights"){
            // draw another rectangle to the side of the first rectangle
            fill(255);
            rect(sortedByDistance[i].location.x+rectWidth/2, sortedByDistance[i].location.y-rectHeight-40, rectWidth, rectHeight);
            // if the number of connections is 3
            if (sortedByDistance[i].roads.length == 3){
                console.log("3 roads");
                // draw two rectangles inside the first
                
                for (var j = 0; j < 2; j++) {
                    // write phase j + 1 above the rectange
                    textSize(10);
                    // create a string of the phase
                    let phase = "Phase " + (j+1);
                    fill(255);
                    rect(sortedByDistance[i].location.x+rectWidth/2+10, sortedByDistance[i].location.y-rectHeight-40+rectHeight/4+(rectHeight/2*(j)), rectWidth-20, 5);
                }

            }
            // if the number of connections is 4
            if (sortedByDistance[i].roads.length == 4){
                console.log("4 roads");
                // draw five rectangles inside the first
                for (var j = 0; j < 5; j++) {
                    fill(255);
                    var yVal = sortedByDistance[i].location.y-rectHeight-40+10+(rectHeight/6*(j));
                    rect(sortedByDistance[i].location.x+rectWidth/2+10, yVal, rectWidth-20, 5);
                }
            }
        }
            
    }
}
// create a class called slider
class Slider {
    constructor(x, y, width, value, label) {
        this.x = x;
        this.y = y;
        this.width = width;
        this.value = value;
        this.label = label;
    }
    // draw the slider
    draw() {
        // draw the slider
        fill(0,0,0);
        rect(this.x, this.y, this.width, 5);
        // draw the label
        fill(255);
        textSize(5);
        text(this.label, this.x, this.y+15);
        // draw an ellipse at the slider
        fill(0,0,255);
        ellipse(this.x+this.value*this.width, this.y+10, 10, 10);
    }
    // update the slider
    update() {
        // if the mouse is pressed
        mouseClicked = function() {
            // if the mouse is over the slider
            if (distPoints(mouseX, mouseY, this.x+this.value*this.width, this.y) < 5) {
                // set the slider to the mouse position
                this.value = (mouseX-this.x)/this.width;
            }
        }
    }
}


// create a function that takes an intersection and returns a random road connected to it
function getRandomIntersection(intersection,car) {
    // create a random int between 0 and the number of roads in the intersection
    var randomRoad = Math.floor(Math.random()*intersection.roads.length);
    if(intersection.roads.length > 1){
        let newId = intersection.roads[randomRoad].end.id + "-" + intersection.roads[randomRoad].start.id;
        console.log(newId);
        while(newId == car.id){
            randomRoad = Math.floor(Math.random()*intersection.roads.length);
            console.log("stuck in while loop");
            newId = intersection.roads[randomRoad].end.id + "-" + intersection.roads[randomRoad].start.id;
        }
    }
    return randomRoad;
}
function getNewRandomIntersection(intersection,car) {
    // create a random int between 0 and the number of roads in the intersection
    var randomRoad = Math.floor(Math.random()*intersection.roads.length);
    if(intersection.roads.length > 1){
        let newId = intersection.roads[randomRoad].end.id + "-" + intersection.roads[randomRoad].start.id;
        let oldId = car.target.id+"-"+car.nextIntersection.id;
        console.log(newId);
        while(newId == oldId){
            randomRoad = Math.floor(Math.random()*intersection.roads.length);
            console.log("stuck in while loop");
            newId = intersection.roads[randomRoad].end.id + "-" + intersection.roads[randomRoad].start.id;
        }
    }
    return randomRoad;
}
function getRandomNextConnection(intersection,last){
    var next = intersection.roads[Math.floor(Math.random()*intersection.roads.length)].end;
    if(intersection.roads.length > 1){
        while (next == last){
            next = intersection.roads[Math.floor(Math.random()*intersection.roads.length)].end;
        }
    }
    return next;
}
// define a function that moves a car from one lane to another
function moveCarOneIntersectionToAnother(car, intersection, randomRoad) {
    var randomIntersection = intersection.roads[randomRoad].end;
    // find the car in the lanes array
    for (let k = 0; k < lanes.length; k++) {
        // if the car is in the lanes traffic   
        if (lanes[k].traffic.includes(car)) {
            // remove the car from the lanes traffic
            lanes[k].traffic.splice(lanes[k].traffic.indexOf(car), 1);
        }
    }
    // set the cars target to the random intersection
    car.lastIntersection = intersection;
    car.target = randomIntersection;
    // set the cars x and y to the intersection x and y
    car.x = intersection.location.x;
    car.y = intersection.location.y;
    // add the car to the roads traffic
    intersection.roads[randomRoad].traffic.push(car);
    // set the cars id to the roads id
    car.id = intersection.roads[randomRoad].id;
    // set the car speed to 1
    car.speed = 1;
}

// define a function that moves a car from one lane to another
function moveCarOneIntersectionToAnother2(car, intersection) {
    // find random road
    var randomRoad = getNewRandomIntersection(car.target,car);
    var randomIntersection = car.target.roads[randomRoad].end;
    // find the car in the lanes array
    for (let k = 0; k < lanes.length; k++) {
        // if the car is in the lanes traffic   
        if (lanes[k].traffic.includes(car)) {
            // remove the car from the lanes traffic
            lanes[k].traffic.splice(lanes[k].traffic.indexOf(car), 1);
        }
    }
    // set the cars target to the random intersection
    car.target = car.nextIntersection;
    car.nextIntersection = randomIntersection;
    car.lastIntersection = intersection;
    // set the cars x and y to the intersection x and y
    car.x = intersection.location.x;
    car.y = intersection.location.y;
    // add the car to the roads traffic
    intersection.roads[randomRoad].traffic.push(car);
    // set the cars id to the roads id
    car.id = intersection.roads[randomRoad].id;
    // set the car speed to 1
    car.speed = 1;
}
// create a function to return the order of movement at a giveway
function getOrderOfMovement(intersection) {
    let orderOfMovement = [];
    // for each road in the intersection
    let otherIntersections = [];
    if(priorityList.length > 1){
        let intersectionA = intersection.priorityList[0];
        let intersectionB = intersection.priorityList[1];
    }
    for (let i = 0; i < intersection.roads.length; i++) {
        // if the road is not intersectionA or intersectionB
        if(intersection.roads[i].end.id != intersectionA.id && intersection.roads[i].end.id != intersectionB.id){
            otherIntersections.push(intersection.roads[i].end);
        }
    }
    // for (let i = 0; i < 2*intersection.roads.length; i++){

    // }
}
// create a function for a car to find the lanes it must giveway to
function findGivewayThree(car,goal) {
    if (car.target.priorityList.length > 1) {
        let A = car.target.priorityList[0];
        let B = car.target.priorityList[1];
        let C = [];
        // loop the cars targets roads
        let carRoot = car.target;
        for (let i = 0; i < car.target.roads.length; i++) {
            // if the road is not A or B
            if(car.target.roads[i].end.id != A.id && car.target.roads[i].end.id != B.id){
                C.push(car.target.roads[i].end);
            }
            // if the roads end and the target is the same as the cars id
            if(car.target.roads[i].end.id+'-'+car.target.id == car.id){
                // set the cars root to the roads end
                carRoot = car.target.roads[i].end;
                console.log(carRoot.location.x+" "+carRoot.location.y);
            }
        }
        // if the cars root and goal are in the priority list
        
        if(carRoot.id == A.id ){
            // a-b traffic
            if(goal.id == B.id){
                // set the cars root to the cars target
                return [];
            }
            // a-c traffic
            if(goal.id == C[0].id){
                return [B];
            } 
        }
        if(carRoot.id == B.id){
            // b-a traffic
            if(goal.id == A.id){
                return [];
            }
            // b-c traffic
            if(goal.id == C[0].id){
                return [];
            }
        }
        if(carRoot.id == C[0].id){
            // c-a traffic
            if(goal.id == A.id){
                return [B];
            }
            if(goal.id == B.id){
                return [A,B];
            }
        }
    }
}
// giveway four way
function findGivewayFour(car,goal) {
    if (car.target.priorityList.length > 1) {
        let A = car.target.priorityList[0];
        let B = car.target.priorityList[1];
        let C = [];
        // loop the cars targets roads
        let carRoot = car.target;
        for (let i = 0; i < car.target.roads.length; i++) {
            // if the road is not A or B
            if(car.target.roads[i].end.id != A.id && car.target.roads[i].end.id != B.id){
                C.push(car.target.roads[i].end);
            }
            // if the roads end and the target is the same as the cars id
            if(car.target.roads[i].end.id+'-'+car.target.id == car.id){
                // set the cars root to the roads end
                carRoot = car.target.roads[i].end;
            }
        }
        // if the cars root and goal are in the priority list
        
        if(carRoot.id == A.id ){
            // a-b traffic
            if(goal.id == B.id){
                // set the cars root to the cars target
                return [];
            }
            // a-d traffic
            if(goal.id == C[1].id){
                return [];
            }
            // a-c traffic
            if(goal.id == C[0].id){
                return [B];
            } 
        }
        if(carRoot.id == B.id){
            // b-a traffic
            if(goal.id == A.id){
                return [];
            }
            // b-c traffic
            if(goal.id == C[0].id){
                return [];
            }
            // b-d traffic
            if(goal.id == C[1].id){
                return [A];
            }
        }
        if(carRoot.id == C[0].id){
            // c-a traffic
            if(goal.id == A.id){
                return [B];
            }
            if(goal.id == B.id){
                return [A,B,C[1]];
            }
            // c-d traffic
            if(goal.id == C[1].id){
                return [A,B];
            }
        }
        if(carRoot.id == C[1].id){
            // d-a traffic
            if(goal.id == A.id){
                return [A,B,C[0]];
            }
            if(goal.id == B.id){
                return [A];
            }
            // d-c traffic
            if(goal.id == C[0].id){
                return [A,B];
            }
        }
    }
}

function giveWayForRoundabouts(car) {
    // loop connected roads 
    let onRB = true;
    for (let i = 0; i < car.target.roads.length; i++) {
        // if the car is in the roads traffic
        if(car.target.roads[i].end.id+'-'+car.target.id == car.id){
            // if the car is in the roads traffic
            onRB = false;
        }
    }
    if(onRB){
        return true;
    }
    else{
        return false;
    }
}

//create a function that takes an intersections and returns the roads sorted by angle
function sortByAngle(intersection) {
    let roads = intersection.roads;
    let sortedRoads = [];
    let rdVectors = []; 
    for (let i = 0; i < roads.length; i++) {
        // append the vector from the intersection to the roads end
        
        sortedRoads.push(roads[i]);
    }
    sortedRoads.sort(function(a, b) {
        return a.angle - b.angle;
    });
    return sortedRoads;
} 
// create a function to record the average speed of all cars
function averageSpeed() {
    let totalSpeed = 0;
    for (let i = 0; i < cars.length; i++) {
        totalSpeed += cars[i].speed;
    }
    return totalSpeed/cars.length;
}
function flindersUniversityGrid(style){
    let gridSize = 100;
    // clear intersections  
    intersections = [];
    cars = [];
    lanes = [];
    if(style == 0){
         // loop over the width of the window in steps of gridSize
        for (let x = gridSize; x < windowWidth-gridSize; x += gridSize) {
            // loop over the height of the window in steps of gridSize
            for (let y = gridSize+70; y < windowHeight-gridSize; y += gridSize) {
                //place an intersection at the current x and y
                let intersection = new Intersection(createVector(x, y),'Roundabout',[],intersections.length,false,[],[]);
                // add the intersection to the intersections array
                intersections.push(intersection);
            }
        }
        // for each intersection
        for (let i = 0; i < intersections.length; i++) {
            // for each intersection
            for (let j = 0; j < intersections.length; j++) {
                // if the distance between the intersections is the same as the gridSize
                if(dist(intersections[i].location.x,intersections[i].location.y,intersections[j].location.x,intersections[j].location.y) == gridSize){
                    // create a lane between the two intersections
                    let selectedIntersection = [intersections[i],intersections[j]];
                    lanes.push(new Lane(selectedIntersection[0],selectedIntersection[1],1,selectedIntersection[0].id+'-'+selectedIntersection[1].id,[]));
                    lanes.push(new Lane(selectedIntersection[1],selectedIntersection[0],1,selectedIntersection[1].id+'-'+selectedIntersection[0].id,[]));
                    // add the lanes to each intersection
                    selectedIntersection[1].roads.push(lanes[lanes.length-1]);
                    selectedIntersection[0].roads.push(lanes[lanes.length-2]);
                }
            }
        }
    }
    if(style == 1){
        // place 9 intersections in a 3x3 grid
        for (let i = 0; i < 3; i++) {
            for (let j = 0; j < 3; j++) {
                let x = i*(windowWidth-200)/2+100;
                let y = j*(windowHeight-450)/2+225;
                let intersection = new Intersection(createVector(x, y),'Roundabout',[],intersections.length,false,[],[]);
                intersections.push(intersection);
            }
        }
    }
    if(style==2){
        // place a cross of intersections
        for (let i = 0; i < 3; i++) {
            for (let j = 0; j < 3; j++) {
                let x = i*(windowWidth-200)/2+100;
                let y = j*(windowHeight-450)/2+225;
                if(i == 1 && j == 0 || i == 1 && j == 2 || j == 1){
                    let intersection = new Intersection(createVector(x, y),'Roundabout',[],intersections.length,false,[],[]);
                    intersections.push(intersection);
                }
            }
        }
    }
    if(style==3){
        // place a cross of intersections
        for (let i = 0; i < 3; i++) {
            for (let j = 0; j < 3; j++) {
                //let x = i*(windowWidth-200)/2+100;
                let y = windowHeight/2+(i-1)*150;
                let x = windowWidth/2+(i-1)*150;
                if(i == 1 && j == 0 || i == 1 && j == 2 || j == 1){
                    let intersection = new Intersection(createVector(x, y),'Roundabout',[],intersections.length,false,[],[]);
                    intersections.push(intersection);
                }
            }
        }
    }
}
