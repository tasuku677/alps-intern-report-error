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
            circleSpace:0,
            initialCircleX:0,
            initialCircleY:0,
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
                };
                imageObj.src = this.imageUrl;

                // this.addPinchZoom(this.stage);
                this.setupDragAndZoom(this.stage);
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
                x: stage.width() / 2,
                y: stage.height() / 2 + imageObj.height / 2,
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
            let scale = 1;
            if (imageObj.width > stage.width() || imageObj.height > stage.height()) {
                const widthScale = stage.width() / imageObj.width;
                const heightScale = stage.height() / imageObj.height;
                scale = Math.min(widthScale, heightScale) * 0.9;
            }

            let konvaImage = new Konva.Image({
                x: (stage.width() - imageObj.width * scale) / 2,
                y: (stage.height() - imageObj.height * scale) / 2,
                image: imageObj,
                width: imageObj.width * scale,
                height: imageObj.height * scale,
                draggable:true,
                stroke: 'Black',
            });
            layer.add(konvaImage);
            this.drawCircles(layer, imageObj, scale);
            layer.draw();
        },
        drawCircles(layer, imageObj, scale) {
            const rows = 13;
            const cols = 60;
            const spacing = (imageObj.height / rows) * scale;

            for (let i = 1; i < rows; i++) {
                for (let j = 1; j < cols; j++) {
                    if(i == 1 && j == 1){
                        this.initialCircleX = spacing * j + (this.stage.width() - imageObj.width * scale) / 2;
                        this.initialCircleY = spacing * i + (this.stage.height() - imageObj.height * scale) / 2;
                        this.circleSpace = spacing;
                    }
                    let circle = new Konva.Circle({
                        x: spacing * j + (this.stage.width() - imageObj.width * scale) / 2,
                        y: spacing * i + (this.stage.height() - imageObj.height * scale) / 2,
                        radius: 25 * scale,
                        fill: "rgba(255, 255, 255, 0.1)",
                        stroke: "rgba(255, 255, 255, 0.1)",
                        strokeWidth: 2 * scale,
                    });
                    circle.on('click tap', (event) => this.changeCircleColor(event));
                    layer.add(circle);
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
                if (shape instanceof Konva.Circle && shape.fill() === CLICKEDCOLOR) {
                    this.clickedPositionList.push({ 
                        x: Math.floor((shape.x() - this.initialCircleX) / this.circleSpace), 
                        y: Math.floor((shape.y() - this.initialCircleY) / this.circleSpace),
                    });
                }
            });
            console.log('Clicked circles:', this.clickedPositionList);

            window.parent.postMessage({
                clickedPositions: JSON.stringify(this.clickedPositionList),
                versionId: this.versionId,
                imageId: this.imageUrl,
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