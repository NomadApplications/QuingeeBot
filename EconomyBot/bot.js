require("./globals");

client.on("ready", () => {
    console.log(`Logged in as ${client.user.username}`);

    client.user.setActivity("/help", {type: "WATCHING"} )

    initCommands();

    main_slash_commands.begin();

    economy_slash_commands.begin();
    economy_commands.startCommands();
})

function initCommands(){
    global.commands = client.api.applications(client.user.id).guilds(guildID);

    global.getApp = (guildID) => {
        const app = client.api.applications(client.user.id);
        if(guildID) app.guilds(guildID);
        return app;
    }

    global.reply = (interaction, response) => {
        client.api.interactions(interaction.id, interaction.token).callback.post({
            data: {
                type: 4,
                data: {
                    content: response
                },
            },
        });
    }
}
client.login(process.env.TOKEN);