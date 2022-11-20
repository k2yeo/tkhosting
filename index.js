const { Client, Collection, Intents, Interaction } = require("discord.js");
const client = new Client({
  intents: [
    Intents.FLAGS.GUILDS,
    Intents.FLAGS.GUILD_MEMBERS,
    Intents.FLAGS.GUILD_MESSAGE_REACTIONS,
    Intents.FLAGS.GUILD_MESSAGES,
  ],
});
const mongo = require("./mongo");
const fs = require("node:fs");
const { REST } = require("@discordjs/rest");
const { Routes } = require("discord-api-types/v9");
const token = "";
const rest = new REST({ version: "9" }).setToken(token);

const activities_list = [
  'over unholy individuals',
'over staff members',
"to Tamer's screaming",
"to Elle's screaming",
'the Personnel jails',
'for unholy behaviour',
'SloMo by Chanel',
'SEKRET by Ronela Hajati',

];

const connectToMongoDB = async () => {
  await mongo().then((mongoose) => {
    try {
      console.log("CONNECTED TO MONGO, BOT ONLINE");
    } catch (err) {
      return console.log("COULD NOT CONNECT TO MONGO: " + err);
    } finally {
      mongoose.connection.close();
    }
  });
};

const commandFiles = fs
  .readdirSync("./commands")
  .filter((file) => file.endsWith(".js"));
;

const commands = [];
const commandNames = new Map();

for (const file of commandFiles) {
  const command = require(`./commands/${file}`);
  commandNames.set(command.data.name, command);
  commands.push(command.data.toJSON());
}

rest.put(Routes.applicationCommands("990644581685162055"), { body: commands });

client.on("ready", async () => {
  await connectToMongoDB();
  setInterval(() => {
    const index = Math.floor(Math.random() * (activities_list.length - 0) + 0);
    client.user.setPresence({
      status: "online",
      activities: [{ name: activities_list[index], type: "WATCHING" }],
    });
  }, 8000);
});

client.on("interactionCreate", async (interaction) => {
    if (!interaction.isCommand()) return;
  
    const command = commandNames.get(interaction.commandName);
    await interaction.deferReply()

    if (interaction.user.id != '549301808716185600') {
    if (command.channel && interaction.channelId !== command.channel) {
      return await interaction.followUp({
        content: "Wrong channel!",
        ephemeral: true,
      });
    }

    if (command.rolePerms && command.rolePerms.length > 0) {
      let hasPerms = false;
      for (const role of command.rolePerms) {
        if (interaction.member.roles.cache.some(r => r.id === role)) {
          hasPerms = true;
          break
        }
      }
      if (hasPerms == false) {
        return await interaction.followUp({
          content: "No perms babe!",
          ephemeral: true,
        });
      }
    }
    }
    try {
      console.log(interaction.commandName)
      await command.execute(interaction, client);
    } catch (error) {
      console.error(error);
      return await interaction.followUp({
        content: "There was an error while executing this command!",
        ephemeral: true,
      });
    }
  });

  client.on('messageCreate', async message => {
    if (message.content.startsWith('!')) {
      message.reply({content: "no, use / or how ELLE would say it: Use / as slash commands have been integrated", ephemeral : true})
    }
  })

client.login(token);
