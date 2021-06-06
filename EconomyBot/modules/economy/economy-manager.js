async function addNewProfile(owner, profile){

}

class EcoProfile {
    constructor(currencyAmount, inventory, title, owner){
        this.currencyAmount = currencyAmount;
        this.inventory = inventory;
        this.title = title;
        this.owner = owner;
    }

    setName(title){
        this.title = title;
    }
}