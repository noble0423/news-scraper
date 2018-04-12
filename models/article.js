var mongoose = require("mongoose");

// Save a reference to the Schema constructor
var Schema = mongoose.Schema;

// Article Schema : this is similar to a Sequelize model
var ArticleSchema = new Schema({
    // `title` is required and of type String (unique prevents duplicates from being pulled into DB)
    title: {
      type: String,
      unique: true,
      required: true
    },
    // `link` is required and of type String
    link: {
      type: String,
      required: true
    },
    // `image` is not required
    image: {
        type: String
    },
    // `publishDate` is required
    publishDate: {
        type: String,
        required: true
    },
    // This allows us to populate the Article with an associated Note
    note: {
      type: Schema.Types.ObjectId,
      ref: "Note"
    }
  });
  
  // This creates our model from the above schema, using mongoose's model method
  var Article = mongoose.model("Article", ArticleSchema);
  
  // Export the Article model
  module.exports = Article;