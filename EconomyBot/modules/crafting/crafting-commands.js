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

            const i1 = getItemByName(args.item1);
            const i2 = getItemByName(args.item2);
            if(i1 === null || i2 === null){
                await replyError(interaction, "Please specify a valid item name. ``/inventory [profile]`` to see all of your items.");
                return null;
            }

            if(profile.inventory.findIndex(x => x.name === args.item1) === -1 || profile.inventory.findIndex(x => x.name === args.item2)){
                await replyError(interaction, "Please specify 2 items that you have in your inventory.");
                return;
            }

            const newItem = combineItems(i1, i2);
            if(newItem === null){
                await replyError(interaction, "You cannot combine these two items.");
                return null;
            }

            const newI = getItemByName(newItem);
            if(newI === null){
                await replyError(interaction, "There was an error combining these items.");
                return;
            }

            const item1name = capitalize(args.item1);
            const item2name = capitalize(args.item2);
            const newItemName = capitalize(newItem);

            await replySuccess(interaction, "You have combined **" + item1name + "** and **" + item2name + "** to make **" + newItemName + "**!");

            removeItem(profile, i1);
            removeItem(profile, i2);

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
                embed.addField(capitalize(i.result), capitalize(i.items[0]) + " + " + capitalize(i.items[1]), true);
            })

            await reply(interaction, embed);
            return;
        }
    });
}