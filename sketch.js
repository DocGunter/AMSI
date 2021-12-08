function setup() {
    // create a canvas the size of the window
    createCanvas(windowWidth, windowHeight);
}
// create new empty arrays
// for intersections
var intersections = [];
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
    mouseClicked = function() {
        // if the n key is pressed
        // if (keyCode == 78) {
        if (editingMode == 'New Intersection Mode'){
            // create a new intersection at the mouse location
            console.log("New Intersection added with ID: "+intersections.length);
            intersections.push(new Intersection(createVector(mouseX, mouseY),'roundabout',[],intersections.length,false));
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
            // // if two intersections are selected
            // if (selectedIntersection.length == 2) {
            //     // if the two intersections are not connected
            //     if (!isConnected(selectedIntersection[0], selectedIntersection[1])) {
            //         // create a new road between the two intersections
            //         console.log("New Road added between Intersections "+selectedIntersection[0].id+" and "+selectedIntersection[1].id);
            //         console.log("Road ID: "+selectedIntersection[0].id+'-'+selectedIntersection[1].id);
            //         roads.push(new Road(selectedIntersection[0],selectedIntersection[1],1,selectedIntersection[0].id+'-'+selectedIntersection[1].id,[]));
            //         // add the road to each intersection
            //         selectedIntersection[0].roads.push(roads[roads.length-1]);
            //         selectedIntersection[1].roads.push(roads[roads.length-1]);
            //         // loop the selectedIntersection array
            //         for (var i = 0; i < selectedIntersection.length; i++) {
            //             // deselect the intersection
            //             selectedIntersection[i].isSelected = false;
            //         }
            //         // log the number of connected roads at each intersection
            //         for (var i = 0; i < selectedIntersection.length; i++) {
            //             console.log("Number of connected roads at Intersection "+selectedIntersection[i].id+": "+selectedIntersection[i].roads.length);
            //         }
            //         // clear the selectedIntersection array
            //         selectedIntersection = [];
            //         // log the number of roads
            //         console.log("Number of roads: "+roads.length);
                    
            //     }else{
            //         // log the two intersections are already connected
            //         console.log("The two intersections are already connected");
            //         // loop the selectedIntersection array
            //         for (var i = 0; i < selectedIntersection.length; i++) {
            //             // deselect the intersection
            //             selectedIntersection[i].isSelected = false;
            //         }
            //         // clear the selectedIntersection array
            //         selectedIntersection = [];
            //     }
            // }
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
    }
    // draw all roads
    drawRoads();
    // draw all intersections
    drawIntersections();
    // roundabout update
    roundAboutUpdate();
    // update the traffic
    updateTraffic();
    
    // draw all cars
    drawCars();
    // draw info
    intersectionInfo();

}

// create an intersection class
class Intersection {
    // constructor
    constructor(location, type,roads,id,isSelected) {
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
        // draw a circle
        ellipse(this.location.x, this.location.y, 20, 20);
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

// create a car class
class Car {
    // constructor
    constructor(x,y,target,speed,id) {
        // set the location
        this.x = x;
        this.y = y;
        // set the target
        this.target = target;
        // set the speed
        this.speed = speed;
        // set the id
        this.id = id;
    }
    // draw function
    draw() {
        // find the orthogonal vector
        var orthogonalVector = new createVector(this.target.location.y - this.y, this.x - this.target.location.x);
        // normalize the vector
        orthogonalVector.normalize();
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
            sortedTraffic = lanes[i].traffic.sort(function(a,b) {
                return distPoints(a.x, a.y, a.target.location.x, a.target.location.y)-distPoints(b.x,b.y,b.target.location.x,b.target.location.y);
            });
            // loop through all the cars in the sorted array
            for (var j = 1; j < sortedTraffic.length; j++) {
                // set the speed to 1
                sortedTraffic[j].speed = 1;
                let speedMult = 1
                // if the distance from the car to the target is less than 20 set the speed to 0.5
                if (distPoints(sortedTraffic[j].x, sortedTraffic[j].y, sortedTraffic[j].target.location.x, sortedTraffic[j].target.location.y) < 40) {
                    // set the j speed to 0.5
                    speedMult = 0.5;
                }
                // if the distance from the car to the target is less than 10 set the speed to 0.25
                if (distPoints(sortedTraffic[j].x, sortedTraffic[j].y, sortedTraffic[j].target.location.x, sortedTraffic[j].target.location.y) < 30) {
                    // set the j speed to 0.25
                    speedMult = 0.25;
                }
                // if the distance from the car to the previous index car is less than 10 set the speed to 0
                if (distPoints(sortedTraffic[j].x, sortedTraffic[j].y, sortedTraffic[j-1].x, sortedTraffic[j-1].y) < 11) {
                    // set the j speed to 0
                    sortedTraffic[j].speed = 0;
                }else{
                    // set the j speed to 1
                    sortedTraffic[j].speed = 1;
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
            car = new Car(intersections[i].location.x,intersections[i].location.y,otherIntersection,1,intersections[i].roads[randomRoad].id);
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
    car = new Car(intersection.location.x,intersection.location.y,otherIntersection,1,intersection.roads[randomRoad].id);
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
    // at the bottom of the screen write
    // Press m and click to add a car
    text("Press m and click to add a car", 10, height - 20);
    // above this write
    // Press c and click on intersections to connect lanes
    text("Press c and click on intersections to connect lanes", 10, height - 40);
    // above this write
    // Press n and click to add an intersection
    text("Press n and click to add an intersection", 10, height - 60);
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
            //above each intersection
            let rangeOfRed = 60/(carsInIntersection);
            fill(255, 0, 0);
            rect(intersections[i].location.x-30, intersections[i].location.y - 50, rangeOfRed*carInQueue, 10);
            fill(0,255,0);
            rect(intersections[i].location.x-30+rangeOfRed*carInQueue , intersections[i].location.y - 50, rangeOfRed*(carsInIntersection-carInQueue), 10);
        }else{
            // is over is true
            isOverIntersection = true;
            // set the index of mouse to the index of the intersection
            indexOfMouse = i;
            // set the values to display to the intersection id and the number of cars in intersection
            valuesToDisplay = [carInQueue, carsInIntersection];
            // // show a box in the top right with the type of intersection inside
            // fill(255);
            // rect(mouseX + 20, mouseY - 20, 200, 200);
            // fill(0);
            // text(intersections[i].type, mouseX + 30, mouseY );
            // // make the text smaller
            // textSize(10);
            // // list current number of connected lanes
            // text("Number of Connected Lanes: "+intersections[i].roads.length, mouseX + 30, mouseY + 20);
            // // list the number of cars in the intersection
            // text("Number of cars towards intersection: " + carsInIntersection, mouseX + 30, mouseY + 40);
            // text("Number of cars in queue: " + carInQueue, mouseX + 30, mouseY + 60);
            // // draw a red rectangle below the text of qued cars
            // fill(255, 0, 0);
            // let rangeOfRed = 180/(carsInIntersection);
            // rect(mouseX + 30, mouseY +70, rangeOfRed*carInQueue, 10);
            // fill(0,255,0);
            // rect(mouseX + 30+rangeOfRed*carInQueue , mouseY +70, rangeOfRed*(carsInIntersection-carInQueue), 10);
            // textSize(20);
            
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

// create a function to move cars around the roundabouts
function roundAboutUpdate() {
    // loop through all the intersections
    for (let i = 0; i < intersections.length; i++) {
        // check if it is a roundabout
        if (intersections[i].type == "roundabout") {
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
            // sort the cars in the intersection by the distance to the intersection
            carsInIntersection.sort(function(a, b){return distPoints(a.x, a.y, intersections[i].location.x, intersections[i].location.y) - distPoints(b.x, b.y, intersections[i].location.x, intersections[i].location.y)});
            // loop the cars in the intersection
            for (let j = 0; j < carsInIntersection.length; j++) {
                // if j is less than the connected roads length
                var throughPut = intersections[i].roads.length;
                throughPut = 2;
                if (j < throughPut) {
                    // create a random int between 0 and the number of roads in the intersection
                    var randomRoad = Math.floor(Math.random()*intersections[i].roads.length);
                    // set this as a random intersection    
                    var randomIntersection = intersections[i].roads[randomRoad].end;
                    var doMove = true;
                    // loop the cars in the traffic between the intersections
                    // if ()
                    if (doMove) {
                        // find the car in the lanes array
                        for (let k = 0; k < lanes.length; k++) {
                            // if the car is in the lanes traffic   
                            if (lanes[k].traffic.includes(carsInIntersection[j])) {
                                // remove the car from the lanes traffic
                                lanes[k].traffic.splice(lanes[k].traffic.indexOf(carsInIntersection[j]), 1);
                            }
                        }
                        // set the cars target to the random intersection
                        carsInIntersection[j].target = randomIntersection;
                        // set the cars x and y to the intersection x and y
                        carsInIntersection[j].x = intersections[i].location.x;
                        carsInIntersection[j].y = intersections[i].location.y;
                        // add the car to the roads traffic
                        intersections[i].roads[randomRoad].traffic.push(carsInIntersection[j]);
                        // set the cars id to the roads id
                        carsInIntersection[j].id = intersections[i].roads[randomRoad].id;
                        // set the car speed to 1
                        carsInIntersection[j].speed = 1;
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

            // //loop the first 4 cars in intersection
            // for (let j = 0; j < carsInIntersection.length; j++) {
            //     // loop through all the cars in the intersection
            //     for (let k = 0; k < carsInIntersection.length; k++) {
            //         // if k is less than the connected roads
            //         if (k <= intersections[i].roads.length) {
            //             // random index value
            //             var randomIndex = Math.floor(Math.random() * intersections[i].roads.length);
            //             // find a randome intersection connected to the current intersection
            //             var randomIntersection = intersections[i].roads[randomIndex].end;
            //             // set the cars target to the random intersection
            //             carsInIntersection[k].target = randomIntersection;
            //             // loop the lanes
            //             for (let l = 0; l < intersections[i].roads.length; l++) {
            //                 // loop the traffic
            //                 for (let m = 0; m < intersections[i].roads[l].traffic.length; m++) {
            //                     // if the car is the same as the current car
            //                     if (carsInIntersection[k] == intersections[i].roads[l].traffic[m]) {
            //                         // remove the car from the traffic
            //                         intersections[i].roads[l].traffic.splice(m, 1);
            //                     }
            //                 }
            //             }
            //             // loop the lane array
            //             for (let l = 0; l < lanes.length; l++) {
            //             // set the cars location to the intersection
            //             carsInIntersection[k].x = intersections[i].location.x;
            //             carsInIntersection[k].y = intersections[i].location.y;
            //             // append the car to the road between the two
            //             intersections[i].roads[randomIndex].traffic.push(carsInIntersection[k]);
            //             // set the cars speed to 1
            //             carsInIntersection[k].speed = 1;
            //             // remove the car from the intersection
            //             carsInIntersection.splice(k, 1);
            //         }else{
            //             // set the car speed to 0
            //             carsInIntersection[k].speed = 0;
            //         }

            //     }
            // }
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

