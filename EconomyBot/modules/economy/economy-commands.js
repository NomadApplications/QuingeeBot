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
                if(Array.isArray(profiles)){
                    profile = profiles[0];
                } else {
                    profile = profiles;
                }
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

                const profiles = db.get(user.id + ".profiles");
                let profile = null;
                if(Array.isArray(profiles)){
                    profile = profiles[0];
                } else {
                    profile = profiles;
                }
                const balance = profile.currencyAmount;

                await replyCurrency(interaction, `${profile.owner.username} currently has ${balance} ${currencyName}`);

                return;
            }

            const profiles = db.get(mentionedUser.id + ".profiles");

            if(!Array.isArray(profiles)){
                await replyError(interaction, "There is only one profile for this user, Main. Please just use /balance [user]");
                return;
            }

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
                if (db.get(user.id + ".profiles").length === maximumProfiles) {
                    await replyError(interaction, "You already have " + maximumProfiles + " profiles.");
                    return;
                }
                let profileName = "Profile" + db.get(user.id + ".profiles").length;
                if(!Array.isArray(db.get(user.id + ".profiles"))){
                    profileName = "Profile1";
                }
                if (!args.name) {
                    const profile = new EcoProfile(startingCurrency, [], 1, profileName, user);
                    addNewProfile(user, profile);
                    await replySuccess(interaction, "Successfully created a new profile under the name " + profileName + "!");
                    return;
                }
                profileName = args.name;
                const profile = new EcoProfile(startingCurrency, [], 1, profileName, user);
                addNewProfile(user, profile);
                await replySuccess(interaction, "Successfully created a new profile under the name " + profileName + "!");
            } else if (args.type === "list") {
                const profiles = db.get(user.id + ".profiles");

                const embed = new Discord.MessageEmbed()
                    .setTitle("Quingee Profiles")
                    .setColor(currencyColor)
                    .setDescription("Your profiles:");

                console.log(profiles);

                if(!Array.isArray(profiles)){
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
        } else if (command == "daily"){
            if(!db.get(user.id)) initUser(user);

            if(!db.get(user.id + ".daily")){
                let midnight = new Date();
                midnight.setHours(24, 0, 0, 0);

                let time = (midnight.getTime() - new Date().getTime()) / 1000 / 60;
                time = Math.floor(time);
                const print = convert(time);

                await replyError(interaction, "You've already redeemed your daily reward! Please wait until tomorrow to redeem again. " + print + " reminding.");
                return;
            }
            db.set(user.id + ".daily", false);

            const dailyReward = getRandom(minDailyReward, maxDailyReward, 0);

            let addedTo = [];

            const profiles = db.get(user.id + ".profiles");
            if(Array.isArray(profiles)){
                for(let i = 0; i < profiles.length; i++){
                    const currentProfile = profiles[i];
                    if(currentProfile.nodeSlots === 0) {
                        continue;
                    }
                    for(let j = 0; j < currentProfile.nodeSlots; j++){
                        const newProfile = currentProfile;
                        newProfile.currencyAmount += dailyReward;
                        updateProfile(newProfile);
                        addedTo.push(newProfile);
                    }
                }

                console.log(db.get(user.id + ".profiles"));

                console.log(addedTo);

                if(addedTo.length === 0){
                    await replyError(interaction, "You don't have any profiles that contain nodes.");
                    return;
                }

                const embed = new Discord.MessageEmbed()
                    .setTitle("Quingee Daily Rewards")
                    .setDescription("Daily Reward. **Amount: " + dailyReward + "**.")
                    .setColor(currencyColor);

                for(let i = 0; i < addedTo.length; i++){
                    embed.addField(addedTo[i].title, "*Node Slots*: **" + addedTo[i].nodeSlots + "**\n*Current Currency*: **" + addedTo[i].currencyAmount + "**", false);
                }

                await reply(interaction, embed);
            } else {
                const profile = db.get(user.id + ".profiles");

                if(profile.nodeSlots === 0){
                    await replyError(interaction, "You don't have any profiles that contain nodes.");
                    return;
                }

                for(let i = 0; i < profile.nodeSlots; i++){
                    profile.currencyAmount += dailyReward;
                }
                updateProfile(profile);

                const embed = new Discord.MessageEmbed()
                    .setTitle("Quingee Daily Rewards")
                    .setDescription("Daily Reward. **Amount: " + dailyReward + "**.")
                    .setColor(currencyColor)
                    .addField(profile.title, "**Node Slots**: " + profile.nodeSlots + ".\n**Current Currency**: " + profile.currencyAmount, false);

                await reply(interaction, embed);
            }
        }
    })
}

global.replyCurrency = async (interaction, response) => {
    const embed = new Discord.MessageEmbed()
        .setTitle("Quingee")
        .setColor(currencyColor)
        .setDescription(response);

    await reply(interaction, embed);
}

const convert = (n) => `0${n / 60 ^ 0}`.slice(-2) + ':' + ('0' + n % 60).slice(-2);