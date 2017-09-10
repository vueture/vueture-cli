import path from 'path';
import download from 'download-git-repo';
import ora from 'ora';
import { existsSync } from 'fs';
import * as logging from './../../lib/logging';
import Command from './../utils/Command';

export default class New extends Command {
  /**
   * The constructor of the new-component.
   */
  constructor() {
    const config = {
      command: 'new [app-name]',
      description: 'Initialize a fresh Vueture application',
    };

    super(config);
  }

  /**
   * The action that will be called when the command has been fired.
   *
   * @param {String|null|undefined} env     The environment that has been send with the command.
   * @param {Object}                options The options that can are send with the command.
   */
  action(env, options) {
    if (!this.constructor.isValid(env, options)) {
      process.exit(1);
    }

    logging.info('Crafting the application...');

    const spinner = ora('Downloading Vueture...');
    spinner.start();

    download('vueture/vueture', env, { clone: false }, (err) => {
      spinner.stop();

      if (err) {
        logging.error('Whoops! Something went wrong!');
        logging.error(err);
        process.exit(1);
      }

      logging.success('Application created!');

      this.constructor.finished(env);
    });
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

    if (existsSync(path.resolve(env))) {
      logging.error('Target directory already exists!');

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
    logging.muted('    # will initialize a fresh Vueture application');
    logging.normal('    $ vueture new my-app');
    logging.normal();
  }

  /**
   * Will generate the finished-block.
   *
   * @param {String} name The name of the new application.
   */
  static finished(name) {
    logging.normal();
    logging.normal('To get started:');
    logging.normal();
    logging.normal(`  $ cd ${name}`);
    logging.normal('  $ npm install');
    logging.normal('  $ npm run dev');
  }
}
