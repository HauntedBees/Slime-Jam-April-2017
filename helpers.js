const GaussRand = () => {
    let r = 0;
    for(let i = 0; i < 6; i++) { r += Math.random(); }
    return r / 6;
};
const GaussRange = (min, max) => min + Math.floor(GaussRand() * (max - min));
const IRange = (min, max) => min + Math.floor(Math.random() * (max - min));
const FRange = (min, max) => min + Math.random() * (max - min);
const RoundNear = (x, n) => Math.round(x * n) / n;
const ArrRand = arr => arr[IRange(0, arr.length)];
function Shuffle(a) {
    for (let i = a.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
}

const ClearAction = () => gameData.waitingAction = undefined;

const vowels = ["a", "e", "i", "o", "u"];
const VowelStart = s => vowels.indexOf(s[0]) >= 0;
const IntVowelStart = i => {
    switch(i) {
        case 8:
        case 11: return true;
    }
    return ("" + i)[0] === "8";
};