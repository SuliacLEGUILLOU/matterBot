"use strict";

var Mattermost = require('node-mattermost');
var bodyParser = require("body-parser");
var Express = require('express');

var MM_HOOK = process.env.MM_HOOK;
var MM_TOKEN = process.env.MM_TOKEN;
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

app.post('/mm', function (req, res) {
    console.log("message detected");
    var message = mattermost.respond(req.body, function (hook) {
        if (hook.token !== MM_TOKEN){
            console.log("token error");
            return null;
        }
        //console.log("message detected " + hook.text + ' ' + hook.user_name);
        return {
            text: hook.text,
            username: hook.user_name,
        }
    });
    if (message && message.username !== MM_BOTNAME) {
        console.log("sending message");
        mattermost.send({
            text: message.text,
            channel: MM_CHANNEL,
            username: MM_BOTNAME,
            icon_url: MM_AVATAR,
            unfurl_links: true
        });
    }
});

mattermost.send({
    text: 'Hi everyone, I am now listening to this channel!',
    channel: MM_CHANNEL,
    username: MM_BOTNAME,
    icon_url: MM_AVATAR
});

console.log("App launched on port " + MB_PORT);
app.listen(MB_PORT);
