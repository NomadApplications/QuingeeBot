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

        if (command === "craft") {
            const profile = getProfileByString(args.profile, user);
            if (profile === null) {
                await replyError(interaction, "Please specify a valid profile name. If you would like to see your current profiles, type ``/profile list``.");
                return;
            }

            const newItem = combineItems(args.recipe, profile);

            if(newItem.error !== undefined){
                await replyError(interaction, newItem.error);
                return;
            }

            const newI = getItemByName(newItem.result);
            if(newI === null){
                await replyError(interaction, "There was an error combining these items.");
                return;
            }

            await replySuccess(interaction, `You have combined **x${newItem.items[0].amount} ${capitalize(newItem.items[0].name)}** and **x${newItem.items[1].amount} ${capitalize(newItem.items[1].name)}** to make **${capitalize(newItem.result)}**!`);

            removeItem(profile, getItemByName(newItem.items[0].name));
            removeItem(profile, getItemByName(newItem.items[1].name));

            addItemToProfile(profile, newI);
        } else if (command === "recipes"){
            const embed = new Discord.MessageEmbed()
                .setTitle("Crafting Recipes")
                .setColor(defaultColor)
                .setDescription("All crafting recipes:");

            if(crafting_recipes.length === 0){
                embed.setDescription("There are no crafting recipes.");
                await reply(interaction, embed);
                return;
            }
            crafting_recipes.recipes.forEach(i => {
                embed.addField(capitalize(i.result), `**x${i.items[0].amount} ${capitalize(i.items[0].name)}** + **x${i.items[1].amount} ${capitalize(i.items[1].name)}**`, true);
            })

            await reply(interaction, embed);
            return;
        }
    });
}