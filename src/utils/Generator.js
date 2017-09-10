import 'shelljs/global';
import async from 'async';
import path from 'path';
import consolidate from 'consolidate';
import Handlebars from 'handlebars';
import Metalsmith from 'metalsmith';
import MetalsmithRenamer from 'metalsmith-renamer';
import helpers from './../../lib/helpers';

export default class Generator {
  /**
   * The constructor of the generator.
   *
   * @param {Object} config The configuration of the generator.
   */
  constructor(config) {
    const {
      type,
      isSplittable,
      outputDirectory,
      handlebars,
    } = config;

    this.type = type;
    this.isSplittable = isSplittable;
    this.outputDirectory = outputDirectory;
    this.inputDirectory = path.join(__dirname, '..', `src/stubs/${type}`);
    this.handlebars = handlebars;
  }

  /**
   * Used to generate the files.
   *
   * @param {String}  name    The name of the file(s).
   * @param {Boolean} isSplit If the files are split.
   */
  generate(name, isSplit = false) {
    this.name = name;

    this.input = {
      directory: this.getInputDirectory(isSplit),
      fileName: this.type,
    };

    this.output = {
      directory: this.getOutputDirectory(isSplit),
      fileName: this.getOutputFilename(),
    };

    this.registerHandlebars();

    // eslint-disable-next-line no-undef
    mkdir('-p', this.output.directory);

    this.generateFiles();
  }

  /**
   * Getter for the input directory.
   *
   * @param {Boolean} isSplit If the files are split.
   *
   * @returns {String} The input directory.
   */
  getInputDirectory(isSplit) {
    if (!this.isSplittable) {
      return this.inputDirectory;
    }

    return isSplit
      ? `${this.inputDirectory}/split`
      : `${this.inputDirectory}/single`;
  }

  /**
   * Getter for the output directory.
   *
   * @param {Boolean} isSplit If the files are split.
   *
   * @returns {String} The output directory.
   */
  getOutputDirectory(isSplit) {
    if (isSplit) {
      return `${this.outputDirectory}/${this.name}`;
    }

    const pathSegments = this.name.split('/');
    pathSegments.pop();

    return `${this.outputDirectory}/${pathSegments.join('/')}`;
  }

  /**
   * Getter for the output filename.
   *
   * @returns {String} The output filename.
   */
  getOutputFilename() {
    const pathSegments = this.name.split('/');

    return pathSegments.length === 1
      ? this.name
      : pathSegments.pop();
  }

  /**
   * Will register the handlebars.
   */
  registerHandlebars() {
    this.handlebars.push({
      keyword: 'filename',
      replacement: this.output.fileName,
    });

    this.handlebars.push({
      keyword: 'name',
      replacement: helpers.ucfirst(this.output.fileName),
    });

    this.handlebars.forEach((handlebar) => {
      Handlebars.registerHelper(handlebar.keyword, () => handlebar.replacement);
    });
  }

  /**
   * Will generate the files using Metalsmith.
   */
  generateFiles() {
    Metalsmith(this.input.directory)
      .use(Generator.renderTemplateFiles)
      .use(MetalsmithRenamer({
        filesToRename: {
          pattern: '*.stub',
          rename: (name) => {
            const extension = name.split('.')[1];

            return `${this.output.fileName}.${extension}`;
          },
        },
      }))
      .clean(false)
      .source('.')
      .destination(path.resolve(this.output.directory))
      .build((err) => {
        if (err) {
          console.log(err);
        }
      });
  }

  /**
   * Will render the template files.
   *
   * @param files
   * @param metalsmith
   * @param done
   */
  static renderTemplateFiles(files, metalsmith, done) {
    const filesCopy = files;
    const keys = Object.keys(files);
    const metalsmithMetadata = metalsmith.metadata();

    async.each(keys, (file, next) => {
      const str = files[file].contents.toString();
      // do not attempt to render files that do not have mustaches
      if (!/{{([^{}]+)}}/g.test(str)) {
        return next();
      }

      consolidate.handlebars.render(str, metalsmithMetadata, (err, res) => {
        if (err) {
          return next(err);
        }

        filesCopy[file].contents = Buffer.from(res);

        return next();
      });

      return null;
    }, done);
  }
}
