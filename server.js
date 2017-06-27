var express = require("express");
var mongoose = require("mongoose");
var request = require("request");
var cheerio = require("cheerio");
var exphbs = require("express-handlebars");
var path = require("path");
var bodyParser = require("body-parser");
var Articles = require("./models/Articles.js");
var Note = require("./models/Note.js");

mongoose.Promise = Promise;

var app = express();

app.use(bodyParser.urlencoded({
  extended: false
}));

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
        });
      });
      res.redirect("/");
  });
});

app.get("/articles/:id", function(req, res) {
  Articles.findOne({ "_id": req.params.id })
  .populate({
    path: "notes",
    model: "Note"
  })
  .exec(function(error, doc) {
    if (error){
      console.log(error);
    } else {
      console.log(doc);
      res.render("article", {article: doc});
    }
  });
});

app.get("/", function(req, res) {
  Articles.find({}, function(error, articles) {
    if (error) {
      console.log(error);
    } else {
      res.render("index", {articles: articles});
    }
  });
});

app.post("/articles/:id", function(req, res) {
  var newNote = new Note(req.body);

  newNote.save(function(error, newNote) {
    if (error) console.log(error);
    else {
      Articles.findOne({ "_id": req.params.id })
        .exec(function(error, doc) {
          var notes = doc.notes;
          notes.push(newNote._id);
          Articles.findOneAndUpdate({ "_id": req.params.id}, {"notes": notes})
          .exec(function(err, doc) {
            if (err) console.log(err)
            else {
              res.redirect("/articles/" + req.params.id);
            }
          })
      });
    }
  });
});

app.listen(3000, function() {
  console.log("App running on port 3000!");
});