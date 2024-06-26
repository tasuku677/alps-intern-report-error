let stage = new Konva.Stage({
  container: 'container',
  width: window.innerWidth,
  height: window.innerHeight,
});

let layer = new Konva.Layer();
stage.add(layer);

let imageObj = new Image();
imageObj.src = "images_temp/SANSK5A001x.jpg"; 
imageObj.onload = showPicture(imageObj);

console.log(stage.width());
console.log(stage.height());
console.log(imageObj.width);
console.log(imageObj.height);

function showPicture(imageObj) {
  // calculate the ratio of the screen and the picture.
  let scale = 0.9;
  if (imageObj.width > stage.width()  || imageObj.height > stage.height()) {
    const widthScale = stage.width()  / imageObj.width;
    const heightScale = stage.height() / imageObj.height;
    scale = Math.min(widthScale, heightScale) * 0.9;
  }

  let konvaImage = new Konva.Image({
    x: (stage.width() - imageObj.width * scale) / 2,
    y: (stage.height() - imageObj.height * scale) / 2,
    image: imageObj,
    width: imageObj.width * scale,
    height: imageObj.height * scale,
  });
  layer.add(konvaImage);
  layer.draw();

  drawCircles(imageObj, scale);
};


// draw an circle at regular interval 
function drawCircles(imageObj, scale) {
  let rows = 15; // the number of rows
  let cols = 100; // the number of columns
  let spacing = (imageObj.height / rows * 2 - 10) * scale;
  let clickedColor = "rgba(255, 0, 0, 0.2)";
  let normalColor = "rgba(255, 255, 255, 0.1)";
  let normalStrokeColor = "rgba(255, 255, 255, 0.1)";

  for (let i = 0; i < rows; i++) {
    for (let j = 0; j < cols; j++) {
      let circle = new Konva.Circle({
        x: spacing * j + (stage.width() - imageObj.width * scale) / 2,
        y: spacing * i + (stage.height() - imageObj.height * scale) / 2,
        radius: 25 * scale,
        fill: normalColor,
        stroke: normalStrokeColor,
        strokeWidth: 2 * scale,
      });

      // add touch event.
      circle.on('click touchstart', function () {
        if (this.fill() === clickedColor) {
          this.fill(normalColor);  // when the screen is touched or clicked, the color change.
          this.stroke(normalStrokeColor);
        }
        else {
          this.fill(clickedColor);  // when the screen is touched or clicked, the color change.
          this.stroke(clickedColor);
        }
        layer.draw();
      });

      layer.add(circle);
    }
  }
  layer.draw();
}