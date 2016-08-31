var async = require('async');
var render = require('consolidate').handlebars.render;

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
};
