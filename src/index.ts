import { spawnSync } from 'child_process';
import * as program from 'commander';
import { writeFileSync } from 'fs';
import { homedir } from 'os';
import zapp from '@zappjs/core';
import { load } from '@zappjs/project';

program
  .version('0.1.0');

program
  .command('install')
  .action(async () => {
    // load zapp project
    const project = await load({ dir: '.' });

    Object.keys(project.imports).forEach((domain) => {
      const users = project.imports[domain];
      Object.keys(users).forEach((username) => {
        const repos = users[username];
        Object.keys(repos).forEach((repoName) => {
          const repo = repos[repoName];

          if (repo.path) {
            return;
          }

          const version = repo.version || 'master';

          const cmd = `git clone https://${domain}/${username}/${repoName}.git ${homedir()}/.zapp/generators/${domain}/${username}/${repoName}/${version}`;

          spawnSync(cmd.split(' ')[0], cmd.split(' ').slice(1));
        });
      });
    });
  });

program
  .command('generate')
  .action(async () => {
    // load zapp project
    const project = await load({ dir: '.' });

    console.log('Loaded Project:');
    console.log(project);

    // generate items
    const items = zapp(project);

    // write generated files to disk
    items.forEach((item) => {
      if (item.type === 'file') {
        writeFileSync(item.path, item.content);
      }
    });

    // display generated items
    console.log('Generated items:');
    items.forEach((item) => {
      console.log(`- ${item.path}`);
    });
  });

program.parse(process.argv);
