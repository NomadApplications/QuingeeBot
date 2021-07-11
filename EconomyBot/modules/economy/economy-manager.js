module.exports.init = async function(){
    const users = client.users.cache;

    for(let i = 0; i < users.length; i++){
        let user = users[i];
        if(db.get(user) === null) {
            initUser(user);
        }
    }
}


global.initUser = function(user){
    if(db.get(user.id) !== null) return;
    db.set(user.id, { profiles: [] });
    const startingProfile = new EcoProfile(startingCurrency, [],1, "Main", user);
    startingProfile.addNode();

    addNewProfile(user ,startingProfile);
}

global.addNewProfile = function(user, profile){
    console.log(profile);
    if(db.get(user.id) === null) initUser(user);
    db.push(user.id + ".profiles", profile);
}

class EcoProfile {
    constructor(currencyAmount = startingCurrency, inventory = [], node_slots, title, o){
        this.currencyAmount = currencyAmount;
        this.inventory = inventory;
        this.node_slots = node_slots;
        this.title = title;
        this.owner = o;
    }

    setName(title){
        this.title = title;
    }

    addNode(){
        this.node_slots++;
    }

    removeMoney(amount){
        this.currencyAmount -= amount;
    }

    addMoney(amount){
        this.currencyAmount += amount;
    }
}
global.EcoProfile = EcoProfile;