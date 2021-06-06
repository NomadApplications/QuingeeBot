module.exports.begin = async function(){
    await getApp(guildID).commands.post({
        data: {
            name: "balance",
            description: "See your (or someone else's) current balance.",
            options: [
                {
                    name: "name",
                    description: "Who's balance you would like to get.",
                    required: true,
                    type: 3,
                },
                {
                    name: "profile",
                    description: "Which profile you would like to use.",
                    required: false,
                    type: 3
                },
            ]
        }
    })

    client.ws.on("INTERACTION_CREATE", async (interaction) => {
        const command = interaction.data.name.toLowerCase();
        const { name, options } = interaction.data;

        const args = {};

        if(options){
            for(const option of options){
                const { name, value } = option;
                args[name] = value;
            }
        }

        if(command === "balance") {

        }
    })
}