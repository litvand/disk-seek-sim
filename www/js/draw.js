// const:
var black = '#000000', gray = '#F0F0F0', white = '#FFFFFF';
var blue = '#0000FF', cyan = '#ceebfd', orange = '#FF6800';
var msgAreaHeight = 60;

function getCtx() {
    return document.getElementById('myCanvas').getContext('2d');
}

function getCtxSize() {
    var ctx = getCtx();
    return [ctx.canvas.clientWidth, ctx.canvas.clientHeight];
}

function clearCtx() {
    var ctx = getCtx();
    var size = getCtxSize();
    ctx.clearRect(0, 0, size[0], size[1]);
}

function drawTxt(txt, x, y, fontSize) {
    var ctx = getCtx();
    ctx.font = (fontSize || 25).toString() + 'px Arial';
    ctx.fillStyle = black;
    ctx.fillText(txt, x, y);
}

function drawMsg(msg) {
    var ctx = getCtx();
    var size = getCtxSize();
    ctx.clearRect(0, size[1] - msgAreaHeight + 4, size[0], msgAreaHeight);
    var x = 10, y = size[1] - 0.5 * msgAreaHeight;
    drawTxt(msg, x, y);
}

function drawError(msg) { drawMsg('Error: ' + msg); }

function xFromSector(sector, xStep) { return xStep * (sector + 1); }

function yFromTime(time, yStep, yAxis) { return yAxis + yStep * (time + 1); }

function drawLine(ax, ay, bx, by, color, width) {
    var ctx = getCtx();
    ctx.beginPath();
    ctx.lineWidth = width || 2;
    ctx.strokeStyle = color;
    ctx.moveTo(ax, ay); 
    ctx.lineTo(bx, by);
    ctx.stroke();
}

function drawSectorAxis(maxSector, xStep, yAxis) {
    // Draw long horizontal line.
    drawLine(xStep, yAxis, xStep * (maxSector + 1), yAxis, black);
    
    // Draw short vertical lines on long horizontal line.
    // Draw `String(i)` above short vertical lines. 
    for (var i = 0; i <= maxSector; ++i) {
        var x = xFromSector(i, xStep);
        var halfHeight = 4;
        drawLine(x, yAxis - halfHeight, x, yAxis + halfHeight, black, 3);
        var yTxt = yAxis - halfHeight - 5;
        var txtHalfWidth = i < 10 ? 3 : 6;
        drawTxt(String(i), x - txtHalfWidth, yTxt, 10);
    }
}

function drawSectorLine(sector, maxSector, xStep, yAxis, isStart) {
// Draw long vertical line over sector short vertical line (on axis) below text.
    var x = xFromSector(sector, xStep);
    var ay = yAxis + 3, by = getCtxSize()[1] - msgAreaHeight - 3;
    drawLine(x, ay, x, by, isStart ? orange : gray, isStart ? 2 : 1);
}

function drawArrowhead(x, y, isRightArrow, color) {
    var halfWidth = 4, halfHeight = 3, gap = 3;
    var sgn = isRightArrow ? 1 : -1;
    var ax = x - sgn * (halfWidth + gap), bx = x + sgn * (halfWidth - gap);
    var ay = y - halfHeight, by = y + halfHeight;
    drawLine(ax, ay, ax, by, color); // vertical
    drawLine(ax, ay, bx, y,  color); // upper diagonal
    drawLine(ax, by, bx, y,  color); // lower diagonal
    drawLine(ax, y,  x,  y,  color); // fill
}

function drawArrow(ax, bx, y, highlight) {
    if (ax == bx) {
        console.log("Warning: Can't draw zero-length arrow.");
        return;
    }

    var isRightArrow = ax < bx;
    var maxLen = Math.abs(ax - bx);
    var drawShortArrows = false;
    var len = drawShortArrows ? Math.min(maxLen, 22) : maxLen;
    var xStart = isRightArrow ? bx - len : bx + len;
    drawLine(xStart, y, bx, y, highlight ? cyan : gray, 1);
    drawArrowhead(bx, y, isRightArrow, highlight ? blue : black);
}

function drawFilledCircle(x, y, radius, color) {
    var ctx = getCtx();
    ctx.beginPath();
    ctx.arc(x, y, radius, 0, 2 * Math.PI);
    ctx.fillStyle = color;
    ctx.fill();
}

function drawTargets(targets, startSector, maxSector, xStep, yStep, yAxis) {
    var curSector = startSector;
    var s = targets.sectors, used = targets.used;

    var drawSectorLines = true;
    if (drawSectorLines) {
        for (var i = 0; i < s.length; ++i) { // `i` corresponds to time and vertical axis.
            if (s[i] != startSector) drawSectorLine(s[i], maxSector, xStep, yAxis, false);
        }
    }
    
    for (var i = 0; i < s.length; ++i) { // Separate loop to always draw arrows over lines
        var xc = xFromSector(curSector, xStep);
        var y = yFromTime(i, yStep, yAxis);
        var radius = 0.5 * Math.min(xStep, yStep) - 3;
        
        var xs = xFromSector(s[i], xStep);
        if (xc != xs) {
            drawArrow(xc, xs, y, used[i]);
        } else {
            drawFilledCircle(xc, y, radius, blue);
        }
        curSector = s[i];
    }
}

function drawGUI(dist, targets, startSector, maxSector) {
    clearCtx();
    drawMsg('Seek distance: ' + dist);
    var xStep = 15, yStep = 10, yAxis = 20;
    drawSectorAxis(maxSector, xStep, yAxis);
    drawSectorLine(startSector, maxSector, xStep, yAxis, true);
    drawTargets(targets, startSector, maxSector, xStep, yStep, yAxis);
}