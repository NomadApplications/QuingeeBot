<h1>QuingeeBot</h1>
<b>A Discord economy bot with a twist for knvoa.&nbsp;</b> 

<h2>Modules listed below:</h2>

<p><b>Economy</b> - Manages all user profiles and currency managment.</p>
<p><b>Homesteads</b> - Manages all homes and placement.</p>
<p><b>Music</b> - Music bot, some URLs don't work. That cannot be avoided or fixed, just YouTube's API gets weird. Although sometimes URLs don't work, searching titles instead of URLs works fine. Sometimes you get interesting results, which is pretty funny.</p>
<p><b>Seasons</b> - Manages all of the seasons and calendar events.</p>
<p><b>Shop</b> - Contains all logic for shop UI and purchasing and storing of items.</p>

<h1>config.json</h1>
This is where all of the important information is stored, like IDs, colors, URLs, titles, and module information.

<h1>items.json</h1>
This file stores all of the items for the Quingee bot. <h3><b>To make a new entry, insert a new object into the list of items with the following information:</b></h3>




&nbsp;




Item name: "name"
  
Item buy-price: 0
  
Item sell-price: 0
  
Item season: -1
  
Item category: "fishing"
  
  

  
  
 &nbsp;
 
 
 

If you don't want a value, for example, you don't want the users to be able to purchase an item, set the "buy" value to -1. Same for sell and season. Name and category and mandatory.

There is also some more important information about seasons and categories. <h3><b>The seasons are listed below:</b></h3>




&nbsp;




All seasons: -1

Spring: 1

Summer: 2

Fall: 3

Winter: 4

  

  
  
 &nbsp;
 
 
 


<h3><b>Here are the categories:</b></h3>

"fishing", "mining", "gathering", "crafted items", "daily".

If none of these categories are in the "category" value then the item will be ignored. Same with seasons. Any values below -1 will return errors, so please don't do that :smile:
