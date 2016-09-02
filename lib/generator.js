var async = require('async');
var path = require('path');
var render = require('consolidate').handlebars.render;
var Metalsmith = require('metalsmith');
var rename = require('metalsmith-rename');
var Handlebars = require('handlebars');
var log = require('./logging');
var helpers = require('./helpers');
require('shelljs/global');

module.exports = {
  config: {
    type: 'component',
    templateDirectory: 'component',
    name: 'component',
    isSplittable: true,
    isSplit: false,
    newDir: false,
    output: {
      directory: 'src/app/components/',
    },
    handlebars: [],
  },

  run: function () {
    log('Creating ' + this.config.type + ' "' + this.config.name + '"...', 'info');

    // Setup input
    var inputDirectory = __dirname + '/../src/templates/' + this.config.templateDirectory;

    if (this.config.isSplittable) {
      inputDirectory += '/' + (this.config.isSplit ? 'split' : 'single');
    }

    this.input = {
      directory: inputDirectory,
      fileName: 'template',
    };

    // Setup output
    var pathSegments = this.config.name.split('/');
    var outputDirectory = this.config.output.directory;
    var outputFilename = '';

    if (pathSegments.length > 1) {
      if (this.config.isSplit || this.config.newDir) {
        outputDirectory += '/' + this.config.name;
      } else {
        pathSegments.forEach(function (segment, index) {
          if (index !== pathSegments.length - 1) {
            outputDirectory += '/' + segment;
          }
        });
      }

      this.name = pathSegments[pathSegments.length - 1];
      outputFilename = pathSegments[pathSegments.length - 1];
    } else {
      if (this.config.isSplit || this.config.newDir) {
        outputDirectory += '/' + this.config.name;
      }

      this.name = this.config.name;
      outputFilename = this.config.name;
    }

    this.output = {
      directory: outputDirectory,
      fileName: outputFilename,
    };


    this.registerHandlebars();
    this.generateDirectories();
    this.generateFiles();

    log(helpers.capitalizeFirstLetter(this.config.type) + ' has been created!', 'success');
  },
  registerHandlebars: function () {
    this.config.handlebars.push({
      keyword: 'filename',
      replacement: this.output.fileName,
    });

    this.config.handlebars.push({
      keyword: 'name',
      replacement: helpers.capitalizeFirstLetter(this.name),
    });

    this.config.handlebars.forEach(function (handlebar) {
      Handlebars.registerHelper(handlebar.keyword, function () {
        return handlebar.replacement;
      });
    });
  },

  generateDirectories: function () {
    mkdir('-p', this.output.directory);
  },

  generateFiles: function () {
    Metalsmith(this.input.directory)
      .use(this.renderTemplateFiles)
      .use(
        rename([
          [new RegExp(this.input.fileName), this.output.fileName]
        ])
      )
      .clean(false)
      .source('.')
      .destination(path.resolve(this.output.directory))
      .build(function (err) {
        if (err) {
          log(err, 'error');
        }
      });
  },

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
