const { TwitterClient } = require('twitter-api-client');
const Log = require('./logger');
const defaultConfig = require('./config');
const TwitterTasks = require('./bot_tasks.js');
const config = require('./config');


/**
 * Usernames that the TwitterRunner will need
 * @constant
 * @typedef TwitterUsers
 * @property {string} sourceUserName twitter account from which tweets could be received
 * @property {string} myUserName twitter account that is sending tweets (the bot)
 */
const DEFAULT_USERS = {
    sourceUserName: config.sourceUserName,
    myUserName: config.myUserName,
};

/**
 * @class TwitterRunner
 * @classdesc A class that executes a series of commands for a twitter "bot" account
 */
class TwitterRunner {
    /**
     * @param  {TwitterUsers} users=DEFAULT_USERS
     * @param  {import('./config').TwitterConfig} config=defaultConfig
     * @param  {Log} log=newLog('log.txt'
     */
    constructor(users = DEFAULT_USERS, config = defaultConfig, log = new Log('log.txt')) {
        const twitterClient = new TwitterClient({
            apiKey: config.consumerKey,
            apiSecret: config.consumerSecret,
            accessToken: config.authenticationToken,
            accessTokenSecret: config.authenticationSecret,
        });

        /**
         * All configuration information for the Bot Runner
         * @type {import('./config').TwitterConfig}
         * @public
         */
        this.config = config;

        /**
         * The Users the runner will need to have
         * @type {TwitterUsers}
         * @public
         */
        this.users = users;

        /**
         * The TwitterClient that the runner needs
         * @type {Object}
         * @public
         */
        this.twitterClient = twitterClient;

        /**
         * The Bot; the container with all of the tasks
         * @type {TwitterTasks}
         * @public
         */
        this.bot = new TwitterTasks(this.twitterClient, log);

        /**
         * The Logger this runner can use to output messages
         * @type {Log}
         * @public
         */
        this.log = log;
    }

    /**
     * Initializes the runner by displaying a message that a bot was created in the log
     * 
     * @returns {Promise<>}
     */
    async init() {
        await this.log
        .toConsole(`Bot Created on ${new Date().toString()}`)
        .infoToFileAsync();
    }


    /**
     * Runs a set of tasks
     * @returns {Promise<Object>} the result of having run those tasks
     */
    async run() {
        const { sourceUserName, myUserName } =  this.users;
        await this.log
            .toConsole(`Run at ${new Date().toString()}`)
            .infoToFileAsync();
        let result = null;

        try {
            const duplicatedTweets = await this.bot.duplicateUserTweets(sourceUserName, myUserName, this.config.duplicateAmount, this.config.dayDelay)

            await this.log
                .toConsole(`${duplicatedTweets.length} to send at ${new Date()}`)
                .infoToFileAsync(JSON.stringify(duplicatedTweets, null, 2))
            result = duplicatedTweets;
        } catch (error) {
            console.log(error);
            await this.log.errorToFileAsync(error);
        }
        return result;
    }


}

module.exports = TwitterRunner;