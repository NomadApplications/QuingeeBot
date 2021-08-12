require("./configs/globals");

client.on("ready", async () => {
    console.log(`Logged in as ${client.user.username}`);

    client.user.setActivity("/help", {type: "WATCHING"})

    initCommands();

    itemReader.initItems(items);

    shop_slash_commands.init();
    shop_commands.startCommands();
    shop_commands.initPages();

    main_slash_commands.init();

    join_leave.startEvent();

    economy_slash_commands.init();
    economy_manager.init();
    economy_commands.startCommands();

    season_manager.init();
    season_commands.startCommands();
    season_slash_commands.init();

    homestead_commands.startCommands();
    homestead_slash_commands.init();

    music_slash_commands.init();
    music_commands.startCommands();

    itemReader.initItems(items);

    minigame_commands.startCommands();
    minigame_slash_commands.init();

    moderation_commands.startCommands();

    crafting_slash_commands.init();
    crafting_commands.startCommands();
})

client.on("message", message => {
    const args = message.content.split(" ").map(arg => arg.toLowerCase());

    if(args[0] === "!add"){
        if(!args[1]) return message.channel.send("Please specify amount.");
        if(isNaN(args[1])) return message.channel.send("Please specify valid number.");

        const profiles = db.get(message.author.id + ".profiles");
        let profile = null;
        if(Array.isArray(profiles)){
            profile = profiles[0];
        } else {
            profile = profiles;
        }
        const newProfile = profile;
        newProfile.currencyAmount += parseInt(args[1]);
        updateProfile(newProfile);
        message.channel.send("Successfully added " + args[1] + " to " + message.author.username);
    } else if (args[0] === "!remove"){
        if(!args[1]) return message.channel.send("Please specify amount.");
        if(isNaN(args[1])) return message.channel.send("Please specify valid number.");

        const profiles = db.get(message.author.id + ".profiles");
        let profile = null;
        if(Array.isArray(profiles)){
            profile = profiles[0];
        } else {
            profile = profiles;
        }
        const newProfile = profile;
        newProfile.currencyAmount -= parseInt(args[1]);
        updateProfile(newProfile);
        message.channel.send("Successfully removed " + args[1] + " from " + message.author.username);
    }
})

function initCommands() {
    global.commands = client.api.applications(client.user.id).guilds(guildID);

    global.getApp = (guildID) => {
        const app = client.api.applications(client.user.id);
        if (guildID) app.guilds(guildID);
        return app;
    }

    global.reply = async (interaction, response) => {
        let data = {
            content: response
        }

        if (typeof response === "object") {
            data = await createAPIMessage(interaction, response);
        }

        client.api.interactions(interaction.id, interaction.token).callback.post({
            data: {
                type: 4,
                data,
            },
        });
    }

    global.replyError = async (interaction, response) => {
        const embed = new Discord.MessageEmbed()
            .setColor(errorColor)
            .setDescription(response);

        await reply(interaction, embed);
    }

    global.replySuccess = async (interaction, response) => {
        const embed = new Discord.MessageEmbed()
            .setColor(successColor)
            .setDescription(response);

        await reply(interaction, embed);
    }

    global.createAPIMessage = async (interaction, content) => {
        const {data, files} = await Discord.APIMessage.create(
            client.channels.resolve(interaction.channel_id),
            content
        ).resolveData().resolveFiles();

        return {...data, files}
    }
}

client.login(process.env.TOKEN);