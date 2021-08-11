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

        if (command === "mine") {
            const profiles = db.get(user.id + ".profiles");
            let profile = Array.isArray(profiles) ? profiles[0] : profiles;

            const embed = new Discord.MessageEmbed()
                .setTitle("⛏ Mining Mini-game")
                .setColor(defaultColor)
                .setDescription("Sift through the stones!");

            await reply(interaction, "Mini-game below:");
            channel.send(embed).then(embedMessage => {
                embedMessage.react("⛰");
                embedMessage.react("🏔️");
                embedMessage.react("🗻");

                embedMessage.awaitReactions((reaction, u) => u.id == user.id && (reaction.emoji.name == '⛰' || reaction.emoji.name == '🏔️' || reaction.emoji.name == '🗻'), {
                    max: 1,
                    time: 30000
                }).then(collected => {

                    embedMessage.reactions.removeAll();

                    const randomItem = mining[getRandom(Object.keys(mining))];

                    const e = new Discord.MessageEmbed()
                        .setTitle("Reward! 🌟")
                        .setColor(successColor)
                        .setDescription(`You won ${capitalize(randomItem.name)}! Congratulations, it has been added to ${profile.title}!`);

                    giveItem(profile, randomItem, 1);

                    channel.send(e);
                }).catch(() => {
                    return;
                });
            })
        } else if (command === "fish") {
            const profiles = db.get(user.id + ".profiles");
            let profile = Array.isArray(profiles) ? profiles[0] : profiles;

            const embed = new Discord.MessageEmbed()
                .setTitle("🎣 Fishing Mini-game")
                .setColor(defaultColor)
                .setDescription("Pull the pole up at the right time for good rewards!");

            await reply(interaction, "Mini-game below:");

            channel.send(embed).then(embedMessage => {
                let timer = setInterval(function(){
                    embed.setColor(successColor);
                    embedMessage.edit(embed).then(edited => {
                        edited.react("🎣");

                        embedMessage.awaitReactions((reaction, u) => u.id == user.id && (reaction.emoji.name == '🎣'), {
                            max: 1,
                            time: 30000
                        }).then(collected => {
                            embedMessage.reactions.removeAll();

                            const randomItem = fishing[getRandom(Object.keys(fishing))];

                            const e = new Discord.MessageEmbed()
                                .setTitle("Reward! 🌟")
                                .setColor(successColor)
                                .setDescription(`You won ${capitalize(randomItem.name)}! Congratulations, it has been added to ${profile.title}!`);

                            channel.send(e);

                            giveItem(profile, randomItem, 1);
                        }).catch(()=>{
                            return;
                        });
                    });
                    clearInterval(timer);
                }, getRandomByRange(3000, 6000));
            })
        } else if (command === "gather") {
            const profiles = db.get(user.id + ".profiles");
            let profile = Array.isArray(profiles) ? profiles[0] : profiles;

            const embed = new Discord.MessageEmbed()
                .setTitle("🧤 Gathering Mini-game")
                .setColor(defaultColor)
                .setDescription("Roll the dice for good rewards!");

            await reply(interaction, "Mini-game below:");

            channel.send(embed).then(embedMessage => {
                embedMessage.react("🎲");

                embedMessage.awaitReactions((reaction, u) => u.id == user.id && (reaction.emoji.name == '🎲'), {
                    max: 1,
                    time: 30000
                }).then(collected => {
                    embedMessage.reactions.removeAll();
                    let side = getRandomIntInclusive(1, 6);

                    const randomItem = gathering[getRandom(Object.keys(gathering))];

                    const e = new Discord.MessageEmbed()
                        .setTitle("You rolled a " + side + "!")
                        .setColor(successColor)
                        .setDescription(`You won ${capitalize(randomItem.name)}! Congratulations, it has been added to ${profile.title}!`);

                    giveItem(profile, randomItem, 1);

                    channel.send(e);
                }).catch(()=>{
                    return;
                })
            })
        }
    });
}

function getRandom(arr){
    return arr[Math.floor(Math.random() * arr.length)];
}

function getRandomIntInclusive(min, max){
    min = Math.min(min, max);
    max = Math.max(max, min);
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function getRandomByRange(min, max){
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min) + min);
}