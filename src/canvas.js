
import * as PIXI from "pixi.js"
import { arabToRoman } from "roman-numbers"
import nouns from "./nouns.json"
import animals from "./animals.json"

const starContainer = new PIXI.Container()
const lineContainer = new PIXI.Container()
const backgroundContainer = new PIXI.Container()

const app = new PIXI.Application(
 window.innerWidth,
 window.innerHeight, {
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

document.body.appendChild(app.view);

app.stage.addChild(backgroundContainer)
app.stage.addChild(lineContainer);
app.stage.addChild(starContainer);

const style = new PIXI.TextStyle({
  fill: colors[0],
  fontSize: 36,
  fontFamily: "Verdana",
  fontStyle: 'italic',
  align: "center",
  wordWrap: true,
  wordWrapWidth: 350
});

const style2 = new PIXI.TextStyle({
  fill: colors[0],
  fontSize: 36,
  fontFamily: "Verdana",
  fontStyle: 'italic',
});

const introText = new PIXI.Text('Use m0use to f1nd a const3llation', style);
introText.pivot.x = introText.width / 2
introText.pivot.y = introText.height / 2
introText.x = app.screen.width/2
introText.y = app.screen.height/2 - 20
app.stage.addChild(introText);


function firstLetterUpperCase(string) {
  return string.charAt(0).toUpperCase() + string.slice(1)
}

const constellationNameText = new PIXI.Text(
  firstLetterUpperCase(nouns[randomRange(0, nouns.length - 1)]) + " "
  + firstLetterUpperCase(animals[randomRange(0, animals.length - 1)])
  + "______", style2
)
  
constellationNameText.visible = false
constellationNameText.pivot.x = constellationNameText.width / 2
constellationNameText.pivot.y = constellationNameText.height / 2
constellationNameText.x = app.screen.width/2
constellationNameText.y = app.screen.height - 50
app.stage.addChild(constellationNameText);





let mouseTrack = 0

let stars = []
let isDone = true
let almostDone = true

const MAX_STARS = 10
const MIN_STARS = 4
const MIN_MOUSETRACK = 5
const MAX_MOUSETRACK = 8
const MIN_AXIS_DIFFERENCE = 30

let mousetrackToNextStar
let constellationStarCount
let oldMousePos = []

document.body.addEventListener("mousemove", (event) => onMouseMove(event))
document.body.addEventListener("click", (event) => onClick(event))

setMouseTrackToNextStar()
setConstellationStarCount()

function storeMousePos(mouse) {
  oldMousePos = {x: mouse.x, y: mouse.y}
}

function setConstellationStarCount() {
  constellationStarCount = randomRange(MIN_STARS, MAX_STARS)
}

function onClick(event) {
  if (isDone) {
    resetCanvas(event)
  }
}

function resetCanvas(event) {
  introText.visible = false
  stars = []
  starContainer.removeChildren()
  lineContainer.removeChildren()
  isDone = false
  almostDone = false
  starContainer.rotation = 0
  lineContainer.rotation = 0
  mouseTrack = 0
  storeMousePos(event)
  tintChilds(backgroundContainer, colors[0])
  constellationNameText.visible = false
  constellationNameText.setText(
    firstLetterUpperCase(nouns[randomRange(0, nouns.length - 1)]) + " "
    + firstLetterUpperCase(animals[randomRange(0, animals.length - 1)]) + " "
    + arabToRoman(randomRange(0,50)), style2
  )
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
        almostDone = true
        constellationNameText.visible = true
        setTimeout(() => isDone = true, 1000)

        
      }

      if (!almostDone) {
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

for (var i=0; i<1000; i++) {
  const star = new PIXI.Graphics();
  star.lineStyle(styles.star.line.weight, styles.star.line.color, 1);
  star.beginFill(styles.star.color, 1);
  star.drawRect(0, 0, 0.1, 0.1)
  star.lineStyle(styles.star.line.weight, colors[0], 1);
  star.drawRect(1, 1, 0.1, 0.1)
  star.position.set(randomRange(0, app.screen.width), randomRange(0, app.screen.height))
  star.endFill();
  backgroundContainer.addChild(star);

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

const rotationSpeed = 0.005

app.ticker.add((delta) => {
  if (isDone) {
    starContainer.rotation += 0.005 * delta;
    lineContainer.rotation += 0.005 * delta;

    const rndColor = colors[randomRange(0, colors.length - 1)]

        tintChilds(backgroundContainer, rndColor)
  }
});

