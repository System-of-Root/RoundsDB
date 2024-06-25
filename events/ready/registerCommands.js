const { testServer } = require('../../../config.json');
const areCommandsDifferent = require('../../utils/areCommandsDifferent');
const getApplicationCommands = require('../../utils/getApplicationCommands');
const getLocalCommands = require('../../utils/getLocalCommands');

module.exports = async (client) => {
  try {
    console.log(`Registering commands...`);
    const localCommands = getLocalCommands();
    const applicationCommands = await getApplicationCommands(
      client,
      testServer
    );

    for (const localCommand of localCommands) {
      const { name, description, options } = localCommand;

      const existingCommand = await applicationCommands.cache.find(
        (cmd) => cmd.name === name
      );

      if (existingCommand) {
        if (localCommand.deleted) {
          await applicationCommands.delete(existingCommand.id);
          console.log(`Deleted "${name}" command.`);
          continue;
        }

        if (areCommandsDifferent(existingCommand, localCommand)) {
          await applicationCommands.edit(existingCommand.id, {
            description,
            options,
          });

          console.log(`Edited "${name}" command.`);
        }else{
          console.log(`Skiping "${name}" command, already registered.`);
	}
      } else {
        if (localCommand.deleted) {
          console.log(
            ` Skipping registering command "${name}" as it is deleted.`
          );
          continue;
        }

        await applicationCommands.create({
          name,
          description,
          options,
        });

        console.log(`Registered command "${name}."`);
      }
    }
    console.log(`Command Registration completed!`);
  } catch (error) {
    console.log(`Registeration error:\n`);
    console.log(error.stack);
  }
};
