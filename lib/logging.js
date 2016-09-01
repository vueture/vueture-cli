var chalk = require('chalk');

module.exports = {

  success: function (message) {
    console.log(chalk.green(message));
  },
  info: function (message) {
    console.log(chalk.blue(message));
  },
  error: function (message) {
    console.log(chalk.red(message));
  },
  normal: function (message) {
    console.log(chalk.white(message));
  },
  muted: function (message) {
    console.log(chalk.gray(message));
  }
};
