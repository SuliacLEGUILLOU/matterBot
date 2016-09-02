"use strict";

var Mattermost = require('node-mattermost');
var bodyParser = require("body-parser");
var Express = require('express');
var wiki = require("node-wikipedia");

var MM_HOOK = process.env.MM_HOOK;
var MM_TOKEN = process.env.MM_TOKEN;
var WIKI_TOKEN = process.env.WK_TOKEN;
var MM_CHANNEL = process.env.MM_CHANNEL;
var MM_BOTNAME = process.env.MM_BOTNAME;
var MM_AVATAR = process.env.MM_AVATAR;
var MB_PORT = process.env.MB_PORT;

var mattermost = new Mattermost(MM_HOOK);
var app = Express();

app.use(bodyParser.urlencoded({
    limit: '128mb'
    , extended: true
}));
app.use(bodyParser.json({
    limit: '128mb'
}));

app.post('/mm/wiki', function (req, res) {
    mattermost.respond(req.body, function (hook) {
        if (hook.token !== WIKI_TOKEN) {
            console.log("WK token error");
        }
        if (hook.text.indexOf(' ') >= 0) {
            var search = hook.text.substr(hook.text.indexOf(' ') + 1);

            console.log("Call to wikipedia" + search + " by " + hook.username);
            wiki.page.data(search, {content: true}, function (response) {
                if (typeof response !== "undefined") {
                    mattermost.send({
                        text: '@' + hook.user_name + ', are you looking for https://en.wikipedia.org/?curid=' + response.pageid + " with \"" + search + "\"?",
                        channel: hook.channel,
                        username: MM_BOTNAME,
                        icon_url: MM_AVATAR
                    });
                } else {
                    mattermost.send({
                    text: 'Page not found.',
                    channel: hook.channel,
                    username: MM_BOTNAME,
                    icon_url: MM_AVATAR
                });}
            });
        }
    });
});

mattermost.send({
    text: 'Hi everyone, I am now listening to this channel!',
    channel: MM_CHANNEL,
    username: MM_BOTNAME,
    icon_url: MM_AVATAR
});

console.log("App launched on port " + MB_PORT);
app.listen(MB_PORT);
