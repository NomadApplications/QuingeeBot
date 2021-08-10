module.exports.startCommands = async function() {
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

        if(command === "home"){
            const profile = getProfileByString(args.profile, user);
            if(profile === null){
                await replyError(interaction, "Please specify a valid profile name. If you would like to see your current profiles, type ``/profile list``.");
                return;
            }

            const embed = new Discord.MessageEmbed()
                .setTitle(`${profile.title.toUpperCase()} ACCESSED`)
                .setDescription(`**House Type**: *${profile.houseType.name}*`)
                .setColor(successColor);

            const nodes = [];

            for(let i = 0; i < profile.nodeSlots.length; i++){
                const slot = profile.nodeSlots[i];
                if(slot === null){
                    nodes.push("OPEN");
                    continue;
                }
                nodes.push(slot.name);
            }

            let nodeString = "";
            for(let i = 0; i < nodes.length; i++){
                nodeString += "**" + (i + 1) + "**: " + nodes[i] + "\n";
            }

            embed.addField("Node Slots:", nodeString, false);

            let furnitureString = "";
            const f = profile.inventory.filter(i => i.category === "furniture");
            if(f.length <= 0) embed.addField("Furniture:", "You do not have any furniture.", false);
            else {
                let itemNames = [];
                f.forEach(i => itemNames.push(i.name));

                let looped = [];
                for(let i = 0; i < f.length; i++){
                    if(looped.includes(f[i].name)) continue;
                    looped.push(f[i].name);

                    const count = findCounts(itemNames)[f[i].name];
                    furnitureString += "x" + count + " " + capitalize(f[i].name) + "\n";
                }
                embed.addField("Furniture:", furnitureString, false);
            }
            await reply(interaction, embed);
        } else if (command === "setnode"){
            const profile = getProfileByString(args.profile, user);
            if(profile === null) {
                await replyError(interaction, "Please specify a valid profile name. If you would like to see your current profiles, type ``/profile list``.");
                return;
            }

            const items = profile.inventory.filter(i => i.name === args.name);
            if(items.length <= 0){
                await replyError(interaction, "Please enter an item that you have in your inventory. If you would like to see your current inventory, type ``/inventory [profile]``.");
                return;
            }

            let item = null;
            if(Array.isArray(items)) item = items[0];
            else item = items;

            let slot = 1;

            if(profile.nodeSlots.length === 1) {
                await replyError(interaction, "You can only set a node if you have more than one node.");
                return;
            }

            for(let i = 0;  i < profile.nodeSlots.length; i++){
                if(profile.nodeSlots[i] === null){
                    slot = i;
                    break;
                }
            }

            const added = profile.setNode(item, slot);
            if(!added) {
                await replyError(interaction, "There was an error adding this node.");
                return;
            }
            await replySuccess(interaction, `You have successfully added ${capitalize(item.name)} to your node slots in ${profile.title}. Type ``/home ${profile.title}`` to see your current nodes.`);
        } else if (command === "removenode"){
            const profile = getProfileByString(args.profile, user);
            if(profile === null) {
                await replyError(interaction, "Please specify a valid profile name. If you would like to see your current profiles, type ``/profile list``.");
                return;
            }

            const items = profile.nodeSlots.filter(i => i.name === args.name);
            if(items.length <= 0){
                await replyError(interaction, "Please enter an item that is currently in a slot. If you would like to see your current node slots, type ``/home [profile]``.");
                return;
            }

            let item = null;
            if(Array.isArray(items)) item = items[0];
            else item = items;

            const removed = profile.removeNode(item);
            if(!removed){
                await replyError(interaction, "There was an error removing this node.");
                return;
            }

            await replySuccess(interaction, `You have successfully removed ${capitalize(item.name)} from your node slots in ${profile.title}. Type ``/home ${profile.title}`` to see your current nodes.`);
        }
    });
}

global.getProfileByString = function(title, user){
    const profiles = db.get(user.id + ".profiles");
    let profile = null;

    if(Array.isArray(profiles)){
        let titles = [];
        profiles.forEach(p => {
            titles.push(p.title.toLowerCase());
        })
        const profileIndex = titles.indexOf(title.toLowerCase());
        if(profileIndex < 0){
            return null;
        }
        profile = profiles[profileIndex];
    } else {
        profile = profiles;

        if(profile.title.toLowerCase() !== title.toLowerCase()){
            return null;
        }
    }

    return profile;
}