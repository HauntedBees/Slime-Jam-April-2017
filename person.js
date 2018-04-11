function GetHobbies() {
    const h = [];
    let amt = IRange(1, 4);
    while(amt-- > 0) { h.push(ArrRand(hobbies)); }
    return [...new Set(h)];
}

function Person() {
    this.firstName = ArrRand(firstNames);
    this.lastName = ArrRand(lastNames);
    this.job = ArrRand(jobs);
    this.age = Math.random() <= 0.6 ? GaussRange(20, 60) : GaussRange(5, 105);
    this.hometown = ArrRand(cities);
    this.hobbies = GetHobbies();
    
    this.score = 0;

    this.head = IRange(0, 6);
    this.nose = IRange(0, 12);
    this.eyes = IRange(0, 12);
    this.mouf = IRange(0, 12);

    this.voice = IRange(0, gameData.voices.length);
    this.pitch = RoundNear(FRange(0.25, 1.75), 5);
    this.rate = RoundNear(FRange(0.5, 1.25), 5);

    this.Speak = function(t) {
        const curPlayer = gameData.contestants[gameData.currentPlayer];
        const ft = t
            .replace(/{fn}/g, this.firstName)
            .replace(/{ln}/g, this.lastName)
            .replace(/{hfn}/g, gameData.host.firstName)
            .replace(/{hln}/g, gameData.host.lastName)
            .replace(/{cfn}/g, curPlayer.firstName)
            .replace(/{cln}/g, curPlayer.lastName);
        const written = this.firstName + ": " + ft.replace(/{doc}/g, ",").replace(/{sos}/g, "");
        const spoken = ft.replace(/{doc}/g, "").replace(/{sos}/g, " ").replace(/___/g, "blank");
        return new Promise((resolve, reject) => {
            const msg = new SpeechSynthesisUtterance();
            msg.rate = this.rate;
            msg.pitch = this.pitch;
            msg.voice = gameData.voices[this.voice];
            msg.text = spoken;
            msg.onend = function() { resolve(); }
            msg.onerror = function() { reject(); };
            speechSynthesis.speak(msg);
            DrawText(written);
        });
    };
}