const Discord = require("discord.js");
const roblox = require("noblox.js");
const profileschema = require("../schemas/profile-schema");
const mongo = require("../mongo");
const { SlashCommandBuilder } = require("@discordjs/builders");
const getUserName = require("../useful/getUserName");
const embed = require("../useful/embed");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("inactivity")
    .setDescription("Adds an activity status to a Personnel Profile")
    .addUserOption((option) =>
      option.setName("user").setDescription("Select a user").setRequired(true)
    )
    .addStringOption((option) =>
      option
        .setName("reason")
        .setDescription("Give the reason")
        .setRequired(true)
    ),
  rolePerms: ["954815725585965077", "954815810650656899"],
  async execute(interaction, client) {
    const username = await getUserName(interaction, client);
    const reason = interaction.options.getString("reason");

    try {
      id = await roblox.getIdFromUsername(username);
    } catch {
      return interaction.followUp({
        embeds: [await embed("Error!", "Invalid ROBLOX username!")],
        ephemeral: true,
      });
    }

    await mongo().then(async (mongoose) => {
      try {
        const result = await profileschema.findOne({ _id: id });

        if (!result) {
          FlightsAttended = 0;
          Balance = 0;
          Snapshots = "N/A";
          Activity = reason;
        } else {
          FlightsAttended = result.FlightsAttended;
          Balance = result.Balance;
          Snapshots = result.Snapshots;
          Activity = reason;
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
        const succesEm = await embed(
          username + " is now inactive due to: " + Activity
        );
        interaction.followUp({  embeds: [succesEm], ephemeral: true });

      } finally {
        mongoose.connection.close();
      }
    });
  },
};
