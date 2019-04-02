const http = require('http');

/**
 * Create a NodeJS http server
 *
 * @param options Server options
 * @param express Express object
 *
 * @returns {Server}
 */
module.exports.createHttpServer = function (options, express) {
    let httpServer = http.createServer(express);
    httpServer.listen(options);
    httpServer.on('error', (e) => {
        switch (e.code) {
            case 'EADDRINUSE':
                console.error('Address is already in use. Retrying in ten seconds...');
                setTimeout(function () {
                    console.log('Reattempting connection...');
                    httpServer.close();
                    httpServer.listen(options);
                }, 10000);
                break;
            default:
                console.error('Unsupported error: ' + e.code);
                throw error;

        }
    });
    httpServer.on("listening", () => {
        //Log where the server is running
        console.log('Running http web server at http://' + options.host + ':' + options.port + '/');
    });
    return httpServer;
};
