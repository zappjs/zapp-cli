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
    const project = require(`${process.cwd()}/.zapp/zapp`).default;

    console.log('Generated Files:');

    Object.keys(project).forEach((fileName) => {
      const fileContents = project[fileName];
      const filePath = path.normalize(fileName);
      const dirName = path.dirname(filePath);
      if (!fs.existsSync(dirName)) {
        fs.mkdirSync(dirName, { recursive: true });
      }
      fs.writeFileSync(filePath, fileContents);

      console.log(`- ${filePath}`);
    });
  });

program.parse(process.argv);