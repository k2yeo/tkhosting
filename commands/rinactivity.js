const Discord = require("discord.js");
const roblox = require("noblox.js");
const profileschema = require("../schemas/profile-schema");
const mongo = require("../mongo");
const { SlashCommandBuilder } = require("@discordjs/builders");
const getUserName = require("../useful/getUserName");
const embed = require("../useful/embed");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("rinactivity")
    .setDescription("Removes an activity status to a Personnel Profile")
    .addUserOption((option) =>
      option.setName("user").setDescription("Select a user").setRequired(true)
    ),
  rolePerms: ["954815725585965077", "954815810650656899"],
  async execute(interaction, client) {
    let username = await getUserName(interaction, client);

    await mongo().then(async (mongoose) => {
      try {
        try {
          id = await roblox.getIdFromUsername(username);
        } catch {
          return interaction.followUp({
            embeds: [await embed("Error!", "Invalid ROBLOX username!")],
            ephemeral: true,
          });
        }
        const result = await profileschema.findOne({ _id: id });
        if (!result) {
          FlightsAttended = 0;
          Balance = 0;
          Snapshots = "N/A";
          Activity = "Active";
        } else {
          FlightsAttended = result.FlightsAttended;
          Balance = result.Balance;
          Snapshots = result.Snapshots;
          Activity = "Active";
        }

        await profileschema.findOneAndUpdate(
          {
            _id: id,
          },
          {
            _id: id,
            FlightsAttended,
            Balance,
            Snapshots,
            Activity,
          },
          {
            upsert: true,
          }
        );
        const userembd = await embed(
          "Succes!",
          username + " no longer has an activity status."
        );
        interaction.followUp(userembd);
      } finally {
        mongoose.connection.close();
      }
    });
  },
};
