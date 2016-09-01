var async = require('async');
var path = require('path');
var render = require('consolidate').handlebars.render;
var Metalsmith = require('metalsmith');
var rename = require('metalsmith-rename');
var Handlebars = require('handlebars');
require('shelljs/global');

module.exports = {
  /**
   * Method used to capitalize the first letter
   *
   * @param {string} string The string
   * @returns {string} The output string
   */
  capitalizeFirstLetter: function (string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
  },

  /**
   * Method used to render the template files
   *
   * @param files
   * @param metalsmith
   * @param done
   */
  renderTemplateFiles: function (files, metalsmith, done) {
    var keys = Object.keys(files);
    var metalsmithMetadata = metalsmith.metadata();
    async.each(keys, function (file, next) {
      var str = files[file].contents.toString();
      // do not attempt to render files that do not have mustaches
      if (!/{{([^{}]+)}}/g.test(str)) {
        return next()
      }
      render(str, metalsmithMetadata, function (err, res) {
        if (err) return next(err);
        files[file].contents = new Buffer(res);
        next()
      })
    }, done)
  },

  generateDirectories: function (path) {
    mkdir('-p', path);
  },

  generateFiles: function (inputDirectory, outputDirectory, outputFilename) {
    Metalsmith(inputDirectory)
      .use(this.renderTemplateFiles)
      .use(
        rename([
          [/template/, outputFilename]
        ])
      )
      .clean(false)
      .source('.')
      .destination(path.resolve(outputDirectory))
      .build(function (err) {
        if (err) {
          console.log(chalk.red(err));
        }
      });
  },

  registerHandlebars: function (handlebars) {
    handlebars.forEach(function (handlebar) {
      Handlebars.registerHelper(handlebar.keyword, function () {
        return handlebar.replacement;
      });
    });
  },
};
