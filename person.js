const GaussRand = () => {
    let r = 0;
    for(let i = 0; i < 6; i++) { r += Math.random(); }
    return r / 6;
};
const GaussRange = (min, max) => min + Math.floor(GaussRand() * (max - min));
const Range = (min, max) => min + Math.floor(Math.random() * (max - min));
const FRange = (min, max) => min + Math.random() * (max - min);
const RoundNear = (x, n) => Math.round(x * n) / n;
const ArrRand = arr => arr[Range(0, arr.length)];

function GetHobbies() {
    const h = [];
    let amt = Range(1, 4);
    while(amt-- > 0) { h.push(ArrRand(hobbies)); }
    return [...new Set(h)];
}

function Person() {
    this.firstName = ArrRand(firstNames);
    this.lastName = ArrRand(lastNames);
    this.job = ArrRand(jobs);
    this.age = Math.random() <= 0.6 ? GaussRange(20, 60) : GaussRange(16, 105);
    this.hometown = ArrRand(cities);
    this.hobbies = GetHobbies();
    
    this.head = Range(0, 6);
    this.nose = Range(0, 12);
    this.eyes = Range(0, 12);
    this.mouf = Range(0, 12);

    this.voice = Range(0, gameData.voices.length);
    this.pitch = RoundNear(FRange(0.25, 1.75), 5);
    this.rate = RoundNear(FRange(0.5, 1.25), 5);

    this.Speak = function(t) {
        const ft = t
            .replace(/{fn}/g, this.firstName)
            .replace(/{ln}/g, this.lastName)
            .replace(/{hfn}/g, gameData.host.firstName)
            .replace(/{hln}/g, gameData.host.lastName);
        const written = ft.replace(/{doc}/g, ",").replace(/{sos}/g, "");
        const spoken = ft.replace(/{doc}/g, "").replace(/{sos}/g, " ");
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
    }


    
    this.SpeakX = function(t) {
        if(gameData.isTalking) { return; }
        gameData.isTalking = true;
        speechSynthesis.cancel();
        const msg = new SpeechSynthesisUtterance();
        msg.rate = this.rate;
        msg.pitch = this.pitch;
        msg.voice = gameData.voices[this.voice];
        msg.text = t;
        msg.onend = function() {
            gameData.isTalking = false;
        }
        speechSynthesis.speak(msg);
    };
}