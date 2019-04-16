/*
* This file runs the service that handles requests from a browser
*
* This returns the main html page as well as communicates with the image server to get image urls
*/

//Port the webserver runs on
let PORT = 80;
//ip address of the web server
let HOSTNAME = '127.0.0.1';
//URI of the image server
let IMAGE_URI = 'http://127.0.0.1:3000';

//Create the express middleware
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
//Create the client object to send and receive messages from the image server
const Client = require('node-rest-client').Client;
const client = new Client();

const server = require('../common/server');
const app = express();

//Setup the express middleware
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({extended: false}));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

//Parse out any program arguments in the form of [IP [PORT [IMAGE_SERVER_URI]]]
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

// GET home page. Any requests for / returns the index.html file
app.get('/', function (req, res) {
    res.sendFile(path.join(__dirname, 'html', 'index.html'));
});

// GET JSON object containing image uris. Request path should be formatted as /images?count=<num_of_images>
app.get('/images', function (req, res) {
    console.log(req.query.count);
    //Validate count exists
    if (req.query.count) {
        //Generate the URI for the request to the image server and send the GET message
        let uri = `${IMAGE_URI}/images?count=${req.query.count}`;
        client.get(uri, function (data, response) {
            console.log("Got response from image server");
            console.log(data);
            //Forward the data back to the web client
            res.json(data);
        });
    }
});

//Create and start the server object
const httpOptions = {host: HOSTNAME, port: PORT};
server.createHttpServer(httpOptions, app);

