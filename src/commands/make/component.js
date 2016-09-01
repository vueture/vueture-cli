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
      .option('-s, --split', 'split the Vue file into separate files')
      .action(function (name, options) {
        self.action(name, options);
      })
      .on('--help', function () {
        self.help();
      });
  },

  action: function (name, options) {
    this.split = options ? options.split : false;
    this.validate(name);

    if (!this.isValid) {
      process.exit(1);
    }

    this.execute(name);
  },

  help: function () {
    console.log('  Examples:');
    console.log();
    console.log(chalk.gray('    # will scaffold a component'));
    console.log('    $ blucify make:component panel');
    console.log();
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

    var path = 'src/app/components/';
    var templateDirectory = this.split ? 'split' : 'single';

    path = this.split ? path + name : path;
    this.filename = name;
    this.name = helpers.capitalizeFirstLetter(name);

    var handlebars = [
      {
        keyword: 'name',
        replacement: this.name
      },
      {
        keyword: 'filename',
        replacement: this.filename
      }
    ];

    console.log('Registering Handlebars...');
    this.registerHandlebars(handlebars);
    console.log('Generating directories...');
    this.generateDirectories(path);
    console.log('Generating files...');
    this.generateFiles(__dirname + '/../../templates/component/' + templateDirectory, path, this.filename);

    console.log(chalk.green('Component has been created!'));
  },

  generateDirectories: function (path) {
    mkdir('-p', path);
  },

  registerHandlebars: function (handlebars) {
    handlebars.forEach(function (handlebar) {
      Handlebars.registerHelper(handlebar.keyword, function () {
        return handlebar.replacement;
      });
    });
  },

  generateFiles: function (inputDirectory, outputDirectory, outputFilename) {
    Metalsmith(inputDirectory)
      .use(helpers.renderTemplateFiles)
      .use(
        rename([
          [/template/, outputFilename]
        ])
      )
      .clean(false)
      .source('.')
      .destination(path.resolve(outputDirectory))
      .build(function (err) {
        if (err) {
          console.log(chalk.red(err));
        }
      });
  }
};
