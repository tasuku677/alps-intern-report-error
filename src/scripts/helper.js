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

export{ getDistance, getCenter}