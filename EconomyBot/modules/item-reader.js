const items = {};

global.fishing = {};
global.mining = {};
global.gathering = {};
global.crafted_items = {};
global.daily = {};
global.furniture = {};

module.exports.initItems = async function(itemList){
    for(let i = 0; i < itemList.length; i++){
        const category = itemList[i].category;

        fishing["name"] = "fishing";
        mining["name"] = "mining";
        gathering["name"] = "gathering";
        crafted_items["name"] = "crafted_items";
        daily["name"] = "daily";
        furniture["name"] = "furniture";

        if(category === "fishing") addItemToObject(fishing, itemList[i]);
        else if (category === "mining") addItemToObject(mining, itemList[i]);
        else if (category === "gathering") addItemToObject(gathering, itemList[i]);
        else if (category === "crafted items") addItemToObject(crafted_items, itemList[i]);
        else if (category === "daily") addItemToObject(daily, itemList[i]);
        else if (category === "furniture") addItemToObject(furniture, itemList[i]);

        addItemToObject(items, itemList[i]);
    }
}

function addItemToObject(object, item){
    object[item.name] = new Item(item.name, item.buy, item.sell, item.season, item.category);
}

global.Item = class {
    constructor(name, buy, sell, season, category) {
        this.name = name;
        this.buy = buy;
        this.sell = sell;
        this.season = season;
        this.category = category;
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

global.giveItem = (profile, item, amount) => {
    if(item === null) return false;

    for(let i = 0; i < amount; i++){
        addItemToProfile(profile, item);
    }
    removeCurrency(profile, item.buy * amount);
    return true;
}

global.removeItem = (profile, item) => {
    if(item === null) return false;

    const removed = removeItemFromProfile(profile, item);
    if(!removed) return false;

    addCurrency(profile, item.sell);
    return true;
}

global.getAllItems = () => {
    return items;
}

global.getItemByIndex = (i) => items[Object.keys(items)[i]];

global.getEmojiByCategory = (item) => {
    const category = item.category;
    let emoji = "";

    if (category === "fishing") emoji = "🎣"
    else if (category === "mining") emoji = "💎"
    else if (category === "gathering") emoji = "🧤"
    else if (category === "crafted items") emoji = "⚒"
    else if (category === "daily") emoji = "☀"

    return emoji;
}