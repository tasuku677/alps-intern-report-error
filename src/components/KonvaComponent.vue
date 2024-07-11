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
            space: 0,
            scale: 1,
            imageEdgeX:0,
            imageEdgeY:0,
            imageUrl: "",
            assetId: "",
            versionId: "",
        };
    },
    mounted() {
        this.initializeKonva();
    },
    methods: {
        async initializeKonva() {
            const data = JSON.parse(await getAssetInfo());
            console.log("data", data);
            this.imageUrl = data.imageUrl;
            this.assetId = data.assetId;
            this.versionId = data.versionId;  
  
            if (this.imageUrl) {
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
                    console.log("original imageWidth", imageObj.width);
                    console.log("original imageHeight", imageObj.height);
                    this.drawButton(imageObj, layer, stage);
                    this.drawImage(imageObj, layer, stage);
                    console.log("imageEdge:(x,y)", this.imageEdgeX, this.imageEdgeY);
                };
                imageObj.src = this.imageUrl;
            }
        },
        drawButton(imageObj, layer, stage) {
            const button = new Konva.Rect({
                // x: stage.width() / 2,
                x: 10,
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
            button.on('click tap', () => this.submitClickedGrids());
            buttonText.on('click tap', () => this.submitClickedGrids());
  
            layer.add(button);
            layer.add(buttonText);
            layer.draw();
        },
        drawImage(imageObj, layer, stage) {
            const widthScale = stage.width() / imageObj.width;
            const heightScale = stage.height() / imageObj.height;
            this.scale = Math.min(widthScale, heightScale);
  
            let konvaImage = new Konva.Image({
                x: (stage.width() - imageObj.width * this.scale) / 2,
                y: (stage.height() - imageObj.height * this.scale) / 2,
                image: imageObj,
                width: imageObj.width * this.scale,
                height: imageObj.height * this.scale,
                // draggable:true,
                stroke: 'Black',
                opacity: 1,
            });
            console.log("imageWidth after modified", konvaImage.width());
            console.log("imageHeight after modified", konvaImage.height());
            this.imageEdgeX = konvaImage.x();
            this.imageEdgeY = konvaImage.y();
            layer.add(konvaImage);
            this.drawGrids(imageObj, layer, stage);
            layer.draw();
        },
        drawGrids(imageObj, layer, stage) {
            const recWidth = getGridSize(Math.min(imageObj.width, imageObj.height));
            const recHeight = recWidth;
            const spacing = recHeight * this.scale;
            const rows = Math.floor(imageObj.height / recHeight) + 1;
            const cols = Math.floor(imageObj.width / recWidth) + 1; 
  
            this.space = spacing;
            for (let i = 0; i < rows; i++) {
                for (let j = 0; j < cols; j++) {
                    let grid = new Konva.Rect({
                        x: spacing * j + (stage.width() - imageObj.width * this.scale) / 2,
                        y: spacing * i + (stage.height() - imageObj.height * this.scale) / 2,
                        width:recWidth * this.scale,
                        height:recHeight * this.scale,
                        fill:NORMALCOLOR,
                        stroke:NORMALCOLOR,
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
        submitClickedGrids() {
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
                        xFromLeft: Math.round((shape.x() - this.imageEdgeX + this.space / 2) / this.scale),
                        yFromTop: Math.round((shape.y() - this.imageEdgeY + this.space / 2) / this.scale),
                    });
                }
            });
            console.log('Clicked Grids:', this.clickedPositionList);

            window.parent.postMessage({
                clickedPositions: JSON.stringify(this.clickedPositionList),
                versionId: this.versionId,
                imageUrl: this.imageUrl,
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