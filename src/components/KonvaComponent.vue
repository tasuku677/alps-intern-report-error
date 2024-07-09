<template>
    <div id="container"></div>
    <!-- <button v-bind:style="buttonStyle" @click="submitClickedCircles">Submit</button> -->
</template>

<script>
import Konva from 'konva';
import { getAssetInfo } from '../scripts/getAssetInfo.js';
import { getDistance, getCenter } from '../scripts/helper.js';

const CLICKEDCOLOR = "rgba(255, 0, 0, 0.2)";
const NORMALCOLOR = "rgba(255, 255, 255, 0.1)";
const NORMALSTROKECOLOR = "rgba(255, 255, 255, 0.1)";

export default {
    name: 'KonvaComponent',
    data() {
        return {
            stage: null,
            layer: null,
            clickedPositionList: [],
            // circleSpace:0,
            space: 0,
            scale: 1,
            imageEdgeX:0,
            imageEdgeY:0,
            imageUrl: "",
            assetId: "",
            versionId: "",
            lastCenter: null,
            lastDist: 0,
            dragStopped: false,
        };
    },
    mounted() {
        this.initializeKonva();
        // this.setupDragAndZoom();
    },
    methods: {
        async initializeKonva() {
            const data = JSON.parse(await getAssetInfo());
            this.imageUrl = data.imageUrl;
            this.assetId = data.assetId;
            this.versionId = data.versionId;  

            if (this.imageUrl) {
                let stage = new Konva.Stage({
                    container: 'container',
                    width: window.innerWidth,
                    height: window.innerHeight,
                });

                let layer = new Konva.Layer();
                stage.add(layer);
                this.stage = stage;
                this.layer = layer;

                // this.drawBackGround(layer);

                let imageObj = new Image();
                imageObj.onload = () => {
                    this.drawButton(imageObj, layer, stage);
                    this.drawImage(imageObj, layer, stage);
                    console.log("imageEdge:(x,y)", this.imageEdgeX, this.imageEdgeY);
                };
                imageObj.src = this.imageUrl;

                // this.addPinchZoom(this.stage);
                // this.setupDragAndZoom(this.stage);
            }
        },
        // drawBackGround(layer) {
        //     let backGround = new Konva.Rect({
        //         width: window.innerWidth,
        //         height: window.innerHeight,
        //         fill: 'black',
        //         stroke: 'black',
        //         fillPatternRepeat: 'repeat',
        //     })
        //     layer.add(backGround);
        // },
        drawButton(imageObj, layer, stage) {
            const button = new Konva.Rect({
                // x: stage.width() / 2,
                x:0,
                // y: stage.height() / 2 + imageObj.height / 2,
                y: stage.height() - stage.height(),
                width: 70,
                height: 40,
                fill: 'Blue',
                id: 'button',
            });
            const buttonText = new Konva.Text({
                x: button.x(), // ボタンの位置に合わせて調整
                y: button.y(), // ボタンの位置に合わせて調整
                text: 'Submit',
                fontSize: 20,
                fontFamily: 'Arial',
                fill: 'White',
            });
            // テキストの位置を調整してボタンの中央に配置する例
            buttonText.position({
                x: button.x() + (button.width() - buttonText.width()) / 2,
                y: button.y() + (button.height() - buttonText.height()) / 2,
            });
            button.on('click tap', () => this.submitClickedCircles());
            buttonText.on('click tap', () => this.submitClickedCircles());

            layer.add(button);
            layer.add(buttonText);
            layer.draw();
        },
        drawImage(imageObj, layer, stage) {
            const widthScale = stage.width() / imageObj.width;
            const heightScale = stage.height() / imageObj.height;
            this.scale = Math.min(widthScale, heightScale) * 0.95;

            let konvaImage = new Konva.Image({
                x: (stage.width() - imageObj.width * this.scale) / 2,
                y: (stage.height() - imageObj.height * this.scale) / 2,
                image: imageObj,
                width: imageObj.width * this.scale,
                height: imageObj.height * this.scale,
                // draggable:true,
                stroke: 'Black',
            });
            this.imageEdgeX = konvaImage.x();
            this.imageEdgeY = konvaImage.y();
            layer.add(konvaImage);
            this.drawGrids(imageObj, layer, stage);
            layer.draw();
        },
        drawGrids(imageObj, layer, stage) {
            // const rows = 20;
            // const cols = 20;
            // const spacing = (imageObj.height / rows) * this.scale;
            // const recWidth = spacing;
            // const recHeight = spacing;
            const recWidth = 50;
            const recHeight = 50;
            const spacing = recHeight * this.scale;
            const rows = Math.floor(imageObj.height / recHeight);
            const cols = Math.floor(imageObj.width / recWidth); 

            for (let i = 0; i < rows; i++) {
                for (let j = 0; j < cols; j++) {
                    if(i == 1 && j == 1){
                        // this.circleSpace = spacing;
                        this.space = spacing;
                    }
                    // let circle = new Konva.Circle({
                    //     x: spacing * j + (stage.width() - imageObj.width * this.scale) / 2,
                    //     y: spacing * i + (stage.height() - imageObj.height * this.scale) / 2,
                    //     radius: 25 * this.scale,
                    //     fill: NORMALCOLOR,
                    //     stroke: NORMALCOLOR,
                    //     strokeWidth: 2 * this.scale,
                    // });
                    // circle.on('click tap', (event) => this.changeCircleColor(event));
                    // layer.add(circle);
                    let grid = new Konva.Rect({
                        x: spacing * j + (stage.width() - imageObj.width * this.scale) / 2,
                        y: spacing * i + (stage.height() - imageObj.height * this.scale) / 2,
                        // width: 25 * this.scale,
                        width:recWidth * this.scale,
                        height:recHeight * this.scale,
                        fill:NORMALCOLOR,
                        stroke:NORMALCOLOR,
                    })
                    grid.on('click tap', (event) => this.changeCircleColor(event));
                    layer.add(grid);
                }
            }
        },
        changeCircleColor(event) {
            const circle = event.target;

            if (circle.fill() === CLICKEDCOLOR) {
                circle.fill(NORMALCOLOR);
                circle.stroke(NORMALSTROKECOLOR);
            } else {
                circle.fill(CLICKEDCOLOR);
                circle.stroke(CLICKEDCOLOR);
            }
            circle.getLayer().draw();
        },
        submitClickedCircles() {
            const button = this.layer.findOne('#button');
            if (button.fill() !== 'Blue'){
                return;
            }
            button.fill('Grey');
            button.stroke('Grey');
            button.getLayer().draw();
            this.clickedPositionList = [];
            this.layer.children.forEach((shape) => {
                if (shape instanceof Konva.Rect && shape.fill() === CLICKEDCOLOR) {
                    this.clickedPositionList.push({ 
                        xFromLeft: shape.x() - this.imageEdgeX,
                        yFromTop: shape.y() - this.imageEdgeY,
                        squareSize: this.space,
                    });
                }
            });
            console.log('Clicked Grids:', this.clickedPositionList);

            window.parent.postMessage({
                clickedPositions: JSON.stringify(this.clickedPositionList),
                versionId: this.versionId,
                imageUrl: this.imageUrl,
                space: this.space,
            }, "*");
        },
        setupDragAndZoom(stage) {
            stage.on('touchmove', (e) => {
                e.evt.preventDefault();
                var touch1 = e.evt.touches[0];
                var touch2 = e.evt.touches[1];

                if (touch1 && touch2) {
                    if (stage.isDragging()) {
                        this.dragStopped = true;
                        stage.stopDrag();
                    }

                    var p1 = {
                        x: touch1.clientX,
                        y: touch1.clientY,
                    };
                    var p2 = {
                        x: touch2.clientX,
                        y: touch2.clientY,
                    };

                    if (!this.lastCenter) {
                        this.lastCenter = getCenter(p1, p2);
                        return;
                    }
                    var newCenter = getCenter(p1, p2);

                    var dist = getDistance(p1, p2);

                    if (!this.lastDist) {
                        this.lastDist = dist;
                    }

                    var pointTo = {
                        x: (newCenter.x - stage.x()) / stage.scaleX(),
                        y: (newCenter.y - stage.y()) / stage.scaleX(),
                    };

                    var scale = this.stage.scaleX() * (dist / this.lastDist);

                    this.stage.scaleX(scale);
                    this.stage.scaleY(scale);

                    var dx = newCenter.x - this.lastCenter.x;
                    var dy = newCenter.y - this.lastCenter.y;

                    var newPos = {
                        x: newCenter.x - pointTo.x * scale + dx,
                        y: newCenter.y - pointTo.y * scale + dy,
                    };

                    stage.position(newPos);

                    this.lastDist = dist;
                    this.lastCenter = newCenter;
                }
            });
            this.stage.on('touchend', () => {
                this.lastDist = 0;
                this.lastCenter = null;
            });
        },
        addPinchZoom(stage) {
            let lastDist = 0;
            let lastCenter = null;

            stage.on('touchmove', (evt) => {
                if (evt.evt.touches.length === 2) {
                    evt.evt.preventDefault();
                    const touch1 = evt.evt.touches[0];
                    const touch2 = evt.evt.touches[1];
                    const dist = getDistance(touch1, touch2);
                    if (!lastDist) {
                        lastDist = dist;
                    }
                    const scale = stage.scaleX() * (dist / lastDist);
                    const center = getCenter(touch1, touch2);
                    if (!lastCenter) {
                        lastCenter = center;
                    }

                    // const pointTo = {
                    //     x: (center.x - stage.x()) / stage.scaleX(),
                    //     y: (center.y - stage.y()) / stage.scaleY(),
                    // };

                    stage.scale({ x: scale, y: scale });

                    const dx = (center.x - lastCenter.x) / scale;
                    const dy = (center.y - lastCenter.y) / scale;

                    stage.position({
                        x: stage.x() - dx * (scale - stage.scaleX()),
                        y: stage.y() - dy * (scale - stage.scaleY()),
                    });

                    lastDist = dist;
                    lastCenter = center;
                    stage.batchDraw();
                }
            });
            stage.on('touchend', () => {
                lastDist = 0;
                lastCenter = null;
            });
        },
    }
};
</script>

<style scoped>
#container {
    width: 100%;
    height: 100vh;
}
</style>