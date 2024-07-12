function getGridSize(shortSide) {
    let gridSize, quotient;
    if(shortSide < 200) gridSize = 5;
    else if(shortSide < 1600) gridSize = 40;
    else gridSize = 80;
    quotient =  Math.floor(shortSide / gridSize)
    if(quotient) gridSize += (shortSide % 40) / quotient;
    return gridSize;
}
function getDistance(p1, p2) {
    return Math.sqrt(
        Math.pow(p2.clientX - p1.clientX, 2) + Math.pow(p2.clientY - p1.clientY, 2)
    );
}
function getCenter(p1, p2) {
    return {
        x: (p1.clientX + p2.clientX) / 2,
        y: (p1.clientY + p2.clientY) / 2,
    };
}

export { getGridSize, getDistance, getCenter }