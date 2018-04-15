// {doc} = display only comma, {sos} = speech only space

// Opening
const openingLines = [
    "I'm in it to win it, {hfn}!", "Happy to be here!", "Hi mom!", "Slime me up!", "I'm ready to roll!", "Foot Tennis!", 
    "Hi, {hfn}!", "Let's do this!", "Hi!", "Hello!", "That's me!", "Let's slime!", "I hate Mondays.", "Hell yeah!", 
    "Get fucked{doc} {hfn}!", "Woo hoo!", "I'm gonna win!", "Y'all are going down!", "It's Slime Time!", "Hoodee Hoo!!",
    "Reru{sos}reru{sos}reru{sos}reru!", "I'm hungry for worms!", "Barney, my pebbles!", "Check out my SoundCloud!",
    "Back me on Kickstarter!", "You're a beautiful audience!", "It's my 10th anniversary today but I'm here instead!", 
    "Let's get down to slimes-ness!", "I'm ready! I'm ready! I'm ready!", "May the best slime win!", "Insert Topical Meme Here!"
];
const introductions = [
    "{fn} {ln}, a{n} {age}-year old {job} from {city}",
    "from {city}, {fn} {ln}, a{n} {age}-year old {job}",
    "{fn} {ln}, a professional {job} from {city}",
    "{dr}{fn} {ln}, a{n} {age}-year old {job} visiting from {city}",
    "if you need some {job}-ing done well, look no further than {fn} {ln} from {city}",
    "First Name: {fn}, Last Name: {ln}, {job} of {age} years of age from {city}"  
];

// General
const youreUpNext = [
    "{cfn}, you're up next! Spin the Wheel of Slime!",
    "Alright, {cfn}, you're up! Spin the Wheel of Slime!",
    "Slime Time for {cfn}! Spin that Wheel!",
    "Next up is {cfn}. Give the Wheel of Slime a good spin!",
    "Up next is {cfn}. Spin the Wheel of Slime!",
    "Okay, {cfn}, you're up! Spin the Wheel of Slime!",
    "{cfn} is up next! Spin the Wheel of Slime!",
    "{cfn}, spin the Wheel of Slime!",
    "{cfn}, you're up, so spin that Wheel! Of Slime!",
    "Spin the Wheel of Slime, {cfn}, you're up next!",
    "{cfn}, you're up next! Spin that motherfucking wheel!",
    "{cfn}, you're up next! Spin that shit!"
];
const loserText = [
    "Fuck!", "I'll do better next time!", "This is horrible news.", "This shit was rigged!", "That's no good.", "I don't like this.", "Why?",
    "Good game, everyone!", "At least we all had fun! :)", "No no no!!", "Dang-ol' darn.", "Oh dearie dearie me.", "I've lost worse."
];
const winnerText = [
    "Woo hoo!", "Hoo dee hoo!", "Fuck yes!", "I'm honored.", "I won!", "Hooray!", "May the best player win--oh, what's that? I won? Yeah, that sounds about right.",
    "Slimetastic!", "Tubular!", "Super Rad!", "I'm happier than I was when my child was born! Sorry, Billy!", "I can die happy now.", "Yes! YES! WOOHOO! YEAH!!"
];

// Question and Slime
const categoryIntros = [
    "Alright, {cfn}, pick {a} category!",
    "Okay, {cfn}, choose {a} category!", 
    "{cfn} - please select {a} category!",
    "Please choose {a} category, {cfn}!"
];
const categoryChoices = [
    "I'll take {cat} for {score}, {hfn}!",
    "{cat} for {score}, {hfn}!",
    "I'm gonna go with {cat} for {score}.",
    "Uh. Um. Uh. Uhh. {cat}! ...for {score}!",
    "Ha ha, {hfn}, you KNOW I'm taking {cat} for {score}!",
    "Let's go with {cat} for {score}, {hfn}."
];
const answerPicks = [
    "I'm gonna go with \"{ans}!\"",
    "I'll pick \"{ans}.\"",
    "Definitely \"{ans}.\"",
    "Oh, without a doubt, it's \"{ans}!\"",
    "Uhh gee, this is a tough one, ha ha! I think I'll pick \"{ans}!\"",
    "What is-- oh wait, wrong game show. \"{ans}!\"",
    "\"{ans}.\""
];
const correctAnswers = [
    "\"{ans}\" is correct! That is {score} Slime Points!",
    "That is correct! {score} Slime Points!",
    "Bada-bing-bada-{score}-points! That is correct!",
    "Nailed it, {cfn}! That's {score} Slime Points for you!",
    "Oooh, I'm sorry... the correct answer was \"{ans}.\" Oh, that's what you said? Nevermind! {score} points!",
    "Correct! {score} points!",
    "Yeah.",
    "I've heard worse guesses! That is correct! {score} points!"
];
const wrongAnswers = [
    "Oh, I'm sorry. The correct answer was \"{ans}.\"",
    "No, the answer was \"{ans}.\"",
    "Incorrect. The answer is \"{ans}.\" Zero points.",
    "Seriously? You got that one wrong? Everyone knows it's \"{ans}.\" Pathetic.",
    "Wrong. The answer there was \"{ans}.\" Better luck next time!",
    "Well, you tried. But the correct answer was \"{ans}.\" You'll get it next time, buddy!",
    "I mean, you're not WRONG, but you're not RIGHT either. The correct answer was \"{ans}.\""
];

// Slime That Phrase!
const sentenceIntros = [
    "Alright, {cfn}, pick a letter!",
    "Pick a letter, {cfn}.",
    "Choose a letter, {cfn}, and don't pick \"Q,\" ha ha!",
    "Please select a letter, {cfn}.",
    "{cfn}, make your guess!"
];
const letterPicks = [
    "I'm gonna go with \"{let}!\"",
    "Let's go with \"{let}!\"",
    "How about... \"{let}!\"",
    "\"{let}!\" Definitely \"{let}!\" There's gotta be at least one \"{let}\" in there!",
    "I'll take \"{let},\" {hfn}!",
    "\"{let}.\"",
    "Let's see... I'll take a \"{let}!\"",
    "I'd like to buy a vow-- I mean, I'll pick \"{let}!\"",
    "I'm betting it all on \"{let}!\""
];
const alreadyGuessed = [
    "I'm sorry, {cfn}, but that letter has already been guessed. You lose 50 Slime Points.",
    "Uh-oh! Someone already guessed {let}! That means you lose 50 Slime Points, {cfn}!",
    "Ding ding! That's the Duplicate Alarm! That letter has already been guessed! You lose 50 Slime Points!",
    "No. That guess was so bad that you lose 50 Slime Points. Don't you ever say that to me again.",
    "Oooh, {cfn}, somebody already guessed that letter! Better pay more attention next time, because that blunder just cost you 50 Slime Points!"
];
const wrongLetters = [
    "Oooh, sorry, {gfn}, there are no {let}'s in this one.",
    "Welp, no \"{let}\" in this one. Sorry, {gfn}.",
    "Nope. Better luck next time, {gfn}!",
    "There are no {let}'s in this phrase, {gfn}.",
    "Nope. No {let}'s. Sorry, {gfn}."
];
const rightLetters = [
    "Yes! There {are} {num} {let} in this phrase! {score} points!",
    "Correct! There {are} {num} {let}! That's {score} Slime Points!",
    "There {are} {num} {let}! That's {score} Slime Points for you, {cfn}."
];
const letterAgain = [
    "Alright, {cfn}, pick another letter!",
    "Okay, {cfn}, guess again!",
    "Take a bonus guess, {cfn}!",
    "Pick another letter, {cfn}!"
];

// Quirk!
const randomSlimeComments = [
    "I'm bonkers for slime!", "Have I mentioned how much I love slime lately?", "I'm coo-coo for slime puffs!", "I appreciate slime.",
    "Did you know slime is technically a fruit?", "Slime? Yes please, ha ha!", "Slime is my religion.", "If you don't like slime, I don't like you.",
    "Slime is like a box of chocolates: it's good.", "Slime me up!", "Pass the slime, please!", "Please, sir, may I have some more slime?",
    "Please provide me with slime.", "Slime, please!", "Give me the good slime.", "Slime slime slime slime slime.", "Slime is my wife and I love her.", 
    "Slime is gooey and good.", "Slime is the best.", "Reminder: slime is great!", "Vote for slime.", "Send that slime my way!", "Slime.", 
    "I diagnose you with slime.", "Me gusta slime.", "I would kill for some slime right now!", "I respect and appreciate slime.", "Such is the word of the slime."
];
const quirkReactions = [
    "Oh golly, that sure won't get old immediately, {hfn}!",
    "Thanks, I hate it!",
    "It's about time!",
    "{hfn} why are you doing this to me.",
    "I don't want this.",
    "This is bad. This is a bad thing you have done to me."
];
const quirkHostReply = [
    "And that's it! Don't forget or you'll die! Ha ha!",
    "Have fun with that!",
    "You are truly blessed to have such a fun Quirk!",
    "Enjoy your Speech Quirk!"
];

// Freep Hoynts
const freepAnnounce = [
    "You landed on \"Free Points!\" That means you're going to get some Slime Points delivered DIRECTLY TO YOU AND YOUR BODY!",
    "\"Freep Hoynts!\" That's Slime-ese for \"Free Points!\" Which is England-ese for \"your score is about to increase!\"",
    "Oh ho ho, the much-adored \"Free Points!\" You're gonna get yourself some Slime Points!",
    "Ding ding ding! Free Slime Points heading your way!",
    "Nice spinning, {cfn}! You just earned yourself some free Slime Points!",
    "I hope you like Slime Points, {cfn}, because you just earned some, for free!"
];
const freepReply = [
    "Oh boy! Slime me up!",
    "Hell to the yes!",
    "Excellent!",
    "Totally tubular!",
    "Slime time!",
    "And my mom said I'd never amount to anything!",
    "Hooray!",
    "Good times! Good times!"
];
const freepFinal = [
    "You just earned yourself {score} Slime Points! Congratulations!",
    "And your total bonus is {score} Slime Points!",
    "{score} Slime Points have been deposited to your Slime Score!",
    "Congratulations on the {score} freep hoynts!"
];

// Slime Vacuum
const vacuumReply = [
    "Bastard fuck.",
    "This is disappointing.",
    "Most unfortunate.",
    "Nooo!",
    "How could this happen to me?!"
];

// Slime Prisoner's Dilemma
const spdC = ["I knew I could trust you.", "Teamwork helps everyone!", "Hooray!", "Good game, pal!", "Friendship always prevails!", "Trust is good."];
const spdD = ["Rat bastard.", "Fuck you.", "I was right not to trust you.", "I made the right choice.", "The seeds of doubt have been sown.", "You..."];
const spdS = ["I love slime!", "Yay!", "Hooray for slime!", "Slime time!", "Good game!", "Slime me up inside!", "Slimy!", "Good stuff right there."];
const spdWronged = ["Rat bastard.", "Fuck you.", "You...", "How could you?!", "I trusted you!", "You monster!", "You greedy punk!"];
const spdWronging = ["I made the right choice.", "You naive fool!", "Ha ha ha!", "I'm playing to win, punk!", "It's kill or die out here, man!"];
const spdSlimed = ["Rat bastard.", "Fuck you.", "You slime-loving piece of shit.", "I guess I just got slimed!", "I betrayed the slime. I feel pathetic."];

// Small Talk
const stTopics = [
    "I got a new {obj} to help me with my {h}.",
    "You know how it is. My oldest is going away to college soon.",
    "When I was going for a jog yesterday I came across a giant {obj}.", 
    "I'm excited to invest all my winnings from this show into {h}!",
    "I'm just... I'm just so happy about slime.", 
    "Can't stop thinking about slime.", 
    "I fit a whole {obj} in my mouth last week!", 
    "It's going pretty bad, {hfn}. My ex is taking my {obj}.", 
    "I'm thinking of combining some of my hobbies. Imagine... {h} and {dh}... combined!",
    "I stubbed my toe on a pile of {obj}s earlier.", 
    "I accidentally ran over my son's {obj} a few days ago. He's still mad at me, even though I bought him a new one.",
    "A giant robot destroyed my house last week.", 
    "I actually died five months ago and I'm a ghost right now."
];
const stResponses = [
    "Wow! How's that working out for you?", 
    "Neat! So, uh, how's that going?",
    "I'm so sorry. How are you holding up?", 
    "Holy cow! That's amazing! You must feel pretty good right now, huh?", 
    "Go on...", 
    "That seems unlikely. How's that going for you?", 
    "Really? Wow! How do you feel about that?", 
    "Amazing. How does that make you feel?",
    "I'm impressed. How do you feel?"
];
const stCounters = [
    "I've never been happier.", 
    "Today is the worst day of my life.", 
    "It's terrible.",
    "I don't even know who I am anymore.", 
    "I've been laughing about it almost nonstop for weeks now.", 
    "I guess it's true what they say about slime...", 
    "Save me. Please.", 
    "I'm ecstatic.", 
    "I'm good. You're good. We're all good!",
    "You don't want to know.", 
    "Oh... you know! Nudge nudge wink wink.", 
    "I'm just glad there's so much slime here."
];
const stEndings = [
    "Good talk. Good talk.",
    "Welp, that was fun!",
    "Exceptional small talk!", 
    "Wonderful conversation.",
    "Good times.",
    "We have fun here, don't we?"
];