let stage = new Konva.Stage({
    container: 'container',
    width: window.innerWidth,
    height: window.innerHeight
});

let layer = new Konva.Layer();
stage.add(layer);
drawCircleAtHome(layer);
layer.draw();


function drawCircleAtHome(layer, x = stage.width() / 2, y = stage.height() / 2){
    let circle = new Konva.Circle({
        x: x,
        y: y,
        radius: 10,
        fill: 'red', // depend on the number of clicks.
        stroke: 'red', // should be the same as "fill".
        strokeWidth: 2,
    });
    layer.add(circle);
}

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


// タッチした位置に円を描画する関数
function drawCircle(x, y) {
var circle = new Konva.Circle({
    x: x,
    y: y,
    radius: 20,
    fill: 'red',
    stroke: 'black',
    strokeWidth: 2,
});

// Layerに円を追加
layer.add(circle);
layer.draw(); // 再描画
}

// Stageがタッチされたときのイベントリスナーを追加
stage.on('touchstart', function(e) {
var touchPos = stage.getPointerPosition();
var touchX = touchPos.x;
var touchY = touchPos.y;

drawCircle(touchX, touchY);
});