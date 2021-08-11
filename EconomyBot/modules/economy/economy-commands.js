module.exports.startCommands = async function () {
    client.ws.on("INTERACTION_CREATE", async (interaction) => {

        if (interaction.type === 3) return;

        const command = interaction.data.name.toLowerCase();
        const {name, options} = interaction.data;

        const channel = client.guilds.cache.get(interaction.guild_id).channels.cache.get(interaction.channel_id);
        const user = client.users.cache.get(interaction.member.user.id);

        const args = {};

        if (options) {
            for (const option of options) {
                const {name, value} = option;
                args[name] = value.toLowerCase();
            }
        }

        if (command === "balance") {
            if (!db.get(user.id + ".profiles")) {
                initUser(user);
            }

            if (!args.name) {
                const profiles = db.get(user.id + ".profiles");
                let profile = null;
                if (Array.isArray(profiles)) {
                    profile = profiles[0];
                } else {
                    profile = profiles;
                }
                let balance = profile.currencyAmount;

                if (balance === null) balance = 0;

                await replyCurrency(interaction, `${channel.guild.users.cache.get(getUserById(profile.id, profile.guildId)).username} currently has ${balance} ${currencyName}`);

                return;
            }

            const mentionedUserID = args.name.split("<@!").pop().slice(0, -1);

            if (!args.name.includes("<@") || isNaN(mentionedUserID)) {
                await replyError(interaction, "You need to **mention** a member.");
                return;
            }

            const mentionedUser = client.guilds.cache.get(interaction.guild_id).members.cache.get(mentionedUserID).user;

            if (!mentionedUser) {
                await replyError(interaction, "You need to mention a valid member.");
                return;
            }

            if (!args.profile) {

                const profiles = db.get(user.id + ".profiles");
                let profile = null;
                if (Array.isArray(profiles)) {
                    profile = profiles[0];
                } else {
                    profile = profiles;
                }
                const balance = profile.currencyAmount;

                await replyCurrency(interaction, `${getUserById(profile.id, profile.guildId).username} currently has ${balance} ${currencyName}`);

                return;
            }

            const profiles = db.get(mentionedUser.id + ".profiles");

            if (!Array.isArray(profiles)) {
                await replyError(interaction, "There is only one profile for this user, Main. Please just use /balance [user]");
                return;
            }

            let titles = [];

            for (let i = 0; i < profiles.length; i++) {
                titles.push(profiles[i].title.toLowerCase());
            }

            if (!titles.includes(args.profile)) {
                await replyError(interaction, "You need to specify a valid profile name.");
                return;
            }

            const profile = profiles[titles.indexOf(args.profile)];

            const balance = profile.currencyAmount;

            await replyCurrency(interaction, `${getUserById(profile.id, profile.guildId).username} currently has ${balance} ${currencyName} in ${profile.title}`);
        } else if (command === "profile") {
            if (!db.get(user.id + ".profiles")) {
                initUser(user);
            }
            if (args.type === "create") {
                if (db.get(user.id + ".profiles").length === maximumProfiles) {
                    await replyError(interaction, "You already have " + maximumProfiles + " profiles.");
                    return;
                }
                let profileName = "Profile" + db.get(user.id + ".profiles").length;
                if (!Array.isArray(db.get(user.id + ".profiles"))) {
                    profileName = "Profile1";
                }
                if (!args.name) {
                    const profile = new EcoProfile(startingCurrency, [], profileName, user.id, guildID, houseTypes.oneRoomCabin);
                    addNewProfile(user, profile);
                    await replySuccess(interaction, "Successfully created a new profile under the name " + profileName + "!");
                    return;
                }
                profileName = args.name;
                const profile = new EcoProfile(startingCurrency, [], profileName, user.id, guildID, houseTypes.oneRoomCabin);
                addNewProfile(user, profile);
                await replySuccess(interaction, "Successfully created a new profile under the name " + profileName + "!");
            } else if (args.type === "list") {
                const profiles = db.get(user.id + ".profiles");

                const embed = new Discord.MessageEmbed()
                    .setTitle("Quingee Profiles")
                    .setColor(currencyColor)
                    .setDescription("Your profiles:");

                if (!Array.isArray(profiles)) {
                    embed.addField(profiles.title, profiles.currencyAmount, false);
                    await reply(interaction, embed);
                    return;
                }
                for (let i = 0; i < profiles.length; i++) {
                    const profile = profiles[i];
                    embed.addField(profile.title, profile.currencyAmount, false);
                }

                await reply(interaction, embed);
            } else {
                await replyError(interaction, "You must mention a valid option [create, list].");
            }
        } else if (command == "daily") {
            if (!db.get(user.id)) initUser(user);

            const dailyReward = getRandom(minDailyReward, maxDailyReward, 0);

            if (!db.get(user.id + ".daily")) {
                let midnight = new Date();
                midnight.setHours(24, 0, 0, 0);

                let time = (midnight.getTime() - new Date().getTime()) / 1000 / 60;
                time = Math.floor(time);
                const print = convert(time);

                await replyError(interaction, "You've already redeemed your daily reward! Please wait until tomorrow to redeem again. " + print + " remaining.");
                return;
            }
            db.set(user.id + ".daily", false);

            let addedTo = [];
            const profiles = db.get(user.id + ".profiles");
            if(Array.isArray(profiles)){
                for(let i = 0; i < profiles.length; i++){
                    let m = 0;
                    profiles[i].nodeSlots.forEach(node => { if(node !== null) m++; })
                    addCurrency(profiles[i], dailyReward * m);
                    addedTo.push([profiles[i], m]);
                }
            } else {
                let m = 0;
                profiles.nodeSlots.forEach(node => { if(node !== null) m++; })
                profiles.addCurrency(profiles, dailyReward * m);
                addedTo.push([profiles, m]);
            }

            const embed = new Discord.MessageEmbed()
                .setTitle("Daily Reward")
                .setColor(currencyColor)
                .setDescription("Reward: " + dailyReward);

            addedTo.forEach(a => {
                const p = a[0];
                const m = a[1];
                embed.addField(p.title, `x${m} ($${dailyReward * m})`, false);
            })

            await reply(interaction, embed);
        } else if (command === "inventory") {
            await inventoryManager(user, interaction, args);
        } else if (command === "rename"){
            const profile = getProfileByString(args.profile, user);
            if (profile === null) {
                await replyError(interaction, "Please specify a valid profile name. If you would like to see your current profiles, type ``/profile list``.");
                return;
            }

            const p = profile;
            p.title = args.name;
            updateProfile(p);

            await replySuccess(interaction, `You have successfully changed the name of ${profile.title`)
        }
    });
}

async function inventoryManager(user, interaction, args) {
    const channel = client.guilds.cache.get(interaction.guild_id).channels.cache.get(interaction.channel_id);
    let profile = null;

    if (!args.profile) {
        profile = getProfileByString("Main", user);
        if (profile === null) {
            await replyError(interaction, "Please specify a valid profile name. If you would like to see your current profiles, type ``/profile list``.");
            return;
        }
    }

    if(profile === null){
        profile = getProfileByString(args.profile, user);
        if (profile === null) {
            await replyError(interaction, "Please specify a valid profile name. If you would like to see your current profiles, type ``/profile list``.");
            return;
        }
    }

    await reply(interaction, "Inventory below:");

    const embed = getPage(0, profile);

    if(initPages(profile).length === 1) {
        channel.send(embed);
        return;
    }
    sendEmbed(embed, channel, 0, profile, user);
}

function sendEmbed(embed, channel, pageNumber, profile, user){
    channel.send(embed).then(embedMessage => {
        editEmbed(embedMessage, embed, pageNumber, profile, user);
    })
}

function editEmbed(message, embed, pageNumber, profile, user) {
    message.edit(embed).then(embedMessage => {
        embedMessage.react('◀');
        embedMessage.react('▶');

        let e = null;
        let p = 0;

        const pages = initPages(profile);

        embedMessage.awaitReactions((reaction, u) => u.id == user.id && (reaction.emoji.name == '◀' || reaction.emoji.name == '▶'), {
            max: 1,
            time: 30000
        }).then(collected => {

            embedMessage.reactions.removeAll();

            if (collected.first().emoji.name == '◀') {
                if (pageNumber === 0) p = pages.length - 1;
                else p = pageNumber - 1;

                e = getPage(p, profile);

                editEmbed(embedMessage, e, p, profile, user);
            } else if (collected.first().emoji.name == "▶") {
                if (pageNumber === pages.length - 1) p = 0;
                else p = pageNumber + 1;

                e = getPage(p, profile);

                editEmbed(embedMessage, e, p, profile, user);
            }
        }).catch(() => {
            return;
        });
    });
}

function initPages(profile) {
    let pages = [];
    let currentPage = 0;
    pages[currentPage] = [];
    let added = [];
    let itemNames = [];
    profile.inventory.forEach(i => itemNames.push(i.name));
    for (let i = 0; i < profile.inventory.length; i++) {
        if (added.length > 20) {
            currentPage++;
            pages[currentPage] = [];
        }
        if(added.includes(profile.inventory[i].name)){
            continue;
        }
        const count = findCounts(itemNames)[profile.inventory[i].name];
        pages[currentPage].push([profile.inventory[i], count]);
        added.push(profile.inventory[i].name);
    }
    return pages;
}
function getPage(pageNumber, profile) {
    const pages = initPages(profile);
    const maximumPages = pages.length;

    const embed = new Discord.MessageEmbed()
        .setTitle("💼 Inventory")
        .setColor(currencyColor)
        .setDescription("Inventory of *" + profile.title + "*. **Items**:");

    if (pageNumber > pages.length) return null;

    for (let i = 0; i < pages[pageNumber].length; i++) {
        const item = pages[pageNumber][i][0];
        let sell = item.sell.toString();
        if(sell === "-1") sell = "N/A";

        embed.addField("x" + pages[pageNumber][i][1] + " " + capitalize(item.name), `**Sell**: *${sell}*\n**Category**: *${capitalize(item.category)} ${getEmojiByCategory(item)}*`, true);
    }
    embed.setFooter("Page " + (pageNumber+1) + " / " + maximumPages);

    return embed;
}

global.replyCurrency = async (interaction, response) => {
    const embed = new Discord.MessageEmbed()
        .setTitle("Quingee")
        .setColor(currencyColor)
        .setDescription(response);

    await reply(interaction, embed);
}


const convert = (n) => `0${n / 60 ^ 0}`.slice(-2) + ':' + ('0' + n % 60).slice(-2);