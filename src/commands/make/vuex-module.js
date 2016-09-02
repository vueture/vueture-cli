var commander = require('commander');
var log = require('./../../../lib/logging');
var generator = require('./../../../lib/generator');
var _ = require('lodash');

commander
  .command('make:vuex-module [name]')
  .description('scaffold a new Vuex module')
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
      type: 'vuex module',
      templateDirectory: 'vuex-module',
      output: {
        directory: 'src/app/store/modules/',
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
    log('    # will scaffold a new vuex module', 'muted');
    log('    $ blucify make:vuex-module user');
    log('    # will scaffold a new vuex-module in a custom directory', 'muted');
    log('    $ blucify make:vuex-module user/admin');
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
