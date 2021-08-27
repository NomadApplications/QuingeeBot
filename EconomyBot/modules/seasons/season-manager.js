global.seasons = {
    spring1: {
        title: "🌷 Spring 1",
        index: 1
    },
    spring2: {
        title: "🌷 Spring 2",
        index: 1
    },
    summer1: {
        title: "☀ Summer 1",
        index: 2
    },
    summer2: {
        title: "☀ Summer 2",
        index: 2
    },
    fall1: {
        title: "🍁 Fall 1",
        index: 3
    },
    fall2: {
        title: "🍁 Fall 2",
        index: 3
    },
    winter1: {
        title: "❄ Winter 1",
        index: 4
    },
    winter2: {
        title: "❄ Winter 2",
        index: 4
    }
};

module.exports.init = async function(){
    const list = client.guilds.cache.get(guildID);
    list.members.cache.forEach(member => {
        const user = member.user;
        if(db.get(user.id) === null){
            initUser(user);
        }
        db.set(user.id + ".daily", true);
        db.get(user.id + ".profiles").forEach(profile => {
            setClaimedNodes(profile, false);
        });
    })
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
        db.get(user.id + ".profiles").forEach(profile => {
            setClaimedNodes(profile, false);
        });
    })

    db.add("seasons.currentDay", 1);
    let announcementChannel = client.guilds.cache.get(guildID).channels.cache.get(announcementChannelID);

    if(db.get("seasons.currentDay") >= seasonLength){
        db.set("seasons.currentDay", 1);

        switch(db.get("seasons.currentSeason").title){
            case seasons.spring1.title:
                db.set("seasons.currentSeason", seasons.spring2);
                initPages();
                announcementChannel.send("🌷 It's now officially Spring 2! 🌷");
                break;
            case seasons.spring2.title:
                db.set("seasons.currentSeason", seasons.summer1);
                initPages();
                announcementChannel.send("☀ It's now officially Summer 1! ☀");
                break;
            case seasons.summer1.title:
                db.set("seasons.currentSeason", seasons.summer2);
                initPages();
                announcementChannel.send("☀ It's now officially Summer 2! ☀");
                break;
            case seasons.summer2.title:
                db.set("seasons.currentSeason", seasons.fall1);
                initPages();
                announcementChannel.send("🍁 It's now officially Fall 1! 🍁");
                break;
            case seasons.fall1.title:
                db.set("seasons.currentSeason", seasons.fall2);
                initPages();
                announcementChannel.send("🍁 It's now officially Fall 2! 🍁");
                break;
            case seasons.fall2.title:
                db.set("seasons.currentSeason", seasons.winter1);
                initPages();
                announcementChannel.send("❄ It's now officially Winter 1! ❄");
                break;
            case seasons.winter1.title:
                db.set("seasons.currentSeason", seasons.winter2);
                initPages();
                announcementChannel.send("❄ It's now officially Winter 2! ❄");
                break;
            case seasons.winter2.title:
                db.set("seasons.currentSeason", seasons.spring1);
                initPages();
                announcementChannel.send("🌷 It's now officially Spring 1! 🌷");
                break;
        }

        for(let i = 0; i < seasonEvents.length; i++){
            const event = seasonEvents[i];

            const eventSeason = event.eventSeason;

            const season = seasons[event.eventSeason];
            if(season === null) continue;

            if(db.get("seasons.currentSeason").index === getIndexBySeasonTitle(eventSeason)){
                let announcementChannel = client.guilds.cache.get(guildID).channels.cache.get(announcementChannelID);
                announcementChannel.send(event.announcementMessage);
            }
        }
    }
    let am = config.calendar.dailyAnnouncement.message;
    am = am.replace("{season}", db.get("seasons.currentSeason").title);
    am = am.replace("{weather}", getRandomWeather());
    am = am.replace("{day}", db.get("seasons.currentDay"));
    am = am.replace("{totalDays}", config.calendar.seasonLength);
    announcementChannel.send(am);
}

global.getIndexBySeasonTitle = (title) => {
    if(title === "spring") return 1;
    else if (title === "summer") return 2;
    else if (title === "fall") return 3;
    else if (title === "winter") return 4;
    return -1;
}

const getRandomWeather = () => {
    const season = db.get("seasons.currentSeason").index;
    if(season === 1){
        return getRandomFromArr(["Rainy 🌧", "Storming ⛈", "Sunny ☀", "Cloudy ☁"]);
    } else if (season === 2){
        return getRandomFromArr(["Rainy 🌧", "Sunny ☀", "Clear ⛱", "Cloudy ☁"]);
    } else if (season === 3){
        return getRandomFromArr(["Rainy 🌧", "Clear ⛱", "Cloudy ☁"]);
    } else if (season === 4){
        return getRandomFromArr(["Rainy 🌧", "Snowing 🌨", "Cloudy ☁"]);
    }
}

getRandomFromArr = (arr) => {
    return arr[Math.floor(Math.random() * arr.length)];
}