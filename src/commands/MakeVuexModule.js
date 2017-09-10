import * as logging from './../../lib/logging';
import Command from './../utils/Command';
import Generator from './../utils/Generator';

export default class MakeVuexModule extends Command {
  /**
   * The constructor of the make:component command.
   */
  constructor() {
    const config = {
      command: 'make:vuex-module [name]',
      description: 'Scaffold a new Vuex module',
      options: [{
        command: '-s, --split',
        description: 'Split the Vuex module into separate files',
      }],
    };

    const generatorConfig = {
      type: 'vuex-module',
      isSplittable: true,
      outputDirectory: 'src/store/modules',
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

    logging.info(`Creating Vuex module "${env}"...`);

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
    logging.muted('    # Will scaffold a new Vuex module');
    logging.normal('    $ vueture make:vuex-module user');
    logging.muted('    # Will scaffold a new Vuex module in a custom directory');
    logging.normal('    $ vueture make:vuex-module user/admin');
    logging.normal();
  }

  /**
   * Will generate the finished-block.
   */
  static finished() {
    logging.success('The Vuex module has been created!');
  }
}
