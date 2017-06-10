/**
 * @author Sven Koelpin
 */

const dataBase = require('./db/DataBase');
const logger = require('./server/Logger');
const server = require('./server/Server');

const tweetsResource = require('./tweets/TweetsResource');

server.register(tweetsResource);

dataBase.init()
    .then(() => server.start())
    .catch(() => {
        logger.warn('DB not running. Using in memory data');
        server.start();
    });
