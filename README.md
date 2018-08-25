# Slime Jam
Let's slime. **Wheel of Slime** is a 0-3 player party game created for the [#SlimeJam](https://itch.io/jam/slime-studio-jam), where it was judged as the **most creative** submission. It runs in the browser and uses text-to-speech technology, which varies depending on the browser you use. In my testing I have found it is the most stable in Firefox. Chrome offers more voice options, but sometimes freezes up if you skip dialogue too much.

## Sources
All assets are AGPLv3. Names and jobs are taken from US Census Bureau. As works of the U.S. federal government, they are in the public domain.

## Building
`uglifyjs helpers.js data.js words.js games.js person.js drawing.js slime.js input.js -o out.min.js`

## want to make changes?
Go for it! Any changes that get accepted into the master branch will be deployed to the hosted version on the [Haunted Bees website](http://hauntedbees.com/games/slime/index.html). Please make all changes GNU AGPLv3 compatible, or - even better - GNU AGPLv3 licensed.
