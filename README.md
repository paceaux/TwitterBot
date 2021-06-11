# TwitterBot Framework
An easy-enough-ish JavaScript framework/pattern for creating a Twitterbot. 

## Pre-Requisites
* Node.js (14 or above)
* Docker (If you want to run it in a container)

## Project Structure
```
/
├── src
│   ├── bot_runner.js
│   ├── bot_tasks.js
│   ├── config.js
│   ├── logger.js
|   └── utils.js
├── index.js
├── start-cron.js
├── start-http.js
├── jest.config.js
├── package.json
├── package-lock.json
├── docker-compose.yml
├── Dockerfile
└── .env !!!!!Not provided !!!!!
```

## Setup
### First, get the code
1. Clone this repository 
2. In this folder, run `npm install`

### Second, set credentials (And configuration)
All bot/twitter configuration information is managed in `src/config.js`. This file is set to pull configurations from the environment _first_ . However, if an environment variable isn't present, you can put in a default. 

*If* you are going to be running/debugging locally, start with credentials/config in `src/config.js`. 

**But, if you plan on version-controlling and/or deploying your code, it will be better in the long run if these credentials are environment variables.**

#### Credentials in the environment
A _mostly_ empty .env file is provided. Docker will use this if you want to run this in a Docker Container -- which is recommended if you're building multiple bots

#### Environment Variables

* `twConsumerKey` Required. Get this from your Twitter App settings
* `twConsumerSecret` Required. Get this from your Twitter App settings
* `twAuthenticationToken` Required. Get this from your Twitter App settings
* `twAuthenticationSecret`Required. Get this from your Twitter App settings
* `twBearerToken` Required. Get this from your Twitter App settings
* `twDuplicateAmt` Optional. used for duplicating tweets. Tells the bot how many could be copied
* `twDaysBack` : Optional. Use for setting how many days in the past tweets should be copied
* `twCronSchedule` Optional. If planning on using the `start-cron.js`, this will be required 
* `twSourceUserName` Optional. In a "duplicating tweets" scenario this is the original twitter account
* `twMyUserName` Required. Account of the bot

## Third, define your tasks
This lil' framework was set up to copy tweets from one user into another account. Most of the tasks that exist are set up for that purpose. 

Look in `src/bot_tasks.js` and add/remove/change any tasks that make sense for your bot. 

Keep in mind that _most likely_ you'll want to end up with one "master task" that does All The Things. 

## Fourth, tell your runner what to do
Look in `src/bot_runner.js` and change the `run()` method to use whatever tasks you've created. 

## Fifth, run it. 
### Running locally with index.js
When running locally, you can run `node index.js` or hit <kbd>F5</kbd> in VS Code on the Index file, and you'll get to step through every breakpoint. Index.js is just there for you to have something to debug.  Running index.js 

### Run it locally, on a schedule (you know, like a bot)
If you want to run this on a schedule on your machine, that's what `start-cron.js` is for. Run `node start-cron.js` from the command line and it will run from the cron schedule you set up in `src/config.js`

### Run it cloudily (or, webily) 
Maybe you want the bot to run every time an HTTP request is sent to a server. For that, there's `start-http.js` which will execute your run command _one time_. 

To Run this in Heroku, what you will have to do is deploy this app, and then have something else hit the app on a schedule (Azure Logic Apps are perfect for this). 

### Run it in a container
You can run this using docker with `docker compose run`. Just make sure you've created a .env file. 


