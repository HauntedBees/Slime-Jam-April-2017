function Spin() {
    ClearAction();
    ClearAllLayers();
    DrawGenBG();
    let angle = IRange(0, 360), numAttempts = 20;
    while(!IsAcceptableSpinChoice(angle) && numAttempts-- > 0) { angle = IRange(0, 360); }
    if(numAttempts === 0) { angle = IRange(162, 325) }
    const drawAngle = (IRange(0, 2) * 360) + angle;
    let curAngle = 0;
    gameData.wheelSpinning = true;
    gameData.wheelSpinIdx = setInterval(function() {
        if(gameData.endIt) {
            curAngle = drawAngle;
            DrawWheel(curAngle, true);
            gameData.endIt = false;
        }
        if(curAngle >= drawAngle) { // spinning complete
            clearInterval(gameData.wheelSpinIdx);
            DrawWheel(curAngle, true);
            gameData.wheelSpinning = false;
            gameData.wheelSpinIdx = -1;
            RevealSpinChoice(angle);
        } else { // still spinning
            const dAmount = Math.max(0.15, Math.min(2, 2 * (1 - Math.pow(curAngle / drawAngle, 2))));
            curAngle += dAmount;
            DrawWheel(curAngle);
        }
    }, 10);
    DrawWheel();
}
function RevealSpinChoice(angle) {
    if(angle <= 36 || angle > 324) {
        if(gameData.hasAnnouncedCategories) { ChooseCategory(); }
        else { AnnounceCategories(); }
    } else if(angle <= 72) {
        AnnounceDating();
    } else if(angle <= 144) {
        if(gameData.hasAnnouncedSentence) { ChooseSentence(); }
        else { AnnounceSentence(); }
    } else if(angle <= 162) {
        AnnounceSmallTalk();
    } else if(angle <= 216) {
        AnnounceSlime();
    } else if(angle <= 234) {
        AnnounceQuirk(0);
    } else if(angle <= 288) {
        AnnounceVacuum();
    } else if(angle <= 324) {
        if(gameData.hasAnnouncedPrisoner) { OuterChooseDilemma(); }
        else { AnnounceDilemma(); }
    }
}
function IsAcceptableSpinChoice(angle) {
    if(angle <= 36 || angle > 324) {
        return gameData.categories.some(e => e.questions.length > 0);
    } else if(angle <= 72) {
        return dating.length > 0;
    } else if(angle <= 144) {
        return gameData.currentSentence.remainingLetters.length > 0;
    } else {
        return true;
    }
}

function AnnounceSmallTalk() {
    ClearAllLayers();
    DrawGenBG();
    DrawHost(50, 60);
    const player = gameData.contestants[gameData.currentPlayer];
    DrawPerson(player, 150, 60, false);
    gameData.host.Speak("\"Small talk!\" So, uh, what's new with you?")
    .then(() => {
        const hob1 = ArrRand(player.hobbies);
        let hob2 = ArrRand(player.hobbies);
        if(player.hobbies.length === 1) {
            hob2 = "Slime";
        } else if(hob1 === hob2) {
            hob2 = ArrRand(player.hobbies);
            if(hob1 === hob2) { hob2 = "Slime"; }
        }
        const str = ArrRand(stTopics).replace(/{h}/g, hob1).replace(/{dh}/g, hob2).replace(/{obj}/g, ArrRand(objects));
        return player.Speak(str);
    })
    .then(() => gameData.host.Speak(ArrRand(stResponses)))
    .then(() => player.Speak(ArrRand(stCounters)))
    .then(() => AdvancePlayer(ArrRand(stEndings)));
}

// Slime Vacuum
function AnnounceVacuum() {
    gameData.host.Speak("Oh dear... The \"Slime Vacuum.\" That means you lose half of your Slime Points, plus another 100 on top of that!")
    .then(() => gameData.contestants[gameData.currentPlayer].Speak(ArrRand(vacuumReply)))
    .then(() => {
        const score = Math.round(gameData.contestants[gameData.currentPlayer].score / 2) - 100;
        gameData.contestants[gameData.currentPlayer].score += score;
        return AdvancePlayer("Your new score is " + score + " Slime Points! Better luck next round!");
    });
}

// Slime Prisoner's Dilemma
function AnnounceDilemma() {
    gameData.hasAnnouncedPrisoner = true;
    const contestants = [0, 1, 2];
    contestants.splice(gameData.currentPlayer, 1);
    gameData.dilemmaBuddy = ArrRand(contestants);
    gameData.host.Speak("Oh ho ho! The \"Slime Prisoner's Dilemma!\" {cfn}, you and {fn" + gameData.dilemmaBuddy + "} are about to slime up... or slime down!!")
    .then(() => {
        ClearAllLayers();
        DrawPeople();
        return gameData.host.Speak("You will both be given a chance to choose COOPERATE, DEFECT, or SLIME.");
    })
    .then(() => gameData.host.Speak("If you both COOPERATE, you will both gain 400 Slime Points!"))
    .then(() => gameData.host.Speak("If you both DEFECT, you will both lose 100 Slime Points!"))
    .then(() => gameData.host.Speak("BUT... if one of you COOPERATES and one of you DEFECTS... the DEFECTOR will gain 800 Slime Points while the COOPERATOR loses 200!"))
    .then(() => gameData.host.Speak("As for SLIME, well, we all know what SLIME does!"))
    .then(() => gameData.host.Speak("So now that the rules are out of the way, let's SLIME IT UP!"))
    .then(ChooseDilemma);
}
function OuterChooseDilemma() {
    const contestants = [0, 1, 2];
    contestants.splice(gameData.currentPlayer, 1);
    gameData.dilemmaBuddy = ArrRand(contestants);
    gameData.host.Speak("The \"Slime Prisoner's Dilemma!\" {cfn}, you and {fn" + gameData.dilemmaBuddy + "} are about to slime up... or slime down!!")
    .then(ChooseDilemma);
}
function SetUpDilemmaDisplay() {
    ClearAllLayers();
    DrawImage("background", gameData.sheets["screen"], 0, 0, fullScreenDims);
    DrawLeftText("Both COOPERATE to gain 400 points. Both DEFECT to lose 100 points. DEFECT and COOPERATE to get 800 and lose 200 points respectively!", 30, 50);
    DrawLeftText("1. COOPERATE.", 30, 125);
    DrawLeftText("2. DEFECT", 30, 160);
    DrawLeftText("3. SLIME", 30, 195);
    for(let i = 0; i < 3; i++) { DrawButton(i, 4, 110 + i * 35, true); }
}
function ChooseDilemma() {
    gameData.host.Speak("{fn" + gameData.dilemmaBuddy + "}, close your eyes while {cfn} makes their choice!")
    .then(() => gameData.host.Speak("Alright, {cfn}, make your choice!"))
    .then(() => {
        SetUpDilemmaDisplay();
        ReadyCurrentPlayer();
        gameData.waitingAction = FirstDilemmaSelect;
    });
}
function FirstDilemmaSelect(idx) {
    if(idx >= 3) { return; }
    ClearAction();
    gameData.dilemmaChoiceA = idx;
    ClearAllLayers();
    DrawPeople();
    gameData.host.Speak("Excellent. {fn" + gameData.dilemmaBuddy + "}, open your eyes! Now it's your turn to pick! {cfn}, close your eyes!")
    .then(() => gameData.host.Speak("Alright, {fn" + gameData.dilemmaBuddy + "}, make your choice!"))
    .then(() => {
        SetUpDilemmaDisplay();
        ReadyCurrentPlayer();
        gameData.waitingAction = SecondDilemmaSelect;
    });
}
function SecondDilemmaSelect(idx) {
    if(idx >= 3) { return; }
    ClearAction();
    gameData.dilemmaChoiceB = idx;
    ClearAllLayers();
    DrawPeople();
    gameData.host.Speak("Excellent. {cfn}, you can open your eyes now! It's time to see the results! You chose...")
    .then(() => {
        const choiceA = ["Collaborate", "Defect", "Slime"][gameData.dilemmaChoiceA];
        const choiceB = ["Collaborate", "Defect", "Slime"][gameData.dilemmaChoiceB];
        return gameData.host.Speak(choiceA + " and " + choiceB + "!");
    })
    .then(() => {
        if(gameData.dilemmaChoiceA === gameData.dilemmaChoiceB) {
            if(gameData.dilemmaChoiceA === 0) { // both collaborated!
                gameData.lastDilState = 0;
                gameData.contestants[gameData.currentPlayer].score += 400;
                gameData.contestants[gameData.dilemmaBuddy].score += 400;
                return gameData.host.Speak("How friendly! Truly we are blessed by trust on this lovely night. You both gain 400 Slime Points!");
            } else if(gameData.dilemmaChoiceA === 1) { // both defected!
                gameData.lastDilState = 1;
                gameData.contestants[gameData.currentPlayer].score -= 100;
                gameData.contestants[gameData.dilemmaBuddy].score -= 100;
                return gameData.host.Speak("How sad! You both lose 100 Slime Points! Y'all need to learn how to trust!");
            } else { // both slimed!
                gameData.lastDilState = 2;
                const newScore = 1000 + Math.max(gameData.contestants[0].score, gameData.contestants[1].score, gameData.contestants[2].score);
                gameData.contestants.forEach(e => e.score = newScore);
                return gameData.host.Speak("Slimetastic! You both chose SLIME! Now EVERYONE has " + newScore + " Slime Points! Universal Basic Slime-come!");
            }
        } else {
            if(gameData.dilemmaChoiceA === 0) { // A chose COLLABORATE
                if(gameData.dilemmaChoiceB === 1) { // but B chose DEFECT
                    gameData.lastDilState = 3;
                    gameData.contestants[gameData.currentPlayer].score -= 200;
                    gameData.contestants[gameData.dilemmaBuddy].score += 800;
                    return gameData.host.Speak("Harsh! But that means {fn" + gameData.dilemmaBuddy + "} gains 800 Slime Points while {cfn} loses 200!");
                } else { // but B chose SLIME
                    gameData.lastDilState = 4;
                    gameData.contestants[gameData.currentPlayer].score += 400;
                    return gameData.host.Speak("{cfn} collaborates with the slime and gets 400 Slime Points!");
                }
            } else if(gameData.dilemmaChoiceA === 1) { // A chose DEFECT
                if(gameData.dilemmaChoiceB === 0) { // but B chose COLLABORATE
                    gameData.lastDilState = 5;
                    gameData.contestants[gameData.currentPlayer].score += 800;
                    gameData.contestants[gameData.dilemmaBuddy].score -= 200;
                    return gameData.host.Speak("Harsh! But that means {cfn} gains 800 Slime Points while {fn" + gameData.dilemmaBuddy + "} loses 200!");
                } else { // but B chose SLIME
                    gameData.lastDilState = 6;
                    const prevScore = gameData.contestants[gameData.currentPlayer].score;
                    gameData.contestants[gameData.currentPlayer].score = Math.floor(gameData.contestants[gameData.currentPlayer].score / 10);
                    const newScore = prevScore - gameData.contestants[gameData.currentPlayer].score;
                    return gameData.host.Speak("{cfn} defects from the slime and loses " + newScore + " Slime Points!");
                }
            } else { // A chose SLIME
                if(gameData.dilemmaChoiceB === 0) { // but B chose COLLABORATE
                    gameData.lastDilState = 7;
                    gameData.contestants[gameData.dilemmaBuddy].score += 400;
                    return gameData.host.Speak("{fn" + gameData.dilemmaBuddy + "} collaborates with the slime and gets 400 Slime Points!");
                } else { // but B chose DEFECT
                    gameData.lastDilState = 8;
                    const prevScore = gameData.contestants[gameData.dilemmaBuddy].score;
                    gameData.contestants[gameData.dilemmaBuddy].score = Math.floor(gameData.contestants[gameData.dilemmaBuddy].score / 10);
                    const newScore = prevScore - gameData.contestants[gameData.dilemmaBuddy].score;
                    return gameData.host.Speak("{fn" + gameData.dilemmaBuddy + "} defects from the slime and loses " + newScore + " Slime Points!");
                }
            }
        }
    })
    .then(() => {
        let responseArray = ["No comment."];
        switch(gameData.lastDilState) {
            case 0: responseArray = spdC; break;
            case 1: responseArray = spdD; break;
            case 2: responseArray = spdS; break;
            case 3: responseArray = spdWronged; break;
            case 4: responseArray = spdC; break;
            case 5: responseArray = spdWronging; break;
            case 6: responseArray = spdSlimed; break;
            case 7: responseArray = spdS; break;
            case 8: responseArray = spdS; break;
        }
        return gameData.contestants[gameData.currentPlayer].Speak(ArrRand(responseArray));
    })
    .then(() => {
        let responseArray = ["No comment."];
        switch(gameData.lastDilState) {
            case 0: responseArray = spdC; break;
            case 1: responseArray = spdD; break;
            case 2: responseArray = spdS; break;
            case 3: responseArray = spdWronging; break;
            case 4: responseArray = spdS; break;
            case 5: responseArray = spdWronged; break;
            case 6: responseArray = spdS; break;
            case 7: responseArray = spdC; break;
            case 8: responseArray = spdSlimed; break;
        }
        return gameData.contestants[gameData.dilemmaBuddy].Speak(ArrRand(responseArray));
    })
    .then(() => AdvancePlayer("A good time was had by all."));
}

// Freep Hoynts
function AnnounceSlime() {
    gameData.host.Speak(ArrRand(freepAnnounce))
    .then(() => gameData.contestants[gameData.currentPlayer].Speak(ArrRand(freepReply)))
    .then(() => {
        const score = IRange(50, 501);
        gameData.contestants[gameData.currentPlayer].score += score;
        return AdvancePlayer(ArrRand(freepFinal).replace(/{score}/g, score));
    });
}

// Quirk!
const quirks = [
    "You must now pronounce \"ou\" like \"eu!\"",
    "You must now pronounce all plural words with an \"ez!\"",
    "You must now end every sentence with a rhyme!",
    "You can no longer use articles like \"the,\" \"a,\" and \"an!\"",
    "You can't not talk about slime all the time.",
    "Every sentence you speak must be in the form of a question.",
    "You must pronounce every vowel as an \"@.\"",
    "You must get everybody's name wrong."
];
function ProcessQuirks(str, q, sq) {
    str = " " + str;
    if((q & 16) !== 0) { str += " " + ArrRand(randomSlimeComments); }
    if((q & 128) !== 0) {
        str = str.replace(new RegExp(gameData.host.firstName, "gi"), ArrRand(firstNames));
        str = str.replace(new RegExp(gameData.contestants[0].firstName, "gi"), ArrRand(firstNames));
        str = str.replace(new RegExp(gameData.contestants[1].firstName, "gi"), ArrRand(firstNames));
        str = str.replace(new RegExp(gameData.contestants[2].firstName, "gi"), ArrRand(firstNames));
    }
    if((q & 1) !== 0) { str = str.replace(/ou/g, "eu"); }
    if((q & 2) !== 0) { str = str.replace(/([a-z]+?)(s)([^a-z])/gi, "$1ez$3"); }
    if((q & 4) !== 0) { const letter = ArrRand("bcdfghjklmprstvwy"); str = str.replace(/([a-z])([a-z]+)([.!?])/gi, "$1$2-" + letter + "$2$3"); }
    if((q & 8) !== 0) { str = str.replace(/[^a-z]the[^a-z]/gi, " ").replace(/[^a-z]an[^a-z]/gi, " ").replace(/[^a-z]a[^a-z]/gi, " "); }
    if((q & 32) !== 0) { str = str.replace(/[.!]/gi, "?"); }
    if((q & 64) !== 0) {
        const subquirkLC = "aeiou"[sq];
        const subquirkUC = "AEIOU"[sq];
        str = str.replace(/[aeiou]/g, subquirkLC).replace(/[AEIOU]/g, subquirkUC);
    }
    return str.substring(1);
}
function AnnounceQuirk(jeff) {
    const quirkIdx = IRange(0, quirks.length);
    const quirk = Math.pow(2, quirkIdx);
    if((gameData.contestants[gameData.currentPlayer].quirks & quirk) !== 0) { // player already has this quirk!
        if(jeff === 5) { // already tried five times!
            gameData.currentPlayer.score -= 50;
            gameData.host.Speak("You landed on \"Speech Quirks\" but you're already quirky enough! You can pay the quirk tax of 50 points!")
            .then(() => AdvancePlayer(""));
        } else {
            AnnounceQuirk(jeff + 1);
        }
    } else {
        gameData.host.Speak("You landed on \"Speech Quirks!\" For the rest of this game, you will have to speak with the following quirk:")
        .then(() => {
            let qstr = quirks[quirkIdx];
            if(quirkIdx === 6) {
                const subquirkNum = IRange(0, 5);
                gameData.contestants[gameData.currentPlayer].subquirk = subquirkNum;
                qstr = qstr.replace("@", "aeiou"[subquirkNum]);
            }
            return gameData.host.Speak(qstr);
        })
        .then(() => {
            ClearAllLayers();
            DrawPeople();
            gameData.contestants[gameData.currentPlayer].quirks += quirk;
            return gameData.contestants[gameData.currentPlayer].Speak(ArrRand(quirkReactions));
        })
        .then(() => AdvancePlayer(ArrRand(quirkHostReply)));
    }
}

const dating = [
    { q: "It's time for our first date, where are you taking me?", a: [
        "Dinner and a movie!", "A romantic candle-lit dinner.", "Netflix and fuck.", "Coffee and people-watching.",
        "A trip to the art museum.", "Drinks at the bar.", "I know a great music venue downtown!",
        "You can watch me play video games at my apartment.", "We can go to a protest together.",
        "Free some animals from the local animal research lab.", "I'll drive you up to Make-Out Point.",
        "Board games!", "We'd go to the aquarium.", "We can watch my favorite movies: Fight Club, V for Vendetta, and The Dark Knight!",
        "Let's check out the bookstore!", "Cat Cafe.", "I can show you my stand-up routine.",
        "We're robbing a bank.", "Picnic in the park.", "I'll read you my favorite Garfield comics from my collection.",
        "I got an invite to an orgy happening this weekend.", "Let's hit up a party like we're in college!", 
        "We'll go get our slime on!", "We shall submerge ourselves in slime.", "Slime Pit.", "Slime Fiesta!", 
        "Let's watch Vine compilations.", "Cheese tasting.", "Jeff Goldblum Jazz Concert.", "Cry in Albertson's." // thx Cindy, Danielle, & Brandt
    ]},
    { q: "You surprise me with a gift-wrapped box. What is inside it?", a: [
        "Slime.", "Just a big gob of slime.", "Chocolates.", "Taxidermied frog.", "Legally obtained human skull.", "Human skull of unknown origin.",
        "Kelp.", "Fancy jewelry.", "Various fruits.", "Sex toys.", "Lingerie.", "A football.", "Multiple golf balls.", "A nice hat.", "Bread.",
        "A lucky rabbit's foot.", "Garfield comics.", "Flowers.", "Tacos.", "A Linguistics textbook.", "A pail of slime.", "Sand.", "Anime DVDs.", 
        "Whole wheat flour.", "Granola.", "Trail mix.", "A new iPhone!", "Music CDs.", "A tennis racquet.", "Condoms.", "Fancy cheeses.", "An elf.",
        "A kazoo.", "Blood.", "A famous painting I stole.", "Some seashells I found.", "My mixtape.", "Five bucks, mostly in change.", "My heart."
    ]},
    { q: "What are you looking for in a partner?", a: [
        "Someone to come home to.", "Someone to go out with.", "Someone to talk to.", "Someone to have fun with.",
        "Basically just a babysitter I can also have sex with.", "My {g}-{g}-{g}-genitals.", "Someone to share my slime with.", 
        "Someone who's great with kids.", "Someone kind, caring, and hopefully cute.", "I'm looking for someone to settle down with.", 
        "I just want to make out with someone.", "Someone to travel the world with.", "I need someone to help me rob a bank.", 
        "Someone named {cfn}.", "Someone who accepts me for who I am.", "Someone packing some major crotch bulge.", "Nice face, nicer ass.",
        "Someone I can take home to my parents.", "A real cutie.", "Someone who will challenge me intellectually.", "Someone like my dad.", 
        "Several functional organs.", "Someone to build LEGO playsets with.", "Someone to debate comic book lore with.", "A gamer gf.",
        "A goth gf.", "Someone with a lot of money.", "A trophy spouse.", "A slime partner.", "Someone to collect slime with."
    ]},
    { q: "What is your best quality?", a: [
        "My smile.", "My abs.", "My chest.", "My junk.", "I'm a go-getter.", "I'm rich.", "My hair.", "My eyes.", "I can turn into a bear.",
        "My slime.", "My mind.", "I can solve any problem.", "I can grab hard-to-reach items.", "I can open ANY pickle jar.", "I'm like, really hot.",
        "I'm very slimy.", "I'm immortal.", "I'm a great singer.", "I can play four chords on my acoustic guitar.", "I'm funny.", "My personality.",
        "I've got nothing going for me.", "I'm better than nothing.", "I am full of slime.", "I will make you look better in comparison.",
        "I'm amazing in bed.", "I can recite the alphabet backwards.", "I'm a clever linguist.", "I can see really well in in low-light environments.",
        "I'm very good at telling stories.", "I can jump really high.", "I can drink a lot without getting drunk.", "I bleed slime.", "I look good in tight underwear."
    ]},
    { q: "What's something you've always wanted to do?", a: [
        "Die.", "Get married.", "Acquire large amounts of slime.", "Become slime.", "Be elected president.", "Own a house.", 
        "Win the lottery.", "Start a band.", "Write a book.", "Be a movie star.", "Get to first base.", "Catch all the Pok%E9mon.", 
        "Become a famous chef.", "Date a supermodel.", "Go to outer space.", "Find Bigfoot.", "Kiss Bigfoot.", "Eat a lot of pasta.", 
        "Paint a masterpiece.", "Commit tax fraud.", "Get a PhD.", "Cure cancer.", "Throw a pie at Bill Gates.", "Overthrow the government.",
        "Find a mermaid.", "Win \"Wheel of Slime.\"", "Get banned from a sports stadium.", "Become a professional athlete.", "Shave.",
        "Become a superhero.", "Find the Fountain of Youth.", "Make a really popular post on Twitter.", "Beat my dad at arm wrestling."
    ]},
    { q: "What makes you laugh?", a: [
        "Slime.", "Cute animals being silly.", "Adam Sandler.", "Comedy movies.", "Swear words.", "Babies doing silly things.", "Practical jokes.",
        "People getting hurt.", "Cartoons.", "Garfield comics.", "Memes.", "Pictures of fat cats.", "Awkward social interactions.", "Knock-knock jokes.", 
        "Bad Puns.", "Funny words like \"spork\" and \"brontubisto.\"", "\"Tutant Meenage Neetle Teetles.\"", "Edgy controversial humor.", "Golf.",
        "Bad Text-to-Speech Video Games.", "The Simpsons before it got bad.", "\"Steamed Hams.\"", "Le epic gamer memes.", "Guys awkwardly trying to flirt with me.",
        "Eggs rolling down stairs.", "Funny faces.", "Political cartoons.", "Parody songs.", "Vine compilations.", "YouTube celebrities."
    ]},
    { q: "What is your worst quality?", a: [
        "I own a nonzero amount of Bitcoin.", "I don't have enough slime.", "I have too much slime.", "I'm not made of slime.", "I'm dead inside.", 
        "I have no empathy for other humans.", "My farts smell really bad.", "I get angry too quickly.", "I forget to shower sometimes.", "I still like ska.",
        "I am bad at the sex.", "I don't like Garfield the cat.", "I don't pay attention when other people are talking.", "I'm too antisocial.", 
        "I didn't vote for Susan McSlime in the last election.", "I care way too much about video games.", "I send death threats on Twitter.", "I hate slime.", 
        "I'm self-conscious about my eleventh toe.", "I am playing this game right now.", "I drink too much water so I'm always peeing.", "Bad body odor.", 
        "I only have five of the required seven Dragon Balls.", "I'm very bad at dancing.", "I complain about millennials on Facebook all day.", 
        "I spent all my money on avocado toast.", "I spent all my money on in-app purchases.", "I say mean things and then tell people they're too easily offended.",
        "I talk about myself too much.", "I only care about other people if it benefits me.", "I'm literally a demon in a human's body."
    ]},
    { q: "If you won a million dollars, what would you do with it?", a: [
        "Convert it all to Bitcoin!", "Rent a studio apartment in California for like a year or two.", "Buy a house.", "Put it in savings.", 
        "Donate it all to charity!", "Spend it all on slime.", "Donate it to the American Slime Association.", "Buy a yacht.", "Put it on the stock market!", 
        "Travel the world.", "Head to Las Vegas!", "Buy a really nice hat.", "Immediately lose all of it in a freak accident.", "Buy several new cars.", 
        "Make my friends compete with each other to earn some of it.", "Acquire so much pasta.", "Retire early.", "Extended vacation.", "Seduce people who like money.", 
        "Bribe some politicians.", "Commission some art.", "Burn it all.", "Invest it.", "Give it to my friends and family.", "Buy many gifts for my partner.",
        "Eat it.", "Hide it in a tree stump and tell no one.", "Buy some land and start a farm.", "Feed it to money-eating slimes.", "Bathe in it."
    ]}
];
function AnnounceDating() {
    gameData.currentDatingQ = IRange(0, dating.length);
    gameData.datingPlayer = gameData.currentPlayer;
    gameData.host.Speak("And it's time for the Dating Game! {cfn}, please cover your eyes as the other two contestants anonymously answer a question!")
    .then(() => gameData.host.Speak("After they answer, you will pick the best one, and that contestant will be revealed to you... and you'll get some of their Slime Points!"))
    .then(() => gameData.host.Speak("Alright, {cfn}, cover your eyes now! Remaining contestants: the question you must answer is..."))
    .then(() => {
        gameData.currentPlayer = (gameData.currentPlayer + 1) % 3;
        gameData.datingChoices = [];
        return gameData.host.Speak("\"" + dating[gameData.currentDatingQ].q + "\" {cfn}, you're up first!");
    }).then(SetUpDatingQuestions);
}
function SetUpDatingQuestions() {
    const curPlayer = gameData.contestants[gameData.currentPlayer];
    const dq = dating[gameData.currentDatingQ];
    const answers = [];
    while(answers.length < 4) {
        const answerIdx = IRange(0, dq.a.length);
        if(answers.indexOf(answerIdx) >= 0) { continue; }
        answers.push(answerIdx);
    }
    gameData.datingAnswers = answers;
    ClearAllLayers();
    DrawImage("background", gameData.sheets["screen"], 0, 0, fullScreenDims);
    DrawLeftText("Q. " + dq.q, 30, 50);
    DrawLeftText("1. " + dq.a[answers[0]].replace(/{cfn}/g, curPlayer.firstName), 30, 85);
    DrawLeftText("2. " + dq.a[answers[1]].replace(/{cfn}/g, curPlayer.firstName), 30, 120);
    DrawLeftText("3. " + dq.a[answers[2]].replace(/{cfn}/g, curPlayer.firstName), 30, 155);
    DrawLeftText("4. " + dq.a[answers[3]].replace(/{cfn}/g, curPlayer.firstName), 30, 190);
    for(let i = 0; i < 4; i++) { DrawButton(i, 4, 65 + i * 35, true); }
    ReadyCurrentPlayer();
    gameData.waitingAction = PickDatingAnswer;
}
function PickDatingAnswer(idx) {
    ClearAction();
    ClearAllUI();
    const curPlayer = gameData.contestants[gameData.currentPlayer];
    gameData.datingChoices.push([gameData.currentPlayer, gameData.datingAnswers[idx]]);
    gameData.currentPlayer = (gameData.currentPlayer + 1) % 3;
    const dq = dating[gameData.currentDatingQ];
    if(gameData.currentPlayer !== gameData.datingPlayer) { // more contestants need to answer the question
        gameData.host.Speak("Alright, {cfn}, you're up next! Answer the question: \"" + dq.q + "\"")
        .then(SetUpDatingQuestions);
    } else { // the other contestants have all answered the question
        ClearAllLayers();
        DrawPeople(gameData.currentPlayer);
        gameData.host.Speak("Wonderful. Everybody has answered. {cfn}, open your eyes!")
        .then(() => {
            ClearAllLayers();
            DrawPeople();
            return gameData.host.Speak("{cfn}, I'm now going to read to you the answers to your question, without saying who gave them.");
        })
        .then(() => gameData.host.Speak("The question was \"" + dq.q + "\""))
        .then(() => {
            Shuffle(gameData.datingChoices);
            return gameData.host.Speak("And the first answer is... \"" + dq.a[gameData.datingChoices[0][1]] + "\"");
        })
        .then(() => gameData.host.Speak("And the other answer is... \"" + dq.a[gameData.datingChoices[1][1]] + "\""))
        .then(() => gameData.host.Speak("Alright, {cfn}, pick your favorite answer!"))
        .then(() => {
            ClearAllLayers();
            DrawImage("background", gameData.sheets["screen"], 0, 0, fullScreenDims);
            DrawLeftText("Q. " + dq.q, 30, 70);
            DrawLeftText("1. " + dq.a[gameData.datingChoices[0][1]].replace(/{cfn}/g, curPlayer.firstName), 30, 110);
            DrawLeftText("2. " + dq.a[gameData.datingChoices[1][1]].replace(/{cfn}/g, curPlayer.firstName), 30, 150);
            for(let i = 0; i < 2; i++) { DrawButton(i, 4, 95 + i * 40, true); }
            ReadyCurrentPlayer();
            gameData.waitingAction = PickDatingContestant;
        });
    }
}
function PickDatingContestant(idx) {
    if(idx >= 2) { return; }
    ClearAction();
    const winner = gameData.datingChoices[idx][0];
    dating.splice(gameData.currentDatingQ, 1); // prevent duplication
    gameData.host.Speak("And it looks like your Slime-mate is... {fn" + winner + "}!")
    .then(() => {
        const ds = Math.round(gameData.contestants[winner].score / 3);
        gameData.contestants[winner].score -= ds;
        gameData.contestants[gameData.currentPlayer].score += ds;
        return gameData.host.Speak("But alas, your Slime Marriage ends in Slime Divorce, and {cfn}, you earned yourself " + ds + " of {fn" + winner + "}'s Slime Points in the Slime Settlement!");
    })
    .then(() => AdvancePlayer("Harsh, but that's love."));
}

// Slime That Phrase!
const sentences = [
    {
        text: "A bird in the hand is worth two in the slime.",
        small: true, wpl: [4, 3, 3, 1], dx: [0, 1.125, 2.625, 3.375]
    }, {
        text: "Actions speak louder than slime.",
        small: false, wpl: [1, 1, 2, 1], dx: [1.5, 3.5, 0.25, 2]
    }, {
        text: "This is the best thing since sliced slime.",
        small: true, wpl: [3, 2, 2, 1], dx: [1, 2.5, 1.5, 4]
    }, {
        text: "You can't judge a book by its slime.",
        small: true, wpl: [2, 4, 2, 0], dx: [2, 0.25, 3, 0]
    }, {
        text: "Don't count your chickens before they slime.",
        small: true, wpl: [2, 2, 2, 1], dx: [1, 1.5, 2.5, 4]
    }, {
        text: "I heard it straight from the slime's mouth.",
        small: true, wpl: [3, 2, 2, 1], dx: [1.5, 1.25, 2, 4]
    }, {
        text: "A journey of 1000 miles begins with a single slime.",
        small: true, wpl: [3, 2, 3, 2], dx: [0.5, 3, 1, 0]
    }, {
        text: "God slimes those who slime themselves.",
        small: true, wpl: [2, 3, 1, 0], dx: [2, 0, 2, 0]
    }, {
        text: "Good things come to those who slime.",
        small: true, wpl: [2, 3, 2, 0], dx: [1, 1, 2.5, 0]
    }, {
        text: "Keep your friends close, and your slimes closer.",
        small: true, wpl: [2, 2, 3, 1], dx: [2, 1, 0, 3]
    }, {
        text: "The grass is always greener on the other slime.",
        small: true, wpl: [3, 2, 3, 1], dx: [0.5, 0.5, 2, 4]
    }, {
        text: "Teach a man to slime, and you feed him for life.",
        small: true, wpl: [3, 3, 3, 2], dx: [1, 1, 2, 2]
    }, {
        text: "Too many cooks spoil the slime.",
        small: false, wpl: [2, 2, 2, 0], dx: [1, 0, 1, 0]
    }, {
        text: "Don't bite off more than you can slime.",
        small: true, wpl: [2, 3, 3, 0], dx: [2, 1, 0.5, 0]
    }, {
        text: "Money doesn't grow on slime.",
        small: false, wpl: [1, 1, 2, 1], dx: [2.5, 2.5, 2.5, 2]
    }, {
        text: "Every cloud has a silver slime.",
        small: false, wpl: [1, 3, 1, 1], dx: [2.5, 0.25, 3, 2.125]
    }, {
        text: "Power to the slime.", 
        small: false, wpl: [0, 2, 2, 0], dx: [0, 1.5, 0.75, 0]
    }, {
        text: "Nobody told me it was Slime Day!",
        small: false, wpl: [1, 3, 2, 1], dx: [1.5, 0.5, 1, 2.5]
    }, {
        text: "Pudding. Just pudding.",
        small: false, wpl: [1, 0, 1, 2], dx: [1, 0, 4, 1]
    }, {
        text: "We're no strangers to slime.", 
        small: false, wpl: [2, 1, 2, 0], dx: [1, 1.5, 1.5, 0]
    }, {
        text: "I know what you did last slimmer. (Slime Summer)",
        small: true, wpl: [3, 3, 2, 1], dx: [1, 2, 0, 3]
    }, {
        text: "Is this the real life? Is this just slimetasy?",
        small: true, wpl: [3, 3, 2, 1], dx: [1, 1, 3, 2]
    }, {
        text: "Universal Healthcare!",
        small: false, wpl: [0, 1, 1, 0], dx: [0, 1.25, 0.25, 0]
    }, {
        text: "Save the bees, please.",
        small: false, wpl: [1, 1, 1, 1], dx: [3, 4.5, 3.5, 1.5]
    },
];
function AnnounceSentence() {
    gameData.hasAnnouncedSentence = true;
    gameData.host.Speak("Alright! You landed on Slime That Phrase!")
    .then(() => {
        ClearAllLayers();
        DrawSentence();
        const numWords = gameData.currentSentence.populated.split(" ").length;
        return gameData.host.Speak("Tonight's phrase is " + numWords + " words long.");
    }).then(ChooseSentence);
}
function ChooseSentence() {
    ClearAllLayers();
    DrawSentence();
    gameData.host.Speak(ArrRand(sentenceIntros)).then(SetLetters);
}
function SetLetters() {
    const letters = [], alphabet = "abcdefghijklmnopqrstuvwxyz";
    letters.push(ArrRand(gameData.currentSentence.remainingLetters));
    for(let i = 0; i < 3; i++) {
        const l = ArrRand(alphabet);
        if(letters.indexOf(l) < 0) { letters.push(l); }
        else { i--; }
    }
    Shuffle(letters);
    for(let i = 0; i < 4; i++) {
        DrawUIText(`${i + 1}. ${letters[i].toUpperCase()}`, 33 + (i * 60), 215);
        DrawButton(i, 10 + (i * 60), 200, true);
    }
    ReadyCurrentPlayer();
    gameData.waitingAction = SelectLetter;
    gameData.currentLetters = letters;
}
function SelectLetter(idx) {
    ClearAction();
    ClearAllUI();
    const player = gameData.contestants[gameData.currentPlayer];
    const letter = gameData.currentLetters[idx];
    player.Speak(ArrRand(letterPicks).replace(/{let}/g, letter))
    .then(() => {
        if(gameData.currentSentence.guessedLetters.indexOf(letter) >= 0) { // someone already guessed this!
            player.score -= 50;
            return gameData.host.Speak(ArrRand(alreadyGuessed).replace(/{let}/g, letter))
            .then(() => AdvancePlayer(""));
        }
        gameData.currentSentence.guessedLetters.push(letter);
        const numOccurrences = (gameData.currentSentence.full.text.match(new RegExp(letter, "gi")) || []).length;
        if(numOccurrences === 0) { // bad guess!
            const cfn = gameData.contestants[gameData.currentPlayer].firstName;
            return AdvancePlayer(ArrRand(wrongLetters).replace(/{gfn}/g, cfn).replace(/{let}/g, letter));
        } else { // correct guess!
            RevealLetter(letter);
            ClearAllLayers();
            DrawSentence();
            const score = numOccurrences * 10;
            player.score += score;
            const winPhrase = ArrRand(rightLetters).replace(/{are}/g, (numOccurrences === 1 ? "is" : "are")).replace(/{num}/g, numOccurrences)
                                                   .replace(/{let}/g, letter + (numOccurrences === 1 ? "" : "'s")).replace(/{score}/g, score);
            if(gameData.currentSentence.remainingLetters.length === 0) { // nailed it
                return gameData.host.Speak(winPhrase)
                .then(() => gameData.host.Speak("And you solved it! \"" + gameData.currentSentence.full.text + "\" Congratulations! That's another 1000 Slime Points!"))
                .then(() => {
                    player.score += 1000;
                    return AdvancePlayer("");
                });
            } else { // still remaining fuckers
                return gameData.host.Speak(winPhrase)
                .then(() => gameData.host.Speak(ArrRand(letterAgain)))
                .then(SetLetters);
            }
        }
    });
}
function RevealLetter(l) {
    gameData.currentSentence.remainingLetters.splice(gameData.currentSentence.remainingLetters.indexOf(l), 1);
    const str = gameData.currentSentence.full.text.toLowerCase();
    let guessed = gameData.currentSentence.populated;
    for(let i = 0; i < str.length; i++) {
        if(str[i] !== l) { continue; }
        guessed = guessed.substr(0, i) + l + guessed.substr(i + 1);
    }
    gameData.currentSentence.populated = guessed;
}

// Question and Slime
function QA(question, answers, randomAnswer) { this.type = 0; this.question = question; this.answers = answers; this.correctAnswer = randomAnswer ? answers[IRange(0, 4)] : answers[0]; }
function ImgQA(question, image, answers) { this.type = 1; this.image = image; this.question = question; this.correctAnswer = answers[0]; this.answers = answers; }
const questions = {
    "slimeMedia": {
        displayName: "Slime",
        questions: [
            new ImgQA("What movie series is this character from?", "q_gb",
            ["Ghostbusters", "Scooby-Doo", "Evil Dead", "Scream"]),
            new ImgQA("What is this little fellow's name?", "q_fl",
            ["Flubber", "Blobby", "Green Glob", "Beef"]),
            new ImgQA("What 60s sci-fi film is this alien monster from?", "q_gs",
            ["The Green Slime", "Space Slime", "It Came From Planet Garf", "Goltar"]),
            new ImgQA("This slime comes from which popular video game franchise?", "q_dq",
            ["Dragon Quest", "Final Fantasy", "Super Mario Bros.", "Kirby"]),
            new ImgQA("What popular video game does this slime come from?", "q_mc",
            ["Minecraft", "Tetris", "Roblox", "Slime Rancher"]),
            new ImgQA("What is this slimey Pok%E9mon's name?", "q_dt",
            ["Ditto", "Muk", "Grimer", "Slimeking"]),
            new ImgQA("This monster from the Final Fantasy franchise is named after which food?", "q_ff",
            ["Flan", "Pudding", "Tapioca", "Jelly"]),
            new ImgQA("This jelly bean-loving fellow is from what video game?", "q_bb",
            ["A Boy and His Blob", "Jelly Days", "Oh Shit, It's The Slunch!", "Slime"]),
            new ImgQA("What is the name of this boss from Yoshi's Island?", "q_yi",
            ["Salvo the Slime", "Greg the Goop", "Jacob Jelly", "Bowser"]),
            new ImgQA("%BFDe qu%E9 videojuego es este limo?", "q_ch",
            ["Cuphead", "Dragon Quest", "Earthbound", "Pok%E9mon"])
        ]
    },
    "slimeBand": {
        displayName: "Slime",
        questions: [
            new QA("Which Slime album is banned in Germany?",
            ["Slime I", "Yankees raus", "Viva la Muerte", "Die Letzten"]),
            new QA("What was the band Slime called before they chose the name Slime?",
            ["Screamer", "Goop", "The Nasty Little Boys", "Sludge"]),
            new QA("What poem inspired the song 'Der Tod Ist Ein Meister aus Deutschland' from Slime's 1994 album 'Schweineherbst?'",
            ["Todesfuge", "Fadensonnen", "Baumkuchen", "Gedicht"]),
            new QA(`What album was "Weird Al" Yankovic's style parody "Slime Creatures from Outer Space" from?`,
            ["Dare to Be Stupid", "Poodle Hat", "Mandatory Fun", "Al-ternative Rock"]),
            new QA(`What musician sang the lyric "it's party time and I smell slime, you stupid people make me evil?"`,
            ["Iggy Pop", "David Bowie", "Andrew W.K.", "Iggy Azalea"]),
            new QA(`Fill in the blanks: "Slime's on the ___, slime's on the ___."`,
            ["man, sea", "ceiling, floor", "mind, soul", "slime, slime"]),
            new QA(`"I'm the Slime" is a song by Frank Zappa and the...`,
            ["Mothers", "Brothers", "Mean Little Infants", "Band"]),
            new QA('What band sang the lyric "oh it feels so good to touch fish slime?"',
            ["The Arrogant Worms", "Talking Heads", "Dead Kennedys", "Moocow Soundhouse"]),
            new QA(`Does "Too Much Slime on My Hands" sound like it'd be a pretty funny parody of that Styx song?`,
            ["Absolutely", "Yes", "Maybe", "Not even a little bit"]),
            new QA("Who is the lead vocalist of the band Slime?",
            ["Dirk Jora", "Michael Mayer", "Ball", "Christian Mevs"])
        ]
    },
    "slimeBio": {
        displayName: "Slime",
        questions: [
            new QA("A snail can create a sort of suction with its slime, allowing it to adhere to surfaces like rocks and trees. This suction is called...",
            ["Epiphragm", "Epiglottis", "Euthanasia", "Elastic"]),
            new QA("Snails, slugs, and other slime-producing creatures, belong to a class of animal known as...",
            ["Gastropods", "Cephalopods", "Bivalves", "Slimy Boys"]),
            new QA('Fish of this species are also referred to as "slimies."',
            ["Ponyfish", "Anglerfish", "Trout", "Glug-glug"]),
            new QA("Why are our stomachs lined with mucus?",
            ["To prevent the stomach from digesting itself", "To lubricate the stomach", "It is a byproduct of digestion", "Because biology is gross"]),
            new QA("Raising snails for their slime is known as...",
            ["Heliciculture", "Snail Hatching", "Being A Snail Mom", "Sliming"]),
            new QA("Aside from water, what is the other primary ingredient of snail slime?",
            ["Glycoprotein", "Carbohydrates", "Spirulina", "Sucrose"]),
            new QA("What is the purpose of nose slime, also known as mucus or snot?",
            ["It keeps the nose from drying out", "It is an emergency food source", "It is the nose's version of saliva", "It's for amusing third graders"]),
            new QA("What is another term for the mucus in our respiratory system?",
            ["Airway Surface Liquid", "Esophageal Phlegm", "Throat Gunk", "Bronchioles"]),
            new QA('Why do people say "God bless you" when someone sneezes?',
            ["To protect against evil", "God loves sneezes", "To protect from disease", "Just because"]),
            new QA("A fun home-made slime toy can be made with glue, water, and one other ingredient. This ingredient is...",
            ["Borax", "Honey", "Hydrogen Peroxide", "Baking Powder"])
        ]
    },
    "italian": {
        displayName: "Italian Cuisine",
        questions: [
            new QA("'Fettuccine' is...",
                ["Long and flat", "Long and thin", "Short and thick", "Elbow-shaped"]),
            new QA("'Farfalle' pasta is shaped like...",
                ["A Bow-Tie", "A Seashell", "A Flower", "An Olive Leaf"]),
            new QA("'Orecchiette' is Italian for...",
                ["Little Ears", "Smoking Pipes", "Little Curls", "Snails"]),
            new QA("'Orzo' pasta resembles...",
                ["Rice", "Diced Carrots", "Potato Dumplings", "Spaghetti"]),
            new QA("Which of these pastas is not traditionally stuffed?",
                ["Ditali", "Casunziei", "Ravioli", "Agnolotti"]),
            new QA("This pasta shell shares its name with a type of dumpling.",
                ["Gnocchi", "Lumache", "Dumple", "Radiatori"]),
            new QA("Which of these pastas is the thinnest?",
                ["Capellini", "Spaghetti", "Bucatini", "Pici"]),
            new QA("'Pappardelle' is a flat noodle made with...",
                ["Eggs", "Spinach", "Sea Salt", "Lard"]),
            new QA("What wheat is most often used for making pasta dough?",
                ["Durum", "Spelt", "Emmer", "Einkorn"]),
            new QA("Where was the first known pasta made?",
                ["Sicily", "Rome", "Milan", "Detroit"])
        ]
    },
    "easy": {
        displayName: "Simple Questions",
        questions: [
            new QA("What caused the Messinian salinity crisis during the Messinian age?",
                ["A Moving Subduction Zone", "Regional Delamination", "Deblobbing", "Global Sea Level Fluctuations"], true),
            new QA("What is the relationship between Polynomial (P) time and Nondeterministic Polynomial (NP) time problems?",
                ["NP is a subset of P", "P does not equal NP", "P and NP are the same", "P is a subset of NP"], true),
            new QA("What are the prime factors of 16,637?",
                ["127 and 131", "379 and 173", "67 and 937", "101 and 661"]),
            new QA("What are the chemical origins of life?",
                ["Panspermia", "Polyphosphates", "Thermodynamic Dissipation", "Fluctuating Hydrothermal Pools"], true),
            new QA("What is the best strategy for quality language translation?",
                ["Fidelity", "Transparency", "Dynamic Equivalence", "Formal Equivalence"], true),
            new QA("What is the last digit of pi?",
                ["6", "3", "4", "0"], true),
            new QA("Where did the Wow! signal come from?",
                ["A Radio Transmission from Deep Space", "A Hydrogen Cloud", "Earth, reflected off of Space Debris", "The Moon"], true),
            new QA("Why do humans dream?",
                ["Defensive Immobilization", "To Strengthen Memories", "Communication with Other Dimensions", "For Funzies"], true),
            new QA("Who was the Zodiac Killer?",
                ["Arthur Leigh Allen", "Jack Tarrance", "Richard Gaikowski", "Rafael Cruz"], true),
            new QA("What's 2 plus 2?",
                ["4", "2", "8", "5"])
        ]
    },
    "quotes": {
        displayName: "Who Said It?",
        questions: [
            new QA('"If you do drugs, you go to hell before you die."',
                ["Super Mario", "McGruff the Crime Dog", "Richard Nixon", "Pope John Paul II"]),
            new QA(`"You miss 100% of the shots you don't take."`, 
                ["Wayne Gretzky", "Michael Scott", "Michael Jordan", "Yao Ming"]),
            new QA('"Every revolution evaporates and leaves behind only the slime of a new bureaucracy."',
                ["Franz Kafka", "Karl Marx", "Victor Hugo", "John F. Kennedy"]),
            new QA('"For supper I want a party platter."',
                ["John F. Kennedy", "Abraham Lincoln", "Joan of Arc", "Cleopatra"]),
            new QA('"I will face God and walk backwards into Hell."',
                ["dril", "William Shakespeare", "Kanye West", "Christopher Hitchens"]),
            new QA(`"My phone's battery warning is the only warning I take seriously."`,
                ["Some fucking Facebook Minions meme", "Chris Rock", "Hannibal Buress", "Sarah Silverman"]),
            new QA('"The slime of all my yesterdays rots in the hollow of my skull."',
                ["Sylvia Plath", "T. S. Elliot", "Anne Sexton", "Garfield the cat"]),
            new QA('"Look at little Goblin Junior. Gonna cry?"',
                ["Peter Parker", "Bruce Wayne", "Clark Kent", "Patrick Warburton"]),
            new QA('"Everybody listen up! We have to put a barrier between us and the snakes!"',
                ["Neville Flynn", "Steve Irwin", "Eddie Kim", "Sean Jones"]),
            new QA(`"I'm running out of ideas for quotes."`,
                ["the guy who made this game", "Shia LaBeouf", "Michael Cera", "Jesse Eisenberg"])
        ]
    }
};
const categories = ["slimeMedia", "slimeBand", "slimeBio", "italian", "easy", "quotes"];
function AnnounceCategories() {
    gameData.hasAnnouncedCategories = true;
    const cats = gameData.categories.map(e => e.name);
    gameData.host.Speak("Alright! You landed on \"Question and Slime!\" The Splategories tonight are...")
    .then(() => {
        ClearAllLayers();
        DrawBoard(true);
        DrawBoardText(cats[0], bleftx, bdy, true);
        return gameData.host.Speak(cats[0] + ".");
    })
    .then(() => {
        DrawBoardText(cats[1], bleftx + bdx, bdy, true);
        return gameData.host.Speak(cats[1] + ".");
    })
    .then(() => {
        DrawBoardText(cats[2], bleftx + 2 * bdx, bdy, true);
        return gameData.host.Speak(cats[2] + ".");
    })
    .then(() => {
        DrawBoardText(cats[3], bleftx + 3 * bdx, bdy, true);
        return gameData.host.Speak("and " + cats[3] + ".");
    })
    .then(ChooseCategory);
}
function ChooseCategory(again) {
    ClearAllLayers();
    DrawBoard();
    gameData.host.Speak(ArrRand(categoryIntros).replace(/{a}/g, (again ? "another" : "a")))
    .then(() => {
        for(let i = 0; i < 4; i++) {
            if(gameData.categories[i].questions.length > 0) {
                DrawButton(i, bleftx + bdx * i + 0.5, btopy - 20);
            }
        }
        ReadyCurrentPlayer();
        gameData.waitingAction = SelectCategory;
    });
}
function SelectCategory(idx) {
    if(gameData.categories[idx].questions.length === 0) { return; }
    ClearAction();
    ClearAllUI();
    const player = gameData.contestants[gameData.currentPlayer];
    const category = gameData.categories[idx];
    gameData.currentCategory = idx;
    const amount = gameData.categories[idx].questions.length - 1;
    const score = 1600 / Math.pow(2, amount);
    player.Speak(ArrRand(categoryChoices).replace(/{cat}/g, category.name).replace(/{score}/g, score))
    .then(() => {
        ClearAllLayers();
        gameData.currentQuestion = gameData.categories[idx].questions.shift();
        DrawScreen(gameData.currentQuestion.question);
        const prefix = category.name === "Who Said It?" ? "Who said it? " : "";
        if(gameData.currentQuestion.type === 1) { DrawQIMG(gameData.currentQuestion.image); }
        return gameData.host.Speak(prefix + gameData.currentQuestion.question + " Is it...");
    })
    .then(() => {
        DrawLeftText("1. " + gameData.currentQuestion.answers[0], 30, 110);
        return gameData.host.Speak("1. " + gameData.currentQuestion.answers[0]);
    })
    .then(() => {
        DrawLeftText("2. " + gameData.currentQuestion.answers[1], 30, 140);
        return gameData.host.Speak("2. " + gameData.currentQuestion.answers[1]);
    })
    .then(() => {
        DrawLeftText("3. " + gameData.currentQuestion.answers[2], 30, 170);
        return gameData.host.Speak("3. " + gameData.currentQuestion.answers[2]);
    })
    .then(() => {
        DrawLeftText("4. " + gameData.currentQuestion.answers[3], 30, 200);
        return gameData.host.Speak("or 4. " + gameData.currentQuestion.answers[3] + "?");
    })
    .then(() => {
        for(let i = 0; i < 4; i++) {
            DrawButton(i, 4, 95 + i * 30, true);
        }
        ReadyCurrentPlayer();
        gameData.waitingAction = PickAnswer;
    });
}
function PickAnswer(idx) {
    ClearAction();
    const player = gameData.contestants[gameData.currentPlayer];
    const answer = gameData.currentQuestion.answers[idx];
    const isCorrect = answer === gameData.currentQuestion.correctAnswer;
    player.Speak(ArrRand(answerPicks).replace(/{ans}/g, answer))
    .then(() => {
        if(isCorrect) {
            const amount = gameData.categories[gameData.currentCategory].questions.length;
            const score = 1600 / Math.pow(2, amount);
            player.score += score;
            const hostStr = ArrRand(correctAnswers).replace(/{ans}/g, answer).replace(/{score}/g, score);
            if(gameData.categories.some(e => e.questions.length > 0)) { // questions remain
                return gameData.host.Speak(hostStr)
                .then(() => ChooseCategory(true));
            } else { // no questions remain
                return gameData.host.Speak(hostStr)
                .then(() => AdvancePlayer("And it looks like we're out of questions! Good going, everyone!"));
            }
        } else {
            return AdvancePlayer(ArrRand(wrongAnswers).replace(/{ans}/g, gameData.currentQuestion.correctAnswer));
        }
    });
}

function AdvancePlayer(t) {
    gameData.currentPlayer = (gameData.currentPlayer + 1) % 3;
    if(gameData.currentPlayer === 0) {
        if(t === "") { return NewRound(); }
        else { return gameData.host.Speak(t).then(NewRound); }
    } else {
        ClearAllLayers();
        DrawPeople();
        return gameData.host.Speak(t + (t === "" ? "" : " ") + ArrRand(youreUpNext)).then(SetToSpin);
    }
}
function SetToSpin() { ReadyCurrentPlayer(); gameData.waitingAction = Spin; }
function NewRound() {
    if(++gameData.currentRound === gameData.numRounds) {
        ClearAllLayers();
        DrawGenBG();
        DrawHost(100, 60);
        const scores = gameData.contestants.map((e, i) => [i, e.score]).sort((a, b) => (a[1] - b[1]));
        return gameData.host.Speak("And it looks like that was our FINAL ROUND of Wheel of Slime! Let's look at our scores!")
        .then(() => {
            ClearAllLayers();
            DrawGenBG();
            DrawPerson(gameData.contestants[scores[0][0]], 100, 60);
            return gameData.host.Speak("In third place is {fn" + scores[0][0] + "} with " + scores[0][1] + " Slime Points!");
        })
        .then(() => gameData.contestants[scores[0][0]].Speak(ArrRand(loserText)))
        .then(() => {
            ClearAllLayers();
            DrawGenBG();
            DrawPerson(gameData.contestants[scores[1][0]], 100, 60);
            return gameData.host.Speak("Next up, in second place is {fn" + scores[1][0] + "} with " + scores[1][1] + " Slime Points!");
        })
        .then(() => gameData.contestants[scores[1][0]].Speak(ArrRand(loserText)))
        .then(() => {
            ClearAllLayers();
            DrawGenBG();
            DrawHost(100, 60);
            return gameData.host.Speak("And finally... our winner for the night is...");
        })
        .then(() => {
            ClearAllLayers();
            DrawGenBG();
            DrawPerson(gameData.contestants[scores[2][0]], 100, 60);
            return gameData.host.Speak("{fn" + scores[2][0] + "}! with " + scores[2][1] + " Slime Points!");
        })
        .then(() => gameData.contestants[scores[2][0]].Speak(ArrRand(winnerText)))
        .then(() => gameData.host.Speak("Congratulations! As the grand prize winner, your prize is..."))
        .then(() => {
            StartSlimeParty();
            return gameData.host.Speak("SLIME!");
        });
    } else {
        ClearAllLayers();
        DrawPeople();
        return gameData.host.Speak("On to the next round! " + ArrRand(youreUpNext)).then(SetToSpin);
    }
}
function StartSlimeParty() {
    const mySlimes = [];
    const img = gameData.sheets["blobs"];
    gameData.slimeIdx = setInterval(() => {
        ClearLayer("slimeParty");
        mySlimes.forEach(e => {
            if(e.moving) {
                e.y += 2;
                if(e.y >= 210 || mySlimes.some(f => f.i !== e.i && !f.moving && Math.round(f.x / 10) === Math.round(e.x / 10) && e.y >= (f.y - 10))) {
                    e.moving = false;
                }
            }
            DrawImage("slimeParty", img, e.x, e.y, e.dims);
        });
        if(Math.random() > 0.45 && mySlimes.length < 1000) {
            mySlimes.push({
                i: mySlimes.length, moving: true,
                x: IRange(-50, 300), y: IRange(-100, -50), 
                dims: miscDims["blob"]()
            });
        }
    }, 10);
}