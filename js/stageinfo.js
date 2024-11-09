let CURRENT_STAGE,
BACKUP_STAGE;

const STAGE_CLEAR_DATA = [{
	stage : 1,
	calearType : "point",
	clearVal : {
		point : 300,
		combo : ""
	},
	bonusTimeFriends : 1
},{
	stage : 2,
	calearType : "combo",
	clearVal : {
		point : 0,
		combo : "1,5"
	},
	bonusTimeFriends : 2
},{
	stage : 3,
	calearType : "point",
	clearVal : {
		point : 500,
		combo : ""
	},
	bonusTimeFriends : 3
},{
	stage : 4,
	calearType : "combo",
	clearVal : {
		point : 0,
		combo : "4,5,1"
	},
	bonusTimeFriends : 4
},{
	stage : 5,
	calearType : "both",
	clearVal : {
		point : 700,
		combo : "1,3"
	},
	bonusTimeFriends : 5
},{
	stage : 6,
	calearType : "both",
	clearVal : {
		point : 1000,
		combo : "2,5"
	},
	bonusTimeFriends : 6
},{
	stage : 7,
	calearType : "both",
	clearVal : {
		point : 1200,
		combo : "6,8,3"
	},
	bonusTimeFriends : 7
},{
	stage : 8,
	calearType : "both",
	clearVal : {
		point : 1500,
		combo : "1,2,3"
	},
	bonusTimeFriends : 8
}],

STAGE_COMBO_DATA = [
	{
		stage:1,
		feverPercent:20,
		comboFeverIndex : 0,
		comboArray : [{
			combo : [3,4],
			result : "FEVER!",
			type : "BONUS"
		},{
			combo : [5,6],
			result : "X",
			type : "X"
		}]
	},
	{
		stage:2,
		feverPercent:20,
		comboFeverIndex : 0,
		comboArray : [{
			combo : [3,6],
			result : "FEVER!",
			type : "BONUS"
		},{
			combo : [7,8],
			result : "X",
			type : "X"
		}]
	},
	{
		stage:3,
		feverPercent:20,
		comboFeverIndex : 1,
		comboArray : [{
			combo : [8,5],
			result : "시간 증가",
			type : "TIME"
		},{
			combo : [4,2],
			result : "FEVER!",
			type : "BONUS"
		},{
			combo : [3,1],
			result : "X",
			type : "X"
		}]
	},
	{
		stage:4,
		feverPercent:20,
		comboFeverIndex : 1,
		comboArray : [{
			combo : [6,1],
			result : "시간 증가",
			type : "TIME"
		},{
			combo : [7,3],
			result : "FEVER!",
			type : "BONUS"
		},{
			combo : [8,2],
			result : "X",
			type : "X"
		}]
	},
	{
		stage:5,
		feverPercent:20,
		comboFeverIndex : 1,
		comboArray : [{
			combo : [2,8],
			result : "시간 증가",
			type : "TIME"
		},{
			combo : [7,1],
			result : "FEVER!",
			type : "BONUS"
		},{
			combo : [4,6],
			result : "X",
			type : "X"
		}]
	},
	{
		stage:6,
		feverPercent:20,
		comboFeverIndex : 1,
		comboArray : [{
			combo : [5,2],
			result : "시간 증가",
			type : "TIME"
		},{
			combo : [7,3],
			result : "FEVER!",
			type : "BONUS"
		},{
			combo : [1,4],
			result : "X",
			type : "X"
		}]
	},
	{
		stage:7,
		feverPercent:20,
		comboFeverIndex : 1,
		comboArray : [{
			combo : [1,2],
			result : "시간 증가",
			type : "TIME"
		},{
			combo : [3,4],
			result : "FEVER!",
			type : "BONUS"
		},{
			combo : [5,6],
			result : "X",
			type : "X"
		}]
	},
	{
		stage:8,
		feverPercent:20,
		comboFeverIndex : 1,
		comboArray : [{
			combo : [4,8],
			result : "시간 증가",
			type : "TIME"
		},{
			combo : [7,5],
			result : "FEVER!",
			type : "BONUS"
		},{
			combo : [3,2],
			result : "X",
			type : "X"
		}]
	}
	];

function setBackupStage(index){
	BACKUP_STAGE = index;
	localStorage.setItem("BACKUP_STAGE",BACKUP_STAGE);
}
function getBackupStage(){
	BACKUP_STAGE = parseInt(localStorage.BACKUP_STAGE,10);
	if(!BACKUP_STAGE) {
		localStorage.setItem("BACKUP_STAGE","0");
		BACKUP_STAGE = 0;
	}
	console.log("BACKUP_STAGE : "+BACKUP_STAGE);
	return BACKUP_STAGE;
}
function setCurrentStage(index){
	CURRENT_STAGE = index;
	localStorage.setItem("CURRENT_STAGE",CURRENT_STAGE);
}
function getCurrentStage(){
	CURRENT_STAGE = parseInt(localStorage.CURRENT_STAGE,10);
	if(!CURRENT_STAGE) {
		localStorage.setItem("CURRENT_STAGE","1");
		CURRENT_STAGE = 1;
	}
	return CURRENT_STAGE;
}
