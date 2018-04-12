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
const miscDims = {
    "wordtilesm": { x: 0, y: 0, w: 13, h: 32 },
    "wordtile": { x: 0, y: 0, w: 19, h: 32 }  
};
const GetIndex = (x, offset, dims) => ({ x: (x + offset.x) * dims.x, y: offset.y * dims.y, w: dims.x, h: dims.y });
const GetHeadIndex = (p, type) => GetIndex(p[type], sheetOffsets[type], bodyDims["head"]);
const GetButtonIndex = (i, small) => GetIndex(i, sheetOffsets["none"], bodyDims[small ? "buttonsmall" : "button"]);




// Sentences
function DrawSentence() {
    DrawImage("background", gameData.sheets["words"], 0, 0, fullScreenDims);
    const sData = gameData.currentSentence.full;
    const fullS = gameData.currentSentence.populated;
    const words = fullS.split(" ");
    const dx = sData.small ? 15 : 20, sprite = sData.small ? "wordtilesm" : "wordtile";
    const dims = miscDims[sprite];
    const img = gameData.sheets[sprite];
    const fontSize = sData.small ? 11 : 16;
    const tdx = sData.small ? 6 : 9, tdy = 20;

    let letterIdx = 0, wordIdx = 0, lineIdx = -1, lineLetterIdx = 0;
    let wordsOnCurrentLine = sData.wpl[lineIdx];
    let di = sData.dx[lineIdx], leftX = 0;
    let doReset = true;

    while(letterIdx < fullS.length) {
        if(doReset) {
            lineIdx++;
            wordIdx = 0;
            lineLetterIdx = -1;
            wordsOnCurrentLine = sData.wpl[lineIdx];
            if(wordsOnCurrentLine === 0) { continue; }
            leftX = (lineIdx === 1 || lineIdx === 2) ? (sData.small ? 14 : 13) : 31;
            di = sData.dx[lineIdx];
            doReset = false;
        }
        const char = fullS[letterIdx++];
        lineLetterIdx += 1;
        if(char === " ") {
            if(++wordIdx === wordsOnCurrentLine) {
                doReset = true;
            }
            continue;
        }
        const x = leftX + (di + lineLetterIdx) * dx;
        const y = 45 + 35 * lineIdx;
        DrawImage("people", img, x, y, dims);
        if(char !== "_") { DrawLetter(char, x + tdx, y + tdy, "people", fontSize); }
    }
}

// Answer Questions
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

// General
const DrawBooth = (layer, x, y) => DrawImage(layer, gameData.sheets["booth"], x, y, { x: 0, y: 0, w: 78, h: 122 });
function DrawPeople(skip) {
    gameData.contestants.forEach((e, i) => DrawPerson(e, 50 + i * 70, 70, skip === i));
}
function DrawPerson(p, x, y, justBooth) {
    if(!justBooth) {
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
    DrawBooth("people", x - 15, y + 70);
    DrawText(p.firstName, x, y + 100, "people");
    DrawText("" + p.score, x + 15, y + 140, "people", 22);
}


// Helpers
function DrawImage(layerName, img, x, y, point) {
    const layer = gameData.ctx[layerName];
    layer.drawImage(img, point.x, point.y, point.w, point.h, x, y, point.dw || point.w, point.dh || point.h);
}
function DrawLetter(l, x, y, layer, size, color) {
    layer = layer || "text";
    size = size || 11;
    x = x || 2; y = y || 10;
    const ctx = gameData.ctx[layer];
    ctx.textAlign = "center";
    ctx.fillStyle = color || "#000000";
    ctx.font = "bold " + size + "px sans-serif";
    ctx.fillText(l, x, y);
}
function DrawText(t, x, y, layer, size, maxWidth, color) {
    layer = layer || "text";
    size = size || 11;
    x = x || 2; y = y || 10;
    if(layer === "text") { ClearLayer("text"); }
    maxWidth = maxWidth || (256 - 2 - x);
    const ctx = gameData.ctx[layer];
    ctx.textAlign = "left";
    ctx.fillStyle = color || "#000000";
    ctx.font = size + "px sans-serif";
    t = t.replace(/{doc}/g, ",").replace(/{sos}/g, "").replace(/{g}/g, "g").replace(/{Emo}/g, "Emo");
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