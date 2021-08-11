module.exports.init = function(){
    getApp(guildID).commands.post({
        data: {
            name: "balance",
            description: "See your (or someone else's) current balance.",
            options: [
                {
                    name: "name",
                    description: "Who's balance you would like to get.",
                    required: true,
                    type: 3,
                },
                {
                    name: "profile",
                    description: "Which profile you would like to use.",
                    required: false,
                    type: 3
                },
            ]
        }
    })

    getApp(guildID).commands.post({
        data: {
            name: "daily",
            description: "Get your daily rewards.",
        },
    })

    getApp(guildID).commands.post({
        data: {
            name: "profile",
            description: "Manage your profiles",
            options: [
                {
                    name: "type",
                    description: "What kind of function you would like to use. [create, list]",
                    required: true,
                    type: 3,
                },
                {
                    name: "name",
                    description: "Name of the profile.",
                    required: false,
                    type: 3,
                }
            ]
        }
    })

    getApp(guildID).commands.post({
        data: {
            name: "inventory",
            description: "See your current inventory.",
            options: [
                {
                    name: "profile",
                    description: "Which profile's inventory you would like to see. [not case-sensitive]",
                    required: false,
                    type: 3,
                }
            ]
        }
    })

    getApp(guildID).commands.post({
        data: {
            name: "rename",
            description: "Rename a profile!",
            options: [
                {
                    name: "profile",
                    description: "Which profile you would like to rename.",
                    required: true,
                    type: 3,
                },
                {
                    name: "name",
                    description: "New name for profile",
                    required: true,
                    type: 3
                }
            ]
        }
    })
}