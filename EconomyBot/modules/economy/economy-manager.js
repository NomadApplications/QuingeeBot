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
    const startingProfile = new EcoProfile(startingCurrency, [], 1, "Main", user);
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
    if(db.get(profile.owner.id) === null) initUser(profile.owner);
    const newProfile = profile;
    newProfile.currencyAmount += currencyAmount;
    updateProfile(newProfile);
}

global.removeCurrency = function(profile, currencyAmount){
    if(db.get(profile.owner.id) === null) initUser(profile.owner);
    const newProfile = profile;
    newProfile.currencyAmount -= currencyAmount;
    updateProfile(newProfile);
}

global.addItemToProfile = function(profile, item){
    if(db.get(profile.owner.id) === null) initUser(profile.owner);
    const newProfile = profile;
    newProfile.inventory.push(item);

    console.log(newProfile.inventory);
    updateProfile(newProfile);
}

global.removeItemFromProfile = function(profile, item){
    if(db.get(profile.owner.id) === null) initUser(profile.owner);
    const newProfile = profile;
    const index = newProfile.inventory.findIndex(x => x.name === item.name);
    console.log(newProfile.inventory[index]);
    newProfile.inventory.splice(index, 1);
    updateProfile(newProfile);
}

global.updateProfile = function(profile){
    const profiles = db.get(profile.owner.id + ".profiles")
    if(Array.isArray(profiles)){
        const index = profiles.findIndex(x => x.title === profile.title);
        const list = db.get(profile.owner.id + ".profiles");
        const f = list[index] = profile;
        db.set(profile.owner.id + ".profiles", list);
    } else {
        db.set(profile.owner.id + ".profiles", profile);
    }

}

global.EcoProfile = class {
    constructor(currencyAmount = startingCurrency, inventory = [], nodeSlots, title, o){
        this.currencyAmount = currencyAmount;
        this.inventory = inventory;
        this.nodeSlots = nodeSlots;
        this.title = title;
        this.owner = o;
    }
}