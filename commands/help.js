const fs = require("fs");
const { MessageEmbed } = require("discord.js");

module.exports = {
  name: "help",
  emoji: "❓",
  description: "Lista todos os comandos do Seu Rubenildo",
  execute(message) {
    try {
      const returnMessage = new MessageEmbed()
        .setColor(0x008000)
        .setTitle("*Lista de comandos*")
        .setFooter("Criado por Gabiru");

      const commandFiles = fs
        .readdirSync("./commands")
        .filter((file) => file.endsWith(".js"));

      for (const file of commandFiles) {
        const command = require(`./${file}`);
        returnMessage.fields.push({
          name: `${command.emoji} **${command.name}**`,
          value: `${command.description}`,
          inline: true,
        });
      }

      message.channel.send(returnMessage);
    } catch (error) {
      return message.channel.send(error);
    }
  },
};
