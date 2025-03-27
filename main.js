const canvas = document.getElementById("mycanvas");
const context = canvas.getContext("2d");

const width = canvas.width;
const height = canvas.height;

let score = 0;

let circlePoints = [];
let createdCircles = [];

let bulletPoints = [];

let points = [
  [0.5 * width - 10, 0.95 * height],
  [0.5 * width + 10, 0.95 * height],
  [0.5 * width, 0.95 * height - 10],
];

context.fillStyle = "pink";

const createTriangle = () => {
  context.clearRect(0, height * 0.85, width, height);
  context.beginPath();
  context.moveTo(points[0][0], points[0][1]);
  context.lineTo(points[1][0], points[1][1]);
  context.lineTo(points[2][0], points[2][1]);
  context.fill();
};

window.addEventListener("keydown", (event) => {
  if (event.key == "ArrowLeft") {
    moveTriangle(-1);
  }
  if (event.key == "ArrowRight") {
    moveTriangle(1);
  }
});

const moveTriangle = (dir) => {
  let move = dir * 5;
  let tempPoints = points.map(innerArray => [...innerArray]);
  
  for (let temp of tempPoints) {
      temp[0] += move;
    }

    if (tempPoints[0][0] >= 0 && tempPoints[1][0] <= canvas.width) {

      console.log(tempPoints[0][0]);
      console.log(tempPoints[1][0]);
      console.log(points);
      console.log(tempPoints);
      points = tempPoints;

    }

  createTriangle();

};

// createTriangle();

const fillCirclePoints = () => {
  for (let i = 0; i < 100; i++) {
    let x = Math.floor((Math.random() * 1000) % canvas.width);
    let y = 15;
    circlePoints.push([x, y]);
  }
};

fillCirclePoints();
// console.log(circlePoints);

const createCircle = (x, y, r = 5) => {
  // console.log("s");
  context.beginPath();
  context.arc(x, y, r, 0, Math.PI * 2);
  context.fill();
};

const createRandomCircles = () => {
  let n = Math.floor(Math.random() * 100);
  // console.log(n);
  createCircle(circlePoints[n][0], circlePoints[n][1]);
  createdCircles.push(circlePoints[n]);
  // console.log(createdCircles);
};

// createRandomCircles();

setInterval(() => {
  let x = points[2][0];
  let y = points[2][1];
  bulletPoints.push([x, y]);
  createCircle(x, y, 2);
}, 1000);

const checkCollision = (bulletPoint) => {
  let x = bulletPoint[0];
  let y = bulletPoint[1];
  // console.log("Bullet:",[x,y]);

  for (let i = 0; i < createdCircles.length; i++) {
    let bx = createdCircles[i][0];
    let by = createdCircles[i][1];

    let distance = Math.sqrt(Math.pow(x - bx, 2) + Math.pow(y - by, 2));

    if (distance <= 10) {
      // console.log(true);
      // console.log(createdCircles.length);
      // createdCircles.filter((circle) => {
      //   console.log(createdCircle);
      //   return circle[0] != createdCircle[0];
      // });
      // console.log(createdCircles.length);
      createdCircles.splice(i, 1);
      return true;
    }
  }
  return false;
};

const moveCircles = () => {
  let modifiedCreatedCircle = [];
  context.clearRect(0, 0, width, height * 0.85);
  while (createdCircles.length > 0) {
    let circle = createdCircles.shift();
    circle[1] += 10;
    if (circle[1] < canvas.height * 0.95) {
      context.fillStyle = "red";
      createCircle(circle[0], circle[1]);
      modifiedCreatedCircle.push(circle);
    } else {
      createTriangle();
    }
  }

  createdCircles = modifiedCreatedCircle;

  let tempBullet = [];
  for (let bulletPoint of bulletPoints) {
    bulletPoint[1] -= 10;
    if (bulletPoint[1] >= 0) {
      if (checkCollision(bulletPoint)) {
        score++;
        document.getElementById("score").innerHTML = score;
      } else {
        createCircle(bulletPoint[0], bulletPoint[1]);
        tempBullet.push(bulletPoint);
      }
      context.fillStyle = "green";
    }
  }
  bulletPoints = tempBullet;
};

setInterval(createRandomCircles, 3000);
setInterval(moveCircles, 1000);
