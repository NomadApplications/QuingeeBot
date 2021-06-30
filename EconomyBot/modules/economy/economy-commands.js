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
                const profile = db.get(user.id + ".profiles")[0];
                let balance = profile.currencyAmount;

                if(balance === null) balance = 0;

                await replyCurrency(interaction, `${channel.guild.users.cache.get(profile.owner).username} currently has ${balance} ${currencyName}`);

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

                const profile = db.get(mentionedUserID + ".profiles")[0];
                const balance = profile.currencyAmount;

                await replyCurrency(interaction, `${profile.owner.username} currently has ${balance} ${currencyName}`);

                return;
            }

            const profiles = db.get(mentionedUser.id + ".profiles");

            let titles = [];

            for(let i = 0; i < profiles.length; i++){
                titles.push(profiles[i].title.toLowerCase());
            }

            if(!titles.includes(args.profile)){
                await replyError(interaction, "You need to specify a valid profile name.");
                return;
            }

            const profile = profiles[titles.indexOf(args.profile)];

            const balance = profile.currencyAmount;

            await replyCurrency(interaction, `${profile.owner.username} currently has ${balance} ${currencyName} in ${profile.title}`);
        } else if (command === "profile") {
            if (!db.get(user.id + ".profiles")) {
                initUser(user);
            }
            if (args.type === "create") {
                if (db.get(user.id + ".profiles").length === 3) {
                    await replyError(interaction, "You already have 3 profiles.");
                    return;
                }
                let profileName = "Profile" + db.get(user.id + ".profiles").length;
                if (!args.name) {
                    const profile = new EcoProfile(0, [], 1, profileName, user);
                    addNewProfile(user, profile);
                    await replySuccess(interaction, "Successfully created a new profile under the name " + profileName + "!");
                    return;
                }
                profileName = args.name;
                const profile = new EcoProfile(0, [], 1, profileName, user);
                addNewProfile(profile);
                await replySuccess(interaction, "Successfully created a new profile under the name " + profileName + "!");
            } else if (args.type === "list") {
                const profiles = db.get(user.id + ".profiles");

                const embed = new Discord.MessageEmbed()
                    .setTitle("Quingee")
                    .setColor(defaultColor)
                    .setDescription("All of your profiles:");

                for (let i = 0; i < profiles.length; i++) {
                    embed.addField(profiles[i].title, profiles[i].currencyAmount, false);
                }

                await reply(interaction, embed);
            } else {
                await replyError(interaction, "You must mention a valid option [create, list].");
            }
        } else if (command == "daily"){
            if(!db.get(user.id)) initUser(user);

            const dailyReward = getRandom(minDailyReward, maxDailyReward, 0);

            let addedTo = [];

            for(let i = 0; i < db.get(user.id + ".profiles").length; i++){
                const currentProfile = db.get(user.id + ".profiles")[i];
                if(currentProfile.node_slots === 0) continue;
                for(let j = 0; j < currentProfile.node_slots; i++){
                    currentProfile.currencyAmount += dailyReward;
                    addedTo.push(currentProfile);
                }
            }

            const embed = new Discord.MessageEmbed()
                .setTitle("Quingee")
                .setDescription("Daily Reward. **Amount: " + dailyReward + "**.")
                .setColor(currencyColor);

            for(let i = 0; i < addedTo.length; i++){
                embed.addField(addedTo[i].title, "Node slots: " + addedTo[i].node_slots + ".\nCurrent Currency: " + addedTo[i].currencyAmount, true);
            }

            reply(interaction, embed);
        }
    })

    client.on('clickButton', async (button) => {
        //console.log(button);
    });
}

async function replyCurrency(interaction, response) {
    const embed = new Discord.MessageEmbed()
        .setTitle("Quingee")
        .setColor(currencyColor)
        .setDescription(response);

    await reply(interaction, embed);
}