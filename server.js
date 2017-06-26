var express = require("express");
var mongoose = require("mongoose");
var request = require("request");
var cheerio = require("cheerio");

var app = express();

app.get("/scrape", function(req, res) {
  var titleArray = [];
  request("http://www.bbc.com/news", function(error, response, html) {
      var $ = cheerio.load(html);
      $(".gs-c-promo-body").each(function(i, element) {
        var title = $(this).children("div").children("a").children(".gs-c-promo-heading__title").text();
        var summary = $(this).children("div").children(".gs-c-promo-summary").text();
        var link = $(this).children("div").children("a").attr("href");
        if (title && summary && link) {  
          console.log(title);
          console.log(summary);
          console.log("http://www.bbc.com/" + link);
        }
      });
  });
});

app.listen(3000, function() {
  console.log("App running on port 3000!");
});