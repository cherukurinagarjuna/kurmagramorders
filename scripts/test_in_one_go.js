const { fork } = require('child_process');
const path = require('path');

const srv = fork(path.join(__dirname, 'serve-root.js'), { stdio: 'inherit' });

setTimeout(() => {
  const test = fork(path.join(__dirname, 'verify_order_tracking_and_admin.js'), { stdio: 'inherit' });
  test.on('exit', (code) => {
    srv.kill();
    process.exit(code);
  });
}, 1500);
