# nebo-mobi-bot

A simple bot for the browser game [nebo.mobi](https://nebo.mobi). Written in Node.js.

## Features

* Buy, unpack goods and collect money from their sales;
* Play the labyrinth;
* Control the lift and collect rewards;
* Login into the account on its own;
* Collect rewards from personal quests;
* Compare the amount of money and bucks before and after certain actions.

## My plans for the bot

* More smarter quest completion;
* Bug and crash proof 24/7 running in the background;
* Chat commands;
* Track the amount of players online;
* Code optimizations;
* Possible migration to a different programming language;
* Better modularity (turn on/off certain modules, control the order of actions);
* Compilation into executable files for easier access.

## Download and launch

0. Make sure you have installed Node.js (atleast v18, older versions WEREN'T tested);
1. Clone the repository or download the zip file, then unpack the folder from the zip file;
2. Go to the bot folder;
3. Do `npm install` (NOTE: will not work if Puppeteer cannot be installed, sorry Termux users);
4. Create `.env` file with `USERNAME="<your username here>"` and `PASSWORD="<your password here>"` lines;
5. Launch the bot with `node index.js` (or shorter: `node .`)

## answering questions before anyone asks them

can i trust leaving my credentials in the .env file?

* yes, just make sure they dont get leaked or accessed by anyone else. 100% of the code is open sourced, with comments and no obfuscation

can i get banned?

* yes. in the [game rules](https://nebo.mobi/rules/type/game) the admins state that any external program that makes the game easier or automates anything inside of it is prohibited. i have not heard of a single ban for botting though, but its up to you to take the risk of your account getting banned

who/what inspired you?

* [nebomobibot.blogspot.com](https://nebomobibot.blogspot.com/)
