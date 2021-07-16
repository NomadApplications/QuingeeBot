global.seasons = Object.freeze({
    spring1: "🌷 Spring 1",
    spring2: "🌷 Spring 2",
    summer1: "☀ Summer 1",
    summer2: "☀ Summer 2",
    fall1: "🍁 Fall 1",
    fall2: "🍁 Fall 2",
    winter1: "❄ Winter 1",
    winter2: "❄ Winter 2"
});

module.exports.init = async function(){
    // Do some shit
}

const s = schedule.scheduleJob({hour: 0, minute: 0}, function () {
    newDay();
})

global.initSeasons = function(){
    db.set("seasons", {currentDay: 1, currentSeason: seasons.spring1});
}

global.newDay = function(){
    if(db.get("seasons") === null){
        initSeasons();
    }

    const list = client.guilds.cache.get(guildID);
    list.members.cache.forEach(member => {
        const user = member.user;
        if(db.get(user.id) === null){
            initUser(user);
        }
        db.set(user.id + ".daily", true);
    })

    db.add("seasons.currentDay", 1);

    if(db.get("seasons.currentDay") === seasonLength){
        let announcementChannel = client.guilds.cache.get(guildID).channels.cache.get(announcementChannelID);

        db.set("seasons.currentDay", 1);
        switch(db.get("seasons.currentSeason")){
            case seasons.spring1:
                db.set("seasons.currentSeason", seasons.spring2);
                announcementChannel.send("🌷 It's now officially Spring 2! 🌷");
                break;
            case seasons.spring2:
                db.set("seasons.currentSeason", seasons.summer1);
                announcementChannel.send("☀ It's now officially Summer 1! ☀");
                break;
            case seasons.summer1:
                db.set("seasons.currentSeason", seasons.summer2);
                announcementChannel.send("☀ It's now officially Summer 2! ☀");
                break;
            case seasons.summer2:
                db.set("seasons.currentSeason", seasons.fall1);
                announcementChannel.send("🍁 It's now officially Fall 1! 🍁");
                break;
            case seasons.fall1:
                db.set("seasons.currentSeason", seasons.fall2);
                announcementChannel.send("🍁 It's now officially Fall 2! 🍁");
                break;
            case seasons.fall2:
                db.set("seasons.currentSeason", seasons.winter1);
                announcementChannel.send("❄ It's now officially Winter 1! ❄");
                break;
            case seasons.winter1:
                db.set("seasons.currentSeason", seasons.winter2);
                announcementChannel.send("❄ It's now officially Winter 2! ❄");
                break;
            case seasons.winter2:
                db.set("seasons.currentSeason", seasons.spring1);
                announcementChannel.send("🌷 It's now officially Spring 1! 🌷");
                break;
        }
    }
}