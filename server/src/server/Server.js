/**
 * @author Sven Koelpin
 */
const restify = require('restify');
const webSocket = require('ws');
const corsMiddleware = require('restify-cors-middleware');

const eventEmitter = require('../server/Events');
const logger = require('./Logger');
const security = require('../security/Security');

const {
    ALLOWED_ORIGINS,
    API_VERSION,
    API_PORT
} = process.env;


const cors = corsMiddleware({
    origins: ALLOWED_ORIGINS ? [ALLOWED_ORIGINS] : ['*'],
    allowHeaders: ['authorization']
});


const PORT = API_PORT;

const server = restify.createServer({
    name: 'Twttr',
    log: logger,
    version: API_VERSION
});

server.on('uncaughtException', (req, res, route, err) => {
    logger.error(err);
    res.send(500);
});

//middlewares pre
server.pre(restify.plugins.throttle({burst: 10, rate: 10, ip: true}));
server.pre(restify.pre.sanitizePath());
server.pre(cors.preflight);

//middlewares use plugins
server.use(cors.actual);
server.use(restify.plugins.requestLogger());
server.use(restify.plugins.gzipResponse());
server.use(restify.plugins.queryParser());
server.use(restify.plugins.bodyParser());

//middlewares use custom
server.use(security);


//socket
const wss = new webSocket.Server({server});
wss.on('connection', ws => {
    const onEventListener = newData => ws.send(JSON.stringify(newData));
    eventEmitter.addListener('newData', onEventListener);
    ws.on('close', () => eventEmitter.removeListener('newData', onEventListener));
});

module.exports = {
    register(resource) {
        resource(server);
    },
    getServer() {
        return server;
    },
    start() {
        server.listen(PORT, () => {
            logger.info(`Server started: http://localhost:${PORT}`);
        });
    }
};
