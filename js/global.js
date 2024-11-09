
window.onload = function(){
	$('[data-role="page"]').on("pagebeforeshow",function(){
	console.log("page beforeshow");
	checkScreen();
	});

	checkScreen();
	window.onresize = function(event) {
		checkScreen();
		if($(".ui-page-active").attr("id") === "stage"){
			$("#stage hr").attr("size",$(document).height());
		}
	};

	if (!window.requestAnimationFrame) {
		alert("no requestAnimationFrame");
		window.requestAnimationFrame = (function() {
			return 	window.webkitRequestAnimationFrame ||
				window.mozRequestAnimationFrame ||
				window.oRequestAnimationFrame ||
				window.msRequestAnimationFrame ||
				function(callback, element) {
					window.setTimeout(callback, 1000 / 60);
				};
			})(); }
};

function checkScreen(){
	var pageClass = document.getElementsByClassName("ui-page");
console.log("documetn size w/h - "+document.body.clientWidth+"/"+document.body.clientHeight);
 if(document.body.clientWidth > document.body.clientHeight){
	 for(var i=0; i<pageClass.length; i++){
		 pageClass[i].classList.add("width-bigger");
		 pageClass[i].classList.remove("height-bigger");
	 }
}else{
	for(var i=0; i<pageClass.length; i++){
		 pageClass[i].classList.add("height-bigger");
		  pageClass[i].classList.remove("width-bigger");
	 }
}
}
function getAllScore(){
	var resSum = 0;
	for(var i =1; i<=8; i++){
		var key = "STAGE"+i;
		var localVal = localStorage.getItem(key);
		if(localVal) resSum += parseInt(localVal,10);
	}
	return resSum;
}
function createComboElement(comboArrIntex,resElementId){
	var comboArr = STAGE_COMBO_DATA[comboArrIntex].comboArray;
	$("#"+resElementId).empty();
	var res = document.getElementById(resElementId);
	if(!res)return;
	for(var i=0; i<comboArr.length; i++){
		var comboElement = document.createElement("div"),
		left = document.createElement("div"),
		right = document.createElement("div"),
		span = document.createElement("span");
		span.classList.add("text-border");
		comboElement.classList.add("combo");
		left.classList.add("left");
		right.classList.add("right");
		right.appendChild(span);
		comboElement.appendChild(left);
		comboElement.appendChild(right);

		if(comboArr[i].type == "X")span.classList.add("red");

		span.textContent = comboArr[i].result;
		var combo = comboArr[i].combo;
		for(var j=0; j < combo.length; j++){
			var img = document.createElement("img");
			img.classList.add("character");
			img.src = "./images/"+combo[j]+".gif";
			left.appendChild(img);
			if(j < combo.length-1){
				var arrow = document.createElement("img");
				arrow.src = "./images/arrow.png";
				left.appendChild(arrow);
			}
		}
		res.appendChild(comboElement);
	}
}
