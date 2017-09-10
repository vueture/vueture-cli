import * as logging from './../../lib/logging';
import Command from './../utils/Command';
import Generator from './../utils/Generator';

export default class MakeComponent extends Command {
  /**
   * The constructor of the make:component command.
   */
  constructor() {
    const config = {
      command: 'make:component [name]',
      description: 'Scaffold a new component',
      options: [{
        command: '-s, --split',
        description: 'Split the .vue-file into separate files',
      }, {
        command: '-cp, --css-preprocessor [css]',
        description: 'Specify the css preprocessor',
      }],
    };

    const generatorConfig = {
      type: 'component',
      isSplittable: true,
      outputDirectory: 'src/components',
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

    logging.info(`Creating component "${env}"...`);

    if (options.cssPreprocessor) {
      this.generator.handlebars.push({
        keyword: 'cssPreprocessor',
        replacement: options.cssPreprocessor,
      });
    }

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
    logging.muted('    # Will scaffold a new component');
    logging.normal('    $ vueture make:component panel');
    logging.muted('    # Will scaffold a new component in a custom directory');
    logging.normal('    $ vueture make:component button/link');
    logging.normal();
  }

  /**
   * Will generate the finished-block.
   */
  static finished() {
    logging.success('The component has been created!');
  }
}
