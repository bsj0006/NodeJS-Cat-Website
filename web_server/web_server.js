/*
* This file runs the service that handles requests from a browser
*
* This returns the main html page as well as communicates with the image server to get image urls
*/


let PORT = 80;
let HOSTNAME = '127.0.0.1';
let IMAGE_URI = 'http://127.0.0.1:3000';

const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const Client = require('node-rest-client').Client;
const server = require('../common/server');
const client = new Client();
const app = express();

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({extended: false}));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

let args = process.argv.slice(2);
if (args.length >= 1) {
    HOSTNAME = args[0];
    if (args.length >= 2) {
        PORT = args[1];
        if (args.length === 3) {
            IMAGE_URI = args[2];
        }
    }
}

/* GET home page. */
app.get('/', function (req, res) {
    res.sendFile(path.join(__dirname, 'html', 'index.html'));
});

/* GET home page. */
app.get('/images', function (req, res) {
    console.log(req.query.count);
    // direct way
    if (req.query.count) {
        let uri = `${IMAGE_URI}/images?count=${req.query.count}`;
        client.get(uri, function (data, response) {
            console.log("Got response from image server");
            console.log(data);
            res.json(data);
        });
    }
});


const httpOptions = {host: HOSTNAME, port: PORT};
server.createHttpServer(httpOptions, app);

