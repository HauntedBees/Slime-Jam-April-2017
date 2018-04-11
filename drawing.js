const bodyDims = {
    "head": { x: 50, y: 53 },
    "button": { x: 40, y: 69 },
    "buttonsmall": { x: 40, y: 40 }
};
const sheetOffsets = {
    "none": { x: 0, y: 0 },
    "head": { x: 0, y: 0 },
    "nose": { x: 0, y: 1 },
    "eyes": { x: 0, y: 2 },
    "mouf": { x: 0, y: 3 }
}
const fullScreenDims = { x: 0, y: 0, w: 256, h: 224 };
const GetIndex = (x, offset, dims) => ({ x: (x + offset.x) * dims.x, y: offset.y * dims.y, w: dims.x, h: dims.y });
const GetHeadIndex = (p, type) => GetIndex(p[type], sheetOffsets[type], bodyDims["head"]);
const GetButtonIndex = (i, small) => GetIndex(i, sheetOffsets["none"], bodyDims[small ? "buttonsmall" : "button"]);


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
    DrawBooth("people", x - 15, y + 70);
    DrawText(p.firstName, x, y + 100, "people");
    DrawText("" + p.score, x + 15, y + 140, "people", 22);
}
const bdx = 61, bdy = 38, bleftx = 9.5, btopy = 87;
function DrawBoard(isFirstTime) {
    DrawImage("background", gameData.sheets["board"], 0, 0, fullScreenDims);
    gameData.categories.forEach((e, i) => {
        if(!isFirstTime) { DrawBoardText(e.name, bleftx + i * bdx, bdy, true); }
        let amt = e.questions.length, max = 3;
        let score = 1600;
        while(amt-- > 0) {
            DrawBoardText("" + score, bleftx + i * bdx, btopy + max * bdy);
            score /= 2;
            max--;
        }
    });
}
function DrawBoardText(t, x, y, header) {
    DrawText(t, x, y, "people", header ? 12 : 16, 50);
}

function DrawScreen(text) {
    DrawImage("background", gameData.sheets["screen"], 0, 0, fullScreenDims);
    DrawText(text, 10, 65, "people", 13, 236, "#FFFFFF");
}

function DrawButton(i, x, y, small) {
    const dims = GetButtonIndex(i, small || false);
    if(small) { dims.dw = dims.w / 2; dims.dh = dims.h / 2; }
    DrawImage("UI", gameData.sheets["buttons"], x, y, dims);
}

const DrawBooth = (layer, x, y) => DrawImage(layer, gameData.sheets["booth"], x, y, { x: 0, y: 0, w: 78, h: 122 });

function DrawImage(layerName, img, x, y, point) {
    const layer = gameData.ctx[layerName];
    layer.drawImage(img, point.x, point.y, point.w, point.h, x, y, point.dw || point.w, point.dh || point.h);
}

function DrawText(t, x, y, layer, size, maxWidth, color) {
    layer = layer || "text";
    size = size || 11;
    x = x || 2; y = y || 10;
    if(layer === "text") { ClearLayer("text"); }
    maxWidth = maxWidth || (256 - 2 - x);
    const ctx = gameData.ctx[layer];
    ctx.fillStyle = color || "#000000";
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
function ClearAllLayers() { for(const key in gameData.ctx) { ClearLayer(key); } } 