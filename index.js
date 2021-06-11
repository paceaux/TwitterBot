
const TwitterRunner = require('./src/bot_runner');

(async () => {
    const twitterRunner = new TwitterRunner();
    await twitterRunner.init();
    await twitterRunner.run();
})()