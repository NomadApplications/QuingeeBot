global.Discord = require("discord.js");
global.client = new Discord.Client();

global.dotenv = require("dotenv").config();

global.db = require("quick.db");
global.color = "#F0F8FF";

global.guildID = "846413849351290962";

global.main_slash_commands = require("./modules/main_slashcommands");

global.economy_manager = require("./modules/economy/economy-manager");
global.economy_commands = require("./modules/economy/economy-commands");
global.economy_slash_commands = require("./modules/economy/slashcommands");