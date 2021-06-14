module.exports.startCommands = async function(){
    client.ws.on("INTERACTION_CREATE", async interaction => {
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

        if(command === "day"){
            if(db.get("seasons") === null){
                initSeasons();
            }
            let currentDay = db.get("seasons.currentDay");
            let currentSeason = db.get("seasons.currentSeason");
            await reply(interaction, `It is currently day ${currentDay}/${seasonLength} of ${currentSeason}!`);
        }
    })
}