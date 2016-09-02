var chalk = require('chalk');

// log('Hello World!', 'error');

module.exports = function (message, level) {
  if (!message) {
    console.log();

    return;
  }

  switch (level) {
    case 'success':
      console.log(chalk.green(message));
      break;
    case 'error':
      console.log(chalk.red(message));
      break;
    case 'info':
      console.log(chalk.blue(message));
      break;
    case 'normal':
      console.log(chalk.white(message));
      break;
    case 'muted':
      console.log(chalk.gray(message));
      break;
    default:
      console.log(message);
      break;
  }
};
