const { MessageEmbed } = require('discord.js');

module.exports = async function (
  title = "None",
  description = "",
  color = "#9766bd"
) {
  const embed = new MessageEmbed();
  embed.setColor(color);
  embed.setTitle(title);
  embed.setDescription(description);
  embed.setTimestamp();
  embed.setFooter({
    text: "Personnel",
    iconURL:
      "https://cdn.discordapp.com/attachments/954818798882533396/958017381035294750/957682225002971287.gif",
  });
  return embed;
};
