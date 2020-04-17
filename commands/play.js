const ytdl = require("ytdl-core");
const fetch = require("node-fetch");
const { MessageEmbed } = require("discord.js");

module.exports = {
  name: "play",
  emoji: "▶️",
  description: "Toca uma música no canal de voz",
  async execute(message) {
    try {
      const args = message.content.split(" ");
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

      args.shift();
      let songName = "";

      args.forEach((element) => {
        songName = songName.concat(element, "+");
      });

      console.log(`Making a music request ${songName}...`);
      const url = `https://www.googleapis.com/youtube/v3/search?part=snippet&q=${songName}&maxResults=1&key=${process.env.YOUTUBEKEY}`;

      let response = await fetch(`${url}`);
      const responseObject = await response.json();

      const songInfo = responseObject.items[0];
      
      const song = {
        member: member.user.username,
        title: songInfo.snippet.title,
        thumbnail: songInfo.snippet.thumbnails.high.url,
        url: `https://www.youtube.com/watch?v=${songInfo.id.videoId}`,
        description: songInfo.snippet.description,
      };

      if (!serverQueue) {
        const queueContruct = {
          textChannel: message.channel,
          voiceChannel: voiceChannel,
          connection: null,
          songs: [],
          volume: 5,
          playing: true,
        };

        queue.set(message.guild.id, queueContruct);

        queueContruct.songs.push(song);

        try {
          var connection = await voiceChannel.join();
          queueContruct.connection = connection;
          this.play(message, queueContruct.songs[0]);
        } catch (err) {
          console.log(err);
          queue.delete(message.guild.id);
          return message.channel.send(err);
        }
      } else {
        serverQueue.songs.push(song);
        const returnMessage = new MessageEmbed()
          .setColor(0xff0000)
          .setDescription(`☑️ **${song.title} adicionado a fila!**`);

        return message.channel.send(returnMessage);
      }
    } catch (error) {
      console.log(error);
      message.channel.send(error.message);
    }
  },

  play(message, song) {
    const queue = message.client.queue;
    const guild = message.guild;
    const serverQueue = queue.get(message.guild.id);

    if (!song) {
      serverQueue.voiceChannel.leave();
      queue.delete(guild.id);
      return;
    }

    const dispatcher = serverQueue.connection
      .play(ytdl(song.url))
      .on("finish", () => {
        serverQueue.songs.shift();
        this.play(message, serverQueue.songs[0]);
      })
      .on("error", (error) => console.error(error));

    const songMessage = new MessageEmbed()
      .setTitle(song.title)
      .setColor(0xff0000)
      .setThumbnail(song.thumbnail)
      .setDescription(`▶️** Musica escolhida pelo ${song.member}**`)
      .setURL(song.url);

    dispatcher.setVolumeLogarithmic(serverQueue.volume / 5);
    serverQueue.textChannel.send(songMessage);
  },
};
