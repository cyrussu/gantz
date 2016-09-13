
function writeTime(){
	var date = new Date();
	//alert((date.toTimeString()).split(' ')[0]);
	O('gantz_clock').innerHTML = date.toTimeString()).split(' ')[0];
	delete date;
	setTimeout(writeTime,1000);
}

