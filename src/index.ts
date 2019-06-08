require('ts-node/register');

import * as fs from 'fs';
import * as path from 'path';
import * as program from 'commander';

program
  .version('0.1.0');

program
  .command('generate')
  .action(async () => {
    // load zapp project
    const project = require(`${process.cwd()}/.zapp/config`).default;

    console.log('Generated Files:');

    Object.keys(project.generates).forEach((fileName) => {
      const fileContents = project.generates[fileName];
      const dirName = path.dirname(fileName);
      if (!fs.existsSync(dirName)) {
        fs.mkdirSync(dirName, { recursive: true });
      }
      fs.writeFileSync(`${dirName}/${fileName}`, fileContents);

      console.log(`- ${dirName}/${fileName}`);
    });
  });

program.parse(process.argv);