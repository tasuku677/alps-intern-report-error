let stage = new Konva.Stage({
    container: 'container',
    width: window.innerWidth,
    height: window.innerHeight
});

let layer = new Konva.Layer();
stage.add(layer);
drawCircle(layer);
layer.draw();

// draw a circle at which the screen is touched.
function drawCircle(x, y) {
    var circle = new Konva.Circle({
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

stage.on('touchstart', function(e) {
var touchPos = stage.getPointerPosition();
var touchX = touchPos.x;
var touchY = touchPos.y;

drawCircle(touchX, touchY);
});
stage.on('click', function(e) {
    var touchPos = stage.getPointerPosition();
    var touchX = touchPos.x;
    var touchY = touchPos.y;
    
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