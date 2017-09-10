import chalk from 'chalk';

export const log = (message = '', color) => {
  console.log(color(message));
};

export const success = (message) => {
  log(message, chalk.green);
};

export const error = (message) => {
  log(message, chalk.red);
};

export const info = (message) => {
  log(message, chalk.blue);
};

export const normal = (message) => {
  log(message, chalk.white);
};

export const muted = (message) => {
  log(message, chalk.gray);
};

export default {
  success,
  error,
  info,
  normal,
  muted,
  log,
};
