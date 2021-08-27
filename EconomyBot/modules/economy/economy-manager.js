global.users = [];

module.exports.init = async function(){
    const list = client.guilds.cache.get(guildID);
    list.members.cache.forEach(member => {
        const user = member.user;
        if(db.get(user.id) === null){
            initUser(user);
        }
    })
}


global.initUser = function(user){
    if(db.get(user.id) !== null) return;
    const startingProfile = new EcoProfile(startingCurrency, [], "Main", user.id, guildID, houses[0]);
    db.set(user.id, { profiles: [startingProfile], daily: true });
}

global.addNewProfile = function(user, profile){
    if(db.get(user.id) === null) initUser(user);
    if(Array.isArray(db.get(user.id + ".profiles"))){
        const list = db.get(user.id + ".profiles");
        list.push(profile);
        db.set(user.id + ".profiles", list);
    } else {
        const list = [];
        list.push(db.get(user.id + ".profiles"));
        list.push(profile);
        db.set(user.id + ".profiles", list);
    }
}

global.addCurrency = function(profile, currencyAmount){
    if(db.get(profile.id) === null) initUser(getUserById(profile.id, profile.guildId));
    const newProfile = profile;
    newProfile.currencyAmount += currencyAmount;
    updateProfile(newProfile);
}

global.removeCurrency = function(profile, currencyAmount){
    if(db.get(profile.id) === null) initUser(getUserById(profile.id, profile.guildId));
    const newProfile = profile;
    newProfile.currencyAmount -= currencyAmount;
    updateProfile(newProfile);
}

global.addItemToProfile = function(profile, item){
    if(db.get(profile.id) === null) initUser(getUserById(profile.id, profile.guildId));
    const newProfile = profile;
    newProfile.inventory.push(item);

    updateProfile(newProfile);
}

global.removeItemFromProfile = function(profile, item){
    if(db.get(profile.id) === null) initUser(getUserById(profile.id, profile.guildId));
    const newProfile = profile;
    const index = newProfile.inventory.findIndex(x => x.name === item.name);
    if(index === -1) return false;
    newProfile.inventory.splice(index, 1);
    updateProfile(newProfile);
    return true;
}

global.updateProfile = function(profile){
    const profiles = db.get(profile.id + ".profiles")
    if(Array.isArray(profiles)){
        const index = profiles.findIndex(x => x.title === profile.title);
        const list = db.get(profile.id + ".profiles");
        list[index] = profile;
        db.set(profile.id + ".profiles", list);
    } else {
        db.set(profile.id + ".profiles", profile);
    }
}

global.getItemByCategory = function(profile, category){
    let items = profile.inventory.filter(item => item.category === category.name);
    return items;
}

global.EcoProfile = class {
    constructor(currencyAmount = startingCurrency, inventory = [], title = "Main", id, guildId, houseType = houses[0]){
        this.currencyAmount = currencyAmount;
        this.inventory = inventory;
        this.title = title;

        this.id = id;
        this.guildId = guildId;

        this.houseType = houseType;
        this.nodeSlots = [];
        for(let i = 0; i < this.houseType.nodeAmount; i++){
            this.nodeSlots.push(null);
        }

        this.claimedNodes = false;
    }
}

global.setClaimedNodes = (profile, bool) => {
    const p = profile;
    p.claimedNodes = bool;
    updateProfile(p);
}

global.setNode = (profile, item, slot) => {
    if(slot > profile.nodeSlots.length) return false;
    if(profile.inventory.filter(i => i.name === item.name).length > 0){
        profile.nodeSlots[slot] = item;
        removeItem(profile, item);
        return true;
    }
    return false;
}

global.removeNode = (profile, item) => {
    if(profile.nodeSlots.filter(i => i.name === item.name).length > 0){
        let itemNames = [];
        profile.nodeSlots.forEach(i => itemNames.push(i.name));
        const i = itemNames.indexOf(item.name);
        profile.nodeSlots[i] = null;
        addItemToProfile(profile, item);
        return true;
    }
    return false;
}