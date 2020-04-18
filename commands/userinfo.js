const { MessageEmbed } = require("discord.js");
const { formatDate } = require("../util/formatDate");

module.exports = {
  name: "userinfo",
  emoji: "🤖",
  description: "Mostra informações sobre o usuário",
  execute(message) {
    try {
      const status = {
        online: ":green_circle: Online",
        idle: " :yellow_circle: Ausente",
        dnd: " :red_circle: Não pertubar",
        offline: " :black_circle: Offline",
      };

      const member = message.mentions.members.first() || message.member;
      const bot = member.user.bot ? "🤖 Sim" : " 🙂 Não";

      const serverInfo = new MessageEmbed()
        .setColor(0x008000)
        .setThumbnail(member.user.displayAvatarURL())
        .setTitle("🔍 *Informações do usuário*")
        .addField("**Tag**", `${member.user.tag}`, true)
        .addField("**ID**", member.user.id, true)
        .addField(
          "**Nickname**",
          `${
            member.nickname !== null ? `Nickname: ${member.nickname}` : "Nenhum"
          }`,
          true
        )
        .addField("**Bot**", `${bot}`, true)
        .addField("**Status**", `${status[member.user.presence.status]}`, true)
        .addField(
          "**Jogando**",
          `${
            member.user.presence.game
              ? `${member.user.presence.game.name}`
              : " Nada"
          }`,
          true
        )
        .addField(
          "**Entrou no Discord em**",
          formatDate("DD/MM/YYYY, às HH:mm:ss", member.user.createdAt)
        )
        .addField(
          "**Entrou no servidor em**",
          formatDate("DD/MM/YYYY, às HH:mm:ss", member.joinedAt)
        );

      message.channel.send(serverInfo);
    } catch (error) {
      return message.channel.send(error);
    }
  },
};
