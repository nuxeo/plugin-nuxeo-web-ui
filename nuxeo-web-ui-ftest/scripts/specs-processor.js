const Finder = require('fs-finder');
const fs = require('fs');

module.exports = (argv) => {
  const args = require('minimist')(argv.slice(2));

  const separator = args.specs.lastIndexOf('/');
  const files = Finder.from(args.specs.substring(0, separator)).findFiles(args.specs.substring(separator + 1));
  /*
   * XXX
   * tagExpression is being used only for syntax purposes, since we are not evaluating expressions.
   * It would only be full featured after this NXP-26660 being addressed.
   */
  if (args.cucumberOpts && args.cucumberOpts.tagExpression) {
    return files.filter(file => fs.readFileSync(file, 'utf8').includes(args.cucumberOpts.tagExpression));
  }
  return files;
};
