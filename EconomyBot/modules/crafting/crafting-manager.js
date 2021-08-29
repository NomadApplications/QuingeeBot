global.crafting_recipes = require("../../configs/crafting-recipes.json");

global.combineItems = (recipeName, profile) => {
    let recipe = null;
    crafting_recipes.recipes.forEach(i => {
        if(i.result === recipeName) recipe = i;
    })
    if(recipe === null){
        return { error: "Please specify a valid recipe. Look at ``/recipes`` for more info." };
    }

    let amountOfItems = {};


    for(let i = 0; i < profile.inventory.length; i++){
        const item = profile.inventory[i];
        for(let j = 0; j < recipe.items.length; j++){
            if(item.name === recipe.items[j].name) {
                if(!amountOfItems[item.name]) amountOfItems[item.name] = 0;
                amountOfItems[item.name] += 1;
            }
        }
    }

    for(let i = 0; i < Object.keys(amountOfItems).length; i++){
        if(amountOfItems[i] === 0){
            return { error: "You do not have enough items for this recipe. Please look at ``/recipes`` to see how many items you need for it." };
        }
    }

    let valid = false;
    for(let i = 0; i < recipe.items.length; i++){
        const recipeItem = recipe.items[i];

        const a = amountOfItems[recipeItem.name];

        if(a === undefined) return { error: "You do not have enough items for this recipe. Please look at ``/recipes`` to see how many items you need for it." };

        if(a >= recipeItem.amount) valid = true;
        else return { error: "You do not have enough items for this recipe. Please look at ``/recipes`` to see how many items you need for it." };
    }

    if(valid) return recipe;
    else return { error: "You do not have enough items for this recipe. Please look at ``/recipes`` to see how many items you need for it." };
}