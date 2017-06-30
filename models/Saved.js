var mongoose = require("mongoose");

var Schema = mongoose.Schema;

var SavedSchema = new Schema({
	articleID: {
			type: Schema.Types.ObjectId,
			ref: "Article",
			unique: true
	}
});

var Saved = mongoose.model("Saved", SavedSchema);

module.exports = Saved;