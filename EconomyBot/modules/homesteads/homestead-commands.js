module.exports.startCommands = function () {
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

        if (command === "home") {
            const profile = getProfileByString(args.profile, user);
            if (profile === null) {
                await replyError(interaction, "Please specify a valid profile name. If you would like to see your current profiles, type ``/profile list``.");
                return;
            }

            const embed = new Discord.MessageEmbed()
                .setTitle(`${profile.title.toUpperCase()} ACCESSED`)
                .setDescription(`**House Type**: *${profile.houseType.name}*`)
                .setColor(successColor);

            const nodes = [];

            for (let i = 0; i < profile.nodeSlots.length; i++) {
                const slot = profile.nodeSlots[i];
                if (slot === null) {
                    nodes.push("OPEN");
                    continue;
                }
                nodes.push(slot.name);
            }

            let nodeString = "";
            for (let i = 0; i < nodes.length; i++) {
                const nodeTitle = nodes[i] === "OPEN" ? "OPEN" : capitalize(nodes[i]);
                nodeString += "**" + (i + 1) + "**: " + nodeTitle + "\n";
            }

            embed.addField("Node Slots:", nodeString, false);

            let furnitureString = "";
            const f = profile.inventory.filter(i => i.category === "furniture");
            if (f.length <= 0) embed.addField("Furniture:", "You do not have any furniture.", false);
            else {
                let itemNames = [];
                f.forEach(i => itemNames.push(i.name));

                let looped = [];
                for (let i = 0; i < f.length; i++) {
                    if (looped.includes(f[i].name)) continue;
                    looped.push(f[i].name);

                    const count = findCounts(itemNames)[f[i].name];
                    furnitureString += "x" + count + " " + capitalize(f[i].name) + "\n";
                }
                embed.addField("Furniture:", furnitureString, false);
            }
            await reply(interaction, embed);
        } else if (command === "setnode") {
            const profile = getProfileByString(args.profile, user);
            if (profile === null) {
                await replyError(interaction, "Please specify a valid profile name. If you would like to see your current profiles, type ``/profile list``.");
                return;
            }

            const items = profile.inventory.filter(i => i.name === args.item);
            if (items.length <= 0) {
                await replyError(interaction, "Please enter an item that you have in your inventory. If you would like to see your current inventory, type ``/inventory [profile]``.");
                return;
            }

            let item = Array.isArray(items) ? items[0] : items;

            const nodeItem = getNodeItem(item.name);
            if(nodeItem === null){
                await replyError(interaction, "You must supply a node item.");
                return;
            }

            let slot = -1;

            for (let i = 0; i < profile.nodeSlots.length; i++) {
                if (profile.nodeSlots[i] === null) {
                    slot = i;
                    break;
                }
            }

            if(slot === -1){
                await replyError(interaction, "You must remove a node or upgrade your house before adding any more.");
                return;
            }

            const added = setNode(profile, item, slot);
            if (!added) {
                await replyError(interaction, "There was an error adding this node.");
                return;
            }
            await replySuccess(interaction, "You have successfully added " + capitalize(item.name) + " to your node slots in " + profile.title + ". Type ``/home [profile]`` to see your current nodes.");
        } else if (command === "removenode") {
            const profile = getProfileByString(args.profile, user);
            if (profile === null) {
                await replyError(interaction, "Please specify a valid profile name. If you would like to see your current profiles, type ``/profile list``.");
                return;
            }

            let item = null;
            for(let i = 0; i < profile.nodeSlots.length; i++){
                if(profile.nodeSlots[i] === null) continue;
                if(profile.nodeSlots[i].name === args.item){
                    item = profile.nodeSlots[i];
                    break;
                }
            }
            if (item === null) {
                await replyError(interaction, "Please enter an item that is currently in a slot. If you would like to see your current node slots, type ``/home [profile]``.");
                return;
            }

            const removed = removeNode(profile, item);
            if (!removed) {
                await replyError(interaction, "There was an error removing this node.");
                return;
            }

            await replySuccess(interaction, "You have successfully removed " + capitalize(item.name) + " from your node slots in " + profile.title + ". Type ``/home [profile]`` to see your current nodes.");
        } else if (command === "upgrade") {
            const profile = getProfileByString(args.profile, user);
            if (profile === null) {
                await replyError(interaction, "Please specify a valid profile name. If you would like to see your current profiles, type ``/profile list``.");
                return;
            }
            let houseType = profile.houseType;
            let previous =  profile.houseType;
            const index = houses.findIndex(x => x.name === houseType.name);
            if(index === -1){
                await replyError(interaction, "There was an error upgrading, please contact an administrator.");
                return;
            }
            if(index=== houses.length - 1){
                await replyError(interaction, "You already have the best house.");
                return;
            }
            houseType = houses[index + 1];

            if(profile.currencyAmount < houseType.price){
                await replyError(interaction, "You do not have enough " + currencyName + " to upgrade your house! You need " + houseType.price + " and you currently have " + profile.currencyAmount);
                return;
            }

            const embed = new Discord.MessageEmbed()
                .setTitle("🏠 House Upgrade!")
                .setDescription(`*${profile.houseType.name}* -> **${houseType.name}** (**${moneyPrefix} ${houseType.price}**). If you would like to confirm, react with ✅.`)
                .setColor(defaultColor);

            await reply(interaction, "Upgrade Below:");

            channel.send(embed).then(async embedMessage => {
                await embedMessage.react("✅");

                embedMessage.awaitReactions((reaction, u) => u.id == user.id && (reaction.emoji.name == '✅'), {
                    max: 1,
                    time: 30000
                }).then(collected => {
                    embedMessage.reactions.removeAll();

                    if (collected.first().emoji.name == '✅') {
                        removeCurrency(profile, houseType.price);
                        const p = profile;
                        p.houseType = houseType;

                        let previousNodes = profile.nodeSlots;
                        let newNodes = [];
                        for(let i = 0; i < previousNodes.length; i++){
                            if(previousNodes[i] === null) continue;
                            newNodes.push(previousNodes[i]);
                        }
                        for(let i = 0; i < houseType.nodeAmount; i++){
                            if(!newNodes[i]) newNodes.push(null);
                        }
                        p.nodeSlots = newNodes;
                        updateProfile(p);

                        const s = new Discord.MessageEmbed()
                            .setTitle("SUCCESS")
                            .setColor(successColor)
                            .setDescription("You have upgraded from *" + previous.name + "* to **" + houseType.name + "**!");

                        channel.send(s);
                        return;
                    }
                }).catch(() => {
                    return;
                })
            })
        } else if (command === "claimnodes"){
            const profile = getProfileByString(args.profile, user);
            if (profile === null) {
                await replyError(interaction, "Please specify a valid profile name. If you would like to see your current profiles, type ``/profile list``.");
                return;
            }

            if(profile.nodeSlots.length <= 0){
                await replyError(interaction, "You dont have any node slots available.");
                return;
            }

            if(profile.claimedNodes){
                let midnight = new Date();
                midnight.setHours(24, 0, 0, 0);

                let time = (midnight.getTime() - new Date().getTime()) / 1000 / 60;
                time = Math.floor(time);
                const print = convert(time);

                await replyError(interaction, "You already claimed your nodes for this profile! Please wait Please wait until tomorrow to redeem again. " + print + " remaining.");
                return;
            }

            setClaimedNodes(profile, true);

            let added = [];

            for(let i = 0; i < profile.nodeSlots.length; i++){
                const n = profile.nodeSlots[i];
                if(n === null) continue;
                const nodeItem = getNodeItem(n.name);
                if(nodeItem === null) continue;

                const c = getItemByName(nodeItem.item);
                if(c === null) continue;

                let z = [];
                const a = getRandomIntInclusive(nodeItem.amountMin, nodeItem.amountMax);
                for(let i = 0; i < a; i++){
                    addItemToProfile(profile, c);
                    z.push(c.name);
                }
                added.push([n.name, z]);
            }

            if(added.length === 0){
                await replyError(interaction, "There was an error.");
                setClaimedNodes(profile, false);
                return;
            }

            const embed = new Discord.MessageEmbed()
                .setTitle("Claimed Nodes")
                .setColor(currencyColor)
                .setDescription("Nodes that you have claimed");

            for(let i = 0; i < added.length; i++){
                embed.addField(capitalize(added[i][0]), "x" + added[i][1].length + " " + added[i][1][0]);
            }

            await reply(interaction, embed);
        }
    });
}

const node_config = require("../../configs/nodes.json");

function getNodeItem(name){
    for(let i = 0; i < node_config.nodes.length; i++){
        if(node_config.nodes[i].name === name){
            return node_config.nodes[i];
        }
    }
    return null;
}

global.getProfileByString = function (title, user) {
    const profiles = db.get(user.id + ".profiles");
    let profile = null;

    if (Array.isArray(profiles)) {
        let titles = [];
        profiles.forEach(p => {
            titles.push(p.title.toLowerCase());
        })
        const profileIndex = titles.indexOf(title.toLowerCase());
        if (profileIndex < 0) {
            return null;
        }
        profile = profiles[profileIndex];
    } else {
        profile = profiles;

        if (profile.title.toLowerCase() !== title.toLowerCase()) {
            return null;
        }
    }

    return profile;
}