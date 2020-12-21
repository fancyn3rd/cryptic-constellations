
import * as PIXI from "pixi.js";

const container = new PIXI.Container();

const app = new PIXI.Application(
  800,
  600, {
    antialias: true,
    backgroundColor : "black"
  }
);


app.stage.addChild(container);
document.body.appendChild(app.view);

let mouseTrack = 0

let stars = []
let isDone = false

const MAX_STARS = 12
const MIN_STARS = 5
const MIN_MOUSETRACK = 10
const MAX_MOUSETRACK = 40
const MIN_AXIS_DIFFERENCE = 50

let mousetrackToNextStar
let constellationStarCount
let oldMousePos = []

document.body.addEventListener("mousemove", (event) => onMouseMove(event))
document.body.addEventListener("click", (event) => resetCanvas(event))

setMouseTrackToNextStar()
setConstellationStarCount()

function storeMousePos(mouse) {
  oldMousePos = {x: mouse.x, y: mouse.y}
}

function setConstellationStarCount() {
  constellationStarCount = randomRange(MIN_STARS, MAX_STARS)
}

function resetCanvas(event) {
  stars = []
  container.removeChildren()
  isDone = false
  mouseTrack = 0
  storeMousePos(event)
}


function setMouseTrackToNextStar() {
  mousetrackToNextStar = randomRange(MIN_MOUSETRACK, MAX_MOUSETRACK)
}


function onMouseMove(mouseEvent) {
  mouseTrack += 1
  if (mouseTrack > mousetrackToNextStar) {

    if (isMousePosDifferent("x", mouseEvent, MIN_AXIS_DIFFERENCE) &&
      isMousePosDifferent("y", mouseEvent, MIN_AXIS_DIFFERENCE)) {
      oldMousePos.x = mouseEvent.x
      oldMousePos.y = mouseEvent.y

        if (stars.length === constellationStarCount) {
        connectStars()
        stars = []
        isDone = true
      }

      if (!isDone) {
        createStarPosition(mouseEvent)
        setMouseTrackToNextStar()
        mouseTrack = 0
      }
    }
  }
}

function isMousePosDifferent(axis, currentMouse, minDifference) {
  return currentMouse[axis] > oldMousePos[axis] + minDifference ||
    currentMouse[axis] < oldMousePos[axis] - minDifference
}


//*******************************************************************************************



function createStarPosition(mouseEvent) {
  console.log("draw star")
  drawStar(mouseEvent)
}

const styles = {
  star: {
    line: {
      weight: 1,
      color:  PIXI.utils.string2hex("#ffffff")
    },
    color:  PIXI.utils.string2hex("#ffffff"),
    size: 5
  },
  line: {
    weight: 2,
    color:  PIXI.utils.string2hex("#ffffff")
  }
}

function drawStar(mouseEvent) {
  const star = new PIXI.Graphics();
  star.lineStyle(styles.star.line.weight, styles.star.line.color, 1);
  star.beginFill(styles.star.color, 1);
  star.drawCircle(0, 0, randomRange(2, 5))
  star.position.set(mouseEvent.x, mouseEvent.y)
  star.endFill();
  container.addChild(star);
  stars.push(star)
}

async function connectStars() {
  for (var i = 0; i < MAX_STARS; i++) {
    drawLine(stars[i], stars[i + 1])
  }
  drawLine(stars[randomRange(0, stars.length - 1)], stars[randomRange(0, stars.length - 1)])
}

function drawLine(pointA, pointB) {
  if (pointA && pointB) {
    const line = new PIXI.Graphics()
    line.lineStyle(styles.line.weight, styles.line.color, 1);
    line.moveTo(pointA.x, pointA.y);
    line.lineTo(pointB.x, pointB.y)
    container.addChild(line);
  }
}

function randomRange(min, max) {
  return Math.ceil(Math.random() * (max - min) + min)
}


