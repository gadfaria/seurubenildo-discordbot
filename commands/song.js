const { MessageEmbed } = require("discord.js");

module.exports = {
  name: "song",
  emoji: "🎵",
  description: "Mostra a musica que esta tocando",
  execute(message) {
    try {
      const serverQueue = message.client.queue.get(message.guild.id);
      if (!serverQueue) return message.channel.send("Não tem nada tocando.");

      const songMessage = new MessageEmbed()
        .setTitle(serverQueue.songs[0].title)
        .setColor(0xff0000)
        .setThumbnail(serverQueue.songs[0].thumbnail)
        .setDescription(
          `▶️** Musica escolhida pelo ${serverQueue.songs[0].member}**`
        )
        .setURL(serverQueue.songs[0].url);

      return message.channel.send(songMessage);
    } catch (error) {
      return message.channel.send(error);
    }
  },
};
