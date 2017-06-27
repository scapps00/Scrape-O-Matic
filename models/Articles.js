var mongoose = require("mongoose");

var Schema = mongoose.Schema;

var ArticlesSchema = new Schema({
	title: {
		type: String,
		required: true,
		unique: true
	},
	summary: {
		type: String,
		required: true
	},
	link: {
		type: String,
		required:true
	},
	notes: [{
			type: Schema.Types.ObjectId,
			ref: "Note"
	}]
});

var Articles = mongoose.model("Articles", ArticlesSchema);

module.exports = Articles;