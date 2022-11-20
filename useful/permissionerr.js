const Discord = require("discord.js");

module.exports = async function (msg) {
  const permembd = embed("Error", "Wrong channel.");
  return message.channel.reply({ embeds: [permembd], ephemeral: true });
};
