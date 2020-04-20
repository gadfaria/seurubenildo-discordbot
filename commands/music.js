const { MessageEmbed } = require("discord.js");

module.exports = {
  name: "music",
  emoji: "🎵",
  description: "Mostra a musica que esta tocando",
  execute(message) {
    try {
      const serverQueue = message.client.queue.get(message.guild.id);
      if (!serverQueue) return message.channel.send("Não tem nada tocando.");

      const musicMessage = new MessageEmbed()
        .setTitle(serverQueue.musics[0].title)
        .setColor(0xff0000)
        .setThumbnail(serverQueue.musics[0].thumbnail)
        .setDescription(
          `▶️** Musica escolhida pelo ${serverQueue.musics[0].member}**`
        )
        .setURL(serverQueue.musics[0].url);

      return message.channel.send(musicMessage);
    } catch (error) {
      return message.channel.send(error);
    }
  },
};
