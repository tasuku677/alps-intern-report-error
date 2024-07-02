
let submitButton = document.getElementById("submit");
submitButton.addEventListener("click", function () {

});

function countPositions() {
    const CLICKEDCOLOR = "rgba(255, 0, 0, 0.2)";
    const NORMALCOLOR = "rgba(255, 255, 255, 0.1)";
    const NORMALSTROKECOLOR = "rgba(255, 255, 255, 0.1)";

    let circles = layer.getChildren(function (node) {
        return node.getClassName() === 'Circle' && node.fill() === CLICKEDCOLOR;
    })

    var positions = circles.map(function (circle) {
        return {
            x: circle.x(),
            y: circle.y()
        };
    });

    console.log(positions);
}

export { countPositions }
