const Discord = require("discord.js");
const roblox = require("noblox.js");
const profileschema = require("../schemas/profile-schema");
const mongo = require("../mongo");
const goose = require("mongoose");
const { SlashCommandBuilder } = require("@discordjs/builders");
const embed = require("../useful/embed");
const getUserName = require("../useful/getUserName");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("profile")
    .setDescription('Displays a Personnel Profile')
    .addUserOption((option) =>
      option.setName("user").setDescription("Select a user")
    ),
  async execute(interaction, client) {
    let username;
    if (interaction.options.getUser("user")) {
     username = await getUserName(interaction, client)
    } else {
      username = interaction.member.nickname;
    if (username === null) {
      username = interaction.user.username;
    }
    }
    let id;
    try {
      id = await roblox.getIdFromUsername(username);
    } catch {
      const usernameembd = await embed(
        "Error",
        "Looks like this username isn't in my database. This most likely means it is not a valid ROBLOX username. Try again..."
      );
      return interaction.followUp({ embeds: [usernameembd], ephemeral: true });
    }
    await mongo().then(async (mongoose) => {
      const profileembd = await embed(username);
      try {
        const result = await profileschema.findOne({ _id: id });
        let FlightsAttended;
        let Balance;
        if (!result) {
          FlightsAttended = "0";
          Balance = 0;
          Strikes = "N/A";
          Activity = "Active";
        } else {
          FlightsAttended = result.FlightsAttended
            ? result.FlightsAttended
            : "0";
          Balance = result.Balance ? result.Balance : 0;
          Strikes = result.Snapshots ? result.Snapshots : "N/A";
          Activity = result.Activity ? result.Activity : "Active";
        }
        
        profileembd.setURL(`https://www.roblox.com/users/${id}/profile`);
        profileembd.setThumbnail(
          `http://www.roblox.com/Thumbs/Avatar.ashx?x=150&y=150&Format=Png&username=${username}`
        );
        profileembd.addFields(
          { name: "Flights Attended", value: FlightsAttended.toString() },
          { name: "Monthly Salary", value: "R$" + Balance },
          { name: "Warnings", value: Strikes ? Strikes : "N/A" },
          { name: "Activity Status", value: Activity ? Activity : "Active" }
        );

        
      } finally {
        mongoose.connection.close();
      }
      interaction.followUp({ embeds: [profileembd], ephemeral: true });
    });
  },
};
