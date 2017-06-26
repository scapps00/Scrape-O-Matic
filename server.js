var express = require("express");
var mongoose = require("mongoose");
var request = require("request");
var cheerio = require("cheerio");
var exphbs = require("express-handlebars");
var path = require("path");
var Articles = require("./models/Articles.js");

mongoose.Promise = Promise;

var app = express();

mongoose.connect("mongodb://127.0.0.1:27017");
var db = mongoose.connection;

db.on("error", function(error) {
  console.log("Mongoose Error: " + error);
});

db.once("open", function() {
  console.log("Mongoose connection successful.");
});

app.engine("handlebars", exphbs({ defaultLayout: "main" }));
app.set("view engine", "handlebars");

app.use(express.static(path.join(__dirname, "/public")));

app.get("/scrape", function(req, res) {
  var titleArray = [];
  request("http://www.bbc.com/news", function(error, response, html) {
      var $ = cheerio.load(html);
      $(".gs-c-promo-body").each(function(i, element) {
        var result = {};
        result.title = $(this).children("div").children("a").children(".gs-c-promo-heading__title").text();
        result.summary = $(this).children("div").children(".gs-c-promo-summary").text();
        result.link = "http://www.bbc.com/" + $(this).children("div").children("a").attr("href");

        var entry = new Articles(result);

        entry.save(function(err, doc) {
          if (err) {
            console.log(err);
          }
          else
            console.log(doc);
        });
      });
  });
  res.render("index");
});

app.listen(3000, function() {
  console.log("App running on port 3000!");
});