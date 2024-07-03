<template>
    <div id="container"></div>
    <!-- <button v-bind:style="buttonStyle" @click="submitClickedCircles">Submit</button> -->
</template>

<script>
import Konva from 'konva';
import { getImageUrl } from '../scripts/getImageUrl.js';
import { getVersionId } from '../scripts/getVersionId.js';

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
            imageUrl: "",
            versionId: "",
        };
    },
    mounted() {
        this.initializeKonva();
    },
    methods: {
        async initializeKonva() {
            this.imageUrl = await getImageUrl();
            this.varsionId = await getVersionId();
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

                this.addPinchZoom(this.stage);
            }
        },
        drawBackGround(layer) {
            let backGround = new Konva.Rect({
                width: window.innerWidth,
                height: window.innerHeight,
                fill: 'black',
                stroke: 'black',
                fillPatternRepeat: 'repeat',
            })
            layer.add(backGround);
        },
        drawButton(imageObj, layer, stage) {
            const button = new Konva.Rect({
                x: stage.width() / 2,
                y: stage.height() / 2 + imageObj.height / 2,
                width: 50,
                height: 20,
                fill: 'Blue',
                id: 'button',
            });
            const buttonText = new Konva.Text({
                x: button.x(), // ボタンの位置に合わせて調整
                y: button.y(), // ボタンの位置に合わせて調整
                text: 'Done',
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
            });
            layer.add(konvaImage);
            this.drawCircles(layer, imageObj, scale);
            layer.draw();
        },
        drawCircles(layer, imageObj, scale) {
            const rows = 13;
            const cols = 60;
            const spacing = (imageObj.height / rows) * scale;

            for (let i = 0; i < rows; i++) {
                for (let j = 0; j < cols; j++) {
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
            if (button.fill() === 'Blue') {
                button.fill('Grey');
                button.stroke('Grey');
                button.getLayer().draw();
                this.clickedPositionList = [];
                this.layer.children.forEach((shape) => {
                    if (shape instanceof Konva.Circle && shape.fill() === "rgba(255, 0, 0, 0.2)") {
                        this.clickedPositionList.push({ x: shape.x(), y: shape.y() });
                    }
                });
                console.log('Clicked circles:', this.clickedPositionList);
                console.log(this.versionId);
                // be supposed to send the data below
            }
        },
        addPinchZoom(stage) {
            let lastDist = 0;
            let lastCenter = null;

            stage.on('touchmove', (evt) => {
                if (evt.evt.touches.length === 2) {
                    evt.evt.preventDefault();
                    const touch1 = evt.evt.touches[0];
                    const touch2 = evt.evt.touches[1];
                    const dist = this.getDistance(touch1, touch2);
                    if (!lastDist) {
                        lastDist = dist;
                    }
                    const scale = stage.scaleX() * (dist / lastDist);
                    const center = this.getCenter(touch1, touch2);
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
        getDistance(p1, p2) {
            return Math.sqrt(
                Math.pow(p2.clientX - p1.clientX, 2) + Math.pow(p2.clientY - p1.clientY, 2)
            );
        },
        getCenter(p1, p2) {
            return {
                x: (p1.clientX + p2.clientX) / 2,
                y: (p1.clientY + p2.clientY) / 2,
            };
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