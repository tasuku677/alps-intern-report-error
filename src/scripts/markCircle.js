import { getImageUrl } from "./getImageUrl.js";

let clickedPositionList = [];
const CLICKEDCOLOR = "rgba(255, 0, 0, 0.2)";
const NORMALCOLOR = "rgba(255, 255, 255, 0.1)";
const NORMALSTROKECOLOR = "rgba(255, 255, 255, 0.1)";

let stage = new Konva.Stage({
  container: 'container',
  width: window.innerWidth,
  height: window.innerHeight,
});
let layer = new Konva.Layer();
stage.add(layer);

let imageObj = new Image();
imageObj.onload = function () {
  // calculate the ratio of the screen and the picture to make the picture responsible design.
  let scale = 1;
  if (imageObj.width > stage.width()  || imageObj.height > stage.height()) {
    const widthScale = stage.width()  / imageObj.width;
    const heightScale = stage.height() / imageObj.height;
    scale = Math.min(widthScale, heightScale) * 0.9;
  }
  //draw the picture.
  let konvaImage = new Konva.Image({
    x: (stage.width() - imageObj.width * scale) / 2,
    y: (stage.height() - imageObj.height * scale) / 2,
    image: imageObj,
    width: imageObj.width * scale,
    height: imageObj.height * scale,
  });
  layer.add(konvaImage);
  //draw circles
  drawCircles(layer, imageObj, scale);
  layer.draw();
}
getImageUrl().then(url => imageObj.src = url);

// draw an circle at regular interval 
function drawCircles(layer, imageObj, scale) {
  const rows = 13; // the number of rows
  const cols = 60; // the number of columns
  const spacing = (imageObj.height / rows) * scale;

  for (let i = 0; i < rows; i++) {
    for (let j = 0; j < cols; j++) {
      let circle = new Konva.Circle({
        x: spacing * j + (stage.width() - imageObj.width * scale) / 2,
        y: spacing * i + (stage.height() - imageObj.height * scale) / 2,
        radius: 25 * scale,
        fill: NORMALCOLOR,
        stroke: NORMALSTROKECOLOR,
        strokeWidth: 2 * scale,
      });
      // add touch event.
      circle.on('click touchstart', changeColor);
      // circle.on('click touchstart', recordPosition);

      layer.add(circle);
    }
  }
}

// Function to change the color of the circle when clicked
function changeColor(event) {
  const circle = event.target;

  if (circle.fill() === CLICKEDCOLOR) {
    circle.fill(NORMALCOLOR); // when the screen is touched or clicked, the color change.
    circle.stroke(NORMALSTROKECOLOR);
  } else {
    circle.fill(CLICKEDCOLOR); // when the screen is touched or clicked, the color change.
    circle.stroke(CLICKEDCOLOR);
  }
  circle.getLayer().draw();
}

function recordPosition(event){
  const circle = event.target;
  const pos = {
    x: circle.x,
    y: circle.y,
  };
  if (circle.fill() === CLICKEDCOLOR) {
    clickedPositionList = clickedPositionList.filter(p => p.x !== pos.x || p.y !== pos.y);
  } else {
    clickedPositionList.push(pos);
  }
  console.log(clickedPositionList[-1]);
}