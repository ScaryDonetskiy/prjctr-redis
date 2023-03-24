const http = require('http');
const Router = require('router');
const finalhandler = require('finalhandler');
const { Client } = require('pg');
const { createClient } = require('redis');

const router = Router();

const pgClient = new Client({
    host: 'pgbouncer',
    port: 6432,
    user: 'postgres',
    password: 'default'
});
let pgClientConnectPromise = pgClient.connect();

const redisClient = createClient({
    url: 'redis://@redis-master'
});
let redisClientConnectPromise = redisClient.connect();

async function getWrap(code) {
    let ttl = await redisClient.ttl(code);
    if (ttl > 0 && ttl < 90 && Math.random() < 0.3) {
        return null;
    }

    return await redisClient.get(code);
}

Promise.all([pgClientConnectPromise, redisClientConnectPromise]).then(() => {
    router.get('/:code', (req, res) => {
        let code = req.params.code;
        getWrap(code).then(value => {
            if (null === value) {
                pgClient.query('SELECT $1::text as message', [code], (err, result) => {
                    redisClient.set(code, result.rows[0].message, {EX: 180});
                    res.end(result.rows[0].message);
                });
            } else {
                res.end(value);
            }
        });
    });

    const server = http.createServer((req, res) => {
        router(req, res, finalhandler(req, res));
    });

    server.listen(8000, '0.0.0.0', () => {
        console.log('Server running');
    });
});
