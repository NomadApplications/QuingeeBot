module.exports.init = async function() {
    await getApp(guildID).commands.post({
        data: {
            name: "home",
            description: "All home commands.",
            options: [
                {
                    name: "profile",
                    description: "Name of profile [not case sensitive].",
                    required: true,
                    type: 3,
                }
            ]
        }
    })

    await getApp(guildID).commands.post({
        data: {
            name: "setnode",
            description: "Set a node to one of your profiles.",
            options: [
                {
                    name: "profile",
                    description: "Name of profile [not case sensitive].",
                    required: true,
                    type: 3,
                },
                {
                    name: "item",
                    description: "Name of item [not case sensitive].",
                    required: true,
                    type: 3,
                }
            ]
        }
    })

    await getApp(guildID).commands.post({
        data: {
            name: "removenode",
            description: "Remove a node from one of your profiles.",
            options: [
                {
                    name: "profile",
                    description: "Name of profile [not case sensitive].",
                    required: true,
                    type: 3,
                },
                {
                    name: "item",
                    description: "Name of item [not case sensitive].",
                    required: true,
                    type: 3,
                }
            ]
        }
    })
}