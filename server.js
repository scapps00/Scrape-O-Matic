var express = require("express");
var mongoose = require("mongoose");
var request = require("request");
var cheerio = require("cheerio");

var app = express();

app.get("/scrape", function(req, res) {
  var titleArray = [];
  request("http://www.bbc.com/news", function(error, response, html) {
      var $ = cheerio.load(html);
      $(".gs-c-promo-heading").each(function(i, element) {
        var title = $(this).text();
        console.log(title);
      });
  });
});

app.listen(3000, function() {
  console.log("App running on port 3000!");
});