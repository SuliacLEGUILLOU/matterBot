"use strict";

var wiki = require("node-wikipedia");

var test = "!wiki jfk";

var id = wiki.page.data(test.substr(test.indexOf(' ') + 1), {content: true}, function (response) {
    console.log('https://en.wikipedia.org/?curid='+response.pageid);
    return response.pageid;
});