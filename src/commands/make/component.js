var program = require('commander');
var chalk = require('chalk');
var path = require('path');
var Handlebars = require('handlebars');
var rename = require('metalsmith-rename');
var Metalsmith = require('metalsmith');
var helpers = require('./../../../lib/helpers');
require('shelljs/global');

module.exports = {
  load: function () {
    var self = this;

    program
      .command('make:component [name]')
      .description('scaffold a new component')
      .action(function (name) {
        self.validate(name);

        if (!self.isValid) {
          process.exit(1);
        }

        self.execute(name);
      })
      .on('--help', function () {
        console.log('  Examples:');
        console.log();
        console.log(chalk.gray('    # will scaffold a component'));
        console.log('    $ lucevi make:component panel');
        console.log();
      });
  },

  validate: function (name) {
    var isValid = true;

    if (!name) {
      console.log(chalk.red('No name specified!'));
      isValid = false;
    }

    this.isValid = isValid;
  },

  execute: function (name) {
    console.log(chalk.green('Creating component "' + name + '"...'));

    this.path = 'src/app/components/' + name;
    this.filename = name;
    this.name = helpers.capitalizeFirstLetter(name);

    // Creating the directories
    mkdir('-p', this.path);
    this.createFiles();

    console.log(chalk.green('Component has been created!'));
  },

  createFiles: function () {
    var self = this;
    var metalsmith = Metalsmith(__dirname + '/../../templates/component');

    Handlebars.registerHelper('name', function () {
      return self.name;
    });
    Handlebars.registerHelper('filename', function () {
      return self.filename;
    });

    metalsmith
      .use(helpers.renderTemplateFiles)
      .use(
        rename([
          [/template/, this.filename]
        ])
      )
      .clean(false)
      .source('.')
      .destination(path.resolve(this.path))
      .build(function (err) {
        if (err) {
          console.log(chalk.red(err));
        }
      });
  },
};
