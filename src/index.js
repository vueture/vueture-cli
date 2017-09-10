import program from 'commander';
import MakeComponentCommand from './../src/commands/MakeComponent';
import MakeLayoutCommand from './../src/commands/MakeLayout';
import MakeMixinCommand from './../src/commands/MakeMixin';
import MakePageCommand from './../src/commands/MakePage';
import MakeVuexModuleCommand from './../src/commands/MakeVuexModule';
import NewCommand from './../src/commands/New';

program
  .version(require('./../package.json').version);

new NewCommand().run();
new MakeComponentCommand().run();
new MakeLayoutCommand().run();
new MakeMixinCommand().run();
new MakePageCommand().run();
new MakeVuexModuleCommand().run();

program.parse(process.argv);
