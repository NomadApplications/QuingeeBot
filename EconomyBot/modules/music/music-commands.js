const ytdl = require("ytdl-core");
const ytSearch = require("yt-search");

const queue = new Map();

module.exports.startCommands = function () {
    client.on("message", async message => {
        const args = message.content.split(" ").map(arg => arg.toLowerCase());
        const command = args[0];
        args.shift();

        const prefix = musicPrefix;

        if (command === prefix + "play" || command === prefix + "skip" || command === prefix + "stop" || command === prefix + "queue") {
            const voiceChannel = message.member.voice.channel;
            if (!voiceChannel) return rError(message, "You need to be in a channel to execute this command.");
            const permissions = voiceChannel.permissionsFor(message.client.user);
            if (!permissions.has("CONNECT")) return rError(message, "You don't have the correct permissions.");
            if (!permissions.has("SPEAK")) return rError(message, "You don't have the correct permissions.");

            const serverQueue = queue.get(message.guild.id);

            if (command === prefix + "play") {
                if (!args.length) return rError(message, "You need to send a song title.");
                let song = {};

                /*if (ytdl.validateURL(args[0])) {
                    await ytdl.getInfo(args[0]).then(info => {
                        song = {title: info.videoDetails.title, url: info.videoDetails.video_url};
                    })
                } else {
                    const videoFinder = async (query) => {
                        const videoResult = await ytSearch(query);
                        console.log(videoResult.videos);
                        return (videoResult.videos.length > 1) ? videoResult.videos[0] : null;
                    }

                    const video = await videoFinder(args.join(" "));
                    if (video) {
                        song = {title: video.title, url: video.url};
                    } else {
                        rError(message, "Error finding video.");
                    }
                }*/

                const videoFinder = async (query) => {
                    const videoResult = await ytSearch(query);
                    return (videoResult.videos.length > 1) ? videoResult.videos[0] : null;
                }

                const video = await videoFinder(args.join(" "));
                if (video) {
                    song = {title: video.title, url: video.url};
                } else {
                    rError(message, "Error finding video.");
                }

                if (!serverQueue) {
                    const queueConstructor = {
                        voiceChannel: voiceChannel,
                        textChannel: message.channel,
                        connection: null,
                        songs: []
                    };

                    queue.set(message.guild.id, queueConstructor);
                    queueConstructor.songs.push(song);

                    try {
                        const connection = await voiceChannel.join();
                        queueConstructor.connection = connection;
                        videoPlayer(message.guild, queueConstructor.songs[0]);
                    } catch (err) {
                        queue.delete(message.guild.id);
                        rError(message, "There was an error connecting.");
                        throw err;
                    }
                } else {
                    serverQueue.songs.push(song);
                    return replyMusic(message, `🎶 **${song.title}** added to the queue!`);
                }
            } else if (command === prefix + "skip") await skipSong(message, serverQueue);
            else if (command === prefix + "stop") await stopSong(message, serverQueue);
            else if (command === prefix + "queue") await replyQueue(message, serverQueue);
        }
    })

    client.on('voiceStateUpdate', (oldState, newState) => {
        if (oldState.channelID !==  oldState.guild.me.voice.channelID || newState.channel)
            return;

        if (!oldState.channel.members.size - 1)
            setTimeout(() => {
                if (!oldState.channel.members.size - 1){
                    replyMusicFromChannel(queue.get(oldState.guild.id).textChannel, "I have left due to inactivity. (30 seconds)");
                    queue.delete(oldState.guild.id);
                    oldState.channel.leave();
                }
            }, 30*1000);
    });
}

const videoPlayer = async (guild, song) => {
    const songQueue = queue.get(guild.id);

    if (!song) {
        songQueue.voiceChannel.leave();
        queue.delete(guild.id);
        return;
    }
    const stream = ytdl(song.url, {filter: "audioonly"});
    songQueue.connection.play(stream, {seek: 0, volume: .5}).on('finish', () => {
        songQueue.songs.shift();
        videoPlayer(guild, songQueue.songs[0]);
    });
    await replyMusicFromChannel(songQueue.textChannel, `🎶 Now playing **${song.title}**`);
}

const skipSong = async (message, serverQueue) => {
    if (!message.member.voice.channel) return rError(message, "You need to be in a channel to execute this command!");
    if (!serverQueue) return rError("There is currently no queue.");
    if (!serverQueue.songs[1]) return rError(message, "You are on the last song in your queue.");
    serverQueue.songs.shift();
    await videoPlayer(serverQueue.textChannel.guild, serverQueue.songs[0]);
}

const stopSong = async (message, serverQueue) => {
    if (!message.member.voice.channel) return rError(message, "You need to be in a channel to execute this command!");
    serverQueue.songs = [];
    serverQueue.connection.dispatcher.end();
    await replyMusicFromChannel(serverQueue.textChannel, "🎶 You have stopped all music. Cleared queue.")
}

const replyQueue = async (message, serverQueue) => {
    if (!message.member.voice.channel) return rError(message, "You need to be in a channel to execute this command!");
    if (!serverQueue) return rError(message, "There are no songs in the queue.");
    if (serverQueue.songs.length === 0) return rError(message, "There are no songs in the queue.");
    let songList = "";
    for (let i = 0; i < serverQueue.songs.length; i++) {
        songList += `${i + 1}. **${serverQueue.songs[i].title}** ([Link](${serverQueue.songs[i].url}))\n\n`;
    }
    await replyMusicFromChannel(serverQueue.textChannel, songList);
}

function rError(message, msg) {
    const embed = new Discord.MessageEmbed()
        .setColor(errorColor)
        .setDescription(msg);
    message.channel.send(embed).then(msg => msg.delete({timeout: 5000}))
    return true;
}

const replyMusicFromChannel = async (channel, msg) => {
    const embed = new Discord.MessageEmbed()
        .setTitle("Quingee Music")
        .setDescription(msg)
        .setColor(musicColor);
    channel.send(embed);
    return true;
}

const replyMusic = async (message, msg) => {
    await replyMusicFromChannel(message.channel, msg);
    return true;
}