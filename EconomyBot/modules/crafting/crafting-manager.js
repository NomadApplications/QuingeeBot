global.crafting_recipes = require("../../configs/crafting-recipes.json");

global.combineItems = (recipeName, profile) => {
    let recipe = null;
    crafting_recipes.recipes.forEach(i => {
        if(i.result === recipeName) recipe = i;
    })
    if(recipe === null){
        return { error: "Please specify a valid recipe. Look at ``/recipes`` for more info." };
    }

    let amountOfItem1 = 0;
    let amountOfItem2 = 0;

    profile.inventory.forEach(i => {
        if(i.name === recipe.items[0].name) amountOfItem1++;
        if(i.name === recipe.items[1].name) amountOfItem2++;
    });

    if(amountOfItem1 === 0 || amountOfItem2 === 0){
        return { error: "You do not have enough items for this recipe. Please look at ``/recipes`` to see how many items you need for it." };
    }

    if(amountOfItem1 >= recipe.items[0].amount && amountOfItem2 >= recipe.items[1].amount) {
        return recipe;
    } else {
        return { error: "You do not have enough items for this recipe. Please look at ``/recipes`` to see how many items you need for it." };
    }
}