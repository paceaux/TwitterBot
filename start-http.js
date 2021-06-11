const cron = require('node-cron');

const Log = require('./src/logger');
const TwitterRunner = require('./src/bot_runner');
const { cronSchedule } = require('./src/config');

const log = new Log('log.txt');

const express = require('express');
const port = process.env.PORT || 3000;

const app = express();

const twitterRunner = new TwitterRunner();

app.listen(port, async () => {
    await twitterRunner.init();
    await log.infoToFileAsync('App started and twitterrunner initialized');
});

app.get('/', async (req, res, next) => {

    let result;
    await log
        .toConsole(`Cron Schedule http request`)
        .infoToFileAsync();
    
    try {
        result = await twitterRunner.run();
        await res.send(result);
    } catch (err) {
        return next(err);
    }
});