module.exports.init = function(){
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
                    description: "What kind of function you would like to use. [create, list, delete]",
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