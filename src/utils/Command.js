import commander from 'commander';

export default class Command {
  /**
   * The constructor of the command.
   *
   * @param {Object} config The configuration of the command.
   */
  constructor(config) {
    const {
      command,
      description,
      options,
      successMessage,
    } = config;

    this.command = command;
    this.description = description;
    this.options = options || [];
    this.successMessage = successMessage;
  }

  /**
   * Method called when the command is run.
   */
  run() {
    const program = commander
      .command(this.command)
      .description(this.description);

    this.options.forEach((option) => {
      program.option(option.command, option.description);
    });

    program
      .action((env, options) => {
        this.action(env, options);
      })
      .on('--help', () => {
        this.constructor.help();
      });
  }

  /**
   * The action that will be called when the command has been fired.
   */
  static action() {
    throw new Error('You have to implement the method action!');
  }

  /**
   * Checks if the command is valid.
   */
  static isValid() {
    throw new Error('You have to implement the method isValid!');
  }

  /**
   * Will generate the help-block.
   */
  static help() {
    throw new Error('You have to implement the method help!');
  }

  /**
   * Will generate the finished-block.
   */
  static finished() {
    throw new Error('You have to implement the method finished!');
  }
}
