const Youtube = require("simple-youtube-api");
const { MessageEmbed } = require("discord.js");
const { playMusic } = require("../util/playMusic");

module.exports = {
  name: "play",
  emoji: "▶️",
  description: "Toca uma música no canal de voz",

  async execute(message) {
    try {
      const youtube = new Youtube(process.env.GOOGLE_KEY);

      const musicName = message.content.replace(
        `${process.env.PREFIX}play `,
        ""
      );

      const queue = message.client.queue;
      const serverQueue = message.client.queue.get(message.guild.id);
      const member = message.member;
      const voiceChannel = message.member.voice.channel;

      if (!voiceChannel)
        return message.channel.send("Entra no chat de voz arrombado!");
      const permissions = voiceChannel.permissionsFor(message.client.user);
      if (!permissions.has("CONNECT") || !permissions.has("SPEAK")) {
        return message.channel.send("Preciso de permissão!");
      }

      const musicInfo = await youtube.searchVideos(musicName, 1);

      const music = {
        member: member.user.username,
        title: musicInfo[0].raw.snippet.title,
        thumbnail: musicInfo[0].raw.snippet.thumbnails.high.url,
        url: `https://www.youtube.com/watch?v=${musicInfo[0].raw.id.videoId}`,
        description: musicInfo[0].raw.snippet.description,
      };

      if (!serverQueue) {
        const queueContruct = {
          textChannel: message.channel,
          voiceChannel: voiceChannel,
          connection: null,
          musics: [],
          volume: 5,
          playing: true,
        };

        queue.set(message.guild.id, queueContruct);
        
        queueContruct.musics.push(music);

        try {
          var connection = await voiceChannel.join();
          queueContruct.connection = connection;
          playMusic(message, queueContruct.musics[0]);
        } catch (err) {
          console.log(err);
          queue.delete(message.guild.id);
          return message.channel.send(err);
        }
      } else {
        serverQueue.musics.push(music);
        const returnMessage = new MessageEmbed()
          .setColor(0xff0000)
          .setDescription(`☑️ **${music.title} adicionado a fila!**`);

        return message.channel.send(returnMessage);
      }
    } catch (error) {
      console.log(error);
      message.channel.send(error.message);
    }
  },
};
