module.exports.startEvent = async function(){
    client.on("guildMemberAdd", async member => {
        initUser(member.user);
        await sendWelcome(member);
    });

    client.on("guildMemberRemove", async member => {
        await sendLeave(member);
    });
}

async function sendWelcome(member){
    const channel = member.guild.channels.cache.get(welcomeID);

    const rules = member.guild.channels.cache.get(rulesChannelID);
    const embed = new Discord.MessageEmbed()
        .setTitle("Welcome! 🎉")
        .setColor(defaultColor)
        .setDescription("Thanks for joining " + getMentionFromID(member.id) + "! You can check out the rules in " + rules.toString() + "! If you are interested in what we do, check out our website at " + websiteURL + ".");
    channel.send(embed);
}

async function sendLeave(member){
    const channel = member.guild.channels.cache.get(welcomeID);

    const embed = new Discord.MessageEmbed()
        .setTitle("Goodbye! 👋")
        .setColor(defaultColor)
        .setDescription("Thanks for visiting " + getMentionFromID(member.id) + " we hope you enjoyed your stay!");

    channel.send(embed);
}