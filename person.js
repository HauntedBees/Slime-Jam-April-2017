function GetHobbies() {
    const h = [];
    let amt = IRange(1, 4);
    while(amt-- > 0) { h.push(ArrRand(hobbies)); }
    return [...new Set(h)];
}

function Censor(t) {
    if(!gameData.censored) { return t; }
    return t.replace(/fuck/gi, "heck")
            .replace(/shit/gi, "poop")
            .replace(/bastard/gi, "bully")
            .replace(/Sex/g, "Hugging")
            .replace(/sex/g, "a party")
            .replace(/crotch bulge/g, "abs")
            .replace(/genitals/gi, "good food I will cook for them")
            .replace(/Dildo/g, "Eggplant");
}

function Person(id) {
    this.id = id;
    this.firstName = ArrRand(firstNames);
    this.lastName = ArrRand(lastNames);
    this.job = ArrRand(jobs);
    this.age = Math.random() <= 0.6 ? GaussRange(20, 60) : GaussRange(5, 105);
    this.hometown = ArrRand(cities);
    this.hobbies = GetHobbies();
    this.score = 0;

    this.head = IRange(0, 6);
    this.nose = IRange(0, 17);
    this.eyes = IRange(0, 24);
    this.mouf = IRange(0, 24);
    this.tmouf = (this.mouf === 6) ? 9 : IRange(0, 9);
    this.trait1 = Math.random() >= 0.5 ? IRange(0, 24) : -1;
    this.trait2 = Math.random() > 0.75 ? IRange(0, 24) : -1;
    this.hair = IRange(0, 32);
    this.body = IRange(0, 15);
    this.dHeight = IRange(-25, 10);

    this.voice = IRange(0, gameData.voices.length);
    this.pitch = RoundNear(FRange(0.25, 1.75), 5);
    this.rate = RoundNear(FRange(0.5, 1.25), 5);
    this.quirks = 0; this.subquirk = 0;
    this.Speak = function(t) {
        const curPlayer = gameData.contestants[gameData.currentPlayer];
        let ft = Censor(unescape(t)
            .replace(/{fn}/g, this.firstName)
            .replace(/{ln}/g, this.lastName)
            .replace(/{hfn}/g, gameData.host.firstName)
            .replace(/{hln}/g, gameData.host.lastName)
            .replace(/{cfn}/g, curPlayer.firstName)
            .replace(/{cln}/g, curPlayer.lastName)
            .replace(/{fn0}/g, gameData.contestants[0].firstName)
            .replace(/{fn1}/g, gameData.contestants[1].firstName)
            .replace(/{fn2}/g, gameData.contestants[2].firstName));
        ft = ProcessQuirks(ft, this.quirks, this.subquirk);
        const written = this.firstName + ": " + ft.replace(/{doc}/g, ",").replace(/{sos}/g, "").replace(/{g}/g, "g").replace(/{Emo}/g, "Emo").replace(/{dr}/g, "Dr. ");
        const spoken = ft.replace(/{doc}/g, "").replace(/{sos}/g, " ").replace(/___/g, "blank").replace(/{g}/g, "juh").replace(/{Emo}/g, "eemo").replace(/{dr}/g, "Doctor ")
                         .replace(/1600/g, "sixteen hundred");
        return new Promise((resolve, reject) => {
            const msg = new SpeechSynthesisUtterance();
            const me = this;
            msg.rate = this.rate;
            msg.pitch = this.pitch;
            msg.voice = gameData.voices[this.voice];
            msg.text = spoken;
            msg.onend = function() { me.SetTalking(false); resolve(); }
            msg.onerror = function() { reject(); };
            speechSynthesis.speak(msg);
            this.SetTalking(true);
            DrawTopText(written);
        });
    };
    this.SetTalking = function(t) {
        const mouth = gameData.mouths.filter(e => e.id === this.id);
        if(mouth.length !== 1) { return; }
        mouth[0].talking = t;
        if(!t) { mouth[0].open = false; }
    }
}
