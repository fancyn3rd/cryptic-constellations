
export const MAX_STARS = 10
export const MIN_STARS = 4
export const MIN_MOUSETRACK = 5
export const MAX_MOUSETRACK = 8
export const MIN_AXIS_DIFFERENCE = 30
export const ROTATION_SPEED = 0.005

const IS_MOBILE = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
export const USER_INPUT_DEVICE = IS_MOBILE ? "f1nger" : "m0use"

export const app = new PIXI.Application(
    window.innerWidth,
    window.innerHeight, {
       antialias: true,
       backgroundColor : "black"
     }
);

export const colors = [
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

export const styles = {
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

export const introTextStyle = new PIXI.TextStyle({
    fill: colors[0],
    fontSize: 36,
    fontFamily: "Verdana",
    fontStyle: 'italic',
    align: "center",
    wordWrap: true,
    wordWrapWidth: 350
});
  
export const nameTextStyle = new PIXI.TextStyle({
    fill: colors[0],
    fontSize: IS_MOBILE ? 26 : 36,
    fontFamily: "Verdana",
    fontStyle: 'italic',
});

  