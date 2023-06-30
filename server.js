const cluster = require('cluster')
const os = require('os')
const numCPUs = os.cpus().length

const config = require("./config/app.config.js");
const app = require("./app");
// const db = require("./config/db.config");



if (cluster.isMaster) {
  // Master:
  // Let's fork as many workers as you have CPU cores
  console.log(`Primary ${process.pid} is running`);
  for (let i = 0; i < numCPUs; ++i) {
    cluster.fork()
  }
  cluster.on('exit', function (worker) {
    console.log('Worker ' + worker.id + ' died..');
    cluster.fork();
  });
} else {
  // Worker:
  // Let's spawn a HTTP server
  // (Workers can share any TCP connection.
  //  In this case its a HTTP server)

  // http.createServer((req, res) => {
  //   res.writeHead(200)
  //   res.end('hello world')
  // }).listen(8080)

  app.listen(config.PORT, () => {
    console.log(`Server is on port http://localhost:${config.PORT}`);
    // console.log("Current directory:", process.cwd());
  })
}

