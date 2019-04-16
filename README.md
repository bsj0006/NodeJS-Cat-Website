# NodeJS-Cat-Website
Two separate NodeJS servers designed for a Service-oriented architecture. One server handles html requests. 
The other is a database server returning image URLs.

This project depends on NODEJS. This can be downloaded at https://nodejs.org/en/download/.
This comes bundled with NPM and NodeJS.

Running NPM install from this directory installs any NodeJS dependencies the server has which are listed in package.json

After downloading dependencies, running 'node web_server/web_server.js' will start the web server.
You can also run 'node web_server/web_server.js <IP> <PORT> <IMAGE_SERVER_URI>' to get the servers to run distributed.

Run 'node image_server/image_server.js' to run the image server locally or
'node image_server/image_server.js <IP> <PORT>' to run the image server distributed.