const carCanvas = document.getElementById("carCanvas");
carCanvas.width = 200;

const networkCanvas = document.getElementById("networkCanvas");
networkCanvas.width = 300;

const carCtx = carCanvas.getContext("2d");
const networkCtx = networkCanvas.getContext("2d");

const road = new Road(carCanvas.width/2, carCanvas.width*0.9);
const N = 400;
const cars = generateCars(N);
let bestCar = cars[0];

if (localStorage.getItem("bestBrain")){

    for (let i = 0; i < cars.length; i++){

        cars[i].brain = JSON.parse(localStorage.getItem("bestBrain"));

        if (i != 0){

            NeuralNetwork.mutate(cars[i].brain, 0.1);
        }
    }
}

let traffic = [];
// const number = 3;
traffic.push(new Car(bestCar.x, (-100), 30, 50, "DUMMY", 2));
traffic.push(new Car(road.getLaneCenter(0), (-320), 30, 50, "DUMMY", 2));
traffic.push(new Car(road.getLaneCenter(2), (-320), 30, 50, "DUMMY", 2));
traffic.push(new Car(bestCar.x, (-130-190-160), 30, 50, "DUMMY", 2));
traffic.push(new Car(road.getLaneCenter(0), (-320-190-320), 30, 50, "DUMMY", 2));
traffic.push(new Car(road.getLaneCenter(2), (-320-190-320), 30, 50, "DUMMY", 2));

// for (let i = 0; i < number; i++){

//     let rngNumber1 = getRndInterger(0, road.laneCount);
//     let rngNumber2 = getRndInterger(1,5);

//     traffic.push(new Car(road.getLaneCenter(rngNumber1), rngNumber2*(-150), 30, 50, "DUMMY", 2));

//     // traffic.push(new Car(bestCar.x, -150, 30, 50, "DUMMY", 2));

// }

animate();

function save(){

    localStorage.setItem("bestBrain", JSON.stringify(bestCar.brain));
}

function discard(){

    localStorage.removeItem("bestBrain");
}

function generateCars(N){

    const cars = [];
    // const lane = getRndInterger(0, road.laneCount);

    for (let i = 1; i <= N; i++){

        cars.push(new Car(road.getLaneCenter(1), 100, 30, 50, "AI"));
    }

    return cars;
}

function animate(time){
    
    for (let i = 0; i < traffic.length; i++){

        traffic[i].update(road.borders, []);
    }

    for (let i = 0; i < cars.length; i++){

        cars[i].update(road.borders, traffic);
    }

    bestCar = cars.find(c=>c.y==Math.min(...cars.map(c=>c.y)));

    carCanvas.height = window.innerHeight;
    networkCanvas.height = window.innerHeight;
    carCtx.save();
    carCtx.translate(0, -bestCar.y+carCanvas.height*0.7);
    road.draw(carCtx);
    for (let i = 0; i < traffic.length; i++){

        traffic[i].draw(carCtx, "red");
    }
    carCtx.globalAlpha = 0.2;
    for (let i = 0; i < cars.length; i++){

        cars[i].draw(carCtx, "blue");
    }
    carCtx.globalAlpha = 1;
    bestCar.draw(carCtx, "blue", true);
    carCtx.restore();

    networkCtx.lineDashOffset = -time/50;
    Visualizer.drawNetwork(networkCtx, bestCar.brain);
    requestAnimationFrame(animate);
}