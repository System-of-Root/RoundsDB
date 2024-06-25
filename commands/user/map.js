const {
  ApplicationCommandOptionType,
  PermissionFlagsBits
} = require('discord.js');
const settings = require('../../utils/settings.js');

module.exports = {
 name: 'map',
  description: 'Displays maps',
  options: [
          {
                  name: 'mod',
                  description: 'The name of the mod',
                  type: ApplicationCommandOptionType.String,
                  required: false,
          },
          {
                  name: 'map',
                  description: 'The name of the map',
                  type: ApplicationCommandOptionType.String,
                  required: false,
          }
  ],

  callback: async (client, interaction) => {
      await interaction.deferReply({ ephemeral: settings.ephemeral(interaction.guildId) });
      await new Promise(r => setTimeout(r, 2000));
      await interaction.editReply("Command unavalable. Bot code is still being restored.");
  }

};


