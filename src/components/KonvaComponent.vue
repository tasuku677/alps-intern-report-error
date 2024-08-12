<template>
    <div id="container"></div>
    <!-- <button v-bind:style="buttonStyle" @click="submitClickedCircles">Submit</button> -->
</template>

<script>
import Konva from 'konva';
import { getAssetInfo } from '../scripts/getAssetInfo.js';
import { getGridSize } from '../scripts/helper.js';


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
            scale: 1,
            spacingWidth: 0,
            spacingHeight: 0,
            imageEdgeX: 0,
            imageEdgeY: 0,
        };
    },
    mounted() {
        this.initializeKonva();
    },
    methods: {
        async initializeKonva() {

            const { imageUrl, assetId, versionId } = JSON.parse(await getAssetInfo());
            console.log("imageUrl", imageUrl, "assetId", assetId, "versionId", versionId);
            if (imageUrl) {
                let stage = new Konva.Stage({
                    container: 'container',
                    width: window.innerWidth,
                    height: window.innerHeight,
                });
                console.log("stage.width:", window.innerWidth);
                console.log("stage.height:", window.innerHeight);

                let layer = new Konva.Layer();
                stage.add(layer);
                this.stage = stage;
                this.layer = layer;

                let imageObj = new Image();
                imageObj.onload = () => {
                    const widthScale = stage.width() / imageObj.width;
                    const heightScale = stage.height() / imageObj.height;
                    this.scale = Math.min(widthScale, heightScale);
                    console.log("scale", this.scale);

                    console.log("original imageWidth", imageObj.width);
                    console.log("original imageHeight", imageObj.height);
                    this.drawButton(versionId, imageUrl, this.scale, this.layer);
                    this.drawImage(imageObj, this.layer, this.stage, this.scale);
                    console.log("imageEdge:(x,y)", this.imageEdgeX, this.imageEdgeY);
                };
                imageObj.src = imageUrl;
            }
        },
        drawButton(versionId, imageUrl, scale, layer) {
            const button = new Konva.Rect({
                x: 10,
                y: 0,
                width: 70,
                height: 40,
                fill: 'Blue',
                id: 'button',
                draggable: true,
            });
            const buttonText = new Konva.Text({
                x: button.x(), 
                y: button.y(), 
                text: 'Submit',
                fontSize: 20,
                fontFamily: 'Arial',
                fill: 'White',
            });
            buttonText.position({
                x: button.x() + (button.width() - buttonText.width()) / 2,
                y: button.y() + (button.height() - buttonText.height()) / 2,
            });
            button.on('click tap', () => this.submitClickedGrids(versionId, imageUrl, scale));
            buttonText.on('click tap', () => this.submitClickedGrids(versionId, imageUrl, scale));

            layer.add(button);
            layer.add(buttonText);
            layer.draw();
        },
        drawImage(imageObj, layer, stage, scale) {
            let konvaImage = new Konva.Image({
                x: (stage.width() - imageObj.width * scale) / 2,
                y: (stage.height() - imageObj.height * scale) / 2,
                image: imageObj,
                width: imageObj.width * scale,
                height: imageObj.height * scale,
                id:'konvaImage',
                draggable: true,
                stroke: 'Black',
                opacity: 1,
            });
            console.log("imageWidth after modified", konvaImage.width());
            console.log("imageHeight after modified", konvaImage.height());

            this.imageEdgeX = konvaImage.x();
            this.imageEdgeY = konvaImage.y();

            layer.add(konvaImage);
            this.drawGrids(imageObj, layer, stage, scale);
            layer.draw();
        },
        drawGrids(imageObj, layer, stage, scale) {
            const recWidth = getGridSize(imageObj.width) * scale;
            const recHeight = getGridSize(imageObj.height) * scale;
            console.log("recWidth", recWidth, "recHeight", recHeight);
            const rows = Math.round(imageObj.height * scale / recHeight);
            const cols = Math.round(imageObj.width * scale / recWidth);

            this.spacingHight = recWidth;
            this.spacingWidth = recHeight;

            const imageEdgeX =  (stage.width() - imageObj.width * scale) / 2;
            const imageEdgeY =  (stage.height() - imageObj.height * scale) / 2;

            for (let i = 0; i < rows; i++) {
                for (let j = 0; j < cols; j++) {
                    let grid = new Konva.Rect({
                        x: recWidth * j + imageEdgeX,
                        y: recHeight * i + imageEdgeY,
                        width: recWidth,
                        height: recHeight,
                        fill: NORMALCOLOR,
                        stroke: NORMALSTROKECOLOR,
                        strokeWidth: 1,
                        draggable: true,
                    })
                    grid.on('click tap', (event) => this.changeGridColor(event));
                    layer.add(grid);
                }
            }
        },
        changeGridColor(event) {
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
        submitClickedGrids(versionId, imageUrl, scale) {
            const button = this.layer.findOne('#button');
            if (button.fill() !== 'Blue') {
                return;
            }
            button.fill('Grey');
            button.stroke('Grey');
            button.getLayer().draw();
            const clickedPositionList = [];
            this.layer.children.forEach((shape) => {
                if (shape instanceof Konva.Rect && shape.fill() === CLICKEDCOLOR) {
                    clickedPositionList.push({
                        xFromLeft: Math.round((shape.x() - this.imageEdgeX + shape.width() / 2) / scale),
                        yFromTop: Math.round((shape.y() - this.imageEdgeY + shape.height() / 2) / scale),
                    });
                }
            });
            console.log('Clicked Grids:', clickedPositionList);

            window.parent.postMessage({
                clickedPositions: JSON.stringify(clickedPositionList),
                versionId: versionId,
                imageUrl: imageUrl,
            }, "*");
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