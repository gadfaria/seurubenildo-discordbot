const fs = require("fs");
const Discord = require("discord.js");
const Client = require("./client/Client");
const dotenv = require("dotenv");

dotenv.config({ path: ".env" });

const seuRubenildo = new Client();

seuRubenildo.commands = new Discord.Collection();

const commandFiles = fs
  .readdirSync("./commands")
  .filter((file) => file.endsWith(".js"));

for (const file of commandFiles) {
  const command = require(`./commands/${file}`);
  seuRubenildo.commands.set(command.name, command);
  console.log("Command",command.name,"loaded")
}

seuRubenildo.once("ready", () => {
  console.log("Ready!");
  seuRubenildo.user.setActivity("a vida fora");
});
seuRubenildo.once("reconnecting", () => {
  console.log("Reconnecting!");
});
seuRubenildo.once("disconnect", () => {
  console.log("Disconnect!");
});

//seuRubenildo.on("raw", console.log);

seuRubenildo.on("message", async (message) => {
  const args = message.content.slice(process.env.PREFIX.length).split(/ +/);
  const commandName = args.shift().toLowerCase();
  const command = seuRubenildo.commands.get(commandName);

  if (message.author.bot) return;
  if (message.channel.type === "dm") return;
  if (!message.content.startsWith(process.env.PREFIX)) return;

  try {
    command.execute(message);
  } catch (error) {
    console.error(error);
    message.reply("Deu ruim");
  }
});

seuRubenildo.login(process.env.TOKEN);
