module.exports.init = async function() {
    await getApp(guildID).commands.post({
        data: {
            name: "shop",
            description: "See the item shop.",
        }
    })

    await getApp(guildID).commands.post({
        data: {
            name: "sell",
            description: "Sell any items in your inventory.",
            options: [
                {
                    name: "item",
                    description: "Which item you would like to sell.",
                    required: true,
                    type: 3
                },
                {
                    name: "amount",
                    description: "[number, max].",
                    required: false,
                    type: 3
                }
            ]
        }
    })

    await getApp(guildID).commands.post({
        data: {
            name: "inventory",
            description: "See all of your items.",
        }
    })

    await getApp(guildID).commands.post({
        data: {
            name: "buy",
            description: "See your (or someone else's) current balance.",
            options: [
                {
                    name: "profile",
                    description: "Which profile you would like to buy it from.",
                    required: true,
                    type: 3
                },
                {
                    name: "item",
                    description: "What item you would like to purchase. (type /shop to see all items)",
                    required: true,
                    type: 3,
                },
                {
                    name: "quantity",
                    description: "How much you would like to buy.",
                    required: false,
                    type: 3,
                }
            ]
        }
    })

    getApp(guildID).commands.post({
        data: {
            name: "transfer",
            description: "Transfer money between accounts",
            options: [
                {
                    name: "profile1",
                    description: "The profile you will take money from.",
                    required: true,
                    type: 3,
                },
                {
                    name: "profile2",
                    description: "The profile you will give money to.",
                    required: true,
                    type: 3,
                },
                {
                    name: "amount",
                    description: "Amount of money to transfer.",
                    required: true,
                    type: 3
                }
            ]
        }
    })

    getApp(guildID).commands.post({
        data: {
            name: "itemtransfer",
            description: "Transfer an item between profiles.",
            options: [
                {
                    name: "profile1",
                    description: "The profile you will take an item from.",
                    required: true,
                    type: 3,
                },
                {
                    name: "profile2",
                    description: "The profile you will give an item to.",
                    required: true,
                    type: 3,
                },
                {
                    name: "item",
                    description: "Which item to transfer.",
                    required: true,
                    type: 3
                }
            ]
        }
    })
}
