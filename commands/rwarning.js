const Discord = require("discord.js");
const roblox = require("noblox.js");
const profileschema = require("../schemas/profile-schema");
const mongo = require("../mongo");
const { SlashCommandBuilder } = require("@discordjs/builders");
const getUserName = require("../useful/getUserName");
const embed = require("../useful/embed");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("rwarning")
    .setDescription("Removes the oldest warning from a Personnel Profile")
    .addUserOption((option) =>
      option.setName("user").setDescription("Select a user").setRequired(true)
    ),
  rolePerms: ["954815725585965077", "954815810650656899", "954815584074367006"],
  async execute(interaction, client) {
    let username = await getUserName(interaction, client);
    try {
      id = await roblox.getIdFromUsername(username);
    } catch {
      return interaction.followUp({
        embeds: [await embed("Error!", "Invalid ROBLOX username!")],
        ephemeral: true,
      });
    }
    await mongo().then(async (mongoose) => {
      const result = await profileschema.findOne({ _id: id });
      let Olds;
      let reason;
      let oldestsnapshot;
      if (!result) {
        Olds = "N/A";
      } else {
        if (result.Snapshots) {
          if (result.Snapshots.indexOf("W3 |") > -1) {
            reason = result.Snapshots.trim().split("\nW3 |");
            Olds = reason[0];
            oldestsnapshot = reason[1];
          } else if (result.Snapshots.indexOf("W2 |") > -1) {
            reason = result.Snapshots.trim().split("\nW2 |");
            Olds = reason[0];
            oldestsnapshot = reason[1];
          } else if (result.Snapshots.indexOf("W1 | ") > -1) {
            reason = result.Snapshots.trim().split("W1 |");
            oldestsnapshot = reason[1];
            Olds = "N/A";
          } else {
            Olds = "N/A";
            reason = result.Snapshots.trim().split("W1 |");
            oldestsnapshot = reason[1];
          }
        }
      }

      let FlightsAttended;
      let Balance;
      if (!result) {
        FlightsAttended = 0;
        Balance = 0;
        Activity = "Active";
      } else {
        FlightsAttended = result.FlightsAttended;
        Balance = result.Balance;
        Activity = result.Activity;
      }
      try {
        await profileschema.findOneAndUpdate(
          {
            _id: id,
          },
          {
            _id: id,
            Snapshots: Olds,
            FlightsAttended: FlightsAttended,
            Balance: Balance,
            Activity: Activity,
          },
          {
            upsert: true,
          }
        );
        return interaction.followUp({
          embeds: [
            await embed(
              "Success!",
              username + " no longer has a warning for " + oldestsnapshot
            ),
          ],
        });
      } finally {
        mongoose.connection.close();
      }
    });
  },
};
