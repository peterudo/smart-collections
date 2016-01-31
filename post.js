'use strict';

const request = require('request-prom');
const program = require('commander');
const pack = require('./package.json');

program
  .version(pack.version)
  .option('-w, --wait-time <n>', 'Seconds to wait between requests', 5)
  .option('-i, --index [index]', 'Index to start at', 0)
  .parse(process.argv);

const url = 'https://bookstore-41.myshopify.com/admin/smart_collections.json';

let collections = require('./collections.json');
const totalCollections = collections.length;

program.index = parseInt(program.index, 10);
if (program.index > 0) {
    collections = collections.slice(program.index);
}

console.log(`${collections.length} to send. Sending 1 request per ${program.waitTime} seconds`);

let currentIndex = program.index;
function post() {
    const collection = collections.shift();

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

    return request(opts);
}

function doPost() {
    post()
        .then(() => {
            console.log(`${currentIndex}/${totalCollections}`);
            currentIndex += 1;
            setTimeout(doPost, program.waitTime * 1000);
        })
        .catch((error) => {
            console.log(`Request failed at ${currentIndex}`);
            console.log(`Run node post.js -i ${currentIndex} to continue/try again`);
        });
}

doPost();
