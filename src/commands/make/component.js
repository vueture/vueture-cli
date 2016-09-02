var commander = require('commander');
var log = require('./../../../lib/logging');
var helpers = require('./../../../lib/helpers');

commander
  .command('make:component [name]')
  .description('scaffold a new component')
  .option('-s, --split', 'split the .vue-file into separate files')
  .action(function (name, options) {
    program.action(name, options);
  })
  .on('--help', function () {
    program.help();
  });

var program = {
  action: function (name, options) {
    if (!this.isValid(name)) {
      process.exit(1);
    }
    log('Creating component "' + name + '"...', 'info');

    var split = options ? options.split : false;

    var templateDirectory = split ? 'split' : 'single';
    var input = __dirname + '/../../templates/component/' + templateDirectory;


    var output = 'src/app/components/';
    var componentPath = name.split('/');
    if (componentPath.length > 1) {
      for (var i = 0; i < componentPath.length - 1; i++) {
        output += componentPath[i] + '/';
      }
    }
    this.filename = componentPath.length > 1 ? componentPath[componentPath.length - 1] : name;
    output = split ? output + this.filename : output;

    this.name = helpers.capitalizeFirstLetter(this.filename);


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
    helpers.generate(input, output, this.filename);

    log('Component has been created!', 'success');
  },
  help: function () {
    log('  Examples:');
    log();
    log('    # will scaffold a new component', 'muted');
    log('    $ blucify make:component panel');
    log('    # will scaffold a new component in a custom directory', 'muted');
    log('    $ blucify make:component button/link');
    log();
  },
  isValid: function (name) {
    var isValid = true;

    if (!name) {
      log('No name specified!', 'error');
      isValid = false;
    }

    return isValid;
  }
};
