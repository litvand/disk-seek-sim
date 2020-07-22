var Sim = {};

function shallowCopyArray(a) { return a.slice(); }

function remElem(array, index) { array.splice(index, 1); }

Sim.fcfs = function(sectors, startSector) {
    var used = [];
    for (var i = 0; i < sectors.length; ++i) used.push(true);
    return {sectors: sectors, used: used};
}

Sim.sstf = function(sectors, startSector) {
    var targets = [], used = [];
    var remaining = shallowCopyArray(sectors);
    var curSector = startSector;
    while (remaining.length > 0) {
        var closestIndex = -1, closestDist = -1;
        for (var i = 0; i < remaining.length; ++i) {
            var sector = remaining[i];
            var dist = Math.abs(sector - curSector);
            if (closestIndex < 0 || dist < closestDist) {
                closestIndex = i;
                closestDist = dist;
            }
        }
        var curTarget = remaining[closestIndex];
        remElem(remaining, closestIndex);
        targets.push(curTarget);
        used.push(true);
        curSector = curTarget; // Move head to target.
    }
    return {sectors: targets, used: used};
}

function sortCorrectly(anArray) { // You know, like every other programming language
    anArray.sort(function(a,b) { return a - b; });
}

function split(numbers, pivot) { // Like quicksort, but numbers <= the pivot are left in.
    var leq = [], gt = [];
    for (var i = 0; i < numbers.length; ++i) {
        var n = numbers[i];
        if (n > pivot) {
            gt.push(n);
        } else {
            leq.push(n);
        }
    }
    sortCorrectly(leq);
    sortCorrectly(gt);
    return {leq: leq, gt: gt};
}

Sim.scan = function(sectors, startSector, maxSector) { // Start direction is up.
    var s = split(sectors, startSector);
    var used = [];
    for (var i = 0; i < s.gt.length; ++i) used.push(true);
    if (s.gt.length == 0 || s.gt[s.gt.length - 1] < maxSector) {
        s.gt.push(maxSector);
        used.push(false);
    }
    for (var i = s.leq.length - 1; i >= 0; --i) {
        s.gt.push(s.leq[i]);
        used.push(true);
    }
    return {sectors: s.gt, used: used};
}

Sim.clook = function(sectors, startSector) { // c - circular; look - unidirectional
    var s = split(sectors, startSector);
    var used = [];
    for (var i = 0; i < s.leq.length; ++i) s.gt.push(s.leq[i]);
    for (var i = 0; i < s.gt.length; ++i) used.push(true);
    return {sectors: s.gt, used: used};
}

function getTargets(method, sectors, startSector, maxSector) {
    if (!Sim[method]) return null;
    if (sectors.length == 0) return {sectors: [], used: []};
    return Sim[method](sectors, startSector, maxSector);
}

function getTotalDist(targets, startSector) {
    var dist = 0;
    var s = targets.sectors;
    var curSector = startSector;
    for (var i = 0; i < s.length; ++i) {
        dist += Math.abs(s[i] - curSector);
        curSector = s[i];
    }
    return dist;
}