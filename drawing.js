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
    "mouf": { x: 0, y: 3 },
    "tmouf": { x: 6, y: 0 },
    "trait1": { x: 0, y: 4 },
    "trait2": { x: 0, y: 4 }
}
const fullScreenDims = { x: 0, y: 0, w: 256, h: 224 };
const miscDims = {
    "wordtilesm": { x: 0, y: 0, w: 13, h: 32 },
    "wordtile": { x: 0, y: 0, w: 19, h: 32 },
    "thwuck": dx => ({ x: 101 * dx, y: 0, w: 101, h: 232, dw: 34, dh: 77 }),
    "pnum": (dx, dy) => ({ x: 200 * dx, y: 106.5 * dy, w: 200, h: 106.5, dw: 100, dh: 53.25 }),
    "blob": () => {
        const i = IRange(0, 24);
        const x = (i % 8);
        const y = Math.floor(i / 8);
        return { x: x * 50, y: y * 50, w: 50, h: 50, dw: IRange(40, 60), dh: IRange(40, 60) };
    }
};
const GetIndex = (x, offset, dims) => ({ x: (x + offset.x) * dims.x, y: offset.y * dims.y, w: dims.x, h: dims.y });
const GetHeadIndex = (p, type) => GetIndex(p[type], sheetOffsets[type], bodyDims["head"]);
const GetButtonIndex = (i, small) => GetIndex(i, sheetOffsets["none"], bodyDims[small ? "buttonsmall" : "button"]);

// General
function DrawGenBG() { DrawImage("background", gameData.sheets["bg"], 0, 0, fullScreenDims); }
function DrawPNum(x, y, type, blinking) { // dx/dy: 0/0 = P1, 1/0 = P2, 0/1 = P3, 1/1 = CPU
    let dx = 0, dy = 0;
    switch(type) {
        case 1: dx = 1; break;
        case 2: dy = 1; break;
        case 3: dx = 1; dy = 1; break;
    }
    if(blinking) {
        let showNow = true;
        gameData.pnumIdx = setInterval(function() {
            showNow = !showNow;
            if(showNow) {
                DrawImage("pnum", gameData.sheets["playericons"], x, y, miscDims.pnum(dx, dy));
            } else {
                ClearLayer("pnum");
            }
        }, 1250);
        DrawImage("pnum", gameData.sheets["playericons"], x, y, miscDims.pnum(dx, dy));
    } else {
        DrawImage("pnum", gameData.sheets["playericons"], x, y, miscDims.pnum(dx, dy));
    }
}
const CenterPNum = (type, blinking) => DrawPNum(78, 20, type, blinking);
function ReadyCurrentPlayer() {
    const pplus = gameData.currentPlayer + 1;
    CenterPNum(((pplus <= gameData.numPlayers) ? gameData.currentPlayer : 3), true);
}
function StopPNum() {
    clearInterval(gameData.pnumIdx);
    gameData.pnumIdx = -1;
    ClearLayer("pnum");
}

const DrawBooth = (layer, x, y) => DrawImage(layer, gameData.sheets["booth"], x, y, { x: 0, y: 0, w: 78, h: 122 });
function DrawPeople(skip) {
    DrawGenBG();
    gameData.contestants.forEach((e, i) => DrawPerson(e, 50 + i * 70, 70, skip === i));
}
function DrawPerson(p, x, y, justBooth) {
    if(!justBooth) { DrawHead(p, x, y + p.dHeight); }
    DrawBooth("people", x - 15, y + 70);
    DrawCenterText(p.firstName, x + 20, y + 100);
    DrawCenterText("" + p.score, x + 20, y + 142, 22);
}
function DrawHost(x, y) {
    const p = gameData.host;
    const ctx = gameData.ctx["people"];
    const ctx2 = gameData.ctx["mouf"];
    DrawImage("people", gameData.sheets["host"], x - 8, y + 1, { x: 0, y: 0, w: 112, h: 194 });
    ctx.save(); ctx2.save();
    ctx.translate(256, 0); ctx2.translate(256, 0);
    ctx.scale(-1, 1); ctx2.scale(-1, 1);
    DrawHead(p, 256 - x - bodyDims.head.x, y, true);
    gameData.mouths[gameData.mouths.length - 1].flipped = true;
    ctx.restore(); ctx2.restore();
}
function DrawHead(p, x, y, skipSkull) {
    const sheet = gameData.sheets["heads"];
    const mouf = GetHeadIndex(p, "mouf");
    const mouthY = y + 3;
    if(!skipSkull) {
        const bodx = (p.body % 5), body = Math.floor(p.body / 5);
        DrawImage("people", gameData.sheets["bodies"], x - 18, y, { x: bodx * 80, y: body * 115, w: 80, h: 115 });
        DrawImage("people", sheet, x, y, GetHeadIndex(p, "head"));
    }

    const hairx = (p.hair % 8), hairy = Math.floor(p.hair / 8);
    DrawImage("people", gameData.sheets["hair"], x - 13, y - 17, { x: hairx * 74, y: hairy * 87, w: 74, h: 87 });

    DrawImage("people", sheet, x, y, GetHeadIndex(p, "eyes"));
    DrawImage("people", sheet, x, y, GetHeadIndex(p, "nose"));
    DrawImage("mouf", sheet, x, mouthY, mouf);
    if(p.trait1 >= 0) { DrawImage("people", sheet, x, y, GetHeadIndex(p, "trait1")); }
    if(p.trait2 >= 0) { DrawImage("people", sheet, x, y, GetHeadIndex(p, "trait2")); }
    gameData.mouths.push({id: p.id, x: x, y: mouthY, mouf: mouf, tmouf: GetHeadIndex(p, "tmouf"), open: false, talking: false });
}
function DrawMouths() {
    ClearLayer("mouf");
    const ctx = gameData.ctx["mouf"];
    const sheet = gameData.sheets["heads"];
    gameData.mouths.forEach(e => {
        if(e.flipped) {
            ctx.save();
            ctx.translate(256, 0);
            ctx.scale(-1, 1);
        }
        if(e.talking) { e.open = !e.open; }
        DrawImage("mouf", sheet, e.x, e.y, e.open ? e.tmouf : e.mouf);
        if(e.flipped) { ctx.restore(); }
    });
}
function DrawButton(i, x, y, small) {
    const dims = GetButtonIndex(i, small || false);
    if(small) { dims.dw = dims.w / 2; dims.dh = dims.h / 2; }
    DrawImage("UI", gameData.sheets["buttons"], x, y, dims);
}
function DrawScreen(text) {
    DrawImage("background", gameData.sheets["screen"], 0, 0, fullScreenDims);
    DrawCenterText(text, 124, 46, 13, 230, "#FFFFFF");
}

// WHEEL! OF! SLIME!!!
let thwuckAngles = [36, 72, 144, 162, 216, 234, 288, 324];
thwuckAngles = thwuckAngles.map(e => e + 2);
const thwuckP1Angles = thwuckAngles.map(e => e + 1);
const thwuckP2Angles = thwuckAngles.map(e => e + 2);
const thwuckP3Angles = thwuckAngles.map(e => e + 3);
function DrawWheel(fuckingAngle, firstThwuck) {
    ClearLayer("people");
    fuckingAngle = (fuckingAngle || 0) % 360;
    const layer = "people";
    const ctx = gameData.ctx[layer];
    ctx.save();
    ctx.translate(128, 178);
    ctx.rotate(fuckingAngle * Math.PI/180);
    DrawImage(layer, gameData.sheets["wheel"], -128, -128, { x: 0, y: 0, w: 667, h: 667, dw: 256, dh: 256 });
    ctx.restore();
    const testAngle = Math.floor(fuckingAngle);
    let thwuckAmount = 0;
    if(!firstThwuck) {
        if(thwuckAngles.indexOf(testAngle) >= 0 || thwuckP1Angles.indexOf(testAngle) >= 0) { thwuckAmount = 1; }
        if(thwuckP2Angles.indexOf(testAngle) >= 0 || thwuckP3Angles.indexOf(testAngle) >= 0) { thwuckAmount = 2; }
    }
    DrawImage(layer, gameData.sheets["thwuck"], 112, 0, miscDims.thwuck(thwuckAmount));
}

// Slime That Phrase!
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

// Question and Slime
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
    DrawCenterText(t, x + 25, y, header ? 12 : 16, 50);
}
function DrawQIMG(imgName) {
    const img = gameData.sheets[imgName];
    const ratio = 100 / img.width;
    DrawImage("people", img, 150, 65, { x: 0, y: 0, w: img.width, h: img.height, dw: img.width * ratio, dh: img.height * ratio });
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
function DrawUIText(t, x, y) {
    t = Censor(unescape(t));
    x = x || 2; y = y || 10;
    const maxWidth = 200;
    const ctx = gameData.ctx["UI"];
    ctx.textAlign = "left";
    ctx.fillStyle = "#000000";
    ctx.font = "16px sans-serif";
    t = t.replace(/{doc}/g, ",").replace(/{sos}/g, "").replace(/{g}/g, "g").replace(/{Emo}/g, "Emo");
    const ddy = 16, ts = t.split(" ");
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
function DrawLeftText(t, x, y) {
    t = Censor(unescape(t));
    const size = 12, maxWidth = 196;
    x = x || 2; y = y || 10;
    const ctx = gameData.ctx["people"];
    ctx.textAlign = "left";
    ctx.fillStyle = "#FFFFFF";
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
function DrawCenterText(t, x, y, size, maxWidth, color) {
    t = Censor(unescape(t));
    size = size || 11;
    x = x || 2; y = y || 10;
    maxWidth = maxWidth || (256 - 2 - x);
    const ctx = gameData.ctx["people"];
    ctx.textAlign = "center";
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
function DrawTopText(t) {
    const x = 2, y = 10, maxWidth = 252;
    ClearLayer("textBack");
    ClearLayer("text");
    const ctx = gameData.ctx["text"];
    ctx.textAlign = "left";
    ctx.fillStyle = "#000000";
    ctx.font = "11px sans-serif";
    t = t.replace(/{doc}/g, ",").replace(/{sos}/g, "").replace(/{g}/g, "g").replace(/{Emo}/g, "Emo");
    const ddy = 11, ts = t.split(" ");
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
    gameData.ctx["textBack"].fillRect(0, 0, 256, y + dy + 6);
}
function ClearAllUI() { ClearLayer("UI"); StopPNum(); }
const ClearLayer = layerName => gameData.ctx[layerName].clearRect(0, 0, 256, 224);
function ClearAllLayers() {
    gameData.mouths = [];
    StopPNum();
    for(const key in gameData.ctx) { ClearLayer(key); }
}   