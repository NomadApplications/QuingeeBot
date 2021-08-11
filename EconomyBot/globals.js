const config = require("./config.json");
const itemConfig = require("./items.json");

// IMPORTS

global.Discord = require("discord.js");
global.client = new Discord.Client();
global.dotenv = require('dotenv').config();
global.db = require("quick.db");
global.schedule = require("node-schedule");

global.moderationPrefix = config.moderationPrefix;

// COLORS

global.successColor = config.colors.successColor;
global.defaultColor = config.colors.defaultColor;
global.errorColor = config.colors.errorColor;
global.currencyColor = config.colors.currencyColor;
global.musicColor = config.colors.musicColor;

// MODERATION

global.moderation_commands = require("./modules/moderation/moderation-commands");

// ITEMS

global.items = itemConfig.items;
global.itemReader = require("./modules/item-reader");

// SHOPS

global.shop_slash_commands = require("./modules/shop/slashcommands");
global.shop_commands = require("./modules/shop/shop-commands");
global.itemsPerPage = config.economy.shopItemsPerPage;

// HOMES

global.homestead_commands = require("./modules/homesteads/homestead-commands");
global.homestead_slash_commands = require("./modules/homesteads/slashcommands");

global.quingeeItem = new Item("quingee", -1, -1, -1, "Node");

// MINIGAMES

global.minigame_commands = require("./modules/mini-games/minigame_commands");
global.minigame_slash_commands = require("./modules/mini-games/slashcommands");

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
global.modlogID = config.ids.modlogID;

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

global.capitalize = function(string){
    const lower = string.toLowerCase();
    const sentence = lower.split(" ");

    let final = "";

    for(let i = 0; i < sentence.length; i++){
        const first = sentence[i].charAt(0);
        const upper = first.toUpperCase();
        const sliced = sentence[i].slice(1);

        if(i === sentence.length -1){
            final += upper + sliced;
        } else {
            final += upper + sliced + " ";
        }
    }

    return final;
}

global.getUserById = function(userId, guildId){
    return client.guilds.cache.get(guildId).members.cache.get(userId).user;
}

global.findCounts = arr => arr.reduce((prev, curr) => (prev[curr] = ++prev[curr] || 1, prev), {});
