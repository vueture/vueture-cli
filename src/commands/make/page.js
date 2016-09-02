var commander = require('commander');
var log = require('./../../../lib/logging');
var generator = require('./../../../lib/generator');
var _ = require('lodash');

commander
  .command('make:page [name]')
  .description('scaffold a new page')
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
      type: 'page',
      templateDirectory: 'page',
      output: {
        directory: 'src/app/pages/',
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
    log('    # will scaffold a new page', 'muted');
    log('    $ vueture make:page home');
    log('    # will scaffold a new component in a custom directory', 'muted');
    log('    $ vueture make:component home/index');
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
