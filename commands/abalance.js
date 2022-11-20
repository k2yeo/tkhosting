const Discord = require("discord.js");
const roblox = require("noblox.js");
const profileschema = require("../schemas/profile-schema");
const mongo = require("../mongo");
const { SlashCommandBuilder } = require("@discordjs/builders");
const getUserName = require("../useful/getUserName");
const embed = require("../useful/embed");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("abalance")
    .setDescription("Adds robux to a Personnel Profile")
    .addUserOption((option) =>
      option.setName("user").setDescription("Select a user").setRequired(true)
    )
    .addIntegerOption((option) =>
      option
        .setName("amount")
        .setDescription("Give the amount")
        .setRequired(true)
    ),
  rolePerms: ["954815810650656899"],
  async execute(interaction, client) {
    let username = await getUserName(interaction, client);
    let amount = interaction.options.getInteger("amount");
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

      let FlightsAttended;
      let Balance;
      if (!result) {
        FlightsAttended = 0;
        Balance = 0 + amount;
        Activity = "Active";
        Snapshots = "N/A";
      } else {
        FlightsAttended = result.FlightsAttended;
        Balance = +result.Balance + +amount;
        Activity = result.Activity;
        Snapshots = result.Snapshots;
      }
      try {
        await profileschema.findOneAndUpdate(
          {
            _id: id,
          },
          {
            _id: id,
            Snapshots,
            FlightsAttended,
            Balance,
            Activity,
          },
          {
            upsert: true,
          }
        );
        return interaction.followUp({
          embeds: [
            await embed(
              "Success!",
              username + " has gained " + amount + " robux!"
            ),
          ],
        });
      } finally {
        mongoose.connection.close();
      }
    });
  },
};
