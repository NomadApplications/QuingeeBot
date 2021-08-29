require("./configs/globals");

client.on("ready", async () => {
    console.log(`Logged in as ${client.user.username}`);

    client.user.setActivity("/help", {type: "WATCHING"})

    initCommands();

    itemReader.initItems(require("./configs/items.json").items);

    shop_slash_commands.init();
    shop_commands.startCommands();
    shop_commands.init();

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

    music_commands.startCommands();

    minigame_commands.startCommands();
    minigame_slash_commands.init();

    moderation_commands.startCommands();

    crafting_slash_commands.init();
    crafting_commands.startCommands();

    reaction_role.startCommands();

    lookup_commands.startCommands();
    lookup_commands.initCommands();
})

client.on("message", message => {
    const args = message.content.split(" ").map(arg => arg.toLowerCase());
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