module.exports.init = async function(){
    const users = client.users.cache;

    for(let i = 0; i < users.length; i++){
        let user = users[i];
        if(db.get(user.id) === null) {
            db.set(user.id, { profiles: [] });
            const startingProfile = new EcoProfile(startingCurrency, "Main", user);

            addNewProfile(startingProfile);
        }
    }
}


global.initUser = function(user){
    if(db.get(user.id) !== null) return;
    db.set(user.id, { profiles: [] });
    const startingProfile = new EcoProfile(startingCurrency, [],"Main", user);

    addNewProfile(startingProfile);
}

global.addNewProfile = function(profile){
    if(db.get(profile.o.id) === null) initUser(profile.o);
    db.push(profile.o.id + ".profiles", profile);
}

class EcoProfile {
    constructor(currencyAmount = startingCurrency, inventory = [], title, o){
        this.currencyAmount = currencyAmount;
        this.inventory = inventory;
        this.title = title;
        this.o = o;
    }

    setName(title){
        this.title = title;
    }
}
global.EcoProfile = EcoProfile;