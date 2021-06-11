const cron = require('node-cron');

const Log = require('./src/logger');
const TwitterRunner = require('./src/bot_runner');
const { cronSchedule } = require('./src/config');

const log = new Log('log.txt');



(async () => {
    const twitterRunner = new TwitterRunner();
    await twitterRunner.init();

    await log
        .toConsole(`Cron Schedule ${cronSchedule}`)
        .infoToFileAsync();
    
    await twitterRunner.run();

    cron.schedule(cronSchedule, async () => {
        try {
            await twitterRunner.run();
        } catch (twitterRunErr) {
            await log
                .toConsole(twitterRunErr, true)
                .errorToFileAsync();
        }
    });
})();