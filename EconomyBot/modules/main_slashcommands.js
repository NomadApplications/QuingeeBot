module.exports.init = async function(){
    await getApp(guildID).commands.post({
        data: {
            name: "help",
            description: "Get help using the quingee bot"
        }
    })

    client.ws.on("INTERACTION_CREATE", async interaction => {
        if(interaction.type === 3) return;

        const command = interaction.data.name.toLowerCase();

        if(command === "help"){
            const commands = await getApp(guildID).commands.get();
            const embed = new Discord.MessageEmbed()
                .setTitle("Quingee Help")
                .setDescription("All commands for the Quingee bot")
                .setColor(defaultColor);

            for(let i = 0; i < commands.length; i++){
                embed.addField(`/${commands[i].name}`, `${commands[i].description}`);
            }
            await reply(interaction, embed);
        }
    });
}