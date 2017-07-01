$(".saveButton").click(function(event) {
	event.preventDefault;
	$(".modal").css("display", "block");
	$(".whiteOut").css("display", "block");
});

$(".close").click(function(event) {
	event.preventDefault;
	$(".modal").css("display", "none");
	$(".whiteOut").css("display", "none");
});