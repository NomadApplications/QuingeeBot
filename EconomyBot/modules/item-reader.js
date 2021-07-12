const items = {};

const fishing = [];
const mining = [];
const gathering = [];
const crafted_items = [];
const daily = [];

module.exports.initItems = async function(itemList){
    for(let i = 0; i < itemList.length; i++){
        const category = itemList[i].category;

        if(category === "fishing") fishing.push(itemList[i]);
        else if (category === "mining") mining.push(itemList[i]);
        else if (category === "gathering") gathering.push(itemList[i]);
        else if (category === "crafted items") crafted_items.push(itemList[i]);
        else if (category === "daily") daily.push(itemList[i]);

        items[itemList[i].name] = {
            name: itemList[i].name,
            buy: itemList[i].buy,
            sell: itemList[i].sell,
            season: itemList[i].season,
            category: itemList[i].category
        };
    }
}

global.getItemByName = (name) => {
    const item = items[name];
    if(item === undefined || item === null) return null;
    return item;
}

global.giveItemByName = (user, name) => {
    let item = getItemByName(name);
    if(item === null) return false;

    giveItem(user, item);
    return true;
}

global.giveItem = (profile, item) => {
    if(item === null) return false;

    profile.inventory.push(item);
    profile.currencyAmount -= item.buy;
    return true;
}

global.getAllItems = () => {
    return items;
}

global.getItemByIndex = (i) => items[Object.keys(items)[i]];