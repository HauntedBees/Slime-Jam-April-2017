const gameData = {
    voices: [], sheets: {}, ctx: {},
    host: null, contestants: [],
    isTalking: false,
    currentPlayer: 0, currentRound: 0,
    currentCategory: undefined,
    currentQuestion: undefined, 
    currentSentence: undefined, 
    currentDatingQ: false, 
    datingPlayer: -1, 
    datingChoices: [], 
    waitingAction: undefined,
    hasAnnouncedCategories: false, 
    hasAnnouncedSentence: false, 
    SendMessage: function(key) {
        let value = -1;
        switch(key) {
            case "1":
            case "Gamepad0": value = 0; break;
            case "2":
            case "Gamepad1": value = 1; break;
            case "3":
            case "Gamepad2": value = 2; break;
            case "4":
            case "Gamepad3": value = 3; break;
            case " ":
            case "Gamepad9": speechSynthesis.cancel(); break;
        }
        if(value < 0 || gameData.waitingAction === undefined) { return; }
        gameData.waitingAction(value);
    }
};
function SlimeInit() {
    gameData.voices = speechSynthesis.getVoices();
    const sheets = ["heads", 
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
    const layers = ["background", "people", "UI", "text"];
    layers.forEach(p => {
        const e = document.getElementById(p);
        gameData.ctx[p] = e.getContext("2d");
    });
    document.addEventListener("keypress", input.KeyPress);
    window.addEventListener("gamepadconnected", input.GamepadConnected);
    window.addEventListener("gamepaddisconnected", input.GamepadDisconnected);
}
function SlimeInitComplete() {
    gameData.voices = speechSynthesis.getVoices().filter(l => l.lang.indexOf("en") === 0);
    gameData.host = new Person();
    gameData.host.rate = 1; gameData.host.pitch = 0.69;
    gameData.contestants = [new Person(), new Person(), new Person()];

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
    //AnnounceSentence();
    StartAnnouncement();
}

function StartAnnouncement() {
    DrawPeople();
    gameData.host.Speak("Hello and welcome to another exciting episode of Wheel of Slime! I'm your host, {fn} {ln}! Tonight's guests are...")
    .then(() => gameData.host.Speak(GetSummary(gameData.contestants[0])))
    .then(() => gameData.contestants[0].Speak(ArrRand(openingLines)))
    .then(() => gameData.host.Speak(GetSummary(gameData.contestants[1])))
    .then(() => gameData.contestants[1].Speak(ArrRand(openingLines)))
    .then(() => gameData.host.Speak("and " + GetSummary(gameData.contestants[2])))
    .then(() => gameData.contestants[2].Speak(ArrRand(openingLines)))
    .then(() => gameData.host.Speak("Let's have some fun! {cfn}, you're up first! Spin the Wheel of Slime!"))
    .then(() => gameData.waitingAction = Spin);
}
function GetSummary(p) {
    let str = p.firstName + " " + p.lastName + ", a" + (IntVowelStart(p.age) ? "n " : " ") + p.age + " year old " + p.job + " from " + p.hometown.replace(", ", "{doc} ");
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