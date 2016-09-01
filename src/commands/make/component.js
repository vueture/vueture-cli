var commander = require('commander');
var logging = require('./../../../lib/logging');
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
    logging.info('Creating component "' + name + '"...');

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
    output = split ? output + this.filename : output;

    this.filename = componentPath.length > 1 ? componentPath[componentPath.length - 1] : name;
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

    logging.success('Component has been created!');
  },
  help: function () {
    logging.normal('  Examples:');
    logging.normal('');
    logging.muted('    # will scaffold a new component');
    logging.normal('    $ blucify make:component panel');
    logging.muted('    # will scaffold a new component in a custom directory');
    logging.normal('    $ blucify make:component button/link');
    logging.normal('');
  },
  isValid: function (name) {
    var isValid = true;

    if (!name) {
      logging.error('No name specified!');
      isValid = false;
    }

    return isValid;
  }
};
