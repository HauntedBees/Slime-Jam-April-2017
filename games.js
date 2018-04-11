function Spin() {
    ClearAction();
    const gameType = 0;
    // TODO: spin shit here
    switch(gameType) {
        case 0:
            if(gameData.hasAnnouncedCategories) {
                ChooseCategory();
            } else {
                gameData.hasAnnouncedCategories = true;
                AnnounceCategories(ChooseCategory);
            }
            break;
    }
}

// Sentences
const sentences = [
    "A bird in the hand is worth two in the slime.",
    "Actions speak louder than slime.",
    "This is the best thing since sliced slime.",
    "You can't judge a book by its slime.",
    "Don't count your chickens before they slime.",
    "I heard it straight from the slime's mouth.",
    "A journey of a thousand miles begins with a single slime.",
    "God slimes those who slime themselves.",
    "Good things come to those who slime.",
    "Keep your friends close, and your slimes closer.",
    "People who live in slime houses should not throw stones.",
    "The grass is always greener on the other side of the slime.",
    "You can lead a horse to slime, but you can't make him drink it.",
    "Too many cooks spoil the slime.",
    "Don't bite off more than you can slime.",
    "Money doesn't grow on slime.",
    "If you scratch my back, I'll scratch slime.",
    "Every cloud has a silver slime.",
    "Power to the slime.", 
    "Nobody told me it was Slime Day!",
    "Once I split your slime in two, you'll be twice as slime.",
    "Pudding. Just pudding.",
    "I wish I could turn into slime so I could kill my bus driver.",
    "We're no strangers to slime.", 
    "Their blood is on your hands and I will never forget this.",
    "Mama, just killed a man... Put a slime against his head...",
    "Medicare for All",
    "Save the bees."
];

// Answer Questions
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
            new ImgQA("What is this slimey Pokémon's name?", "q_dt",
            ["Ditto", "Muk", "Grimer", "Slimeking"]),
            new ImgQA("This monster from the Final Fantasy franchise is named after which food?", "q_ff",
            ["Flan", "Pudding", "Tapioca", "Jelly"]),
            new ImgQA("This jelly bean-loving fellow is from what video game?", "q_bb",
            ["A Boy and His Blob", "Jelly Days", "Oh Shit, It's The Slunch!", "Slime"]),
            new ImgQA("What is the name of this boss from Yoshi's Island?", "q_yi",
            ["Salvo the Slime", "Greg the Goop", "Jacob Jelly", "Bowser"]),
            new ImgQA("¿De qué videojuego es este limo?", "q_ch",
            ["Cuphead", "Dragon Quest", "Earthbound", "Pokémon"])
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
            new QA('What band "oh it feels so good to touch fish slime?"',
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
                ["some fucking Facebook Minions meme", "Chris Rock", "Hannibal Buress", "Sarah Silverman"]),
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
function AnnounceCategories(next) {
    const cats = gameData.categories.map(e => e.name);
    gameData.host.Speak("Alright! You landed on Slime Questions! The Slime Question Categories tonight are...")
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
    .then(next);
}
function ChooseCategory() {
    ClearAllLayers();
    DrawBoard();
    gameData.host.Speak("Alright, {cfn}, pick a category!")
    .then(() => {
        for(let i = 0; i < 4; i++) {
            DrawButton(i, bleftx + bdx * i + 0.5, btopy - 20);
        }
        gameData.waitingAction = SelectCategory;
    });
}
function SelectCategory(idx) {
    ClearAction();
    ClearLayer("UI");
    const player = gameData.contestants[gameData.currentPlayer];
    const category = gameData.categories[idx];
    gameData.currentCategory = idx;
    const amount = gameData.categories[idx].questions.length - 1;
    const score = 1600 / Math.pow(2, amount);
    player.Speak("I'll take " + category.name + " for " + score + ", {hfn}!")
    .then(() => {
        ClearAllLayers();
        gameData.currentQuestion = gameData.categories[idx].questions.shift();
        DrawScreen(gameData.currentQuestion.question);
        const prefix = category.name === "Who Said It?" ? "Who said it? " : "";
        return gameData.host.Speak(prefix + gameData.currentQuestion.question + " Is it...");
    })
    .then(() => {
        DrawText("1. " + gameData.currentQuestion.answers[0], 30, 110, "people", 12, 196, "#FFFFFF");
        return gameData.host.Speak("1. " + gameData.currentQuestion.answers[0]);
    })
    .then(() => {
        DrawText("2. " + gameData.currentQuestion.answers[1], 30, 140, "people", 12, 196, "#FFFFFF");
        return gameData.host.Speak("2. " + gameData.currentQuestion.answers[1]);
    })
    .then(() => {
        DrawText("3. " + gameData.currentQuestion.answers[2], 30, 170, "people", 12, 196, "#FFFFFF");
        return gameData.host.Speak("3. " + gameData.currentQuestion.answers[2]);
    })
    .then(() => {
        DrawText("4. " + gameData.currentQuestion.answers[3], 30, 200, "people", 12, 196, "#FFFFFF");
        return gameData.host.Speak("or 4. " + gameData.currentQuestion.answers[3] + "?");
    })
    .then(() => {
        for(let i = 0; i < 4; i++) {
            DrawButton(i, 4, 95 + i * 30, true);
        }
        gameData.waitingAction = PickAnswer;
    });
}
function PickAnswer(idx) {
    ClearAction();
    const player = gameData.contestants[gameData.currentPlayer];
    const answer = gameData.currentQuestion.answers[idx];
    const isCorrect = answer === gameData.currentQuestion.correctAnswer;
    player.Speak("I'm gonna go with \"" + answer + "\"!")
    .then(() => {
        if(isCorrect) {
            const amount = gameData.categories[gameData.currentCategory].questions.length;
            const score = 1600 / Math.pow(2, amount);
            return gameData.host.Speak("\"" + answer + "\" is correct! That is " + score + " slime points! Spin the wheel again!");
        } else {
            gameData.currentPlayer = (gameData.currentPlayer + 1) % 3;
            return gameData.host.Speak("Oh, I'm sorry. The correct answer was \"" + gameData.currentQuestion.correctAnswer + ".\" {cfn} is up next! Spin the Wheel of Slime!");
        }
    }).then(() => {
        gameData.waitingAction = Spin;
    });
}