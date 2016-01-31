'use strict';

const request = require('request-prom');
const program = require('commander');
const pack = require('./package.json');
const fs = require('fs');

program
  .version(pack.version)
  .option('-w, --wait-time <n>', 'Miliseconds to wait between requests', 500)
  .option('-i, --index [index]', 'Index to start at', 0)
  .parse(process.argv);

const url = 'https://bookstore-41.myshopify.com/admin/smart_collections.json';

let collections = require('./collections.json');
const totalCollections = collections.length;
let failedCollections = [];

program.index = parseInt(program.index, 10);
program.waitTime = parseInt(program.waitTime, 10);

if (program.index > 0) {
    collections = collections.slice(program.index);
}

console.log(`${collections.length} to send.`);

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

    console.log('Posting...');

    return request(opts);
}

function doPost() {
    post()
        .then(() => {
            console.log(`${currentIndex}/${totalCollections}`);
            currentIndex += 1;

            if (currentIndex === totalCollections) {
                console.log('Complete!');
                return done();
            }

            console.log('Done, waiting for next...');

            setTimeout(doPost, program.waitTime);
        })
        .catch((error) => {
            console.log(`Request failed at ${currentIndex}`);
            console.log(`Run node post.js -i ${currentIndex} to continue/try again`);
            console.log('');
            console.log('Collection:')
            console.log(collections[currentIndex]);

            failedCollections.push(collections[currentIndex]);

            currentIndex += 1;
            doPost();
        });
}

function done() {
    if (failedCollections.length) {
        fs.writeFileSync('failed-collections.json', JSON.stringify(failedCollections, null, 4));
    }
}

process.on('SIGINT', function () {
    done();
    process.exit(1);
});

doPost();
