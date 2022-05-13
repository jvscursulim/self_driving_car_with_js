function lerp(A, B, t) {

    return A + (B-A)*t;
}

function getRndInterger(min, max) {

    return Math.floor(Math.random() * (max - min) + min);
}