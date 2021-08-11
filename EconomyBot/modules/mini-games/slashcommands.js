module.exports.init = function(){
    getApp(guildID).commands.post({
        data: {
            name: "fish",
            description: "Go fishing!",
        }
    })

    getApp(guildID).commands.post({
        data: {
            name: "mine",
            description: "Go mining!",
        }
    })

    getApp(guildID).commands.post({
        data: {
            name: "gather",
            description: "Gather so materials!",
        }
    })
}