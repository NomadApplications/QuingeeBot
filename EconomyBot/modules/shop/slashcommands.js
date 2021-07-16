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
                }
            ]
        }
    })

    await getApp(guildID).commands.post({
        data: {
            name: "buy",
            description: "See your (or someone else's) current balance.",
            options: [
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
}
