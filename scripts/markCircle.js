import { getImageUrl } from "./getImageUrl.js";

let stage = new Konva.Stage({
    container: 'container',
    width: window.innerWidth,
    height: window.innerHeight
});

let layer = new Konva.Layer();
stage.add(layer);

//
async function showPicture(){
    let imageUrl = await getImageUrl();
    let imageObj = new Image();
    imageObj.src = (imageUrl) ? imageUrl :"images_temp/SANSK5A001x.jpg"; //deprecated.
    // imageObj.src = "images_temp/SANSK5A001x.jpg";

    imageObj.onload = function() {
    let konvaImage = new Konva.Image({
        x: (stage.width() - imageObj.width) / 2,
        y: (stage.height() - imageObj.height) / 2,
        image: imageObj,
        width: imageObj.width,
        height: imageObj.height,
    });

    layer.add(konvaImage);
    layer.draw();
    };
}
showPicture();

drawCircle(layer);
layer.draw();

// draw a circle at which the screen is touched.
function drawCircle(x, y) {
    let circle = new Konva.Circle({
        x: x,
        y: y,
        radius: 5,
        fill: 'red',    // depend on the number of clicks
        stroke: 'red', // should be the same as the value of "fill".
        strokeWidth: 2,
    });

    layer.add(circle);
    layer.draw(); 
}

stage.on('click touchstart', function(e) {
let touchPos = stage.getPointerPosition();
let touchX = touchPos.x;
let touchY = touchPos.y;

drawCircle(touchX, touchY);
});

function decideColorByClickedNumber(number){
    if(number < 10){
        return "green";
    }
    else if(number < 20){
        return "yellow";
    }
    else{
        return "red";
    }
}