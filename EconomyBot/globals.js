const config = require("./config.json");

// IMPORTS

global.Discord = require("discord.js");
global.client = new Discord.Client();
global.dotenv = require('dotenv').config();
global.db = require("quick.db");
global.schedule = require("node-schedule");

// COLORS

global.successColor = config.colors.successColor;
global.defaultColor = config.colors.defaultColor;
global.errorColor = config.colors.errorColor;
global.currencyColor = config.colors.currencyColor;
global.musicColor = config.colors.musicColor;

require('discord-buttons')(client);
global.disbut = require('discord-buttons');

// CALENDAR

global.seasonEvents = config.calendar.seasonEvents;
global.seasonLength = config.calendar.seasonLength;
global.monthLength = config.calendar.monthLength;
global.season_manager = require("./modules/seasons/season-manager");
global.season_commands = require("./modules/seasons/season-commands");
global.season_slash_commands = require("./modules/seasons/slashcommands");

// ECONOMY

global.currencyName = config.economy.name;
global.maximumProfiles = config.economy.maximumProfiles;
global.startingCurrency = config.economy.startingCurrency;
global.startingProfileName = config.economy.startingProfileName;
global.minDailyReward = config.economy.daily.min;
global.maxDailyReward = config.economy.daily.max;
global.economy_manager = require("./modules/economy/economy-manager");
global.economy_commands = require("./modules/economy/economy-commands");
global.economy_slash_commands = require("./modules/economy/slashcommands");

// MUSIC

global.music_slash_commands = require("./modules/music/slashcommands");
global.music_commands = require("./modules/music/music-commands");

// IDs

global.websiteURL = config.websiteURL;

global.guildID = config.ids.guildID;
global.welcomeID = config.ids.welcomeID;
global.rulesChannelID = config.ids.rulesChannelID;
global.announcementChannelID = config.ids.announcementChannelID;

// EVENTS

global.join_leave = require("./modules/join-leave");
global.main_slash_commands = require("./modules/main_slashcommands");

global.getMentionFromID = function (id) {
    return `<@${id}>`;
}

global.getRandom = function (min, max, fractionDigits) {
    const fractionMultiplier = Math.pow(10, fractionDigits)
    return Math.round(
        (Math.random() * (max - min) + min) * fractionMultiplier,
    )
}