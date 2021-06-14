const config = require("../config.json");

// IMPORTS

global.Discord = require("discord.js");
global.client = new Discord.Client();
global.dotenv = require('dotenv').config();
global.db = require("quick.db");
global.schedule = require("node-schedule");

// COLORS

global.successColor = config.get("colors.successColor");
global.defaultColor = config.get("colors.defaultColor");
global.errorColor = config.get("colors.errorColor");
global.currencyColor = config.get("colors.currencyColor");

require('discord-buttons')(client);
global.disbut = require('discord-buttons');

// CALENDAR

global.seasonEvents = config.get("calendar.seasonEvents");
global.seasonLength = config.get("calendar.seasonLength");
global.monthLength = config.get("calendar.monthLength");
global.season_manager = require("./modules/seasons/season-manager");
global.season_commands = require("./modules/seasons/season-commands");
global.season_slash_commands = require("./modules/seasons/slashcommands");

// ECONOMY

global.currencyName = config.get("economy.name");
global.maximumProfiles = config.get("economy.maximumProfiles");
global.startingCurrency = config.get("economy.startingCurrency");
global.startingProfileName = config.get("economy.startingProfileName");
global.minDailyReward = config.get("economy.daily.min");
global.maxDailyReward = config.get("economy.daily.max");
global.economy_manager = require("./modules/economy/economy-manager");
global.economy_commands = require("./modules/economy/economy-commands");
global.economy_slash_commands = require("./modules/economy/slashcommands");

// IDs

global.websiteURL = config.get("websiteURL");

global.guildID = config.get("ids.guildID");
global.welcomeID = config.get("ids.welcomeID");
global.rulesChannelID = config.get("ids.rulesChannelID");
global.announcementChannelID = config.get("ids.announcementChannelID");

// EVENTS

global.join_leave = require("./modules/join-leave");
global.main_slash_commands = require("./modules/main_slashcommands");

global.getMentionFromID = function(id) {
    return `<@${id}>`;
}