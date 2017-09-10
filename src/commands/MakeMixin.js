import * as logging from './../../lib/logging';
import Command from './../utils/Command';
import Generator from './../utils/Generator';

export default class MakeMixin extends Command {
  /**
   * The constructor of the make:component command.
   */
  constructor() {
    const config = {
      command: 'make:mixin [name]',
      description: 'Scaffold a new mixin',
    };

    const generatorConfig = {
      type: 'mixin',
      isSplittable: false,
      outputDirectory: 'src/mixins',
      handlebars: [],
    };

    super(config);

    this.generator = new Generator(generatorConfig);
  }

  /**
   * The action that will be called when the command has been fired.
   *
   * @param {String|undefined} env     The environment that has been send with the command.
   * @param {Object}           options The options that can are send with the command.
   */
  action(env, options) {
    if (!this.constructor.isValid(env)) {
      process.exit(1);
    }

    logging.info(`Creating mixin "${env}"...`);

    this.generator.generate(env, options.split);

    this.constructor.finished();
  }

  /**
   * Checks if the command is valid.
   *
   * @param {String|null|undefined} env The environment that has been send with the command.
   *
   * @returns {boolean} If the command is valid.
   */
  static isValid(env) {
    if (!env) {
      logging.error('No name specified!');
      return false;
    }

    return true;
  }

  /**
   * Will generate the help-block.
   */
  static help() {
    logging.normal('  Examples:');
    logging.normal();
    logging.muted('    # Will scaffold a new mixin');
    logging.normal('    $ vueture make:mixin slot');
    logging.muted('    # Will scaffold a new mixin in a custom directory');
    logging.normal('    $ vueture make:component slot/main');
    logging.normal();
  }

  /**
   * Will generate the finished-block.
   */
  static finished() {
    logging.success('The mixin has been created!');
  }
}
