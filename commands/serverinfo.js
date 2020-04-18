const { MessageEmbed } = require("discord.js");
const { formatDate } = require("../util/formatDate");

module.exports = {
  name: "serverinfo",
  emoji: "❗️",
  description: "Informação sobre o servidor",
  execute(message) {
    try {
      const region = {
        brazil: ":flag_br: Brazil",
      };
      const date = message.guild.createdAt;
      const joined = message.member.joinedAt;

      const serverInfo = new MessageEmbed()
        .setColor(0x008000)
        .setTitle("🔍 *Informações do servidor*")
        .addField("**Nome**", message.guild.name, true)
        .addField("**ID**", message.guild.id, true)
        .addField(
          "**Dono(a)**",
          `${message.guild.owner.user.username}#${message.guild.owner.user.discriminator}`
        )
        .addField("**Região**", region[message.guild.region], true)
        .addField("**Criado em**", formatDate("DD/MM/YYYY, às HH:mm:ss", date))
        .addField(
          "**Você entrou em**",
          formatDate("DD/MM/YYYY, às HH:mm:ss", joined)
        );

      message.channel.send(serverInfo);
    } catch (error) {
      return message.channel.send(error);
    }
  },
};
