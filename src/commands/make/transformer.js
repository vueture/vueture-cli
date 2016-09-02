var commander = require('commander');
var log = require('./../../../lib/logging');
var generator = require('./../../../lib/generator');
var _ = require('lodash');

commander
  .command('make:transformer [name]')
  .description('scaffold a new transformer')
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
      type: 'transformer',
      templateDirectory: 'transformer',
      output: {
        directory: 'src/app/transformers/',
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
    log('    $ vueture make:transformer user');
    log('    # will scaffold a new transformer in a custom directory', 'muted');
    log('    $ vueture make:transformer user/admin');
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
