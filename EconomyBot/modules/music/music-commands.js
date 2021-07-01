const ytdl = require("ytdl-core");
const ytSearch = require("yt-search");

const queue = new Map();

module.exports.startCommands = async function () {
    client.ws.on("INTERACTION_CREATE", async (interaction) => {

        if (interaction.type === 3) return;

        const command = interaction.data.name.toLowerCase();
        const {name, options} = interaction.data;

        const guild = client.guilds.cache.get(interaction.guild_id);
        const member = guild.members.cache.get(interaction.member.user.id);

        const channel = guild.channels.cache.get(interaction.channel_id);
        const user = interaction.member.user;


        const args = {};

        if (options) {
            for (const option of options) {
                const {name, value} = option;
                args[name] = value.toLowerCase();
            }
        }

        if (command === "music") {
            const voice_channel = member.voice.channel;
            if (!voice_channel) {
                await replyError(interaction, "You need to be in a voice channel.");
                return;
            }

            const serverQueue = queue.get(guild.id);

            let song = {};

            if (args.function.toLowerCase() === "play") {
                if (!args.song) {
                    await replyError(interaction, "You must specify a song name / url.");
                    return;
                }
                if (ytdl.validateURL(args.song)) {
                    const songInfo = await ytdl.getInfo(args.song).catch(async err => {
                        await replyError(interaction, "There was an error fetching this link.");
                    });
                    if (songInfo === undefined || songInfo === null) return;
                    song = {title: songInfo.videoDetails.title, url: songInfo.videoDetails.video_url};
                } else {
                    const videoFinder = async (query) => {
                        const videoResult = await ytSearch(query);
                        return (videoResult.videos.length > 1) ? videoResult.videos[0] : null;
                    }

                    const video = await videoFinder(args.song);

                    if (video) {
                        song = {title: video.title, url: video.url};
                    } else {
                        await replyError(interaction, "Error finding video.");
                        return;
                    }
                }

                if (!serverQueue) {
                    const queueConstructor = {
                        voice_channel: voice_channel,
                        text_channel: channel,
                        connection: null,
                        songs: []
                    };

                    queue.set(guild.id, queueConstructor);
                    queueConstructor.songs.push(song);

                    try {
                        const connection = await voice_channel.join();
                        queueConstructor.connection = connection;
                        await videoPlayer(guild, queueConstructor.songs[0]);
                        await replySuccess(interaction, "Started playing music.");
                    } catch {
                        queue.delete(guild.id);
                        await replyError(interaction, "There was an error connecting.");
                        return;
                    }
                } else {
                    serverQueue.songs.push(song);
                    await replyMusic(interaction, `🎶 **${song.title}** added to queue!`);
                    return;
                }
            } else if (args.function.toLowerCase() === "skip") skipSong(interaction, serverQueue, member);
            else if (args.function.toLowerCase() === "stop") stopSong(interaction, serverQueue, member);
            else if (args.function.toLowerCase() === "queue") await listQueue(interaction, serverQueue, member);
            else await replyError(interaction, "You must specify a valid function [play, skip, stop, queue].");
        }
    });
}

const videoPlayer = async (guild, song) => {
    const songQueue = queue.get(guild.id);

    if (!song) {
        songQueue.voice_channel.leave();
        queue.delete(guild.id);
        return;
    }
    const stream = ytdl(song.url, {filter: "audioonly"});
    songQueue.connection.play(stream, {seek: 0, volume: 0.5}).on('finish', () => {
        songQueue.songs.shift();
        videoPlayer(guild, songQueue.songs[0]);
    });
    const embed = new Discord.MessageEmbed()
        .setTitle("Quingee Music")
        .setDescription(`🎶 Now playing **${song.title}**`)
        .setColor(musicColor);
    await songQueue.text_channel.send(embed);
}

const skipSong = (interaction, serverQueue, member) => {
    if (!member.voice.channel) replyError("You need to be in a channel to skip a song.");
    if (!serverQueue) {
        replyError(interaction, "There are no songs in the queue.");
        return;
    }
    serverQueue.connection.dispatcher.end();
    replySuccess(interaction, "Skipped the current song.");
}

const stopSong = (interaction, serverQueue, member) => {
    if (!member.voice.channel) {
        replyError(interaction, "You need to be in a channel to stop playing.");
        return;
    }
    serverQueue.songs = [];
    serverQueue.connection.dispatcher.end();
    replySuccess(interaction, "Stopped all music.")
}

const listQueue = async (interaction, serverQueue, member) => {
    if(!serverQueue){
        await replyMusic(interaction, "There are currently no songs in the queue.");
        return;
    }

    const embed = new Discord.MessageEmbed()
        .setTitle("Quingee Music")
        .setDescription("All songs currently in the queue.")
        .setColor(musicColor);

    for(let i = 0; i < serverQueue.songs.length; i++){
        embed.addField(serverQueue.songs[i].title, serverQueue.songs[i].url);
    }

    await reply(interaction, embed);
}

const replyMusic = async (interaction, response) => {
    const embed = new Discord.MessageEmbed()
        .setTitle("Quingee Music")
        .setDescription(response)
        .setColor(musicColor);
    await reply(interaction, embed);
}
