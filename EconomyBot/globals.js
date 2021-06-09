global.Discord = require("discord.js");
global.client = new Discord.Client();

global.dotenv = require('dotenv').config();

global.db = require("quick.db");

global.schedule = require("node-schedule");

global.color = "#4be045";
global.defaultColor = "#ffeded"
global.errorColor = "#EF2813";
global.currencyColor = "#ffb624";

require('discord-buttons')(client);
global.disbut = require('discord-buttons');

// Economy

global.currencyName = "Gald";
global.startingCurrency = 10;

// IDs

global.websiteURL = "<https://www.google.com/>"

global.guildID = "846413849351290962";
global.welcomeID = "850811108025171969";
global.rulesChannelID = "851330725990760468";
global.announcementChannelID = "852219497300754505";

// Classes

global.join_leave = require("./modules/join-leave");

global.main_slash_commands = require("./modules/main_slashcommands");

global.economy_manager = require("./modules/economy/economy-manager");
global.economy_commands = require("./modules/economy/economy-commands");
global.economy_slash_commands = require("./modules/economy/slashcommands");

//Seasons

global.season_manager = require("./modules/seasons/season-manager");
global.season_commands = require("./modules/seasons/season-commands");
global.season_slash_commands = require("./modules/seasons/slashcommands");

global.enum = require("./modules/enum");

global.getMentionFromID = function(id) {
    return `<@${id}>`;
}