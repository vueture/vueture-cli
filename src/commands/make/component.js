var program = require('commander');
var chalk = require('chalk');
var helpers = require('./../../../lib/helpers');

module.exports = {
  load: function () {
    program
      .command('make:component [name]')
      .description('scaffold a new component')
      .option('-s, --split', 'split the Vue file into separate files')
      .action(function (name, options) {
        this.action(name, options);
      }.bind(this))
      .on('--help', function () {
        this.help();
      }.bind(this));
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

    var componentPath = name.split('/');
    if (componentPath.length > 1) {
      for (var i = 0; i < componentPath.length - 1; i++) {
        path += componentPath[i] + '/';
      }
    }

    this.filename = componentPath.length > 1 ? componentPath[componentPath.length - 1] : name;
    this.name = helpers.capitalizeFirstLetter(this.filename);
    path = this.split ? path + this.filename : path;

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


    helpers.registerHandlebars(handlebars);
    helpers.generateDirectories(path);
    helpers.generateFiles(__dirname + '/../../templates/component/' + templateDirectory, path, this.filename);

    console.log(chalk.green('Component has been created!'));
  },
};
