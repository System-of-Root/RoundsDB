const {
  ApplicationCommandOptionType,
  PermissionFlagsBits
} = require('discord.js');
const settings = require('../../utils/settings.js');
const database = require('../../utils/database.js');
const embeds = require('../../utils/Embeds.js');
const {waitUntil} = require('async-wait-until');

module.exports = {
  name: 'random',
  description: 'Replies with data about a random card',
  options: [],

  callback: async (client, interaction) => {
	  await interaction.deferReply({ ephemeral: await settings.ephemeral(interaction.guildId) });
	  var id;
	  database.get("SELECT ID from Cards ORDER BY RANDOM() LIMIT 1",{},(e,r) => id = r.ID)
	  await waitUntil(() => id != undefined);
	  await interaction.editReply(embeds.card(await(database.card(id))));
  }
};


