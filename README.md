<h1>QuingeeBot</h1>
<b>A Discord economy bot with a twist for knvoa.</b> 

<h2>Modules listed below:</h2>

 - **<a href="https://github.com/NomadApplications/QuingeeBot/tree/main/EconomyBot/modules/economy">Economy</a>**: - Manages all user profiles and currency managment.
 - **<a href="https://github.com/NomadApplications/QuingeeBot/tree/main/EconomyBot/modules/homesteads">Homesteads</a>**: - Manages all homes and placement.
 - **<a href="https://github.com/NomadApplications/QuingeeBot/tree/main/EconomyBot/modules/music">Music</a>**: - Music bot, some URLs don't work. That cannot be avoided or fixed, just YouTube's API gets weird. Although sometimes URLs don't work, searching titles instead of URLs works fine. Sometimes you get interesting results, which is pretty funny.
 - **<a href="https://github.com/NomadApplications/QuingeeBot/tree/main/EconomyBot/modules/seasons">Seasons</a>**: - Manages all of the seasons and calendar events.
 - **<a href="https://github.com/NomadApplications/QuingeeBot/tree/main/EconomyBot/modules/shop">Shop</a>**: - Contains all logic for shop UI and purchasing and storing of items.

<h1>config.json</h1>
Check out the config https://github.com/NomadApplications/QuingeeBot/blob/main/EconomyBot/config.json

This is where all of the important information is stored, like IDs, <a href="https://htmlcolorcodes.com/">colors</a>, URLs, titles, and module information.

<h1>items.json</h1>
Check out the items config Check out the config https://github.com/NomadApplications/QuingeeBot/blob/main/EconomyBot/items.json

This file stores all of the items for the Quingee bot. <h3><b>To make a new entry, insert a new object into the list of items with the following information:</b></h3>

 - **Item name** ``String``: "name"
 - **Item buy-price** ``Integer``: 0
 - **Item sell-price** ``Integer``: 0
 - **Item season** ``Integer``: -1
 - **Item category** ``String``: "fishing"

If you don't want a value, for example, you don't want the users to be able to purchase an item, set the "buy" value to -1. Same for sell and season. Name and category and mandatory.

There is also some more important information about seasons and categories. <h3><b>The seasons are listed below:</b></h3>

 - **All seasons** ``Integer``: -1
 - **Spring** ``Integer``: 1
 - **Summer** ``Integer``: 2
 - **Fall** ``Integer``: 3
 - **Winter** ``Integer``: 4

<h3><b>Here are the categories:</b></h3>

 - **"fishing"**, **"mining"**, **"gathering"**, **"crafted items"**, **"daily"**.

If none of these categories are in the "category" value then the item will be ignored. Same with seasons. Any values below -1 will return errors, so please don't do that :smile:
