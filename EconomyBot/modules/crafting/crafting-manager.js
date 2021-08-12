global.crafting_recipes = require("../../configs/crafting-recipes.json");

global.combineItems = (item1, item2) => {
    if(!item1 || !item2) return null;

    let result = null;

    crafting_recipes.recipes.forEach(i => {
        if(i.items.includes(item1.name) && i.items.includes(item2.name)){
            result = i.result;
        }
    });

    return result;
}