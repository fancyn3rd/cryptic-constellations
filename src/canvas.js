
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
let isConstellationDrawn = false

let mouseTrack = 0
let mousetrackToNextStar
let constellationStarCount
let oldMousePos = []

document.body.addEventListener("pointermove", (event) => onPointerMove(event))
document.body.addEventListener("pointerdown", (event) => onPointerClick(event))

const starContainer = new PIXI.Container()
setupContainer(starContainer)

const lineContainer = new PIXI.Container()
setupContainer(lineContainer)

const backgroundContainer = new PIXI.Container()
setupContainer(backgroundContainer)

const introText = new PIXI.Text(`Use ${USER_INPUT_DEVICE} to f1nd a const3llation`, introTextStyle);
introText.pivot.x = introText.width / 2
introText.pivot.y = introText.height / 2
introText.x = app.screen.width/2
introText.y = app.screen.height/2 - 20

const constellationNameText = new PIXI.Text(
  firstLetterUpperCase(nouns[randomRange(0, nouns.length - 1)]) + " "
  + firstLetterUpperCase(animals[randomRange(0, animals.length - 1)]) + " "
  + "X", nameTextStyle
)
constellationNameText.visible = false

document.body.appendChild(app.view);
app.stage.addChild(backgroundContainer)
app.stage.addChild(lineContainer);
app.stage.addChild(starContainer);
app.stage.addChild(introText);
app.stage.addChild(constellationNameText);

drawBackgroundStars()
setMouseTrackToNextStar()
setConstellationStarCount()

let time = 0
let scaleValue = 1
let isStarGrowing = false
let pickedStar = null

app.ticker.add((delta) => {
  if (isConstellationRoating && isConstellationDrawn) {
    //starContainer.rotation += ROTATION_SPEED * delta;
        //constellationConatiner.rotation += ROTATION_SPEED * time;
        
          
          
          if (pickedStar) {
            if (!stars[pickedStar].initialColor) {
              stars[pickedStar].initialColor = stars[pickedStar].tint
            }
            stars[pickedStar].scale.set(scaleValue)*delta
          }
        
          if (!isStarGrowing && scaleValue <= 1) {
            pickedStar = randomRange(0, stars.length - 1)
            isStarGrowing = true
          }

          if (isStarGrowing && scaleValue < 4) {
            scaleValue += 0.03
          }

          if (isStarGrowing && scaleValue >= 4) {
            isStarGrowing = false
          }

          if (!isStarGrowing && scaleValue > 1) {
            scaleValue -= 0.03
          }

          
          // if (index > 0) {
          //   stars[index].tint = rndColor;
          //   stars[index].scale.set(3)
          //   stars[index].zIndex = 100
          //   stars[index - 1].tint = 0xFFFFFF;
          //   stars[index - 1].scale.set(1)
          //   stars[index - 1].zIndex = 100
          // }
    
          // if (index === 0) {
          //   stars[index].tint = rndColor;
          //   stars[index].scale.set(3)
          //   stars[stars.length - 1].tint = 0xFFFFFF;
          //   stars[stars.length - 1].scale.set(1)
          // }
    
      



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

function onPointerClick(event) {
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

function onPointerMove(event) {
  if (stars.length <= constellationStarCount && !isConstellationDrawn) {
  mouseTrack += 1
  if (mouseTrack > mousetrackToNextStar) {

    if (isMousePosDifferent("x", event, MIN_AXIS_DIFFERENCE) &&
      isMousePosDifferent("y", event, MIN_AXIS_DIFFERENCE)) {
        oldMousePos.x = event.x
        oldMousePos.y = event.y

          if (stars.length === constellationStarCount) {
            connectStars()

            const rndColor = colors[randomRange(0, colors.length - 1)]
            tintChilds(starContainer, rndColor)
            tintChilds(lineContainer, rndColor)

            //stars = []
            isConstellationDrawn = true
            constellationNameText.visible = true
            constellationNameText.pivot.x = constellationNameText.width / 2
            constellationNameText.pivot.y = constellationNameText.height / 2
            constellationNameText.x = app.screen.width/2
            constellationNameText.y = app.screen.height - 50
            setTimeout(() => isConstellationRoating = true, 1000)
          }

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
  
  console.log("this")
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



