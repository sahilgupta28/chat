require('rootpath')();
const express = require('express');
const app = express();
const cors = require('cors');
const bodyParser = require('body-parser');
const jwt = require('_helpers/jwt');
const errorHandler = require('_helpers/error-handler');
const io = require('socket.io');
const config = require('config.json');
const nodemailer = require('nodemailer');
const bodyParser1 = require('body-parser');
app.use(bodyParser1.json({limit: '50mb'}));
app.use(bodyParser1.urlencoded({limit: '50mb', extended: true}));


var transporter = nodemailer.createTransport(config.mailer);


users = [];
users_connection = [];

app.use(bodyParser.urlencoded({ extended: true }));



app.use(bodyParser.json());
app.use(cors());
// use JWT auth to secure the api
app.use(jwt());
// api routes
app.use('/users', require('./users/users.controller'));
app.use('/wallets', require('./wallets/wallet.controller'));


// global error handler
app.use(errorHandler);

app.get('/', function (req, res) {
    res.sendfile('index.html');
});


// start server
const port = process.env.NODE_ENV === 'production' ? 80 : 4003;
const server = app.listen(port, function () {
    console.log('Server listening on port ' + port);
});

const sio= io.listen(server);

module.exports.io = sio;
module.exports.transporter = transporter;





