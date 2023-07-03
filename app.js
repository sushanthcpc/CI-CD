const express = require('express');
const app = express();
const BodyParser = require('body-parser');
const pgCon = require('./utils/db.util')
const runKafka = require('./controllers/kafka.consumer')

// const mongoose = require('mongoose');
// const session = require('express-session');
// const { createProxyMiddleware } = require('http-proxy-middleware');

// const cors = require('cors');
// var morgan = require('morgan');
// const helmet = require('helmet');
// const formidable = require('formidable');
const router = express.Router();
const path = require('path');
const rfs = require('rotating-file-stream')
const fs = require('fs');
global.__basedir = __dirname + "/..";
console.log(global.__basedir);
const indexRouter = require('./routes/index.route');
const { cronJob } = require('./utils/message.util');


/**File Rotate */
const d = new Date();
let text = d.toString();
let part = text.slice(4, 15).replaceAll('','-');
let fileRotateName = `server${part}.log`;

 const accessLogStream = fs.createWriteStream(path.join(__dirname, 'logs/access.log'), { flags: 'a' })
/**Stream Logs */
const serverLogStream = rfs.createStream(fileRotateName, {
    interval: '1d', // rotate daily
    path: path.join(__dirname, 'logs')
});

/**Middleware */
// app.use(morgan('common', { stream: serverLogStream }));
// app.use(cors());
// app.use(helmet());
app.use(BodyParser.json())
app.use(BodyParser.urlencoded({ extended: true }));
// app.use(session({
//     secret: 'IAMKARBAN14545',
//     cookie: { maxAge: 60000, sameSite: 'strict' },
//     saveUninitialized: true,
//     resave: true,
// }));


/**DB Connection */
//pgCon()
//runKafka()

// cronJob()
// dbCon()
// mongoose
//   .connect(
//     'mongodb://172.20.115.134:27017/OTP_DB',
//     { useNewUrlParser: true },{ useUnifiedTopology: true }
//   )
//   .then(() => console.log('MongoDB Connected'))
//   .catch(err => console.log(err));

// const { Client } = require("pg")

// const connectDb = async () => {
//     try {
//         const client = new Client({
//             user: 'postgres',
//             host: '172.20.123.29',
//             database: 'postgres',
//             password: 'postgres',
//             port: 5435
//         })

//         await client.connect()
//         const res = await client.query('SELECT table_schema,table_name FROM information_schema.tables ORDER BY table_schema,table_name;')
//         console.log(res)
//         await client.end()
//     } catch (error) {
//         console.log(error)
//     }
// }

// connectDb()


// var pg = require('pg');
// var conString = "postgres://postgres:postgres@172.20.123.29:5435/postgres";

// var client = new pg.Client(conString);
// client.connect();

// var tunnelingAgent = tunnel.httpsOverHttp({
//     proxy: {
//         host: '172.20.102.123',
//         port: 8080
//     },
//     rejectUnauthorized: false
// });


// const { Pool } = require('pg');
// var config = {
//     user: 'postgres',
//     database: 'postgres',
//     password: 'postgres',
//     host: '172.20.123.29',
//     port: 5435,
//     max: 500, // max number of clients in the pool
//     statement_timeout: 864000000,
//     idleTimeoutMillis: 864000000,
//     // httpsAgent: tunnelingAgent
    
// };
// const pool = new Pool(config);
// pool.on('error', function (err, client) {
//     console.error('idle client error', err.message, err.stack);
// });
// pool.query('SELECT table_schema,table_name FROM information_schema.tables ORDER BY table_schema,table_name;', ['2'], function (err, res) {
//     if (err) {
//         return console.error('error running query', err);
//     }
//     console.log('number:', res.rows[0].number);
// });

/**Capture Error */
app.use((err, req, res, next) => {
    res.status(400).send(err.message)
})

/**Route */
app.use('/api', indexRouter);


/**Export App */
module.exports = app;
