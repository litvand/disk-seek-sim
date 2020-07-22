function isInt(x) { return Math.floor(x) === x; }

function getSectors(maxSector) {
    var sectors = [];
    var input = document.getElementById("sectors").value;
    var strs = input.trim().split(',');
    for (var i = 0; i < strs.length; ++i) {
        if (strs[i].length == 0) return strs.length == 1 ? [] : null;
        n = Number(strs[i]);
        if (!isInt(n) || n < 0 || n > maxSector) return null;
        sectors.push(n);
    }
    return sectors;
}

function setSectors(sectors) {
    document.getElementById('sectors').value = sectors;    
}

function getMethod() {
    var radioBtns = document.getElementsByName('method');
    for (var i = 0; i < radioBtns.length; ++i) {
        if (radioBtns[i].checked) return radioBtns[i].value;
    }
    console.log("Error: No method is checked.");
    return null;
}

function updateGUI() {
    var maxSector = 49;
    var sectors = getSectors(maxSector);
    if (!sectors) {
        drawError("Invalid sectors");
        return;
    }

    var startSector = 10;
    var method = getMethod(), targets;
    if (!method || !(targets = getTargets(method, sectors, startSector, maxSector))) {
        drawError("Invalid method");
        return;
    }

    var dist = getTotalDist(targets, startSector);
    drawGUI(dist, targets, startSector, maxSector);
}

function setExample(i) {
    var button = document.getElementById('example' + i)
    var example = button.firstChild.nodeValue; // Text displayed on button
    setSectors(example);
    updateGUI();
}