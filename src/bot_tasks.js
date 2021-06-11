const Log = require('./logger');
const {asyncForEach, getTimeNDaysAgo} = require('./utils');

/**
 * @class TwitterTasks
 * @classdesc the "meat" of a TwitterBot. All of the predefined tasks that the Bot can do
 */
class TwitterTasks {
    /**
     * @param  {TwitterClient} twitterClient The library that is used for the Twitter API
     * @param  {Log} [log] the logger to use to log messages
     */
    constructor(twitterClient, log = new Log('log.txt')) {
        this.client = twitterClient;
        this.log = log;
    }

    /** Gets the unique id of a user in a query by user name
     * @param  {string} userName
     *
     * @returns {Promise<String>}
     */
    async getUserIdFromName(userName) {
        let userId = null;
        try {

            const [user] = await this.client.accountsAndUsers.usersLookup({
                screen_name: userName,
            });
            
            userId = user.id
        } catch (getIdError) {
            await this.log.errorToFileAsync(getIdError);
        }

        return userId;
    }

    /**
     * @typedef UserTweetParameters
     * @param {number} count 
     * @param {boolean} [exclude_replies=true] 
     */

    /**
     * Gets tweets from a user
     * @param  {string} userName
     * @param  {UserTweetParameters} [params]
     *
     * @returns {Promise<Array>} List of Tweets
     */
    async getUserTweets(userName, params = { count: 20, exclude_replies: true }) {
        const tweetArray = [];
        try {

            const requestParams = { screen_name: userName, tweet_mode: 'extended', ...params };
            
            const tweets = await this.client.tweets.statusesUserTimeline(requestParams);

            tweetArray.push(...tweets);
        } catch (getTweetsError) {
            await this.log.errorToFileAsync(getTweetsError);
        }
        return tweetArray;
    }


    /** Removes tweets that are less than {daysBack} (prevents tweets from 5 minutes ago being sent)
     * @param  {Array<Object>} tweets
     * @param  {number} daysBack
     *
     * @returns {Array<Object>}
     */
    filterTweetsFromNDaysAgo(tweets, daysBack) {
        const nDaysAgo = getTimeNDaysAgo(daysBack);
        const tweetsFromNDaysAgo = tweets.filter((tweet) => {
            const {created_at} = tweet;
            const createdAtDate = new Date(created_at);
            const createdTime = createdAtDate.getTime()

            return createdTime <= nDaysAgo;
        });

        return tweetsFromNDaysAgo;
    }

    /** Compares tweets to duplicate to tweets already sent and removes duplicates
     * @param  {Array<Object>} sourceTweets
     * @param  {Array<Object>} targetTweets
     *
     * @returns {Array<Object>}
     */
    filterDuplicatesFromTweets(sourceTweets, targetTweets) {
        const uniqueTweets = sourceTweets.filter((sourceTweet) => {
            const sourceTweetText = sourceTweet.full_text || sourceTweet.text;
            let searchText = sourceTweetText;
            const hasMedia = sourceTweet.extended_entities && sourceTweet.extended_entities.media;

            if (hasMedia) {
                const [mediaItem] = sourceTweet.extended_entities.media;
                const [mediaStart, mediaEnd ] = mediaItem.indices;
                searchText = sourceTweetText.slice(0, mediaStart);
            }

            const sourceTweetInTargetTweets = targetTweets.find((targetTweet) => {
                const targetTweetText = targetTweet.full_text || targetTweet.text;

                return targetTweetText.includes(searchText);
            });

            return sourceTweetInTargetTweets ? false : true;

        });

        return uniqueTweets;
    }

    /** Sends Tweets from the bot's account
     * @param  {Array<Object>} tweets Tweets captured from another account
     *
     * @returns {Promise<Array<Object>>} Responses from sending tweets
     */
    async sendTweets(tweets) {
        const sentTweets = [];
        await asyncForEach(tweets, async (sourceTweet) => {
            try {

                const { text, full_text } = sourceTweet;
                const tweetText = full_text || text;
                const newTweet = await this.client.tweets.statusesUpdate({
                    status: tweetText,
                });
                sentTweets.push(newTweet);
            } catch (sendTweetError) {
                sentTweets.push({
                    ERROR: sendTweetError,
                    sourceTweet,
                });
            }
        });

        return sentTweets;
    }

    /** Duplicates tweets from one account in another
     * @param  {string} sourceUserName The account name to copy
     * @param  {string} targetUserName the account name to paste
     * @param  {number} amountToDuplicate Integer. How many tweets could potentially be duplicated
     * @param  {number} daysToDelay Integer. How soon ofter the source tweet is sent should the tweet be duplicated
     *
     * @returns {Promise<Array<Object>>}
     */
    async duplicateUserTweets(sourceUserName, targetUserName, amountToDuplicate, daysToDelay) {
        const duplicatedTweets = [];
        try {

            const sourceTweets = await this.getUserTweets(sourceUserName, {count: amountToDuplicate, exclude_replies: true});
            const myTweets = await this.getUserTweets(targetUserName, {count: amountToDuplicate, exclude_replies: true});
            
            const targetsOldestTweets = this.filterTweetsFromNDaysAgo(sourceTweets, daysToDelay);
            const tweetsToResend = this.filterDuplicatesFromTweets(targetsOldestTweets, myTweets);
            
            if (tweetsToResend.length > 0 ) {
                const sentTweets = await this.sendTweets(tweetsToResend);
                duplicatedTweets.push(...sentTweets);
            }
            
        } catch (duplicateTweetsError) {
            await this.log.errorToFileAsync(getIdError);
        }
        return duplicatedTweets;

    }

}

module.exports = TwitterTasks;