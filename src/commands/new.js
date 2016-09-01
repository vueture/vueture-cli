var program = require('commander');
var download = require('download-git-repo');
var chalk = require('chalk');
var exists = require('fs').existsSync;
var path = require('path');
var rename = require('metalsmith-rename');
var ora = require('ora');
require('shelljs/global');

module.exports = {
  load: function () {
    var self = this;

    program
      .command('new [app-name]')
      .description('initialize a fresh Blucify application')
      .action(function (name) {
        self.validate(name);

        if(!self.isValid) {
          process.exit(1);
        }

        self.execute(name);
      })
      .on('--help', function () {
        console.log('  Examples:');
        console.log();
        console.log(chalk.gray('    # will initialize a fresh Blucify application'));
        console.log('    $ blucify new app-name');
        console.log();
      });
  },
  validate: function (name) {
    var isValid = true;

    if (!name) {
      console.log(chalk.red('No name specified!'));
      isValid = false;
    }

    if(exists(path.resolve(name))) {
      console.log(chalk.red('Target directory already exists!'));
      isValid = false;
    }

    this.isValid = isValid;
  },
  execute: function (name) {
    console.log(chalk.green('Crafting the application...'));

    var self = this;
    this.name = name;

    var spinner = ora('Downloading Blucify...');
    spinner.start();

    download('blucify/blucify', this.name, { clone: true }, function (err) {
      spinner.stop();

      if (err) {
        console.log(chalk.red('Whoops! Something went wrong!'));
        console.log(chalk.red(err));
        process.exit(1);
      }

      cd(self.name);

      console.log(chalk.green('Installing node modules...'));
      exec('npm install');

      console.log(chalk.green('Application created!'));
    });
  },
};
