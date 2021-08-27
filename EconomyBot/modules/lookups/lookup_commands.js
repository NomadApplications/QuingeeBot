const lookup = require("../../configs/lookup.json");

module.exports.startCommands = function(){
    client.ws.on("INTERACTION_CREATE", async (interaction) => {

        if (interaction.type === 3) return;

        const command = interaction.data.name.toLowerCase();
        const {name, options} = interaction.data;

        const guild = client.guilds.cache.get(interaction.guild_id);
        const member = guild.members.cache.get(interaction.member.user.id);

        const channel = guild.channels.cache.get(interaction.channel_id);
        const user = interaction.member.user;

        const args = {};

        if (options) {
            for (const option of options) {
                const {name, value} = option;
                args[name] = value.toLowerCase();
            }
        }

        if (command === "dictionary") {
            const embed = new Discord.MessageEmbed()
                .setTitle("📚 Dictionary")
                .setColor(defaultColor);

            let dictionaryLookupString = "";
            for(let i = 0; i < lookup.lookups.length; i++){
                const l = lookup.lookups[i];
                dictionaryLookupString += capitalize(l.title) + " " + l.emoji + "\n";
            }

            embed.addField("Lookups:", dictionaryLookupString);

            await reply(interaction, embed);
        } else if (command === "lookup"){
            let l = null;
            for(let i = 0; i < lookup.lookups.length; i++){
                const lu = lookup.lookups[i];
                if(lu.title === args.object){
                    l = lu;
                    break;
                }
            }

            if(l === null){
                replyError(interaction, "Please specify a valid lookup. To see all type ``/dictionary``.");
                return;
            }

            const embed = new Discord.MessageEmbed()
                .setTitle("Lookup for " + capitalize(l.title) + " " + l.emoji)
                .setColor(defaultColor)
                .setDescription(l.message);

            if(l.imageURL !== ""){
                embed.setThumbnail(l.imageURL);
            }

            await reply(interaction, embed);
        }
    });
}

module.exports.initCommands = function(){
    getApp(guildID).commands.post({
        data: {
            name: "lookup",
            description: "Lookup something from the table.",
            options: [
                {
                    name: "object",
                    description: "Which object you would like to lookup, /dictionary to see all.",
                    required: true,
                    type: 3,
                }
            ]
        }
    })

    getApp(guildID).commands.post({
        data: {
            name: "dictionary",
            description: "All lookup definitions",
        }
    })
}