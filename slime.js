const gameData = {
    voices: [], sheets: {}, ctx: {},
    host: null, contestants: [],
    isTalking: false
};
function SlimeInit() {
    gameData.voices = speechSynthesis.getVoices();
    const sheets = ["heads"];
    let sheetsRemaining = sheets.length;
    sheets.forEach(p => {
        const img = new Image();
        img.onload = function() {
            gameData.sheets[p] = this;
            if(--sheetsRemaining === 0) {
                SlimeInitComplete();
            }
        };
        img.src = "img/" + p + ".png";
    });
    const layers = ["background", "people", "text"];
    layers.forEach(p => {
        const e = document.getElementById(p);
        gameData.ctx[p] = e.getContext("2d");
    });
}
function SlimeInitComplete() {
    gameData.voices = speechSynthesis.getVoices().filter(l => l.lang.indexOf("en") === 0);
    gameData.host = new Person();
    gameData.host.rate = 1; gameData.host.pitch = 0.69;
    gameData.contestants = [new Person(), new Person(), new Person()];
    DrawPeople();
    gameData.host.Speak("Hello and welcome to another exciting episode of Wheel of Slime! I'm your host, {fn} {ln}! Tonight's guests are...")
    .then(() => gameData.host.Speak(GetSummary(gameData.contestants[0])))
    .then(() => gameData.contestants[0].Speak(ArrRand(openingLines)))
    .then(() => gameData.host.Speak(GetSummary(gameData.contestants[1])))
    .then(() => gameData.contestants[1].Speak(ArrRand(openingLines)))
    .then(() => gameData.host.Speak(" and " + GetSummary(gameData.contestants[2])))
    .then(() => gameData.contestants[2].Speak(ArrRand(openingLines)))
    .then(() => gameData.host.Speak("Let's have some fun!"));
}

function GetSummary(p) {
    let str = p.firstName + " " + p.lastName + ", a" + (IntVowelStart(p.age) ? "n " : " ") + p.age + " year old " + p.job + " from " + p.hometown.replace(", ", "{doc} ");
    if(p.hobbies.length === 1) {
        str += " who enjoys " + p.hobbies[0] + ".";
    } else {
        str += " whose hobbies include";
        for(let i = p.hobbies.length - 1; i > 0; i--) {
            str += " " + p.hobbies[i] + ",";
        }
        str += " and " + p.hobbies[0] + ".";
    }
    return str;
}

const vowels = ["a", "e", "i", "o", "u"];
const VowelStart = s => vowels.indexOf(s[0]) >= 0;
const IntVowelStart = i => {
    switch(i) {
        case 8:
        case 11: return true;
    }
    return ("" + i)[0] === "8";
};