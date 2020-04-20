const ytdl = require("ytdl-core");
const { MessageEmbed } = require("discord.js");

exports.playMusic = (message, music) => {
  const queue = message.client.queue;
  const guild = message.guild;
  const serverQueue = queue.get(message.guild.id);

  if (!music) {
    serverQueue.voiceChannel.leave();
    queue.delete(guild.id);
    return;
  }

  const dispatcher = serverQueue.connection
    .play(ytdl(music.url))
    .on("finish", () => {
      serverQueue.musics.shift();
      this.playMusic(message, serverQueue.musics[0]);
    })
    .on("error", (error) => console.error(error));

  const musicMessage = new MessageEmbed()
    .setTitle(music.title)
    .setColor(0xff0000)
    .setThumbnail(music.thumbnail)
    .setDescription(`▶️** Musica escolhida pelo ${music.member}**`)
    .setURL(music.url);

  dispatcher.setVolumeLogarithmic(serverQueue.volume / 5);
  serverQueue.textChannel.send(musicMessage);
};
