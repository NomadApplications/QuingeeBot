module.exports.begin = async function(){
    await getApp(guildID).commands.post({
        data: {
            name: "help",
            description: "Get help using the quingee bot"
        }
    })

    client.ws.on("INTERACTION_CREATE", async interaction => {
        const command = interaction.data.name.toLowerCase();
        const args = interaction.data.options;

        if(command === "help"){
            reply(interaction, "To see all commands, just type a single **/**");
        }
    });
}