
import * as PIXI from "pixi.js";

const starContainer = new PIXI.Container()
const lineContainer = new PIXI.Container()

const app = new PIXI.Application(
  800,
  600, {
    antialias: true,
    backgroundColor : "black"
  }
);

const colors = [
  "0xffffff",
  "0x71fff1",
  "0xb6fffd",
  "0x8ad3ff",
  "0xff7d00",
  "0xffd23f",
  "0x3bceac",
  "0xd7f75b",
  "0xfb710b",
  "0xbf74a0",
  "0x8afed6",
  "0x36f219",
  "0xee2e31",
]

PIXI.settings.SORTABLE_CHILDREN = true

document.body.appendChild(app.view);

app.stage.addChild(lineContainer);

app.stage.addChild(starContainer);

let mouseTrack = 0

let stars = []
let isDone = false

const MAX_STARS = 10
const MIN_STARS = 4
const MIN_MOUSETRACK = 10
const MAX_MOUSETRACK = 40
const MIN_AXIS_DIFFERENCE = 20

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
  starContainer.removeChildren()
  lineContainer.removeChildren()
  isDone = false
  starContainer.rotation = 0
  lineContainer.rotation = 0
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

        const rndColor = colors[randomRange(0, colors.length - 1)]

        tintChilds(starContainer, rndColor)
        tintChilds(lineContainer, rndColor)

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

function tintChilds(parent, color) {
  for (var i = 0; i < parent.children.length; i++) {
    parent.children[i].tint = color
  }
}

function isMousePosDifferent(axis, currentMouse, minDifference) {
  return currentMouse[axis] > oldMousePos[axis] + minDifference ||
    currentMouse[axis] < oldMousePos[axis] - minDifference
}


//*******************************************************************************************


function createStarPosition(mouseEvent) {
  const randomValue = randomRange(0,100)
  switch(true) {
    case (randomValue <= 50):
      drawCircle(mouseEvent)
      break
    case (randomValue > 50):
      drawStar(mouseEvent)
      break
  }
}


const styles = {
  star: {
    line: {
      weight: 1,
      color:  colors[0]
    },
    color:  colors[0],
    size: 5
  },
  line: {
    weight: 2,
    color:  colors[0]
  }
}

function drawCircle(mouseEvent) {
  const star = new PIXI.Graphics();
  star.lineStyle(styles.star.line.weight, styles.star.line.color, 1);
  star.beginFill(styles.star.color, 1);
  star.drawCircle(0, 0, randomRange(2, 5), randomRange(2, 5))
  star.position.set(mouseEvent.x, mouseEvent.y)
  star.endFill();
  starContainer.addChild(star);
  stars.push(star)
}

function drawStar(mouseEvent) {
  const star = new PIXI.Graphics();
  star.lineStyle(styles.star.line.weight, styles.star.line.color, 1);
  star.beginFill(styles.star.color, 1);
  star.drawStar(0, 0, randomRange(3, 10), randomRange(2, 8))
  star.position.set(mouseEvent.x, mouseEvent.y)
  star.endFill();
  starContainer.addChild(star);
  stars.push(star)
}

function connectStars() {
  for (var i = 0; i < MAX_STARS; i++) {
    drawLine(stars[i], stars[i + 1])
  }
  drawLine(stars[randomRange(0, stars.length - 1)], stars[randomRange(0, stars.length - 1)])
  drawLine(stars[randomRange(0, stars.length - 1)], stars[randomRange(0, stars.length - 1)])
}

function drawLine(pointA, pointB) {
  if (pointA && pointB) {
    const line = new PIXI.Graphics()
    line.lineStyle(styles.line.weight, styles.line.color, 1);
    line.moveTo(pointA.x, pointA.y);
    line.lineTo(pointB.x, pointB.y)
    lineContainer.addChild(line);
  }
}

function randomRange(min, max) {
  return Math.ceil(Math.random() * (max - min) + min)
}

starContainer.x = app.screen.width / 2;
starContainer.y = app.screen.height / 2;

starContainer.pivot.x = app.screen.width / 2
starContainer.pivot.y = app.screen.height / 2


lineContainer.x = app.screen.width / 2;
lineContainer.y = app.screen.height / 2;

lineContainer.pivot.x = app.screen.width / 2
lineContainer.pivot.y = app.screen.height / 2

const rotationSpeed = 0.003

app.ticker.add((delta) => {
  if (isDone) {
    starContainer.rotation += rotationSpeed * delta;
    lineContainer.rotation += rotationSpeed * delta;
  }
});

