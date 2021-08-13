const pages = [];

const fishingPage = [];
const miningPage = [];
const gatheringPage = [];

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
            pages[currentPage][1].push(item);
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
            await handleShop(interaction, channel, user, args)
        } else if (command === "buy") {
            if(db.get(user.id) === null) initUser(user);
            const item = getItemByName(args.item);

            const profile = getProfileByString(args.profile, user);
            if (profile === null) {
                await replyError(interaction, "Please specify a valid profile name. If you would like to see your current profiles, type ``/profile list``.");
                return;
            }

            if (item === null || item === undefined) {
                await replyError(interaction, "Please say a valid item. To view all items and prices, type /shop.");
                return;
            }

            if (item.buy === -1) {
                await replyError(interaction, "You cannot buy this item.");
                return;
            }

            let amount = 0;

            if(args.quantity){
                if(isNaN(args.quantity)){
                    await replyError(interaction, "Please enter a valid number.");
                    return;
                }
                amount = parseInt(args.quantity);
            }

            if(amount <= 0){
                await replyError(interaction, "Please specify a number above 0.");
                return;
            }


            if (profile.currencyAmount >= item.buy * amount) {
                // BUY ITEM
                giveItem(profile, item, amount);
                const newBalance = profile.currencyAmount;
                let plural = "";
                if(amount > 1) plural = "s";
                await replyCurrency(interaction, "You have successfully bought " + amount + " **" + capitalize(item.name) + plural + "** for " + (item.buy * amount) + "! You now have a total of " + newBalance + " in " + profile.title + ".");
                return;
            } else {
                let plural = "";
                if(amount > 1) plural = "s";
                await replyError(interaction, "You do not have enough " + currencyName + " to purchase " + amount + " **" + capitalize(item.name) + plural + "**!");
                return;
            }


        } else if (command === "sell"){
            const profile = getProfileByString(args.profile, user);
            if (profile === null) {
                await replyError(interaction, "Please specify a valid profile name. If you would like to see your current profiles, type ``/profile list``.");
                return;
            }
            const item = getItemByName(args.item);

            if (item === null || item === undefined) {
                await replyError(interaction, "Please say a valid item. To view all items and prices, type ``/shop``.");
                return;
            }

            if(item.sell <= 0){
                await replyError(interaction, "You cannot sell this item.");
                return;
            }

            const valid = profile.inventory.findIndex(x => x.name === item.name) !== -1;

            let amount = 0;
            for(let i = 0; i < profile.inventory.length; i++){
                if(profile.inventory[i].name === item.name){
                    amount++;
                }
            }

            let f = 0;

            if(isNaN(args.amount)){
                if(args.amount === "max"){
                    f = amount;
                } else {
                    await replyError(interaction, "Please specify a valid amount ``[number, max]``.");
                    return;
                }
            } else {
                let c = parseInt(args.amount);
                if(c > amount || c <= 0){
                    await replyError(interaction, "Please specify a valid amount (check ``/inventory [profile]``");
                    return;
                }
                f = c;
            }

            if(f <= 0){
                await replyError(interaction, "Please specify a valid amount (check ``/inventory [profile]``");
                return;
            }

            if (valid) {
                for(let i = 0; i < f; i++){
                    removeItem(profile, item);
                }
                await replyCurrency(interaction, "You have successfully sold x" + f + " **" + capitalize(item.name) + "** for " + item.sell * f + "! You now have a total of " + profile.currencyAmount + " in " + profile.title + ".");
                return;
            } else {
                await replyError(interaction, "You do not have **" + capitalize(item.name) + "** in your inventory. Type ``/inventory`` to see your inventory");
                return;
            }
        } else if (command === "transfer"){
            const profile1 = getProfileByString(args.profile1, user);
            const profile2 = getProfileByString(args.profile2, user);
            if (profile1 === null || profile2 === null) {
                await replyError(interaction, "Please specify a valid profile name. If you would like to see your current profiles, type ``/profile list``.");
                return;
            }

            if(isNaN(args.amount)){
                await replyError(interaction, "Please specify a valid number.");
                return;
            }

            const amount = parseInt(args.amount);

            if(amount <= 0){
                await replyError(interaction, "Please specify a number over 0.");
                return;
            }

            removeCurrency(profile1, amount);
            addCurrency(profile2, amount);

            await replySuccess(interaction, "You have successfully transferred **$" + amount + "** from **" + profile1.title + "** to **" + profile2.title + "**.");
        } else if (command === "itemtransfer"){
            const profile1 = getProfileByString(args.profile1, user);
            const profile2 = getProfileByString(args.profile2, user);
            if (profile1 === null || profile2 === null) {
                await replyError(interaction, "Please specify a valid profile name. If you would like to see your current profiles, type ``/profile list``.");
                return;
            }

            const item = getItemByName(args.item);

            if (item === null || item === undefined) {
                await replyError(interaction, "Please say a valid item. To view all items and prices, type ``/shop``.");
                return;
            }

            const valid = profile1.inventory.findIndex(x => x.name === item.name) !== -1;

            if(valid){
                removeItem(profile1, item);
                giveItem(profile2, item, 1);

                await replySuccess(interaction, "Successfully transferred **" + capitalize(item.name) + "** from **" + profile1.title + "** to **" + profile2.title + "**.");
                return;
            } else {
                await replyError(interaction, "You do not have **" + capitalize(item.name) + "** in **" + profile1.title + "**.");
                return;
            }
        }
    });
}

async function handleShop(interaction, channel, user, args) {
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

        const emoji = getEmojiByCategory(item);
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
