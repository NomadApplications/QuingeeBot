module.exports.init = async function(){
    await getApp(guildID).commands.post({
        data: {
            name: "balance",
            description: "See your (or someone else's) current balance.",
            options: [
                {
                    name: "name",
                    description: "Who's balance you would like to get.",
                    required: false,
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

    await getApp(guildID).commands.post({
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
}