const { MessageEmbed } = require("discord.js");

module.exports = {
  name: "pause",
  emoji: "⏸",
  description: "Pausa a musica que está tocando",
  execute(message) {
    try {
      const serverQueue = message.client.queue.get(message.guild.id);
      if (!message.member.voice.channel)
        return message.channel.send("Entra no canal de voz arrombado!");
      if (!serverQueue)
        return message.channel.send("Não tem musica para pausar carai!");
      serverQueue.connection.dispatcher.pause();
      const returnMessage = new MessageEmbed()
        .setColor(0xff0000)
        .setDescription(`⏸ **Pause**`);

      return message.channel.send(returnMessage);
    } catch (error) {
      return message.channel.send(error);
    }
  },
};
