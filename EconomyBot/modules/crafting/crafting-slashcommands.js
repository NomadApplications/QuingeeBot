module.exports.init = function(){
    getApp(guildID).commands.post({
        data: {
            name: "craft",
            description: "Combine items to make new items!",
            options: [
                {
                    name: "profile",
                    description: "Which profile you would like to use.",
                    required: true,
                    type: 3
                },
                {
                    name: "item1",
                    description: "First item you would like to use.",
                    required: true,
                    type: 3
                },
                {
                    name: "item2",
                    description: "Second item you would like to use.",
                    required: true,
                    type: 3
                }
            ]
        }
    })

    getApp(guildID).commands.post({
        data: {
            name: "recipes",
            description: "See all recipes",
        }
    })
}