let api = require('./wrapper/index').Application;

api.login("https://panel.sky-bot.ml/", "2ABWRsgetLjwr3uTJMr99H2DwZHOQT8EMjAZzjZNAOMDf95L")

api.createUser("eeeee", "eee", "eee@eee.ee", "sex").then(user => {
    console.log("**ERRORS:**\n\n●" + user.error.map(error => error.detail.replace('\n', ' ')).join('\n●'));
})