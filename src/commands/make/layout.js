var commander = require('commander');
var log = require('./../../../lib/logging');
var generator = require('./../../../lib/generator');
var _ = require('lodash');

commander
  .command('make:layout [name]')
  .description('scaffold a new layout')
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

    _.mergeWith(generator.config, {
      type: 'layout',
      templateDirectory: 'layout',
      output: {
        directory: 'src/app/layouts/',
      },
      name: name,
      isSplit: options ? options.split : false,
    }, function (objValue, srcValue) {
      if (_.isArray(objValue)) {
        return objValue.concat(srcValue);
      }
    });

    generator.run();
  },
  help: function () {
    log('  Examples:');
    log();
    log('    # will scaffold a new layout', 'muted');
    log('    $ blucify make:layout default');
    log('    # will scaffold a new layout in a custom directory', 'muted');
    log('    $ blucify make:layout default/main');
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
