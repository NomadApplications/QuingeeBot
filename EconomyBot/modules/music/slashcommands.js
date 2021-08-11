module.exports.init = function() {
     getApp(guildID).commands.post({
        data: {
            name: "music",
            description: "Quingee's music bot function.",
            options: [
                {
                    name: "function",
                    description: "(play, skip, stop, queue)",
                    required: true,
                    type: 3,
                },
                {
                    name: "song",
                    description: "How much you would like to buy.",
                    required: false,
                    type: 3
                },
            ]
        }
    })
}