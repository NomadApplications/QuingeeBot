const ytdl = require("ytdl-core");
const ytSearch = require("yt-search");

const queue = new Map();

module.exports.startCommands = async function () {
    client.ws.on("INTERACTION_CREATE", async (interaction) => {

        if (interaction.type === 3) return;

        const command = interaction.data.name.toLowerCase();
        const {name, options} = interaction.data;

        const channel = interaction.member.guild.channels.cache.get(interaction.channel_id);
        const user = interaction.member.user;

        const args = {};

        if (options) {
            for (const option of options) {
                const {name, value} = option;
                args[name] = value.toLowerCase();
            }
        }

        if (command === "music") {
            const voice_channel = interaction.member.voice.channel;
            if(!voice_channel) return replyError(interaction, "You need to be in a voice channel.");

            const permissions = voice_channel.permissionsFor(user);
            if(!permissions.has("CONNECT") || !permissions.has("SPEAK")) return replyError(interaction, "You do not have the correct permissions.");

            const serverQueue = queue.get(interaction.member.guild.id);

            let song = {};

            if(args.function.toLowerCase() === "play"){
                if(ytdl.validateURL(args.song)){
                    const songInfo = await ytdl.getInfo(args.song);
                    song = { title: songInfo.videoDetails.title, url: songInfo.videoDetails.video_url };
                } else {
                    const videoFinder = async (query) => {
                        const videoResult = await ytSearch(query);
                        return (videoResult.videos.length > 1) ? videoResult.videos[0] : null;
                    }

                    const video = await videoFinder(args.song);

                    if(video){
                        song = { title: video.title, url: video.url };
                    } else {
                        await replyError(interaction, "Error finding video.");
                    }
                }

                if(!serverQueue){
                    const queueConstructor = {
                        voice_channel: voice_channel,
                        text_channel: text_channel,
                        connection: null,
                        songs: []
                    };

                    queue.set(interaction.member.guild.id, queueConstructor);
                    queueConstructor.songs.push(song);

                    try {
                        const connection = await voice_channel.join();
                        queueConstructor.connection = connection;
                        video_player(interaction.member.guild, queueConstructor.songs[0]);
                    } catch (err) {
                        queue.delete(interaction.member.guild.id);
                        await replyError(interaction, "There was an error connecting.");
                        throw err;
                    }
                } else {
                    serverQueue.songs.push(song);
                    await replyMusic(interaction, `🎶 **${song.title}** added to queue!`);
                }
            }
            else if (args.function.toLowerCase() === "skip") await skipSong(interaction, serverQueue);
            else if (args.function.toLowerCase() === "stop") await stopSong(interaction, serverQueue);
            else await replyError(interaction, "You must specify a valid function [play, skip, stop].");
        }
    });
}

const videoPlayer = async(guild, song) => {
    const songQueue = queue.get(guild.id);

    if(!song){
        songQueue.voice_channel.leave();
        queue.delete(guild.id);
        return;
    }
    const stream = ytdl(song.url, {filter: "audioonly"});
    songQueue.connection.play(stream, {seek: 0, volume: .5 }).on("finish", () => {
        songQueue.songs.shift();
        videoPlayer(guild, songQueue.songs[0]);
    });
    const embed = new Discord.MessageEmbed()
        .setTitle("Quingee Music")
        .setDescription(`🎶 Now playing **${song.title}**`)
        .setColor(musicColor);
    await songQueue.text_channel.send(embed);
}

const skipSong = (interaction, serverQueue) => {
    if(!interaction.member.voice.channel) return replyError("You need to be in a channel to skip a song.");
    if(!serverQueue){
        return replyError(interaction, "There are no songs in the queue.");
    }
    serverQueue.connection.dispatcher.end();
}

const stopSong = (interaction, serverQueue) => {
    if(!interaction.member.voice.channel) return replyError(interaction, "You need to be in a channel to stop playing.");
    serverQueue.song = [];
    serverQueue.connection.dispatcher.end();
}

const replyMusic = async(interaction, response) => {
    const embed = new Discord.MessageEmbed()
        .setTitle("Quingee Music")
        .setDescription(response)
        .setColor(musicColor);
    await reply(interaction, embed);
}
