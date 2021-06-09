const enumValue = (name) => Object.freeze({toString: () => name});

global.seasons = Object.freeze({
    spring1: "Spring1",
    spring2: "Spring2",
    summer1: "Summer1",
    summer2: "Summer2",
    fall1: "Fall1",
    fall2: "Fall2",
    winter1: "Winter1",
    winter2: "Winter2"
});

module.exports.init = async function(){
    // Do some shit
}

const s = schedule.scheduleJob({hour: 0, minute: 0}, function () {
    newDay();
})

global.newDay = function(){
    if(db.get("seasons") === null){
        db.set("seasons", {currentDay: 1, currentSeason: seasons.spring1});
    }
    db.add("seasons.currentDay", 1);

    if(db.get("seasons.currentDay") === 48){
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