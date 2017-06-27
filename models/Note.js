var mongoose = require("mongoose");

var Schema = mongoose.Schema;

var NoteSchema = new Schema({
	body: {
		type: String,
		required: true
	},
	author: {
		type: String,
		required: false,
		default: "Anonymous"
	},
	aID: {
		type: String,
		required: true
	}
});

var Note = mongoose.model("Note", NoteSchema);

module.exports = Note;