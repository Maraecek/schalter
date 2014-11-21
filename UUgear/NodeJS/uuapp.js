var uugear = require('./uugear');

var device = uugear.UUGearDevice("UUGear-Arduino-1325-7161");


//todo callback und done zusammenfasse oder gleich in promise mit err umwandeln



function setup(device){

	device.setPinModeAsInput(2,function(done){
		device.setPinHigh(2,function(done){
			console.log("done",2,done);

			device.setPinModeAsOutput(12,function(done){
				device.setPinHigh(12,function(done){
					console.log("setPinHigh",12,done);
					run(device);				

				});			
			});	

		});
	});

}

function run(device){

	var x = setInterval(function(){
		device.setPinModeAsOutput(6,function(done){
			device.setPinHigh(6,function(done){
				console.log("setPinHigh",6,done);				
			});			
		});
		setTimeout(function(){
			device.setPinModeAsOutput(6,function(done){
				device.setPinLow(6,function(done){
					console.log("setPinLow",6,done);				
				});			
			});
		},1000);

	},2000);

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
	},10000)			
}

device.connect(function(err){
	console.log("connect error:",err);
	setup(device);
});

//s