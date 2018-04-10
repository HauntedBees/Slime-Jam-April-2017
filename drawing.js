const bodyDims = {
    "head": { x: 50, y: 53 }
};
const sheetOffsets = {
    "head": { x: 0, y: 0 },
    "nose": { x: 0, y: 1 },
    "eyes": { x: 0, y: 2 },
    "mouf": { x: 0, y: 3 }
}
const GetIndex = (x, point, dims) => ({ x: (x + point.x) * dims.x, y: point.y * dims.y, w: dims.x, h: dims.y });
const GetHeadIndex = (p, type) => GetIndex(p[type], sheetOffsets[type], bodyDims["head"]);



function DrawPeople() {
    gameData.contestants.forEach((e, i) => DrawPerson(e, 50 + i * 70, 70));
}


function DrawPerson(p, x, y) {
    const sheet = gameData.sheets["heads"];
    const head = GetHeadIndex(p, "head");
    const eyes = GetHeadIndex(p, "eyes");
    const nose = GetHeadIndex(p, "nose");
    const mouf = GetHeadIndex(p, "mouf");

    DrawImage("people", sheet, x, y, head);
    DrawImage("people", sheet, x, y, eyes);
    DrawImage("people", sheet, x, y, nose);
    DrawImage("people", sheet, x, y, mouf);
}

function DrawImage(layerName, img, x, y, point) {
    const layer = gameData.ctx[layerName];
    layer.drawImage(img, point.x, point.y, point.w, point.h, x, y, point.w, point.h);
}
function DrawText(t, x, y) {
    x = x || 2; y = y || 10;
    ClearLayer("text");
    const maxWidth = 256 - 2 - x;
    const ctx = gameData.ctx["text"];
    ctx.fillStyle = "#000000";
    const size = 11;
    ctx.font = size + "px sans-serif";
    const ddy = size, ts = t.split(" ");
    let row = ts[0], dy = 0;
    for(let i = 1; i < ts.length; i++) {
        const textInfo = ctx.measureText(row + " " + ts[i]);
        if(textInfo.width > maxWidth || row.indexOf("\n") >= 0) {
            ctx.fillText(row, x, y + dy);
            dy += ddy;
            row = ts[i];
        } else {
            row += " " + ts[i];
        }
    }
    ctx.fillText(row, x, y + dy);
}
const ClearLayer = layerName => gameData.ctx[layerName].clearRect(0, 0, 256, 224);