<template>
    <button @click="submitClickedCircles">Submit</button>
    <div id="container"></div>
</template>

<script>
import Konva from 'konva';
import { getImageUrl } from '../scripts/getImageUrl.js';

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
        // this.drawImage(this.stage, this.layer, this.clickedPositionList);
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
                    this.drawImage(imageObj, layer, stage);
                };
                imageObj.src = imageUrl;
            }
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
                    circle.on('click touchstart', (event) => this.changeColor(event));
                    layer.add(circle);
                }
            }
        },
        changeColor(event) {
            const circle = event.target;

            if (circle.fill() === "rgba(255, 0, 0, 0.2)") {
                circle.fill("rgba(255, 255, 255, 0.1)");
                circle.stroke("rgba(255, 255, 255, 0.1)");
            } else {
                circle.fill("rgba(255, 0, 0, 0.2)");
                circle.stroke("rgba(255, 0, 0, 0.2)");
            }
            circle.getLayer().draw();
        },
        submitClickedCircles() {
            this.clickedCircles = [];
            this.layer.children.forEach((shape) => {
                if (shape instanceof Konva.Circle && shape.fill() === "rgba(255, 0, 0, 0.2)") {
                    this.clickedCircles.push({ x: shape.x(), y: shape.y() });
                }
            });
            console.log('Clicked circles:', this.clickedCircles);
            // ここで必要な処理を追加する（例えば、サーバーにデータを送信するなど）
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