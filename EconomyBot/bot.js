require("./globals");

// WHATS GOOOOD SIMON!?!?!?!?!?! CAN YOU SEE THIS BRO

client.on("ready", () => {
    console.log(`Logged in as ${client.user.username}`);

    client.user.setActivity("/help", {type: "WATCHING"} )

    initCommands();

    main_slash_commands.begin();

    economy_slash_commands.begin();
    economy_manager.begin();
    economy_commands.startCommands();
})

function initCommands(){
    global.commands = client.api.applications(client.user.id).guilds(guildID);

    global.getApp = (guildID) => {
        const app = client.api.applications(client.user.id);
        if(guildID) app.guilds(guildID);
        return app;
    }

    global.reply = async (interaction, response) => {
        let data = {
            content: response
        }

        if(typeof response === "object"){
            data = await createAPIMessage(interaction, response);
        }

        client.api.interactions(interaction.id, interaction.token).callback.post({
            data: {
                type: 4,
                data,
            },
        });
    }

    global.createAPIMessage = async (interaction, content) => {
        const { data, files } = await Discord.APIMessage.create(
            client.channels.resolve(interaction.channel_id),
            content
        ).resolveData().resolveFiles();

        return { ...data, files }
    }
}
client.login(process.env.TOKEN);