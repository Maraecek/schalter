var uugear = require('./uugear');

var device = uugear.UUGearDevice("UUGear-Arduino-1325-7161");

//todo callback und done zusammenfasse oder gleich in promise mit err umwandeln

var pin2 = false;
var pin2time = new Date().getTime();


function tor(mode)
{
	if (!mode){
		console.log("LED aus");
		device.setPinHigh(6);		
	} else {
		console.log("LED an");
		device.setPinLow(6);		
	}
}


function run(){

	var x = setInterval(function (){	
		//setzen auf high  erforderlich sonst willkürliche ergebnisse, in der read.js ist dies nicht nötig. warum weiß ich nicht
		device.setPinHigh(2,function(){
			device.getPinStatus(2, function (pinmode){
				if (pinmode == 0){
					if (pin2time+100 < new Date().getTime()){
						
						pin2 = !pin2;
						tor(pin2);
					}
					//verhindert wechsel bei gedrückthalten
					pin2time = new Date().getTime();
				}
			});		
		});		
	},20);


	setTimeout(function(){
		clearInterval(x);
		device.reset(function(done){
			console.log("reseting:");
			device.setPinModeAsOutput(12,function(done){
				device.setPinLow(12,function(done){
					console.log("setPinLow",12,done);
					device.close(function(done){
						console.log("close",done);
					});				
				});			
			});	
		});
	},30000)			
}

function setup(){

	device.setPinHigh(2);		
	device.setPinModeAsInput(2);
	device.setPinModeAsOutput(6);	
	device.setPinModeAsOutput(12);	
	run();
}


device.connect(function(err){
	if (err) console.log("connect error:",err);
	setup();
});

//s