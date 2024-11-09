(function(){
$("#intro").on("pagebeforeshow",function(){
	$("#myBestScore").text(getAllScore());
	$("#introStartBtn").on("click",function(){
		$.mobile.changePage("#way")
	});
});
$("#intro").on("pageshow",function(){

});

$("#intro").on("pagebeforehide",function(){
	$("#introStartBtn").off("click");
});

}());
