const _items = {};

global.fishing = {};
global.mining = {};
global.gathering = {};
global.crafted_items = {};
global.daily = {};
global.furniture = {};

module.exports.initItems = function(items){
    fishing["name"] = "fishing";
    mining["name"] = "mining";
    gathering["name"] = "gathering";
    crafted_items["name"] = "crafted_items";
    daily["name"] = "daily";

    for(let i = 0; i < items.length; i++){
        const category = items[i].category;

        if(category === "fishing") addItemToObject(fishing, items[i]);
        else if (category === "mining") addItemToObject(mining, items[i]);
        else if (category === "gathering") addItemToObject(gathering, items[i]);
        else if (category === "crafted items") addItemToObject(crafted_items, items[i]);
        else if (category === "daily") addItemToObject(daily, items[i]);
        else if (category === "furniture"){
            addItemToObject(furniture, items[i]);
        }

        addItemToObject(_items, items[i]);
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
    const item = _items[name];
    if(item === undefined || item === null) return null;
    return item;
}

global.itemInCurrentSeason = (item) => {
    if(item.currentSeason === -1) return true;
    const currentSeason = db.get("seasons.currentSeason");
    if(item.season === currentSeason.index) return true;
    else return false;
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
    return _items;
}

global.getItemByIndex = (i) => _items[Object.keys(_items)[i]];

global.getEmojiByCategory = (item) => {
    const category = item.category;
    let emoji = "";

    if (category === "fishing") emoji = "????"
    else if (category === "mining") emoji = "????"
    else if (category === "gathering") emoji = "????"
    else if (category === "crafted items") emoji = "???"
    else if (category === "daily") emoji = "???"
    else if (category === "furniture") emoji = "????"
    else if (category === "node") emoji = "????"

    return emoji;
}