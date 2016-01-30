'use strict';

const request = require('request-prom');

const url = 'https://bookstore-41.myshopify.com/admin/smart_collections.json';
let collections = require('./collections.json');

collections.forEach((collection) => {
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

    request(opts)
        .then((response) => {
            console.log('Sent', collection.smart_collection.title);
            console.log('Response', response.body);
        })
        .catch((error) => {
            console.error('Failure', error.response.body);
        });

});
