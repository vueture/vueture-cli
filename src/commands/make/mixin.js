var commander = require('commander');
var log = require('./../../../lib/logging');
var generator = require('./../../../lib/generator');
var _ = require('lodash');

commander
  .command('make:mixin [name]')
  .description('scaffold a new mixin')
  .action(function (name, options) {
    program.action(name, options);
  })
  .on('--help', function () {
    program.help();
  });

var program = {
  action: function (name) {
    if (!this.isValid(name)) {
      process.exit(1);
    }

    _.mergeWith(generator.config, {
      type: 'mixin',
      templateDirectory: 'mixin',
      output: {
        directory: 'src/app/mixins/',
      },
      name: name,
      isSplittable: false,
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
    log('    # will scaffold a new mixin', 'muted');
    log('    $ vueture make:mixin slot');
    log('    # will scaffold a new mixin in a custom directory', 'muted');
    log('    $ vueture make:mixin slot/main');
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
