const Discord = require("discord.js");
const roblox = require("noblox.js");
const profileschema = require("../schemas/profile-schema");
const mongo = require("../mongo");
const { SlashCommandBuilder } = require("@discordjs/builders");
const embed = require("../useful/embed");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("leaderboard")
    .setDescription(
      "Shows the Attendance Leaderboard for this month, with a maximum of 25 users"
    )
    .addIntegerOption((option) =>
      option
        .setName("toshow")
        .setDescription("The amount of places it will show.")
    ),
  async execute(interaction, client) {
    await mongo().then(async (mongoose) => {
      const userembd = await embed(":trophy: **Attendance Leaderboard**");
      try {
        let result = await profileschema.find().sort({ FlightsAttended: -1 });
        let toshow = interaction.options.getInteger("toshow");
        if (toshow === null) {toshow = 5;}
        
        result = result.slice(0, toshow > result.length ? result.length -1  : toshow);
        let i = 0;
        for (const tab of result) {
          try {
            id = await roblox.getUsernameFromId(tab._id);
            i = i + 1;
          } catch (err) {
            const usernameembd = await embed(
              "Error",
              "Please contact Voretics or mraviations with this error message: " +
                err
            );
            return interaction.followUp({ embeds: [usernameembd] })
          }
          userembd.addFields({
            name: i + ". " + id,
            value: tab.FlightsAttended+" ",
          });
        }
      } finally {
        mongoose.connection.close();
      }
      interaction.followUp({embeds: [userembd], ephemeral: true})
    });
  },
};
