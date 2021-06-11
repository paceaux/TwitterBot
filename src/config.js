
const {
    twConsumerKey,
    twConsumerSecret,
    twAuthenticationToken,
    twAuthenticationSecret,
    twBearerToken,
    twDuplicateAmt,
    twDaysBack,
    twCronSchedule,
    twSourceUserName,
    twMyUserName,
} = process.env;

/**
 * @typedef TwitterConfig
 * @property {string} consumerKey
 * @property {string} consumerSecret
 * @property {string} bearerToken
 * @property {string} authenticationToken
 * @property {string} authenticationSecret
 * @property {number} duplicateAmount
 * @property {string} dayDelay
 * @property {string} cronSchedule
 * @property {string} sourceUserName
 * @property {string} myUserName
 */
const config = {
    consumerKey: twConsumerKey,
    consumerSecret: twConsumerSecret,
    bearerToken:  twBearerToken,
    authenticationToken: twAuthenticationToken,
    authenticationSecret: twAuthenticationSecret,
    duplicateAmount: twDuplicateAmt || 40,
    dayDelay: twDaysBack || 1,
    cronSchedule: twCronSchedule || '* */2 * * *',
    sourceUserName: twSourceUserName || 'paceaux',
    myUserName: twMyUserName || 'madebypaceaux',
};
module.exports = config;