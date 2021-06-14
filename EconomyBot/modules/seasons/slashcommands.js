module.exports.init = async function(){
    await getApp(guildID).commands.post({
        data: {
            name: "day",
            description: "See the current day of the season.",
        }
    })
}