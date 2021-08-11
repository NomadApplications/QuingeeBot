module.exports.startCommands = function(){
    client.on("message", message => {
        const args = message.content.split(" ").map(arg => arg.toLowerCase());
        const command = args[0];
        args.shift();

        const prefix = moderationPrefix;

        if(command === prefix + "ban"){
            if(!message.member.hasPermission("BAN_MEMBERS")) return;

            if(!args[0]) return rError(message, "You must specify a user.");

            let banMember = message.mentions.members.first() || message.guild.members.cache.get(args[0]) || message.guild.members.cache.find(r => r.user.username.toLowerCase() === args[0].toLocaleLowerCase()) || message.guild.members.cache.find(ro => ro.displayName.toLowerCase() === args[0].toLocaleLowerCase());
            if(!banMember) return rError(message, "User is not in the guild.");
            if(banMember === message.member) return rError(message, "You cannot ban yourself.");

            let reason = args.slice(1).join(" ");
            if(!banMember.bannable) return rError(message, "You cannot kick that user.");
            try {
                message.guild.members.ban(banMember);
                banMember.send(`**Hello, you have been banned from ${message.guild.name} for - ${reason || "No Reason"}**`).catch(()=>null);
            } catch {
                message.guild.members.ban(banMember);
            }
            if(reason){
                const sembed = new Discord.MessageEmbed()
                    .setColor(successColor)
                    .setDescription(`**${banMember.user.username}** has been banned for ${reason}.`);
                message.channel.send(sembed);
            } else {
                const sembed2 = new Discord.MessageEmbed()
                    .setColor(successColor)
                    .setDescription(`**${banMember.user.username}** has been banned.`);
                message.channel.send(sembed2);
            }
            let channel = message.guild.channels.cache.get(modlogID);
            if(!channel) return;

            const embed = new Discord.MessageEmbed()
                .setAuthor(`${message.guild.name} Modlogs`, message.guild.iconURL())
                .setColor(defaultColor)
                .setThumbnail(banMember.user.displayAvatarURL({dynamic: true}))
                .setFooter(message.guild.name, message.guild.iconURL())
                .addField("**Moderation**", "ban")
                .addField("**Banned**", banMember.user.username)
                .addField("**ID**", banMember.id)
                .addField("**Banned By**", message.author.username)
                .addField("**Reason**", `${reason || "**No Reason**"}`)
                .addField("**Date**", message.createdAt.toLocaleString())
                .setTimestamp();

            channel.send(embed);
        } else if (command === prefix + "unban"){
            if(!message.member.hasPermission("BAN_MEMBERS")) return;

            if(!args[0]) return rError(message, "Please enter a name!");

            let bannedMemberInfo = message.guild.fetchBans();

            let bannedMember;
            bannedMember = bannedMemberInfo.find(b => b.user.username.toLowerCase() === args[0].toLocaleLowerCase()) || bannedMemberInfo.get(args[0]) || bannedMemberInfo.find(bm => bm.user.tag.toLowerCase() === args[0].toLocaleLowerCase());
            if(!bannedMember) return rError(message, "Please provide a valid username, tag, or ID or the user is not banned.");

            let reason = args.slice(1).join(" ");

            try {
                if(reason){
                    message.guild.members.unban(bannedMember.user.id, reason);
                    const sembed = new Discord.MessageEmbed()
                        .setColor(successColor)
                        .setDescription(`**${bannedMember.user.tag} has been unbanned for **${reason}**.`);
                    message.channel.send(sembed);
                } else {
                    message.guild.members.unban(bannedMember.user.id, reason);
                    const sembed = new Discord.MessageEmbed()
                        .setColor(successColor)
                        .setDescription(`**${bannedMember.user.tag} has been unbanned.`);
                    message.channel.send(sembed);
                }
            } catch { }

            let channel = message.guild.channels.cache.get(modlogID);
            if(!channel) return;

            let embed = new Discord.MessageEmbed()
                .setColor(defaultColor)
                .setThumbnail(bannedMember.user.displayAvatarURL({ dynamic: true }))
                .setAuthor(`${message.guild.name} Modlogs`, message.guild.iconURL())
                .addField("**Moderation**", "unban")
                .addField("**Unbanned**", `${bannedMember.user.username}`)
                .addField("**ID**", `${bannedMember.user.id}`)
                .addField("**Moderator**", message.author.username)
                .addField("**Reason**", `${reason}` || "**No Reason**")
                .addField("**Date**", message.createdAt.toLocaleString())
                .setFooter(message.guild.name, message.guild.iconURL())
                .setTimestamp();

            channel.send(embed);
        }
    });
}
function rError(message, msg){
    const embed = new Discord.MessageEmbed()
        .setColor(errorColor)
        .setDescription(msg);

    message.channel.send(embed);

    return true;
}
