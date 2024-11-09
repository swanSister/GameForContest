(function(){
let CARD_COUNT = 8;

function drawStage(){
	for(var i= CARD_COUNT; i>=1; i--){

		if( i > BACKUP_STAGE+1){
			$("#stageBtn"+i).attr('class','stage-btn gray');
		}else{
			if(i == BACKUP_STAGE+1){
				$("#stageBtn"+i).attr('class','stage-btn latest-anim');
			}else{
				$("#stageBtn"+i).attr('class','stage-btn');
			}
		}
	}
	$("#stageBtnContent div img").on("click",function(){
		if(!$(this).attr("class")){
			var index = CARD_COUNT - $(this).parent().index();
			setCurrentStage(index);
			console.log(index+ " - stage");
			$.mobile.changePage("#game");
		}
	});
}

$("#stage").on("pagebeforeshow",function(){
	BACKUP_STAGE = getBackupStage();
	drawStage();
});
$("#stage").on("pageshow",function(){
	if(BACKUP_STAGE<4){
		$(document).scrollTop($(document).height());
	}else{
		$(document).scrollTop(0);
	}
});
$("#stage").on("pagebeforehide",function(){
	$("#stageBtnContent div img").off("click");
});

}());
