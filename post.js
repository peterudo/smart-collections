'use strict';

const request = require('request-prom');

const url = 'https://bookstore-41.myshopify.com/admin/smart_collections.json';
const waitTimeSeconds = 5;

let collections = require('./collections.json');

console.log(`${collections.length} to send. Sending 1 request per ${waitTimeSeconds} seconds`);

function post() {
    const collection = collections.pop();

    const opts = {
        url: url,
        json: true,
        method: 'POST',
        body: collection,
        auth: {
            user: 'd4d837c815dceada45daf3f77da95639',
            pass: 'e241e32c4dd7dc6280f65af4de88faf7'
        }
    };

    console.log('Sending collection...');

    return request(opts);
}

function doPost() {
    post()
        .then(() => {
            console.log('Sent!', collections.length, 'left.');
            setTimeout(doPost, waitTimeSeconds * 1000);
        })
        .catch((error) => {
            console.log('Request failed', error.response);
        })
}

doPost();
