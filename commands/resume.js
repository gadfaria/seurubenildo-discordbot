const { MessageEmbed } = require("discord.js");

module.exports = {
  name: "resume",
  emoji: "⏯",
  description: "Continua a musica que está tocando",
  execute(message) {
    try {
      const serverQueue = message.client.queue.get(message.guild.id);
      if (!message.member.voice.channel)
        return message.channel.send("Entra no canal de voz arrombado!");
      if (!serverQueue)
        return message.channel.send("Não tem musica para continuar carai!");
      serverQueue.connection.dispatcher.resume();

      const returnMessage = new MessageEmbed()
        .setColor(0xff0000)
        .setDescription(`⏯ **Resume**`);

      return message.channel.send(returnMessage);
    } catch (error) {
      return message.channel.send(error);
    }
  },
};
