<template>
    <div id="container"></div>
    <!-- <button v-bind:style="buttonStyle" @click="submitClickedCircles">Submit</button> -->
</template>

<script>
import Konva from 'konva';
import { getImageUrl } from '../scripts/getImageUrl.js';

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
        };
    },
    mounted() {
        this.initializeKonva();
    },
    methods: {
        async initializeKonva() {
            let imageUrl = await getImageUrl();
            // imageUrl = "http://127.0.0.1:9081/image/SANSK5A001x";
            if (imageUrl) {
                let stage = new Konva.Stage({
                    container: 'container',
                    width: window.innerWidth,
                    height: window.innerHeight,
                });

                let layer = new Konva.Layer();
                stage.add(layer);
                this.stage = stage;
                this.layer = layer;

                let imageObj = new Image();
                imageObj.onload = () => {
                    this.drawButton(imageObj, layer, stage);
                    this.drawImage(imageObj, layer, stage);
                };
                imageObj.src = imageUrl;
            }
        },
        drawButton(imageObj, layer, stage) {
            const button = new Konva.Rect({
                x: stage.width() / 2, //x:stage.width() / 2 + imageObj.width / 2
                y: stage.height() / 2 + imageObj.height / 4, //y:stage.height() / 2 + imageObj.height / 2
                width: 50,
                height: 20,
                fill: 'Blue',
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
            // button.on('click touchstart', () => this.submitClickedCircles());
            buttonText.on('click touchstart', () => this.submitClickedCircles());

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
                    circle.on('click touchstart', (event) => this.changeCircleColor(event));
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
            const button = this.layer.findOne('Rect');
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
                // ここで必要な処理を追加する（例えば、サーバーにデータを送信するなど）
            }
        },
    },
};
</script>

<style scoped>
#container {
    width: 100%;
    height: 100vh;
}
</style>