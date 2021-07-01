const items = new Map();

const fishing = [];
const mining = [];
const gathering = [];
const crafted_items = [];
const daily = [];

module.exports.initItems = async function(items){
    for(let i = 0; i < items.length; i++){
        const category = items[i].category;

        if(category === "fishing") fishing.push(items[i]);
        else if (category === "mining") mining.push(items[i]);
        else if (category === "gathering") gathering.push(items[i]);
        else if (category === "crafted items") crafted_items.push(items[i]);
        else if (category === "daily") daily.push(items[i]);

        items.set(items[i].name, {
            buy: items[i].buy,
            sell: items[i].sell,
            season: items[i].season,
            category: items[i].category
        });
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

global.giveItem = (user, item) => {
    if(item === null) return false;

    db.get(user.id + ".profiles")[0].inventory.push(item);
    return true;
}