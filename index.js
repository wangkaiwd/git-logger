const { exec } = require('child_process');

exec('cat package.json', (err, stdout, stderr) => {
  console.log('err', err);
  console.log('stdout', stdout);
  console.log('stderr', stderr);
});
