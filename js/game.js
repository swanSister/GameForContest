(function(){
  let game = document.getElementById("game"),
  map = document.getElementById("map"),
  comboExplain = document.getElementById("comboExplain"),
  scoreText = document.getElementById("scoreText"),
  bestText = document.getElementById("bestText"),
  timeBarInner = document.getElementById("timeBarInner"),
  timeFeverBarInner = document.getElementById("timeFeverBarInner"),
  alertPopup = document.getElementById("alertPopup"),
  alertPopupMessage = document.getElementById("alertPopupMessage"),
  stageStartBtn = document.getElementById("stageStartBtn"),
  gamePlayContent = document.getElementById("gamePlayContent"),

  bgSound = document.getElementById("bgSound"),
  punchSound = document.getElementById("punchSound"),
  yeahSound = document.getElementById("yeahSound"),
  sighSound = document.getElementById("sighSound"),
  buttonShowTimer,
  Xmask,

  XMASK_TIME = 3000,
  X_COMBO_TIME = 300,
  ALERT_POPUP_TIME = 600,
  CARD_REMOVE_TIME = 200,
  ANIMATION_TIME = 300,
  FADE_WAIT_TIME = 1500,
  FEVER_WAIT_TIME = 2300,
  GAME_DURATION = 30000,

  LAST_FEVER_TIME = null,
  CHECK_HINT_TIME = 0,
  IS_TIMEUP = false,
  IS_FEVER = false,
  CARD_COUNT = 25,
  MAX_IMAGE_COUNT = 8,
  MAX_RUNNING_CARD_COUNT = 15;

  var LEVEL = 1,
  CARD_ARR = [],
  GAME_STARTED = false,
  SCORE = 0,
  COMBO_INPUT_ARR = [],
  CLEAR_INPUT_ARR = [],
  REMOVING_COUNT = 0,
  CELAR_CHECK = {
	point:false,
	combo:false,
	isAlarmed:false
},
  INTERVAL = {
	"checkTimeInterval":null,
	"checkTimeFeverInterval":null,
	"ALERTING":false,
	"PAUSE":false,
  "PAUSE_TIME":null};

  function startGame(){
      if(GAME_STARTED){
        return;
      }
      GAME_STARTED = true;

      CELAR_CHECK = {
        point:false,
        combo:false,
        isAlarmed:false
      };
	    COMBO_INPUT_ARR = [];
		CLEAR_INPUT_ARR = [];
		REMOVING_COUNT = 0;
		CHECK_HINT_TIME = 4000*(CURRENT_STAGE-1);
        IS_FEVER = false;
        IS_TIMEUP = false;
        REMOVING_COUNT = 0;
        INTERVAL.ALERTING = false;
        INTERVAL.PAUSE = false;
        SCORE = 0;
        scoreText.textContent = SCORE;
        checkTime();
        fadeInAnim();
  }
  function getBestScore(){
    var key = "STAGE"+CURRENT_STAGE;
    var localVal = localStorage.getItem(key);
    if(localVal) return parseInt(localVal,10);
    else {
        localStorage.setItem(key, "0");
        return 0;
    }
  }
  function saveBestScore(){
    var key = "STAGE"+CURRENT_STAGE;
    var localVal = localStorage.getItem(key);
    if(localVal){
      if(parseInt(localVal,10) < SCORE)
        localStorage.setItem(key, SCORE);
    }else{
        localStorage.setItem(key, SCORE);
    }

  }
  function endGame(){
      GAME_STARTED = false;
      bgSound.pause();
      SCORE = 0;
      scoreText.textContent = SCORE;
      alertPopup.style.top = "100vh";
      clearInterval(INTERVAL.checkTimeInterval);
  }

  function createMap(){
  	CARD_ARR = [];

  	for(var i =0; i < CARD_COUNT; i++){
		var card_content = document.createElement("div");
		card_content.classList.add("card-content");
		CARD_ARR[i] = document.createElement("img");
		CARD_ARR[i].classList.add("card");

        CARD_ARR[i].effect = document.createElement("img");
        CARD_ARR[i].effect.classList.add("glitter");
        CARD_ARR[i].effect.src = "./images/glitter.gif";
        CARD_ARR[i].effect.style.display = "none";

        CARD_ARR[i].cardEffect = document.createElement("img");
        CARD_ARR[i].cardEffect.classList.add("card-effect");
        CARD_ARR[i].cardEffect.src = "./images/card_effect.png";
        CARD_ARR[i].cardEffect.style.display = "none";

    	card_content.appendChild(CARD_ARR[i]);
        card_content.appendChild(CARD_ARR[i].effect);
        card_content.appendChild(CARD_ARR[i].cardEffect);

    	map.appendChild(card_content);
		    CARD_ARR[i].parentNode.addEventListener("touchstart",cardClickListener);
        CARD_ARR[i].parentNode.addEventListener("click",cardClickListener);
    	}

    	Xmask = document.createElement("div");
    	Xmask.setAttribute("id","Xmask");
    	Xmask.style.backgroundImage = "url('./images/X.png')";

    	map.appendChild(card_content);
    	map.appendChild(Xmask);
  }
  function sufferMap(){
		for(var i =0; i < CARD_COUNT; i++){
			var imgNumber = parseInt(Math.random()*MAX_IMAGE_COUNT + 1,10);
			CARD_ARR[i].src = "./images/"+imgNumber+"_crop.png";
			CARD_ARR[i].imgNumber = imgNumber;
		}
  }

  function checkTime(){
	var IntervalTime = 10, destWidth = 0, startWidth = 100, width = 100, decInc = startWidth*IntervalTime/GAME_DURATION;//30second
    timeFeverBarInner.style.width = "100%";
	  INTERVAL.checkTimeInterval = setInterval(function(){
		if(INTERVAL.PAUSE || INTERVAL.ALERTING || IS_FEVER)return;
    if(IS_TIMEUP){
      IS_TIMEUP = false;
      width += (decInc * 200);
  		timeBarInner.style.width = width+"%";
    }else{
      width -= decInc;
      if(width < destWidth){
        clearInterval(INTERVAL.checkTimeInterval);
        showAlertPopup("Game End","gameEnd",true);
        return;
      }
      timeBarInner.style.width = width+"%";
    }
	  },IntervalTime);
  }
  function fadeOutAnim(RandArr){
  	if(!GAME_STARTED)return;

    var filterValue, filterDiff, destFilterValue = 100, startValue = 100, startScale = 1.5, start, pause;

  	function runAnim(timestamp){
  		if(!GAME_STARTED)return;
  		if(INTERVAL.PAUSE || INTERVAL.ALERTING){
  			requestAnimationFrame(runAnim);
  			return;
  		}
      var timestamp = Date.now();
      if(INTERVAL.PAUSE_TIME){
        if(start)start += timestamp - INTERVAL.PAUSE_TIME ;
        if(LAST_FEVER_TIME) LAST_FEVER_TIME += timestamp - INTERVAL.PAUSE_TIME;
        INTERVAL.PAUSE_TIME = null;
      }

      if(!start)start = timestamp;
      var progress = timestamp - start;

      filterValue = Math.max(startValue*progress/ANIMATION_TIME,0);
      scaleValue = Math.max(startScale - (startScale - 1.0)*progress/ANIMATION_TIME,1.0);

  		if(filterValue < destFilterValue){
  			for(var i =0; i < RandArr.length; i++){
  			  if(!CARD_ARR[RandArr[i]].isRemoving){
  			   CARD_ARR[RandArr[i]].style.filter = "grayscale("+filterValue+"%)";
  			   CARD_ARR[RandArr[i]].style.transform  = "scale("+scaleValue+")";
  			 }
  			}
  			requestAnimationFrame(runAnim);
  		}else{
    	  alertPopupMessage.style.backgroundColor = "rgba(17,153,142,0.8)";
  			for(var i =0; i < RandArr.length; i++){
  				var imgNumber = parseInt(Math.random()*MAX_IMAGE_COUNT + 1,10);
          CARD_ARR[RandArr[i]].src = "./images/"+imgNumber+"_crop.png";
  				CARD_ARR[RandArr[i]].imgNumber = imgNumber;
  				CARD_ARR[RandArr[i]].style.filter = "grayscale(100%)";
  				CARD_ARR[RandArr[i]].style.transform  = "scale(1.0)";
  				CARD_ARR[RandArr[i]].isBonus = false;
  				CARD_ARR[RandArr[i]].effect.style.display = "none";
          CARD_ARR[RandArr[i]].cardEffect.style.display = "none";
  				CARD_ARR[RandArr[i]].isAnimating = false;
  				CARD_ARR[RandArr[i]].isRemoving = false;
  			}
  			REMOVING_COUNT = 0;
  			COMBO_INPUT_ARR = [];
  			CLEAR_INPUT_ARR = [];
  			fadeInAnim();
  		}
  	}
  	requestAnimationFrame(runAnim);
  }

  function fadeInAnim(){
	if(!GAME_STARTED)return;

	var filterValue, scaleValue, startValue = 100, destScale = 1.5;
	var RandArr = [];
	var isFeverBar = false, feverBarWidth=100;
	var count = parseInt(Math.random()*MAX_RUNNING_CARD_COUNT+3,10);
	var comboFeverArr = STAGE_COMBO_DATA[CURRENT_STAGE-1].comboArray[STAGE_COMBO_DATA[CURRENT_STAGE-1].comboFeverIndex].combo;
	var comboIncludedArr = [];
	var timeDiff = new Date().getTime() - LAST_FEVER_TIME;
  var start,wait, waitDuration, pause, beforeTimestamp;

  waitDuration = FADE_WAIT_TIME;

	for(var i = 0; i<count; i++){
		var randomNumber = parseInt(Math.random()*CARD_COUNT,10);
		if(!RandArr.includes(randomNumber)){
		  if(!CARD_ARR[randomNumber].isRemoving){
			RandArr.push(randomNumber);
			CARD_ARR[randomNumber].isAnimating = true;
			}
		}
	}
	for(var i = 0; i<comboFeverArr.length; i++){
		for(var j =0; j<RandArr.length; j++){
			if(comboFeverArr[i] == CARD_ARR[RandArr[j]].imgNumber){
				comboIncludedArr.push(RandArr[j]);
				break;
			}
		}
	}
	if(comboIncludedArr.length == comboFeverArr.length && timeDiff >= CHECK_HINT_TIME){
		for(var i = 0; i<comboIncludedArr.length; i++){
			CARD_ARR[comboIncludedArr[i]].effect.style.display = "block";
		}
	}
	function runAnim(timestamp){
		if(!GAME_STARTED)return;
		if(INTERVAL.PAUSE || INTERVAL.ALERTING){
			requestAnimationFrame(runAnim);
			return;
		}
    var timestamp = Date.now();
    if(INTERVAL.PAUSE_TIME){
      if(start){start += (timestamp - INTERVAL.PAUSE_TIME );}
      if(wait) {wait += (timestamp - INTERVAL.PAUSE_TIME );}
      if(LAST_FEVER_TIME) LAST_FEVER_TIME += timestamp - INTERVAL.PAUSE_TIME;
      INTERVAL.PAUSE_TIME = null;
    }

		if(IS_FEVER){
			IS_FEVER = false;
  		start = timestamp;
      waitDuration = FEVER_WAIT_TIME;
      wait = null;
			filterValue = 100;
			scaleValue = 1;
			isFeverBar = true;
			RandArr = [];
			var imgNumber = STAGE_CLEAR_DATA[CURRENT_STAGE-1].bonusTimeFriends;
			for(var i = 0; i < CARD_ARR.length; i++){
				CARD_ARR[i].isBonus = true;
				CARD_ARR[i].isAnimating = true;
				CARD_ARR[i].isRemoving = false;
				CARD_ARR[i].style.filter = "grayscale("+filterValue+"%)";
				CARD_ARR[i].style.transform  = "scale("+scaleValue+")";
				CARD_ARR[i].src = "./images/"+imgNumber+"_crop.png";
				CARD_ARR[i].imgNumber = imgNumber;
				CARD_ARR[i].effect.style.display = "block";
				RandArr.push(i);
			}
			requestAnimationFrame(runAnim);
		}else{

      if(!start)start = timestamp;
      var progress = timestamp - start;

      filterValue = Math.max(100 - startValue*progress/ANIMATION_TIME,0);
      scaleValue = Math.max( 1.0 +(destScale - 1.0)*progress/ANIMATION_TIME,1.0);
  		if(isFeverBar){
  			feverBarWidth = Math.max(100 - startValue*progress/(ANIMATION_TIME+FEVER_WAIT_TIME),0);
  				timeFeverBarInner.style.width = feverBarWidth +"%";
  			}
  		if(filterValue > 0){
  			for(var i =0; i < RandArr.length; i++){
  				if(!CARD_ARR[RandArr[i]].isRemoving){
  					 CARD_ARR[RandArr[i]].style.filter = "grayscale("+filterValue+"%)";
  					 CARD_ARR[RandArr[i]].style.transform  = "scale("+scaleValue+")";
  			   }
  			}
  			requestAnimationFrame(runAnim);
  		}else{
        if(!wait)wait = timestamp;
        var waitProgress = timestamp - wait;
  			if(waitProgress > waitDuration || (REMOVING_COUNT > 0  && REMOVING_COUNT >= RandArr.length)){
  				if(isFeverBar){
  					isFeverBar = false;
  					map.style.borderColor = "rgba(17,153,142,0.8)";
  					timeBarInner.style.display = "block";
  					timeFeverBarInner.style.display = "none";
  				}
  				fadeOutAnim(RandArr);
  			}else{
  				requestAnimationFrame(runAnim);
  			}
  		}
		}
    beforeTimestamp = timestamp;
	}
	requestAnimationFrame(runAnim);
  }

  function comboCheck(){
	  var comboString = COMBO_INPUT_ARR.toString();
	  var comboArray = STAGE_COMBO_DATA[CURRENT_STAGE-1].comboArray;
	  var isXmask = false;
		if(COMBO_INPUT_ARR.length >= 2){

		for(var i = 0; i < comboArray.length; i++){
			if(comboString.indexOf(comboArray[i].combo.toString()) >= 0){
			switch(comboArray[i].type){
				case "TIME" :
					map.style.borderColor = "rgba(17,153,142,0.8)";
					alertPopupMessage.style.backgroundColor = "rgba(17,153,142,0.8)";
					playAudio(yeahSound);
				break;
					case "BONUS" :
					timeBarInner.style.display = "none";
					timeFeverBarInner.style.display = "block";
					timeFeverBarInner.style.width = "100%";
					map.style.borderColor = "#F7B618";
					alertPopupMessage.style.backgroundColor = "rgba(247,182,24,0.8)";
					playAudio(yeahSound);
				break;
					case "X" :
						map.style.borderColor = "rgba(17,153,142,0.8)";
						alertPopupMessage.style.backgroundColor = "rgba(17,153,142,0.8)";
						// map.style.borderColor = "rgba(200,0,0,0.8)";
						// alertPopupMessage.style.backgroundColor = "rgba(200,0,0,0.8)";
					isXmask = true;
				break;
			}
			showAlertPopup(comboArray[i].result,comboArray[i].type);
			COMBO_INPUT_ARR = [];
			break;
			}
		}
      }
  }
  function clearCheck(){

	var clearVal = STAGE_CLEAR_DATA[CURRENT_STAGE-1].clearVal;

	if(clearVal.point && SCORE >= clearVal.point)CELAR_CHECK.point = true;
	if(clearVal.combo && CLEAR_INPUT_ARR.toString().indexOf(clearVal.combo) >= 0)CELAR_CHECK.combo = true;

	if(!CELAR_CHECK.isAlarmed &&(
	(clearVal.point && clearVal.combo && CELAR_CHECK.point && CELAR_CHECK.combo) ||
	(clearVal.point && CELAR_CHECK.point && !CELAR_CHECK.isAlarmed && !clearVal.combo) ||
	(clearVal.combo && CELAR_CHECK.combo && !CELAR_CHECK.isAlarmed && !clearVal.point) )){
		if(getBackupStage()<=CURRENT_STAGE){
			setBackupStage(CURRENT_STAGE);
		}
		CELAR_CHECK.isAlarmed = true;
		showAlertPopup("Stage Clear","STAGE_CLEAR");
	}
  }

  function cardClickListener(event){
    event.preventDefault();
    event.stopPropagation();
    var removeObj = event.currentTarget.childNodes[0];
    if(!removeObj)return;
    if(removeObj.isAnimating){
  		if(removeObj.isRemoving)return;
		var scoreInc = 5;
  		if(removeObj.isBonus){
  			removeObj.isBonus = false;
			scoreInc = 10;
  		}
		SCORE += scoreInc;
		var pageX, pageY;
		if(event.type =="click"){
			pageX = event.pageX;
			pageY = event.pageY;
		}
		if(event.type =="touchstart"){
			pageX = event.changedTouches[0].pageX;
			pageY = event.changedTouches[0].pageY;
		}
		pageY -= 20;
		pageX += 10;
		$("#textEffect").stop();
		$("#textEffect").text("+"+scoreInc).css({"top":pageY+"px","left":pageX+"px"}).show().animate({"top":pageY-20},300,"linear",function(){
		   $("#textEffect").hide();
	  });
      playAudio(punchSound);
      scoreText.textContent = SCORE;
  	  COMBO_INPUT_ARR.push(removeObj.imgNumber);
  	  CLEAR_INPUT_ARR.push(removeObj.imgNumber);
  	  comboCheck();
  	  clearCheck();
      removeObj.isRemoving = true;
      removeObj.effect.style.display = "none";
      removeObj.cardEffect.style.display = "block";

      var filterValue, filterDiff, start, startScale = 1.5,pause,
        currentFilterValue = parseInt(removeObj.style.filter.replace(/[^-\.0-9]/g,""),10),
	      destFilterValue = 100,
        currentScale = parseFloat(removeObj.style.transform.replace(/[^-\.0-9]/g,""),10),
        destFilterValue = 100,
        destScale = 1.0;

        REMOVING_COUNT ++;

		function runAnim(timestamp){
      if(!removeObj.isRemoving) return;
      if(!removeObj.isAnimating) return;
			if(!GAME_STARTED)return;
			if(INTERVAL.PAUSE){
				requestAnimationFrame(runAnim);
				return;
			}
      var timestamp = Date.now();
      if(INTERVAL.PAUSE_TIME){
        if(start)start += timestamp - INTERVAL.PAUSE_TIME;
        if(LAST_FEVER_TIME) LAST_FEVER_TIME += timestamp - INTERVAL.PAUSE_TIME;
        INTERVAL.PAUSE_TIME = null;
      }
      if(!start)start = timestamp;
      var progress = timestamp - start;

      filterValue = Math.max(currentFilterValue + destFilterValue*progress/CARD_REMOVE_TIME,0);
      if(currentScale > destScale){
        currentScale = Math.max(currentScale - (startScale - 1.0)*progress/CARD_REMOVE_TIME,1.0);
      }else{
        currentScale = destScale;
      }
			if(filterValue < destFilterValue){
				removeObj.style.filter = "grayscale("+filterValue+"%)";
				removeObj.style.transform  = "scale("+currentScale+")";
				requestAnimationFrame(runAnim);
			}else{
				  removeObj.style.filter = "grayscale(100%)";
				  removeObj.style.transform  = "scale(1.0)";
          removeObj.cardEffect.style.display = "none";
			}
		}
		requestAnimationFrame(runAnim);
    }else{
		playAudio(sighSound);
		$("#Xmask").fadeIn(100).delay(X_COMBO_TIME).fadeOut(100);
	}
  }
	function showXmask(){
		$("#Xmask").stop();
		$("#Xmask").fadeIn(300).delay(XMASK_TIME).fadeOut(300,function(){
			map.style.borderColor = "#11998e";
		});
	}
  function showAlertPopup(txt, alertType, is_start_end){
  	if(!is_start_end && !GAME_STARTED)return;
    alertPopup.style.display = "block";
	  INTERVAL.ALERTING = true;
    INTERVAL.PAUSE_TIME = Date.now();
    var opacity = 1.0, destTop = 8, start, wait,pause, top = 100;
    alertPopupMessage.textContent = txt;
    alertPopupMessage.style.opacity = opacity;
  	if(alertType == "STAGE_CLEAR"){
  		waiting = 15;
  	}
	function runAnim(timestamp){
		if(!is_start_end && !GAME_STARTED) return;
		if(INTERVAL.PAUSE){
			requestAnimationFrame(runAnim);
			return;
		}
    var timestamp = Date.now();
    if(INTERVAL.PAUSE_TIME){
      if(start)start += timestamp - INTERVAL.PAUSE_TIME ;
      if(LAST_FEVER_TIME) LAST_FEVER_TIME += timestamp - INTERVAL.PAUSE_TIME;
      INTERVAL.PAUSE_TIME = null;
    }
    if(!start)start = timestamp;
    var progress = timestamp-start;
    top = Math.max(100 - 100*progress/ANIMATION_TIME, 0);

		if(top > destTop){
			alertPopup.style.top = top+"vh";
			requestAnimationFrame(runAnim);
		}else{
      alertPopup.style.top = destTop + "vh";
      if(!wait)wait = timestamp;
      var waitProgress = timestamp - wait;

      if(waitProgress < ALERT_POPUP_TIME){
        requestAnimationFrame(runAnim);
      }else if(opacity > 0){
        opacity = Math.max(1.0 - (1.0)*progress/ANIMATION_TIME,0);
        alertPopupMessage.style.opacity = opacity;
        requestAnimationFrame(runAnim);
      }else{
        alertPopup.style.top = "100vh";
        alertPopup.style.display = "none";
        INTERVAL.ALERTING = false;
        if(alertType == "TIME"){
          IS_TIMEUP = true;
        }else if(alertType == "X"){
          showXmask();
        }else if(alertType == "BONUS"){
          LAST_FEVER_TIME = new Date().getTime();
          IS_FEVER = true;
        }else if(alertType == "gameStart"){
          startGame();
        }else if(alertType == "gameEnd"){
          showEndPopup();
        }
      }
    }

	}
	requestAnimationFrame(runAnim);
  }

 function showStageExplain(){
   $("#stageStartBtn").hide();
   buttonShowTimer = setTimeout(function(){
     $("#stageStartBtn").stop().fadeIn(500);
   },2000);
   for(var i = 0; i<CARD_ARR.length; i++){
     CARD_ARR[i].style.filter = "grayscale(100%)";
     CARD_ARR[i].style.transform  = "scale(1)";
     CARD_ARR[i].isBonus = false;
     CARD_ARR[i].effect.style.display = "none";
     CARD_ARR[i].cardEffect.style.display = "none";
     CARD_ARR[i].isAnimating = false;
     CARD_ARR[i].isRemoving = false;
   }
   CURRENT_STAGE = getCurrentStage();

	 var clearVal = STAGE_CLEAR_DATA[CURRENT_STAGE-1].clearVal,
	 spanCount = 0;
	 $("#gameEndPopup").hide();
	 $("#stageExplain").show();
	 $("#stageClearScore").empty();
	 $("#stageClearCombo").empty();
	 if(clearVal.point){
		 spanCount++;
		  $("#stageClearScore").append('<span class="circle-span">'+spanCount+'</span>'+clearVal.point+'점 달성');
	 }
	 if(clearVal.combo){
		 spanCount++
		 var combo = clearVal.combo.split(",");
		 $("#stageClearCombo").append('<span class="circle-span">'+spanCount+'</span>');
		 for(var i =0; i<combo.length; i++){
				$("#stageClearCombo").append('<img src="images/'+combo[i]+'.gif" class="character"/>');
			 if(i<combo.length-1){
				 $("#stageClearCombo").append('<img src="images/arrow.png"/>');
			 }
		 }
	 }
	 createComboElement(CURRENT_STAGE-1,"stageComboExplain");
     createComboElement(CURRENT_STAGE-1,"comboExplain");
	 sufferMap();
  }
  function showEndPopup(){
    GAME_STARTED = false;
    map.style.borderColor = "#11998e";
    timeBarInner.style.display = "block";
    timeFeverBarInner.style.display = "none";
    timeFeverBarInner.style.width = "100%";
    for(var i = 0; i<CARD_ARR.length; i++){
      CARD_ARR[i].style.filter = "grayscale(100%)";
      CARD_ARR[i].style.transform  = "scale(1)";
      CARD_ARR[i].isBonus = false;
      CARD_ARR[i].effect.style.display = "none";
      CARD_ARR[i].cardEffect.style.display = "none";
      CARD_ARR[i].isAnimating = false;
      CARD_ARR[i].isRemoving = false;
    }

    $("#gameEndPopup span").text("STAGE "+CURRENT_STAGE);
    $("#gameEndPopup img").attr("src","./images/"+CURRENT_STAGE+"_stage_clear.png");
    $("#endScore").text(SCORE);
    $("#gameEndPopup").show();
    saveBestScore();
    endGame();
    if(!CELAR_CHECK.isAlarmed){
      $("#gameEndPopupNextBtn").attr("class","disable text-border-thin");
      $("#gameEndPopupNextBtn").hide();
      $("gameEndPopupRetryBtn").css('float','left');
    }else{
      $("#gameEndPopupNextBtn").attr("class","enable text-border-thin");
      $("#gameEndPopupNextBtn").show();
      $("gameEndPopupRetryBtn").css('float','none').css('margin','auto auto');
    }
  }
  function playAudio(audio,restart){
	if(!restart) audio.currentTime = 0;
    audio.play();
  }
  function stopAudio(audio){
    audio.pause();
  }
  function audioEnded(){
    this.play();
  }
  function visiabilityChangeListener(){
    if( document.hidden ){
		INTERVAL.PAUSE = true;
    INTERVAL.PAUSE_TIME = Date.now();
		stopAudio(bgSound);
		stopAudio(punchSound);
		stopAudio(yeahSound);
		stopAudio(sighSound);
    }else{
		INTERVAL.PAUSE = false;
		playAudio(bgSound,true);
    }
  }
  $("#game").on("pagebeforeshow",function(){
    try {
      GAME_STARTED = false;
      $("#map").empty();
      createMap();
      CURRENT_STAGE = getCurrentStage();
      showStageExplain();
      document.addEventListener("visibilitychange",visiabilityChangeListener,false);
      bgSound.addEventListener('ended', audioEnded, false);
      $("#stageStartBtn").off("click");
      $("#gameEndPopupRetryBtn").off("click");
      $("#gameEndPopupNextBtn").off("click");

      $("#stageStartBtn").on("click",function(){
        map.style.borderColor = "rgba(17,153,142,0.8)";
        timeBarInner.style.width = "100%";
        timeBarInner.style.display = "block";
        timeFeverBarInner.style.display = "none";
        gamePlayContent.style.display = "block";
        alertPopup.style.display = "none";
        alertPopupMessage.style.backgroundColor = "rgba(17,153,142,0.8)";
        alertPopup.style.top = "100vh";
        playAudio(bgSound);
        $("#stageExplain").hide();
		$("#textEffect").hide();
        bestText.textContent = "BEST "+getBestScore();
        showAlertPopup("Game Start","gameStart",true);
      });

      $("#gameEndPopupNextBtn").on("click",function(){
        if(CELAR_CHECK.isAlarmed){
  			CURRENT_STAGE++;
  			setCurrentStage(CURRENT_STAGE);
          $("#gameEndPopup").hide();
          showStageExplain();

        }
      });

      $("#gameEndPopupRetryBtn").on("click",function(){
          $("#gameEndPopup").hide();
           showStageExplain();
      });

    } catch (e) {
      alert(e.message);
    }

	});
  $("#game").on("pagebeforehide",function(){
      try {
        clearInterval(INTERVAL.checkTimeInterval);
        clearTimeout(buttonShowTimer);
        bgSound.removeEventListener('ended', audioEnded);
        for(var i = 0; i < CARD_ARR.length; i++){
          CARD_ARR[i].parentNode.removeEventListener("touchstart",cardClickListener);
          CARD_ARR[i].parentNode.removeEventListener("click",cardClickListener);
        }
        CARD_ARR = [];
        endGame();
        $("#stageStartBtn").off("click");
        $("#gameEndPopupRetryBtn").off("click");
        $("#gameEndPopupNextBtn").off("click");
        document.removeEventListener("visibilitychange",visiabilityChangeListener);
        $("#stageStartBtn").hide();
        $("#stageStartBtn").stop();
      } catch (e) {
          alert(e.message);
      }

	});

}());
