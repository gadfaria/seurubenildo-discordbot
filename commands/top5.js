const Youtube = require("simple-youtube-api");
const { MessageEmbed } = require("discord.js");
const { playMusic } = require("../util/playMusic");

module.exports = {
  name: "top5",
  emoji: "▶️",
  description: "Mostra os cinco primeiros resultados no youtube",
  async execute(message) {
    try {
      const youtube = new Youtube(process.env.GOOGLE_KEY);

      const musicName = message.content.replace(
        `${process.env.PREFIX}top5 `,
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

      const musicInfo = await youtube.searchVideos(musicName, 5);

      message.channel.send(
        `0️⃣ :white_small_square: ${musicInfo[0].raw.snippet.title}`
      );
      message.channel.send(
        `1️⃣ :white_small_square: ${musicInfo[1].raw.snippet.title}`
      );
      message.channel.send(
        `2️⃣ :white_small_square: ${musicInfo[2].raw.snippet.title}`
      );
      message.channel.send(
        `3️⃣ :white_small_square: ${musicInfo[3].raw.snippet.title}`
      );
      message.channel.send(
        `4️⃣ :white_small_square: ${musicInfo[4].raw.snippet.title}`
      );

      message.channel
        .send({
          embed: {
            color: 0xff0000,
            description: "**Escolha uma música de 0 a 4**",
          },
        })
        .then(async (embedMessage) => {
          await embedMessage.react("0️⃣");
          await embedMessage.react("1️⃣");
          await embedMessage.react("2️⃣");
          await embedMessage.react("3️⃣");
          await embedMessage.react("4️⃣");

          const filter = (reaction, user) => {
            return (
              ["0️⃣", "1️⃣", "2️⃣", "3️⃣", "4️⃣"].includes(reaction.emoji.name) &&
              user.id === message.author.id
            );
          };

          const collector = embedMessage.createReactionCollector(filter, {
            time: 20000,
          });

          let music;

          collector.on("collect", async (reaction, reactionCollector) => {
            switch (reaction.emoji.name) {
              case "0️⃣":
                music = {
                  member: member.user.username,
                  title: musicInfo[0].raw.snippet.title,
                  thumbnail: musicInfo[0].raw.snippet.thumbnails.high.url,
                  url: `https://www.youtube.com/watch?v=${musicInfo[0].raw.id.videoId}`,
                  description: musicInfo[0].raw.snippet.description,
                };
                break;

              case "1️⃣":
                music = {
                  member: member.user.username,
                  title: musicInfo[1].raw.snippet.title,
                  thumbnail: musicInfo[1].raw.snippet.thumbnails.high.url,
                  url: `https://www.youtube.com/watch?v=${musicInfo[1].raw.id.videoId}`,
                  description: musicInfo[1].raw.snippet.description,
                };
                break;

              case "2️⃣":
                music = {
                  member: member.user.username,
                  title: musicInfo[2].raw.snippet.title,
                  thumbnail: musicInfo[2].raw.snippet.thumbnails.high.url,
                  url: `https://www.youtube.com/watch?v=${musicInfo[2].raw.id.videoId}`,
                  description: musicInfo[2].raw.snippet.description,
                };
                break;

              case "3️⃣":
                music = {
                  member: member.user.username,
                  title: musicInfo[3].raw.snippet.title,
                  thumbnail: musicInfo[3].raw.snippet.thumbnails.high.url,
                  url: `https://www.youtube.com/watch?v=${musicInfo[3].raw.id.videoId}`,
                  description: musicInfo[3].raw.snippet.description,
                };
                break;

              case "4️⃣":
                music = {
                  member: member.user.username,
                  title: musicInfo[4].raw.snippet.title,
                  thumbnail: musicInfo[4].raw.snippet.thumbnails.high.url,
                  url: `https://www.youtube.com/watch?v=${musicInfo[4].raw.id.videoId}`,
                  description: musicInfo[4].raw.snippet.description,
                };
                break;
            }

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
          });
        });
    } catch (error) {
      console.log(error);
      message.channel.send(error.message);
    }
  },
};
