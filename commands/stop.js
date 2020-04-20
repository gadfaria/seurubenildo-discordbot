const { MessageEmbed } = require("discord.js");

module.exports = {
  name: "stop",
  emoji:"⏹",
  description: "Para todas as musicas da fila",
  execute(message) {
    try {
      const serverQueue = message.client.queue.get(message.guild.id);
      if (!message.member.voice.channel)
        return message.channel.send(
          "Entra no canal de voz arrombado!"
        );

      serverQueue.musics = [];

      serverQueue.connection.dispatcher.end();

      const returnMessage = new MessageEmbed()
        .setColor(0xff0000)
        .setDescription(`⏹ **Stop**`);

      return message.channel.send(returnMessage);
    } catch (error) {
      return message.channel.send("Nao tem musica para parar seu cuzão!");
    }
  },
};
