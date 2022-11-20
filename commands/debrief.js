const Discord = require("discord.js");
const { SlashCommandBuilder } = require("@discordjs/builders");
const embed = require("../useful/embed");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("debrief")
    .setDescription(
      "Informs all Personnel of the status changing of the debrief channel"
    )
    .addStringOption((option) =>
      option
        .setName("status")
        .setDescription("Select the status")
        .setRequired(true)
        .addChoice("open", "open")
        .addChoice("close", "close")
    ),
  rolePerms: [
    "954815725585965077",
    "954815810650656899",
    "954815584074367006",
    "954803770515128370",
    "954802899823779860",
  ],
  channel: '954819200889798737',
  async execute(interaction, client) {
    const status = interaction.options.getString("status");
    let username = interaction.member.nickname;
    if (!username) {
      username = interaction.user.username;
    }
    const userembd = await embed(
      "<:w_TKwhiteplane:957729671628353536> **FLIGHT DEBRIEF**"
    );
    if (status == "open") {
      userembd.setDescription(
        `\nGreetings, personnel! **<@${interaction.user.id}>** ` +
          "has __opened the debrief channel__ for new submissions. To submit a debrief, please use the format below! Please remember that all staff that attended the flight hosted must partake in debriefing as it is __mandatory__. Please keep them professional and tidy, otherwise it will be deleted. \n \n > <@&954801388074958898> <:w_bow:963521462596173904>\n```Name: \nFlight Pros: \nFlight Cons: \nMy Pros: \nMy Cons:```"
      );

      client.channels.cache
        .get(interaction.channelId)
        .send("@here")
        .then((msg) => {
          msg.delete();
        });
    } else {
      userembd.setDescription(
        `\n Farewell, personnel! <@${interaction.user.id}> has now closed the debrief channel! \nPlease __do not submit__ any debriefs underneath this message. \n \nIf you are seeing this after the flight has finished, please ask the flight manager to __reopen__ the channel. \n \n Thank you for attending!`
      );
    }
    
    return interaction.followUp({ embeds: [userembd], ephemeral: true });
  },
};
