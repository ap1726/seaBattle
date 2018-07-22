var lengthShip;
var count;
var arrCellsNumbers=[];
var nameGamer;
for(var i=0;i<100;i++) arrCellsNumbers[i]=i;//создаем массив для ходов компьютера
$('#reload').click(function(){//по клику создается поле боя
	emptyCellsToField('#leftField');//очищается левое поле
	emptyCellsToField('#rightField');//очищается правое поле
	//"шторы" для блокировки 
	//нажатия во время чужого хода
	$('#leftField').append('<div id="leftShade"></div>');
	$('#rightField').append('<div id="rightShade"></div>');
	for (lengthShip=4; lengthShip>=1; lengthShip--){
		for (count=(5-lengthShip); count>=1; count--){
			//получается массив координат частей корабля
			var position=randomizer(lengthShip,'#leftField');
			var position2=randomizer(lengthShip,'#rightField');
			//в цикле вызывается функция для размещения кораблей по частям
			for(var cells=0; cells<position.length; cells++){
				addShipPart(position[cells], '#leftField');
				addShipPart(position2[cells], '#rightField');
			}
		}
	}
	$('#leftFieldText p').text(nameGamer);
	//пустые ячейки заполняются "водой"
	colorToField('#leftField');
	colorToField('#rightField');
	whoseShot(1);
});
function addShipPart(numberCell, field){
	var arrAround=[numberCell-1,numberCell-10,numberCell+10,numberCell-1-10,numberCell-1+10,numberCell+1,numberCell+1-10,numberCell+1+10];
	var lengthArrAround;
	if(Math.floor(numberCell%10)<9)	lengthArrAround=arrAround.length;
	else lengthArrAround=arrAround.length-3;

	for(var i=0;i<lengthArrAround;i++){
		var cell=$(field+' #cell'+arrAround[i]);
		cell.hasClass('shipColor')?0:cell.removeClass('shipColor waterColor cellColor fireColor').addClass('waterColor');
	}
	$(field+' #cell'+numberCell).removeClass('shipColor waterColor cellColor fireColor').addClass('shipColor');
	$(field+' #cell'+numberCell).addClass('ship');
};
function randomizer(x, field){
	var out=[];
	var direction=randomInteger(0,1);
	out[0]=randomInteger(0,99);
	if (direction){
		if (out[0]%10>(10-x)){
			out[0]=Math.floor(out[0]/10)*10+(10-x);
		}
		for(i=1;i<x;i++){	
			out[i]=out[i-1]+1;
		}
	}
	else {
		if (out[0]>(x*10-1)){
			out[0]=(x*10-1)+Math.round(out[0]%10);
		}
		for(i=1;i<x;i++){	
			out[i]=out[i-1]+10;
		}
	}
	for (i=0;i<x;i++){
		if($(field+' #cell'+out[i]).hasClass('shipColor')||
			$(field+' #cell'+out[i]).hasClass('waterColor')) 
			return randomizer(x, field);
	}
	return out;
};
function getName(){
	nameGamer=$('input').val();
	$('#yourName').toggle();
	$('#info').html('<p><h3 id="blinkText">'+nameGamer+', для начала игры нажмите "Старт"</h3></p>');
}
function randomInteger(min, max) {
    var rand = min + Math.random() * (max + 1 - min);
    rand = Math.floor(rand);
    return rand;
};
function emptyCellsToField(field){
	$(field).empty();
	for (var i=0; i<100; i++){
		$(field).append('<span class="cell cellColor" id=cell'+i+'  oncontextmenu="blocker('+i+');return false" ></span>');
	}
};
function blocker(i){
	if($('#rightField #cell'+i).hasClass('flagColor')){
		$('#rightField #cell'+i).removeClass('flagColor');
		$('#rightField #cell'+i).removeClass('shipColor waterColor cellColor fireColor').addClass('waterColor');
	}
	else if($('#rightField #cell'+i).hasClass('waterColor')) {
		$('#rightField #cell'+i).addClass('flagColor');
	}
}
function shot(cell, x){
	if($(cell).hasClass('flagColor')){return false;}
	if(($(cell).hasClass('fireColor'))||
	($(cell).hasClass('cellColor'))||
	($(cell).hasClass('ship')) && ($(cell).parent('#rightField'))){
	}
	else{
		computerShot();
	}
		if (x){
			$(cell).removeClass('shipColor waterColor cellColor fireColor').addClass('fireColor');
			checkWinner('#rightField');
		}
		else{
			$(cell).removeClass('shipColor waterColor cellColor fireColor').addClass('cellColor');
		}
}
function computerShot(){
	whoseShot(0);
	var i=randomInteger(0,arrCellsNumbers.length-1);
	if(arguments[0]=='boom'){
		i=arguments[1];
		if(Math.floor(i/10)>9) i=arguments[1]-1;
	}
	arrCellsNumbers.splice(i,1);
	var cell='#leftField #cell'+arrCellsNumbers[i];
	if(randomInteger(0,5)>1 && $(cell).hasClass('waterColor')){
		console.log('fffff');
		for(var i=0; i<arrCellsNumbers.length; i++){
			if($('#cell'+arrCellsNumbers[i]).hasClass('.shipColor')) {
				cell='#cell'+arrCellsNumbers[i];
	arrCellsNumbers.splice(i,1);
		console.log(cell);

				break;
			}
		}
	}
	setTimeout(function(){
			if($(cell).hasClass('ship')){
				$(cell).removeClass('shipColor waterColor cellColor fireColor').addClass('fireColor');
				checkWinner('#leftField');
				computerShot('boom',i);
			}
			else {
				$(cell).removeClass('shipColor waterColor cellColor fireColor').addClass('cellColor');;
			}	
		$('#leftShade').toggle();
		$('#rightShade').toggle();
		whoseShot(1);
}, 400);
}
function whoseShot(x){
	if(x){
		$('#info').html("<p><h3>Ваш ход</h3></p>");
	}
	else{
		$('#info').html("<p><h3>Противник думает</h3></p>");
		$('#leftShade').toggle();
		$('#rightShade').toggle();
	}
}
function checkWinner(field){
	var winner;
	winner=0;
	for (var i=0; i<100; i++){
		if($(field+' #cell'+i).hasClass('fireColor')) winner++;
	}
		if (winner<20){
			console.log('winner not');
		}
		else {
			var name=(field=='#leftShade')?'Компьютер':nameGamer;
			$('#info').html('<p><h3 id="blinkText">Игрок '+name+' победил!<br>Нажмите "Старт" для новой игры</h3></p>');
			colorToField(' ',true);
			$('#leftShade').show();
			$('#rightShade').show();
		}
}
function colorToField(field){
	for (var i=0; i<100; i++){
		if(arguments[1]){
			if($('#rightField #cell'+i).hasClass('ship') && ($('#rightField #cell'+i).hasClass('waterColor')|| $('#rightField #cell'+i).hasClass('flagColor')))
				$('#rightField #cell'+i).removeClass('shipColor waterColor cellColor fireColor').addClass('shipColor');
			else if($('#rightField #cell'+i).hasClass('fireColor')){continue;}
			else if($('#rightField #cell'+i).hasClass('cellColor')){continue;}
			else{ 
				$('#rightField #cell'+i).removeClass('shipColor waterColor cellColor fireColor').addClass('waterColor');;
			}
		} else {
			if($(field+' #cell'+i).hasClass('cellColor')){
				$(field+' #cell'+i).removeClass('shipColor waterColor cellColor fireColor').addClass('waterColor'); 
			}
				if($('#rightField #cell'+i).hasClass('ship')){
					$('#rightField #cell'+i).removeClass('shipColor waterColor cellColor fireColor').addClass('waterColor');;
					$('#rightField #cell'+i).click(function(){
						shot(this,1);
					});
				}
				else {
					$(field+' #cell'+i).click(function(){
						shot(this,0);
					});
				}	
		}	
	}
};
var topText=['а','б','в','г','д','е','ж','з','и','к'];
var leftText=['1','2','3','4','5','6','7','8','9','10']
function addTextToPositioning(id){
	for(var i=0;i<10;i++){
		$('#'+id+'TextLeft').append('<span>'+leftText[i]+'</span>');
		$('#'+id+'Text').append('<span>'+topText[i]+'</span>');
	}
}
emptyCellsToField('#leftField');
emptyCellsToField('#rightField');
$('.cell').removeClass('cellColor');
addTextToPositioning('left');
addTextToPositioning('right');















