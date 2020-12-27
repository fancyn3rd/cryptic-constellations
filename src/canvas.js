
import * as PIXI from "pixi.js"
import { arabToRoman } from "roman-numbers"

import nouns from "./nouns.json"
import animals from "./animals.json"

import {
  app, 
  colors,
  styles,
  introTextStyle,
  nameTextStyle,
  USER_INPUT_DEVICE,
  MAX_STARS,
  MIN_STARS,
  MAX_MOUSETRACK,
  MIN_MOUSETRACK,
  MIN_AXIS_DIFFERENCE,
  ROTATION_SPEED
} from "./config.js"

let stars = []
let rndColor

let isConstellationRoating = true
let isConstellationDrawn = true

let mouseTrack = 0
let mousetrackToNextStar
let constellationStarCount
let oldMousePos = []

const starContainer = new PIXI.Container()
setupContainer(starContainer)

const lineContainer = new PIXI.Container()
setupContainer(lineContainer)

const backgroundContainer = new PIXI.Container()
setupContainer(backgroundContainer)

document.body.addEventListener("pointermove", (event) => onMouseMove(event))
document.body.addEventListener("pointerdown", (event) => onClick(event))

document.body.appendChild(app.view);

app.stage.addChild(backgroundContainer)
app.stage.addChild(lineContainer);
app.stage.addChild(starContainer);

drawBackgroundStars()
setMouseTrackToNextStar()
setConstellationStarCount()

const introText = new PIXI.Text(`Use ${USER_INPUT_DEVICE} to f1nd a const3llation`, introTextStyle);
introText.pivot.x = introText.width / 2
introText.pivot.y = introText.height / 2
introText.x = app.screen.width/2
introText.y = app.screen.height/2 - 20
app.stage.addChild(introText);

const constellationNameText = new PIXI.Text(
  firstLetterUpperCase(nouns[randomRange(0, nouns.length - 1)]) + " "
  + firstLetterUpperCase(animals[randomRange(0, animals.length - 1)]) + " "
  + "X", nameTextStyle
)
constellationNameText.visible = false
app.stage.addChild(constellationNameText);

app.ticker.add((delta) => {
  if (isConstellationRoating) {
    starContainer.rotation += ROTATION_SPEED * delta;
    lineContainer.rotation += ROTATION_SPEED * delta;

    rndColor = colors[randomRange(0, colors.length - 1)]
    tintChilds(backgroundContainer, rndColor)
  }
});


//*******************************************************************************************

function setupContainer(container) {
  container.x = app.screen.width / 2;
  container.y = app.screen.height / 2;
  container.pivot.x = app.screen.width / 2
  container.pivot.y = app.screen.height / 2
}

function onClick(event) {
  if (isConstellationRoating) {
    resetCanvas(event)
  }
}

function resetCanvas(event) {
  introText.visible = false
  stars = []
  starContainer.removeChildren()
  lineContainer.removeChildren()
  isConstellationRoating = false
  isConstellationDrawn = false
  starContainer.rotation = 0
  lineContainer.rotation = 0
  mouseTrack = 0
  storeMousePos(event)
  tintChilds(backgroundContainer, colors[0])
  constellationNameText.visible = false
  constellationNameText.text =
    firstLetterUpperCase(nouns[randomRange(0, nouns.length - 1)]) + " "
    + firstLetterUpperCase(animals[randomRange(0, animals.length - 1)]) + " "
    + arabToRoman(randomRange(0,20)), nameTextStyle
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
        isConstellationDrawn = true
        constellationNameText.visible = true
        constellationNameText.pivot.x = constellationNameText.width / 2
        constellationNameText.pivot.y = constellationNameText.height / 2
        constellationNameText.x = app.screen.width/2
        constellationNameText.y = app.screen.height - 50
        setTimeout(() => isConstellationRoating = true, 1000)
      }

      if (!isConstellationDrawn) {
        createStarPosition(mouseEvent)
        setMouseTrackToNextStar()
        mouseTrack = 0
      }
    }
  }
}

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

function drawBackgroundStars() {
  for (var i = 0; i < 1000; i++) {
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
}


function isMousePosDifferent(axis, currentMouse, minDifference) {
  return currentMouse[axis] > oldMousePos[axis] + minDifference ||
    currentMouse[axis] < oldMousePos[axis] - minDifference
}

function storeMousePos(mouse) {
  oldMousePos = {x: mouse.x, y: mouse.y}
}

function setMouseTrackToNextStar() {
  mousetrackToNextStar = randomRange(MIN_MOUSETRACK, MAX_MOUSETRACK)
}

function setConstellationStarCount() {
  constellationStarCount = randomRange(MIN_STARS, MAX_STARS)
}

function tintChilds(parent, color) {
  for (var i = 0; i < parent.children.length; i++) {
    parent.children[i].tint = color
  }
}

function firstLetterUpperCase(string) {
  return string.charAt(0).toUpperCase() + string.slice(1)
}

function randomRange(min, max) {
  return Math.ceil(Math.random() * (max - min) + min)
}



