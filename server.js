var express = require("express");
var bodyParser = require("body-parser");
var logger = require("morgan");
var mongoose = require("mongoose");
var path = require("path");

// Our scraping tools
var axios = require("axios");
var cheerio = require("cheerio");

// Initialize Express
var app = express();

var PORT = process.env.PORT || 3000;

// Set Handlebars.
var exphbs = require("express-handlebars");

app.engine("handlebars", exphbs({ defaultLayout: "main" }));
app.set("view engine", "handlebars");

// Require all models
var db = require("./models");

// Use morgan logger for logging requests
app.use(logger("dev"));

// Use body-parser for handling form submissions
app.use(bodyParser.urlencoded({ extended: true }));

// Use express.static to serve the public folder as a static directory
app.use(express.static("public"));

// parse application/json
app.use(bodyParser.json());

// Connect to the Mongo DB
// If deployed, use the deployed database. Otherwise use the local mongoHeadlines database
var MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost/mongoHeadlines";

// Set mongoose to leverage built in JavaScript ES6 Promises
// Connect to the Mongo DB
mongoose.Promise = Promise;
mongoose.connect(MONGODB_URI, {
    // useMongoClient: true
});

// Routes
// directing to home route
// app.get("/", function(req, res) {
//     res.sendFile(path.join(__dirname, "index.html"));
//   });
// app.get("*", function(req, res) {
//     res.sendFile(path.join(__dirname, "/public/index.html"));

// A GET route for scraping the Popular Mechanics website
app.get("/scrape", function(req, res) {
    // First, we grab th body of the html with axios
    axios.get("https://www.popularmechanics.com/").then(function(response) {
        // Then we load that into Cheerio and save it to $ for a shorthand selector
        var $ = cheerio.load(response.data);

        // Now, we grab every .full-time and do the following:
        $(".full-item ").each(function(i, element) {
            // Save an empty result object
            var result = {};

            result.title = $(this)
                .children(".full-item-content")
                .children("a")
                .text()
                .replace("\n\t", "")
                .replace("\n", "");
            result.link = "https://www.popularmechanics.com" + $(this)
                .children(".full-item-content")
                .children("a")
                .attr("href");
            result.image = $(this)
                .children("a")
                .children("img")
                .attr("data-src");
            result.publishDate = $(this)
                .children(".full-item-metadata")
                .children("div")
                .text()
                .replace("\n\t\t\n\t\t", "")
                .replace("\n\t", "");
            // result.publishTime = $(this)
            //     .children(".full-item-metadata")
            //     .children("div")
            //     .attr("data-publish-date")
            //     .format("DD-MM-YYYY");
            //     .text()
            //     .replace()

            console.log(result);
            // Create a new Article using the `result` object built from scraping
            db.Article.create(result)
                .then(function(dbArticle) {
                    // View the added result in the console
                    console.log(dbArticle);
                })
                .catch(function(err) {
                    // If an error occurred, send it to the client
                    console.log("error");
                    return res.json(err);
                });
        });

        // If we were able to successfully scrape and save an Article, send a message to the client
        // res.end();
        // app.get("*", function(req, res) {
            // res.sendFile(path.join(__dirname, "/public/index.html"));
        // });
        // alert("All new articles have been added!");
        // res.sendFile(path.join(__dirname, "/public/index.html"));
        res.send(`Scrape Complete <button id='home-btn'>Home</button>`);
        // $("#home-btn").click(function() {
        //     console.log("clicked");
        // });
    });
});

// Route for getting all Articles from the db (want this to sort from newest publish date to oldest--right now though, this data is a string, so it is not sorting correctly--although it appears is if it is, but that is only a coincedence b/c of the current data's dates)
app.get("/articles", function(req, res) {
    db.Article.find().sort({ publishDate: -1 })
        .then(function(dbArticle) {
            res.json(dbArticle)
        })
        .catch(function(err) {
            res.json(err);
        });
});

// Route for getting all notes from the db
app.get("/notes", function(req, res) {
    db.Note.find({})
        .then(function(dbNote) {
            res.json(dbNote);
        })
        .catch(function(err) {
            res.json(err);
        });
});

// Route for grabbing a specific Article by Id and populate it with it's note
app.get("/articles/:id", function(req, res) {
    // Using the id passed in the id parameter, prepare a query that finds the matching one in our db...
    db.Article.findOne({ _id : req.params.id })
        .populate("note")
        .then(function(dbArticle) {
            // console.log("dbArticle after" + dbArticle);
            // If we were able to successfully find an Article with the given id, send it back to the client
            res.json(dbArticle);
            // console.log("dbArticle from app.get-server.js line 141" + dbArticle);
        })
        .catch(function(err) {
            res.json(err);
        });
});

// Route to save a new note 
app.post("/articles/:id", function(req, res) {
    console.log(req.body);
    db.Note.create(req.body)
        .then(function(dbNote) {
            return db.Article.findOneAndUpdate({ _id : req.params.id }, { note : dbNote._id}, { new : true });
        })
        .then(function(dbArticle) {
            res.json(dbArticle);
        })
        .catch(function(err) {
            res.json(err);
        });
});

// Route to update an Article's note (note is being updated in DB correctly, but it is not being transferred correctly to the front end)
app.put("/articles/:id", function(req, res) {
    console.log("req.body" + req.body);
    db.Note.update(req.body)
        .then(function(dbNote) {
            return db.Article.findOneAndUpdate({ _id : req.params.id }, { note : dbNote._id}, { new : true });
        })
        .then(function(dbArticle) {
            res.json(dbArticle);
        })
        .catch(function(err) {
            res.json(err);
        });
});

// Route to delete an Article's note
app.delete("/articles/:id", function(req, res) {
    console.log(req.body);
    db.Note.update(req.body)
        .then(function(dbNote) {
            return db.Article.findOneAndRemove({ _id : req.params.id }, { note : dbNote._id}, { new : true });
        })
        .then(function(dbArticle) {
            res.json(dbArticle);
        })
        .catch(function(err) {
            res.json(err);
        });
});


// HANDLEBARS?
// app.get("/", function(req, res) {
//     db.Article.find().sort({ publishDate: 1 })
//         .then(function(dbArticle) {
//             res.render("index", dbArticle)
//         })
//     });



// Start the server
app.listen(PORT, function() {
    console.log("App running on port " + PORT + "!");
});