module.exports = {
  name: "skip",
  emoji: "⏭",
  description: "Toca a proxima musica na fila",
  execute(message) {
    try {
      const serverQueue = message.client.queue.get(message.guild.id);
      if (!message.member.voice.channel)
        return message.channel.send("Entra no canal de voz arrombado!");
      if (!serverQueue)
        return message.channel.send("Não tem musica para passar carai!");
      serverQueue.connection.dispatcher.end();
    } catch (error) {
      return message.channel.send(error);
    }
  },
};
