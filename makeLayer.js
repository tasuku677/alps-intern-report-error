let stage = new Konva.Stage({
    container: 'container',
    width: window.innerWidth,
    height: window.innerHeight
});

let layer = new Konva.Layer();
stage.add(layer);

export{stage}