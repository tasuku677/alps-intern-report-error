function getGridSize(shortSide) {
    if (shortSide < 50) return 1;
    else if (shortSide < 100) return 2.5;
    else if (shortSide < 200) return 5;
    else if (shortSide < 400) return 10;
    else if (shortSide < 800) return 20;
    else if (shortSide < 1600) return 40;
    else return 80;
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