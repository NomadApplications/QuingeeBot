const items = {};

global.fishing = {};
global.mining = {};
global.gathering = {};
global.crafted_items = {};
global.daily = {};

module.exports.initItems = async function(itemList){
    for(let i = 0; i < itemList.length; i++){
        const category = itemList[i].category;

        if(category === "fishing") addItemToObject(fishing, itemList[i]);
        else if (category === "mining") addItemToObject(mining, itemList[i]);
        else if (category === "gathering") addItemToObject(gathering, itemList[i]);
        else if (category === "crafted items") addItemToObject(crafted_items, itemList[i]);
        else if (category === "daily") addItemToObject(daily, itemList[i]);

        addItemToObject(items, itemList[i]);
    }
}

function addItemToObject(object, item){
    object[item.name] = {
        name: item.name,
        buy: item.buy,
        sell: item.sell,
        season: item.season,
        category: item.category
    };
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

    removeItemFromProfile(profile, item);
    addCurrency(profile, item.sell);
    return true;
}

global.getAllItems = () => {
    return items;
}

global.getItemByIndex = (i) => items[Object.keys(items)[i]];