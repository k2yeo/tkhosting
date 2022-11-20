const Discord = require("discord.js");
const roblox = require("noblox.js");
const profileschema = require("../schemas/profile-schema");
const mongo = require("../mongo");
const { SlashCommandBuilder } = require("@discordjs/builders");
const getUserName = require("../useful/getUserName");
const embed = require("../useful/embed");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("warn")
    .setDescription("Adds a warning to a Personnel Profile")
    .addUserOption((option) =>
      option.setName("user").setDescription("Select a user").setRequired(true)
    )
    .addStringOption((option) =>
      option.setName("reason").setDescription("Give a reason").setRequired(true)
    ),
  rolePerms: ["954815725585965077", "954815810650656899", "954815584074367006"],
  async execute(interaction, client) {
    let username = await getUserName(interaction, client);
    let reason = interaction.options.getString("reason");
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
      let OldSnapshots;
      if (!result) {
        OldSnapshots = "W1 | " + reason;
      } else {
        if (result.Snapshots.indexOf("W3 | ") > -1) {
          return interaction.followUp({
            embeds: [await embed("Error!", "Maximum of 3 warnings reached!")],
            ephemeral: true,
          });
        } else if (result.Snapshots.indexOf("W2 |") > -1) {
          OldSnapshots = result.Snapshots + "\nW3 | " + reason;
        } else if (result.Snapshots.indexOf("W1 | ") > -1) {
          OldSnapshots = result.Snapshots + "\nW2 | " + reason;
        } else {
          OldSnapshots = "W1 | " + reason;
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
        await profileschema
          .findOneAndUpdate(
            {
              _id: id,
            },
            {
              _id: id,
              Snapshots: OldSnapshots,
              FlightsAttended: FlightsAttended,
              Balance: Balance,
              Activity,
            },
            {
              upsert: true,
            }
          )
          .catch((err) => console.log(err));
        return interaction.followUp({
          embeds: [
            await embed(
              "Succes!",
              username + " has recieved a warning for: " + reason
            ),
          ],
        });
      } finally {
        mongoose.connection.close();
      }
    });
  },
};
