const Discord = require("discord.js");
const roblox = require("noblox.js");
const profileschema = require("../schemas/profile-schema");
const mongo = require("../mongo");
const { SlashCommandBuilder } = require("@discordjs/builders");
const embed = require("../useful/embed");
const getUserName = require("../useful/getUserName");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("removeflight")
    .setDescription("Removes flight attendance from a Personnel Profile")
    .addIntegerOption((option) =>
      option
        .setName("flights")
        .setDescription("Amount of flights")
        .setRequired(true)
    )
    .addUserOption((option) =>
      option.setName("user").setDescription("Select a user").setRequired(true)
    ),
  rolePerms: ["954815725585965077", "954815810650656899"],
  async execute(interaction, client) {
    username = await getUserName(interaction, client);
    console.log(username)
    try {
      if (!username) {
        return interaction.followUp({
          embeds: [await embed("Error!", "Invalid ROBLOX username!")],
          ephemeral: true,
        });
      }
      id = await roblox.getIdFromUsername(username);
    } catch {
      return interaction.followUp({
        embeds: [await embed("Error!", "Invalid ROBLOX username!")],
        ephemeral: true,
      });
    }
    const times = interaction.options.getInteger("flights");
    await mongo().then(async (mongoose) => {
      try {
        const result = await profileschema.findOne({ _id: id });
        let FlightsAttended;
        let Balance;
        if (!result) {
          FlightsAttended = 0;
          Balance = 0;
          Activity = "Active";
        } else {
          FlightsAttended = result.FlightsAttended - 1 * times;
          Balance = result.Balance - 30 * times;
          Activity = result.Activity;
          if (FlightsAttended < 0) {
            FlightsAttended = 0;
          }
          if (Balance < 0) {
            Balance = 0;
          }
        }

        let OldSnapshots;
        if (!result) {
          OldSnapshots = "None";
        } else {
          OldSnapshots = result.Snapshots;
        }

        await profileschema.findOneAndUpdate(
          {
            _id: id,
          },
          {
            _id: id,
            FlightsAttended: FlightsAttended,
            Balance: Balance,
            Snapshots: OldSnapshots,
            Activity,
          },
          {
            upsert: true,
          }
        );
        const userembd = await embed(
          "Succes!",
          username + " has lost " + times + " flight(s)."
        );
        return interaction.followUp({ embeds: [userembd] });
      } finally {
        mongoose.connection.close();
      }
    });
  },
};
