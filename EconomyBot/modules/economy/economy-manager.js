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
    db.set(user.id, { profiles: [] });
    const startingProfile = new EcoProfile(startingCurrency, [], 1, "Main", user);

    addNewProfile(user, startingProfile);
}

global.addNewProfile = function(user, profile){
    if(db.get(user.id) === null) initUser(user);
    const list = db.get(user.id + ".profiles");
    list.push(profile);
    db.set(user.id + ".profiles", list);
}

global.addCurrency = function(profile, currencyAmount){
    if(db.get(profile.owner.id) === null) initUser(profile.owner);
    const newProfile = profile;
    newProfile.currencyAmount += currencyAmount;
    updateProfile(profile.owner, newProfile);
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
    updateProfile(newProfile);
}

global.removeItemFromProfile = function(profile, item){
    if(db.get(profile.owner.id) === null) initUser(profile.owner);
    const newProfile = profile;
    const index = newProfile.inventory.findIndex(x => x.name === item.name);
    newProfile.inventory.slice(index, 1);
    updateProfile(newProfile);
}

global.updateProfile = function(profile){
    addNewProfile(profile.owner, profile);
    const profiles = db.get(profile.owner.id + ".profiles")
    console.log(profiles);
    const index = profiles.findIndex(x => x.title === profile.title);
    const f = db.get(profile.owner.id + ".profiles")[index] = profile;
    db.set(profile.owner.id + ".profiles", f);
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