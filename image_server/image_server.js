/*
* This runs the image database service
*
* This server receives http requests for a certain number of images and returns URLs for images using
* an advanced selection algorithm.
*/

//Port for image server
let PORT = 3000;
//ip for image server
let HOSTNAME = '127.0.0.1';

//Create dependencies
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const server = require('../common/server');
const Database = require('./db/database').Database;
const db = new Database();

const app = express();

//Setup the express middleware
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({extended: false}));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

//Parse program arguments of the form [IP [PORT]]
let args = process.argv.slice(2);
if (args.length >= 1) {
    HOSTNAME = args[0];
    if (args.length === 2) {
        PORT = args[1];
    }
}

//Accepts requests for images and returns a json object with images or an error
//Image count should be from 1 to 50
app.get('/images', function (req, res) {
    if (req.query.count) {
        console.log(req.query.count + " images requested.");
        //res.json(["https://www.warrenphotographic.co.uk/photography/bigs/23081-Maine-Coon-kittens-8-weeks-old-white-background.jpg"]);
        db.get_random_images(req.query.count, function (err, result) {
            if (err) {
                //Database encountered a problem. Sending error.
                res.status(400);
                res.send(err);
            } else {
                console.log("returning " + result);

                //This takes the query result and returns it as json
                res.json(result);
            }
        });
    } else {
        //Count not specified. Sending error.
        res.status(400);
        res.send("Bad query");
    }
});

//Create and start the server
const httpOptions = {host: HOSTNAME, port: PORT};
server.createHttpServer(httpOptions, app);

