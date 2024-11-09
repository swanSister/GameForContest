(function(){
$("#way").on("pagebeforeshow",function(){
	$("#startBtn").on("click",function(){
		$.mobile.changePage("#stage");
	});
});

$("#way").on("pagebeforehide",function(){
	$("#startBtn").off("click");
});
}());
