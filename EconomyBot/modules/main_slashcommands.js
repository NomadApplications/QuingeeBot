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
                let options = [];
                if(commands[i].options === null || commands[i].options.length === 0){
                    embed.addField(`/${commands[i].name}`, `${commands[i].description}`);
                } else {
                    commands[i].options.forEach(o => {
                        options.push(o.name);
                    })
                    embed.addField(`/${commands[i].name} ${options}`, `${commands[i].description}`);
                }

            }
            await reply(interaction, embed);
        }
    });
}