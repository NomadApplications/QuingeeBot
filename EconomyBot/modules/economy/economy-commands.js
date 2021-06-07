module.exports.startCommands = async function(){
    client.ws.on("INTERACTION_CREATE", async (interaction) => {
        const command = interaction.data.name.toLowerCase();
        const { name, options } = interaction.data;

        const user = client.users.cache.get(interaction.member.user.id);

        const args = {};

        if(options){
            for(const option of options){
                const { name, value } = option;
                args[name] = value.toLowerCase();
            }
        }

        if(command === "balance") {

        } else if (command === "profile"){
            if(!db.get(user.id + ".profiles")){
                initUser(user);
            }
            if(args.type === "create"){
                if(db.get(user.id + ".profiles").length === 3) {
                    await replyError(interaction, "You already have 3 profiles.");
                    return;
                }
                let profileName = "Profile" + db.get(user.id + ".profiles").length;
                if(!args.name){
                    const profile = new EcoProfile(startingCurrency, [], profileName, user);
                    addNewProfile(profile);
                    await replySuccess(interaction, "Successfully created a new profile under the name " + profileName + "!");
                    return;
                }
                profileName = args.name;
                const profile = new EcoProfile(startingCurrency, [], profileName, user);
                addNewProfile(profile);
                await replySuccess(interaction, "Successfully created a new profile under the name " + profileName + "!");
            } else if (args.type === "list"){
                const profiles = db.get(user.id + ".profiles");

                const embed = new Discord.MessageEmbed()
                    .setTitle("Quingee")
                    .setColor(defaultColor)
                    .setDescription("All of your profiles:");

                for(let i = 0; i < profiles.length; i++){
                    embed.addField(profiles[i].title, profiles[i].currencyAmount, false);
                }

                await reply(interaction, embed);
            } else if (args.type === "remove"){
                if(!args.name){
                    await replyError(interaction, "You need to specify a profile name.");
                    return;
                }
                if(!db.get(user.id + ".profiles")[args.name]){
                    await replyError(interaction, "That is not a valid profile name. To see all of your profiles, type /profile list");
                    return;
                }
                const profile = db.get(user.id + ".profiles")[args.name];

                //db.set(user.id + ".profiles", db.get(user.id + ".profiles").filter(p => p !== profile));

                await replySuccess(interaction, "Successfully removed " + profile.title + " from your ")
            } else {
                await replyError(interaction, "You must mention a valid option [create, remove, list].");
            }
        }
    })
}