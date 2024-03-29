import * as PIXI from "pixi.js"
import { arabToRoman } from "roman-numbers"
import "regenerator-runtime"

import nouns from "./words/nouns.json"
import animals from "./words/animals.json"

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
} from "./config.js"

let stars = []
let rndColor

let isConstellationAnimationPlaying = true
let isConstellationDrawn = false

let mouseTrack = 0
let mousetrackToNextStar
let constellationStarCount
let oldMousePos = []

let scaleValue = 1
let isStarGrowing = false
let pickedStar = null

const starContainer = setupContainer(new PIXI.Container())
const lineContainer = setupContainer(new PIXI.Container())
const backgroundContainer = setupContainer(new PIXI.Container())

const introText = setupIntroText(new PIXI.Text())
const constellationNameText = setupConstellationNameText(new PIXI.Text())

document.body.appendChild(app.view);
document.body.addEventListener("pointermove", (event) => onPointerMove(event))
document.body.addEventListener("pointerdown", (event) => onPointerClick(event))

app.stage.addChild(backgroundContainer)
app.stage.addChild(lineContainer);
app.stage.addChild(starContainer);
app.stage.addChild(introText);
app.stage.addChild(constellationNameText);

drawBackgroundStars()
setMouseTrackToNextStar()
setConstellationStarCount()

app.ticker.add((deltaTime) => {
  if (isConstellationAnimationPlaying && isConstellationDrawn) {
    colorizeBackgroundStars()
    doStarScalingAnimation(deltaTime)
  }
});

//*******************************************************************************************

function setupContainer(container) {
  container.x = app.screen.width / 2;
  container.y = app.screen.height / 2;
  container.pivot.x = app.screen.width / 2
  container.pivot.y = app.screen.height / 2
  return container
}

function setupIntroText(text) {
  text.text = `Use ${USER_INPUT_DEVICE} to f1nd a const3llation`
  text.style = introTextStyle
  text.pivot.x = text.width / 2
  text.pivot.y = text.height / 2
  text.x = app.screen.width/2
  text.y = app.screen.height/2 - 20
  return text
}

function setupConstellationNameText(text) {
  text.style = nameTextStyle
  text.x = app.screen.width/2
  text.y = app.screen.height - 50
  text.visible = false
  return text
}

function onPointerClick(event) {
  if (isConstellationAnimationPlaying) {
    resetCanvas(event)
  }
}

function resetCanvas(event) {
  stars = []
  starContainer.removeChildren()
  lineContainer.removeChildren()
  introText.visible = false;
  isConstellationAnimationPlaying = false
  isConstellationDrawn = false
  mouseTrack = 0
  storeMousePos(event)
  tintChilds(backgroundContainer, colors[0])
  setConstellationName()
}

function setConstellationName() {
  constellationNameText.text =
    firstLetterUpperCase(nouns[randomRange(0, nouns.length - 1)]) + " "
    + firstLetterUpperCase(animals[randomRange(0, animals.length - 1)]) + " "
    + arabToRoman(randomRange(0,20))

  constellationNameText.visible = false;
  constellationNameText.pivot.x = constellationNameText.width / 2
  constellationNameText.pivot.y = constellationNameText.height / 2
}

function onPointerMove(event) {
  if (stars.length <= constellationStarCount && !isConstellationDrawn) {
    mouseTrack += 1

    if (stars.length === constellationStarCount) {
      connectStars()

      const rndColor = colors[randomRange(0, colors.length - 1)]
      tintChilds(starContainer, rndColor)
      tintChilds(lineContainer, rndColor)

      isConstellationDrawn = true
      constellationNameText.visible = true
      setTimeout(() => isConstellationAnimationPlaying = true, 1000)
    }

    if (mouseTrack > mousetrackToNextStar) {
      if (isMousePosDifferent("x", event, MIN_AXIS_DIFFERENCE) &&
        isMousePosDifferent("y", event, MIN_AXIS_DIFFERENCE)) {
          oldMousePos.x = event.x
          oldMousePos.y = event.y

          if (!isConstellationDrawn) {
            createStarPosition(event)
            setMouseTrackToNextStar()
            mouseTrack = 0
          }
        }
    }
  }
}

function createStarPosition(event) {
  const randomValue = randomRange(0,100)
  switch(true) {
    case (randomValue <= 50):
      drawCircle(event)
      break
    case (randomValue > 50):
      drawStar(event)
      break
  }
}

function drawCircle(event) {
  const star = new PIXI.Graphics();
  star.lineStyle(styles.star.line.weight, styles.star.line.color, 1);
  star.beginFill(styles.star.color, 1);
  star.drawCircle(0, 0, randomRange(2, 5), randomRange(2, 5))
  star.position.set(event.x, event.y)
  star.endFill();
  starContainer.addChild(star);
  stars.push(star)
}

function drawStar(event) {
  const star = new PIXI.Graphics();
  star.lineStyle(styles.star.line.weight, styles.star.line.color, 1);
  star.beginFill(styles.star.color, 1);
  star.drawStar(0, 0, randomRange(3, 10), randomRange(2, 8))
  star.position.set(event.x, event.y)
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


//LOOP/TICKER Functions
//*******************************************************************************************
function colorizeBackgroundStars() {
  rndColor = colors[randomRange(0, colors.length - 1)]
  tintChilds(backgroundContainer, rndColor)
}

function doStarScalingAnimation(deltaTime) {
  if (!isStarGrowing) {
    switch (true) {
      case (scaleValue <= 1):
        pickedStar = randomRange(0, stars.length - 1)
        isStarGrowing = true
        break
      case (scaleValue > 1):
        scaleValue -= 0.03
        break
    }
  }

  if (isStarGrowing) {
    switch (true) {
      case (scaleValue < 4):
        scaleValue += 0.03
        break
      case (scaleValue >= 4):
        isStarGrowing = false
        break
    }
  }

  if (pickedStar) {
    if (!stars[pickedStar].initialColor) {
      stars[pickedStar].initialColor = stars[pickedStar].tint
    }
    stars[pickedStar].scale.set(scaleValue)*deltaTime
  }
}


