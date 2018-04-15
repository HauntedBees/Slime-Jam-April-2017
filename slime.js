const gameData = {
    voices: [], sheets: {}, ctx: {},
    host: null, contestants: [],
    isTalking: false, censored: false, 
    waitingAction: undefined,
    currentPlayer: 0, numPlayers: 3, 
    currentRound: 0, numRounds: 5,
    wheelSpinIdx: -1, pnumIdx: -1, 
    mouths: [], mouthIdx: -1, 
    slimeIdx: -1, NPCIdx: -1,
    currentCategory: undefined,
    currentQuestion: undefined, 
    currentSentence: undefined, 
    currentDatingQ: false, 
    datingPlayer: -1, 
    datingChoices: [], 
    dilemmaBuddy: -1, 
    dilemmaChoiceA: -1, dilemmaChoiceB: -1, 
    hasAnnouncedCategories: false, 
    hasAnnouncedSentence: false, 
    hasAnnouncedPrisoner: false, 
    endIt: false, wheelSpinning: false, 
    SendMessage: function(key) {
        let value = -1;
        switch(key) {
            case "1":
            case "A":
            case "Gamepad0": value = 0; break;
            case "2":
            case "B":
            case "Gamepad1": value = 1; break;
            case "3":
            case "X": 
            case "Gamepad2": value = 2; break;
            case "4":
            case "Y": 
            case "Gamepad3": value = 3; break;
            case " ":
            case "Gamepad9": if(gameData.wheelSpinning) { gameData.endIt = true; } speechSynthesis.cancel(); break;
        }
        if(value < 0 || gameData.waitingAction === undefined) { return; }
        gameData.waitingAction(value);
    }
};
function SlimeInit() {
    gameData.voices = speechSynthesis.getVoices();
    const sheets = ["heads", "hair", "bodies", "blobs",
                    "bg", "wheel", "thwuck", "logo", "playericons", "host",
                    "booth", "board", "screen", "buttons",
                    "words", "wordtile", "wordtilesm",
                    "q_bb", "q_ch", "q_dq", "q_dt", "q_ff", "q_fl", "q_gb", "q_gs", "q_mc", "q_yi"];
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
    const layers = ["background", "people", "mouf", "slimeParty", "UI", "pnum", "textBack", "text"];
    layers.forEach(p => {
        const e = document.getElementById(p);
        gameData.ctx[p] = e.getContext("2d");
    });
    gameData.ctx["textBack"].fillStyle = "#9999FFCC";
    document.addEventListener("keypress", input.KeyPress);
    window.addEventListener("gamepadconnected", input.GamepadConnected);
    window.addEventListener("gamepaddisconnected", input.GamepadDisconnected);
}
function SlimeInitComplete() {
    gameData.voices = speechSynthesis.getVoices().filter(l => l.lang.indexOf("en") === 0);
    gameData.host = new Person(-1);
    gameData.host.job = "Game Show Host";
    gameData.host.head = 4;
    gameData.host.rate = 1.2; gameData.host.pitch = 0.69;
    gameData.contestants = [new Person(0), new Person(1), new Person(2)];
    gameData.mouthIdx = setInterval(DrawMouths, 250);

    // Setting up Question Segment
    gameData.categories = [];
    const curCats = [...categories];
    let numCats = 4;
    while(numCats-- > 0) {
        const cat = questions[curCats.splice(IRange(0, curCats.length), 1)[0]];
        const newCat = { name: cat.displayName, questions: [] };
        const curQs = [...cat.questions];
        let numQs = 4;
        while(numQs-- > 0) {
            const q = curQs.splice(IRange(0, curQs.length), 1)[0];
            Shuffle(q.answers);
            newCat.questions.push(q);
        }
        gameData.categories.push(newCat);
    }
    
    // Setting up Sentence Segment
    const sFull = ArrRand(sentences);
    const s = sFull.text;
    gameData.currentSentence = { full: sFull, guessedLetters: [], populated: "", remainingLetters: [] };
    gameData.currentSentence.populated = s.replace(/[A-Za-z]/g, "_");
    gameData.currentSentence.remainingLetters = [...new Set(s.replace(/[^A-Za-z]/g, "").toLowerCase())];

    ShowTitleScreen();
}
function CPUAction() {
    if(gameData.waitingAction !== undefined && gameData.currentPlayer >= gameData.numPlayers) {
        gameData.waitingAction(IRange(0, 4));
    }
}

function ShowTitleScreen() {
    const logo = gameData.sheets["logo"];
    DrawImage("background", gameData.sheets["words"], 0, 0, fullScreenDims);
    DrawImage("people", logo, 0, -40, { x: 0, y: 0, w: 341, h: 299, dw: 256, dh: 224 });
    SetTitleScreenOptions(["1 Player", "2 Player", "3 Player", "No Player"]);
    gameData.ctx["textBack"].fillRect(0, 145, 256, 60);
    gameData.waitingAction = PickNumPlayers;
}
function SetTitleScreenOptions(opts, justTwo) {
    ClearLayer("UI");
    for(let i = 0; i < opts.length; i++) {
        const iter = (justTwo && i == 1 ? 2 : i);
        const x = 38 + ((iter % 2) * 120);
        const y = 165 + Math.floor(iter / 2) * 30;
        DrawUIText(`${i + 1}. ${opts[i]}`, x, y);
        DrawButton(i, x - 23, y - 15, true);
    }
}
function PickNumPlayers(idx) {
    ClearAction();
    gameData.numPlayers = idx === 3 ? 0 : (idx + 1);
    SetTitleScreenOptions(["5 Rounds", "10 Rounds", "15 Rounds", "20 Rounds"]);
    gameData.waitingAction = PickNumRounds;
}
function PickNumRounds(idx) {
    ClearAction();
    gameData.numRounds = 5 + idx * 5;
    SetTitleScreenOptions(["No Potty Words", "Potty Words"], true);
    gameData.waitingAction = PickCensor;
}
function PickCensor(idx) {
    if(idx >= 2) { return; }
    ClearAction();
    gameData.censored = (idx === 0);
    ClearAllLayers();
    StartAnnouncement();
}

function StartAnnouncement() {
    gameData.NPCIdx = setInterval(CPUAction, 600);
    DrawGenBG();
    DrawHost(100, 60);
    gameData.host.Speak("Hello and welcome to another exciting episode of Wheel of Slime! I'm your host, {fn} {ln}! Tonight's guests are...")
    .then(() => {
        ClearAllLayers();
        DrawGenBG();
        DrawPerson(gameData.contestants[0], 120, 70);
        DrawPNum(92, 160, gameData.numPlayers >= 1 ? 0 : 3, false);
        return gameData.host.Speak(GetSummary(gameData.contestants[0]));
    })
    .then(() => gameData.contestants[0].Speak(ArrRand(openingLines)))
    .then(() => {
        ClearAllLayers();
        DrawGenBG();
        DrawPerson(gameData.contestants[1], 120, 70);
        DrawPNum(92, 160, gameData.numPlayers >= 2 ? 1 : 3, false);
        return gameData.host.Speak(GetSummary(gameData.contestants[1]));
    })
    .then(() => gameData.contestants[1].Speak(ArrRand(openingLines)))
    .then(() => {
        ClearAllLayers();
        DrawGenBG();
        DrawPerson(gameData.contestants[2], 120, 70);
        DrawPNum(92, 160, gameData.numPlayers >= 3 ? 2 : 3, false);
        return gameData.host.Speak("and " + GetSummary(gameData.contestants[2]));
    })
    .then(() => gameData.contestants[2].Speak(ArrRand(openingLines)))
    .then(() => {
        ClearAllLayers();
        DrawGenBG();
        DrawHost(100, 60);
        return gameData.host.Speak("Let's have some fun! {cfn}, you're up first! Spin the Wheel of Slime!");
    })
    .then(SetToSpin);
}
function GetSummary(p) {
    let str = ArrRand(introductions).replace(/{fn}/g, p.firstName).replace(/{ln}/g, p.lastName).replace(/{age}/g, p.age).replace(/{city}/g, p.hometown.replace(", ", "{doc} "))
                                    .replace(/{job}/g, p.job).replace(/{n}/g, (IntVowelStart(p.age) ? "n" : ""));
    if(p.hobbies.length === 1) {
        str += " who enjoys " + p.hobbies[0] + ".";
    } else if(p.hobbies.length === 2) {
        str += " whose hobbies include " + p.hobbies[0] + " and " + p.hobbies[1] + ".";
    } else {
        str += " whose hobbies include";
        for(let i = p.hobbies.length - 1; i > 0; i--) {
            str += " " + p.hobbies[i] + ",";
        }
        str += " and " + p.hobbies[0] + ".";
    }
    return str;
}