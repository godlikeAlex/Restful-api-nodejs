/*
 * Server 
 *
 */

// Dependencies
const http = require('http');
const path = require('path');
const StringDecoder = require('string_decoder').StringDecoder;
const url = require('url');
const handlers = require('./lib/handlers');
const helpers = require('./lib/helpers');
const config = require('./lib/config');

let server = {};

server.httpServer = http.createServer(function(req,res){
    // Parsing URL
    let parseUrl = url.parse(req.url,true);

    // Get the path url
    let path = parseUrl.pathname;
    let trimmedPath = path.replace(/^\/+|\/+$/g, '');


    // Get the METHOD
    let method = req.method.toLowerCase();

    // Get the queryString object
    let queryStringObject = parseUrl.query;

    // Get the headers 
    let headers = req.headers;

    // Get the payload,if any
    let decoder = new StringDecoder('utf-8');
    let buffer = '';
    req.on('data', (data) => {
        buffer += decoder.write(data);
    });

    req.on('end', () => {
        buffer += decoder.end();

        let chosenHandler = typeof(router[trimmedPath]) !== 'undefined' ? router[trimmedPath] : router.notFound;
       
        let data = {
            'trimmedPath': trimmedPath,
            'queryStringObject': queryStringObject,
            'method': method,
            'headers': headers,
            'payload':helpers.parseJsonToObject(buffer)
        };
        
        chosenHandler(data,(statusCode,payload,contentType)=>{

            // Set default contentType json
            contentType = typeof (contentType) === 'string' ? contentType : 'json';

            // Use the status code calde back by the handler? or default to 200
            statusCode = typeof(statusCode) === 'number' ? statusCode : 200;

            // Return the response parts are content specific
            let payloadString = '';
            if(contentType === 'json'){
                res.setHeader('Content-Type', 'application/json');
                payload = typeof (payload) === 'object' ? payload : {};

                payloadString = JSON.stringify(payload);
            }

            if(contentType === 'html'){
                res.setHeader('Content-Type', 'text/html');
                payloadString = typeof (payload) === 'string' ? payload : '';
            }

            if(contentType === 'css'){
                res.setHeader('Content-Type', 'text/css');
                payloadString = typeof (payload) !== 'undefined' ? payload : '';
            }

            if (contentType === 'png') {
                res.setHeader('Content-Type', 'image/png');
                payloadString = typeof (payload) !== 'undefined' ? payload : '';
            }

            if (contentType === 'jpg') {
                res.setHeader('Content-Type', 'image/jpeg');
                payloadString = typeof (payload) !== 'undefined' ? payload : '';
            }

            if (contentType === 'plain') {
                res.setHeader('Content-Type', 'text/plain');
                payloadString = typeof (payload) !== 'undefined' ? payload : '';
            }


            // Return the response parts that are common to all content types
            res.writeHead(statusCode);
            res.end(payloadString);
        });

    })
});

server.httpServer.listen(3000,()=>{
    console.log('\'\x1b[36m%s\x1b[0m\'',`server start on localhost:${config.httpPort}`);
});

let router = {
    '' : handlers.index,
    'account' : handlers.accountView,
    'posts/create' : handlers.postsCreate,
    'api/ping' : handlers.ping,
    'api/posts' : handlers.posts,
    'api/users':handlers.users,
    'api/tokens' : handlers.tokens,
    'api/users/action':handlers.usersAction,
    'notFound' : handlers.notFound
};




