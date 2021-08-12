module.exports.init = function() {
     getApp(guildID).commands.post({
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

     getApp(guildID).commands.post({
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

     getApp(guildID).commands.post({
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

     getApp(guildID).commands.post({
        data: {
            name: "upgrade",
            description: "Buy a house. (One Bedroom House, 3 Room 2 Bath).",
            options: [
                {
                    name: "profile",
                    description: "Which profile you would like to upgrade.",
                    required: true,
                    type: 3
                }
            ]
        }
    })

    getApp(guildID).commands.post({
        data: {
            name: "claimnodes",
            description: "Claim all nodes from a specific profile",
            options: [
                {
                    name: "profile",
                    description: "Which profile you would like to claim from.",
                    required: true,
                    type: 3
                }
            ]
        }
    })
}