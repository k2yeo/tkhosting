const Discord = require("discord.js");
const embed = require("../useful/embed");
const { SlashCommandBuilder } = require("@discordjs/builders");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("shout")
    .setDescription("Informs everyone of a flight")
    .addStringOption((option) =>
      option
        .setName("airport")
        .setDescription("Select the airport")
        .setRequired(true)
        .addChoice("ayt", "ayt")
        .addChoice("gzp", "gzp")
        .addChoice("ist", "ist")
        .addChoice("tia", "tia")
        .addChoice("isl", "isl")
        .addChoice("cli", "cli")
    )
    ,
  rolePerms: [
    "954815725585965077",
    "954815810650656899",
    "954815584074367006",
    "954803770515128370",
    "954802899823779860",'954798639820197898',
  ],
  channel: '955034989756567572',
  async execute(interaction, client) {
    let username = interaction.member.nickname;
    if (!username) {
      username = interaction.user.username;
    }
    let url = "";
    let airport = "";
    selectedAirport = interaction.options.getString("airport");
    switch (selectedAirport) {
      case "ayt":
        url = "https://bit.ly/tkantalyaairport";
        airport = "<:z_AYTlogo:957682225061720094> **Antalya Airport**";
        break;
      case "gzp":
        airport = "<:z_GZPlogo:957682225049129030> **Gazipaşa-Alanya Airport**";
        url = "https://bit.ly/tkalanyaairport";
        break;
      case "ist":
        airport = "<:z_ISTlogo:957682225053323304> **Istanbul Airport**";
        url = "https://bit.ly/tkistanbulairport";
        break;
      case "tia":
        airport = "<:z_TIAlogo:957682225451769956> **Tirana Airport**";
        url = "https://bit.ly/tktiranaairport";
        break;
      case "isl":
        airport = "<:z_GZPlogo:957682225049129030> **Atatürk Airport**";
        url = "https://bit.ly/tkataturkairport";
        break;
      case "clj":
        airport = "<:z_CLJlogo:1000895285406482432> **Cluj-Napoca Airportt**";
        url = "https://bit.ly/tkclujairport";
        break;
    }
    const userembd = await embed(
      "<:w_TKwhiteplane:957729671628353536>  **Flight Announcement**",
      `\n Greetings, personnel! <@${interaction.user.id}> has announced a flight at ${airport}. \nIf you have been allocated for a role at this flight, please __make your way__ to the airport now. Those who do not attend the flight and has been put down in the briefing message will __receive a warning__. Upon arrival, ensure you do the following tasks: \n> ✠ Team yourself Staff and respawn yourself \n> ✠ Put your appropriate uniform on \n> ✠ Take a seat in the briefing room and await further instructions \nMake sure to listen to all the Flight Manager's announcements and instructions so the flight is organised and up to our standards. Thank you and see you all at the briefing room. \n \n<:w_TKClick:957731324184113173> ${url}`
    );
    client.channels.cache
      .get(interaction.channelId)
      .send("@everyone")
      .then((msg) => {
        msg.delete();
      });
    interaction.followUp({ embeds: [userembd] });
  },
};
