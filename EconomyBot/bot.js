require("./globals");

client.on("ready", async () => {
    console.log(`Logged in as ${client.user.username}`);

    client.user.setActivity("/help", {type: "WATCHING"} )

    initCommands();

    await main_slash_commands.init();

    await join_leave.startEvent();

    await economy_slash_commands.init();
    await economy_manager.init();
    await economy_commands.startCommands();
})

const disbut = require("discord-buttons")(client);

client.on("message", message => {
    if(message.content === "!test"){
        let deny = new disbut.MessageButton()
            .setLabel("Deny")
            .setStyle("red")
            .setEmoji("⛔")
            .setID("deny");
        let confirm = new disbut.MessageButton()
            .setLabel("Confirm")
            .setStyle("green")
            .setEmoji("✅")
            .setID("confirm");
        let buttonRow = new disbut.MessageActionRow()
            .addComponent(deny)
            .addComponent(confirm);

        message.channel.send("Here is a thingy", {component: buttonRow});
    }
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

    global.replyError = async (interaction, response) => {
        const embed = new Discord.MessageEmbed()
            .setTitle("Quingee")
            .setColor(errorColor)
            .setDescription(response);

        await reply(interaction, embed);
    }

    global.replySuccess = async (interaction, response) => {
        const embed = new Discord.MessageEmbed()
            .setTitle("Quingee")
            .setColor(color)
            .setDescription(response);

        await reply(interaction, embed);
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