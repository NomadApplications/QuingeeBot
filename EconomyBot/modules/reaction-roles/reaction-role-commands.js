const rr = [];

module.exports.startCommands = function () {
    const guild = client.guilds.cache.get(guildID);
    const channel = guild.channels.cache.get(reactionRoleChannel);

    channel.bulkDelete(99);

    if (reactionRoles.length <= 0) return;
    for (let i = 0; i < reactionRoles.length; i++) {
        const title = reactionRoles[i].name;
        const description = reactionRoles[i].description;
        const options = reactionRoles[i].options;

        if (options.length <= 0) continue;

        const embed = new Discord.MessageEmbed()
            .setTitle(title)
            .setColor(defaultColor)
            .setDescription(description);

        for (let j = 0; j < options.length; j++) {
            embed.addField(options[j].emoji, "React if : **"+ options[j].description + "**", false);
        }

        channel.send(embed).then(embedMessage => {
            options.forEach(option => {
                embedMessage.react(option.emoji);
            })
            rr.push({
                message: embedMessage,
                options: options,
                channel: channel,
            });
        })
    }

    client.on('messageReactionAdd', (reaction, user) => {
        const guild = client.guilds.cache.get(guildID);
        const channel = guild.channels.cache.get(reactionRoleChannel);
        if (reaction.message.channel.id === channel.id) {
            handleReaction(reaction, user, true)
        }
    })

    client.on('messageReactionRemove', (reaction, user) => {
        const guild = client.guilds.cache.get(guildID);
        const channel = guild.channels.cache.get(reactionRoleChannel);
        if (reaction.message.channel.id === channel.id) {
            handleReaction(reaction, user, false)
        }
    })

    const handleReaction = (reaction, user, add) => {
        if(user.id === client.user.id) return;

        if (rr.length <= 0) return;
        const reactionRole = rr.find(r => r.message.id === reaction.message.id);
        if (reactionRole === null) return;

        const emoji = reaction._emoji.name;
        const option = reactionRole.options.find(o => o.emoji === emoji);
        if (option === null) return;

        const {guild} = reaction.message;

        const role = guild.roles.cache.find(ro => ro.id === option.id);
        if (role === null) return;

        const member = guild.members.cache.get(user.id);

        const roleAdded = add ? member.roles.add(role) : member.roles.remove(role);

        return roleAdded;
    }
}