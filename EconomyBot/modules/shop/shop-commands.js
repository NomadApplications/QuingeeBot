const pages = [];

module.exports.initPages = async function () {
    let currentPage = 0;

    pages.push([0, []]);

    const items = Object.keys(getAllItems());

    let addedItems = 0;

    for (let i = 0; i < items.length; i++) {
        const item = getAllItems()[items[i]];
        if (addedItems % itemsPerPage === 0) {
            if (item.buy === 1 && i !== 0) {
                currentPage++;
                pages.push([currentPage, []]);
            }
        }
        if (item.buy !== -1) {
            addedItems++;
            pages[currentPage][1].push(getAllItems()[items[i]]);
        }
    }
}

module.exports.startCommands = async function () {
    client.ws.on("INTERACTION_CREATE", async (interaction) => {

        if (interaction.type === 3) return;

        const command = interaction.data.name.toLowerCase();
        const {name, options} = interaction.data;

        const channel = client.guilds.cache.get(interaction.guild_id).channels.cache.get(interaction.channel_id);
        const user = client.users.cache.get(interaction.member.user.id);

        const args = {};

        if (options) {
            for (const option of options) {
                const {name, value} = option;
                args[name] = value.toLowerCase();
            }
        }

        if (command === "shop") {
            await handleShop(interaction, channel, user)
        } else if (command === "buy") {
            const item = getItemByName(args.item);

            if (item === null || item === undefined) {
                await replyError(interaction, "Please say a valid item. To view all items and prices, type /shop.");
                return;
            }

            if (item.buy === -1) {
                await replyError(interaction, "You cannot buy this item.");
                return;
            }

            const profile = db.get(user.id + ".profiles")[0];

            if (profile.currencyAmount >= item.buy) {
                // BUY ITEM
                giveItem(profile, item);
                const newBalance = profile.currencyAmount;
                await replyCurrency(interaction, "You have successfully bought " + item.name + " for " + item.buy + "! You now have a total of " + newBalance + " in " + profile.title + ".");
                return;
            } else {
                await replyError(interaction, "You do not have enough " + currencyName + " to purchase " + item.name + "!");
                return;
            }


        }
    });
}

async function handleShop(interaction, channel, user) {
    const pageNumber = 0;
    const embed = getPage(pageNumber);

    await reply(interaction, "Shop below:");

    if (pages.length === 1) {
        channel.send(embed);
        return;
    }

    sendEmbedWithReactions(embed, channel, pageNumber, user);
}

function getPage(pageNumber) {
    const embed = new Discord.MessageEmbed()
        .setTitle("🛒 Quingee Shop")
        .setColor(currencyColor)
        .setDescription("To buy items, type ``/buy [item] [amount]``.")
        .setFooter("Page " + (parseInt(pageNumber) + 1) + " / " + pages.length);

    for (let i = 0; i < pages[pageNumber][1].length; i++) {
        const item = pages[pageNumber][1][i];

        const category = item.category;
        let emoji = "";

        if (category === "fishing") emoji = "🎣"
        else if (category === "mining") emoji = "💎"
        else if (category === "gathering") emoji = "🧤"
        else if (category === "crafted items") emoji = "⚒"
        else if (category === "daily") emoji = "☀"

        embed.addField(capitalize(item.name) + `\n *${emoji + capitalize(item.category)}*`, `*Price*: ${item.buy}`, true);
    }

    return embed;
}

function sendEmbedWithReactions(embed, channel, pageNumber, user) {
    channel.send(embed).then(embedMessage => {
        editEmbed(embedMessage, embed, pageNumber, user);
    });
}

function editEmbed(message, embed, pageNumber, user) {
    message.edit(embed).then(async embedMessage => {
        await embedMessage.react('◀');
        await embedMessage.react('▶');

        let embed = null;
        let p = 0;


        embedMessage.awaitReactions((reaction, u) => u.id == user.id && (reaction.emoji.name == '◀' || reaction.emoji.name == '▶'), {
            max: 1,
            time: 30000
        }).then(collected => {

            embedMessage.reactions.removeAll();

            if (collected.first().emoji.name == '◀') {
                if (pageNumber === 0) p = pages.length - 1;
                else p = pageNumber - 1;

                embed = getPage(p);

                editEmbed(embedMessage, embed, p, user);
            } else if (collected.first().emoji.name == "▶") {
                if (pageNumber === pages.length - 1) p = 0;
                else p = pageNumber + 1;

                embed = getPage(p);

                editEmbed(embedMessage, embed, p, user);
            }
        }).catch(() => {
            return;
        });
    });
}