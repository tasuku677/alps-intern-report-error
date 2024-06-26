let stage = new Konva.Stage({
    container: 'container',
    width: window.innerWidth,
    height: window.innerHeight,
  });

  // Stage上のLayerを作成
  let layer = new Konva.Layer();
  stage.add(layer);

  // 画像オブジェクトを作成
  let imageObj = new Image();
  imageObj.src = "images_temp/SANSK5A001x.jpg"; // 画像のパスを指定

  imageObj.onload = function() {
    let konvaImage = new Konva.Image({
      x: (stage.width() - imageObj.width) / 2,
      y: (stage.height() - imageObj.height) / 2,
      image: imageObj,
      width: imageObj.width,
      height: imageObj.height,
    });

    // Layerに画像を追加
    layer.add(konvaImage);
    
    // 一定間隔で円を描画する関数
    function drawCircles() {
      let spacing = 30;  // 円の間隔
      let rows = imageObj.height / spacing;  // 行数
      let cols = imageObj.width / spacing;  // 列数

      for (let i = 0; i < rows; i++) {
        for (let j = 0; j < cols; j++) {
          let circle = new Konva.Circle({
            x: spacing * j + (stage.width() - imageObj.width) / 2,
            y: spacing * i +  (stage.height() - imageObj.height) / 2,
            radius: 10,
            fill: 'rgba(255, 255, 255, 0.5)',
            stroke: 'rgba(255, 255, 255, 0.8)',
            strokeWidth: 2,
          });

          // add touch event.
          circle.on('click touchstart', function() {
            this.fill('blue');  // when the screen is touched or clicked, the color change to blue.
            layer.draw();
          });

          layer.add(circle);
        }
      }
      layer.draw();
    }

    // 円を描画
    drawCircles();
  };