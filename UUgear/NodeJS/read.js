var net = require('net');
var pack = require( 'hipack' ).pack;

var DATA_TYPE_VOID 		= 0x01;
var DATA_TYPE_STRING 	= 0x02;
var DATA_TYPE_INTEGER 	= 0x03;
var DATA_TYPE_FLOAT 	= 0x04;


var functionMap = {
	'attachUUGearDevice' : { 'request' : 1, 	'return' : DATA_TYPE_INTEGER, 	'paramCount' : 1, 'paramType1' : DATA_TYPE_STRING },
	'detachUUGearDevice' : { 'request' : 2,	  	'return' : DATA_TYPE_VOID,		'paramCount' : 1, 'paramType1' : DATA_TYPE_STRING },
	'resetUUGearDevice'	 : { 'request' : 217, 	'return' : DATA_TYPE_VOID,		'paramCount' : 1, 'paramType1' : DATA_TYPE_STRING },	

	'setPinModeAsInput'	 : { 'request' : 10,	'return' : DATA_TYPE_VOID,		'paramCount' : 2, 'paramType1' : DATA_TYPE_STRING, 'paramType2' : DATA_TYPE_INTEGER },
	'setPinModeAsOutput' : { 'request' : 11,	'return' : DATA_TYPE_VOID,		'paramCount' : 2, 'paramType1' : DATA_TYPE_STRING, 'paramType2' : DATA_TYPE_INTEGER },
	'setPinLow'			 : { 'request' : 12,	'return' : DATA_TYPE_VOID,		'paramCount' : 2, 'paramType1' : DATA_TYPE_STRING, 'paramType2' : DATA_TYPE_INTEGER },	
	'setPinHigh'		 : { 'request' : 13,	'return' : DATA_TYPE_VOID,		'paramCount' : 2, 'paramType1' : DATA_TYPE_STRING, 'paramType2' : DATA_TYPE_INTEGER },
	'getPinStatus'		 : { 'request' : 14,	'return' : DATA_TYPE_INTEGER,	'paramCount' : 2, 'paramType1' : DATA_TYPE_STRING, 'paramType2' : DATA_TYPE_INTEGER },

	'analogWrite'		 : { 'request' : 15,	'return' : DATA_TYPE_VOID,		'paramCount' : 3, 'paramType1' : DATA_TYPE_STRING, 'paramType2' : DATA_TYPE_INTEGER, 'paramType3' : DATA_TYPE_INTEGER },
	'analogRead'		 : { 'request' : 16,	'return' : DATA_TYPE_INTEGER,	'paramCount' : 2, 'paramType1' : DATA_TYPE_STRING, 'paramType2' : DATA_TYPE_INTEGER },
	'analogReference'	 : { 'request' : 17,	'return' : DATA_TYPE_VOID,		'paramCount' : 2, 'paramType1' : DATA_TYPE_STRING, 'paramType2' : DATA_TYPE_INTEGER }
}

function UUGearRequest(myrequest)
{
	function sendRequest(req, respNeeded) {
	    var resp = '';
	    var timeout = 10*1000;
		var socketclient = net.connect({ path: "/tmp/uugear_socket_broker.sock"}, function() {
		  		//console.log('client connected');
		  		socketclient.write(req,function(){
		  			//console.log('client data written');
		  		});
		  	});
	    socketclient.setTimeout(timeout, function(){
	    	console.log('socket timeout');
	    	socketclient.end();
	    });
	    socketclient.on("error",function(err){
	    	console.log('socket error',err);    	
	    })
		socketclient.on('end', function() {
		  //console.log('client disconnected');
		});    
		socketclient.on('data', function(data) {
	    	//console.log('socket data',data);    	
			socketclient.end();
			if (typeof respNeeded == "function") {
		    	//console.log('socket data callback');    	
			    respNeeded(data.toString());
			}
		});
	}

	if (myrequest.func){

		var $function = functionMap[myrequest.func];

		if ($function) {
			
			var $request = pack('CC', $function['request'], $function['return']).toString();
			var $missParam = false;

			for (var i = 1; i <= $function['paramCount']; i++) {
				
				if (!myrequest['paramValue'+i]) {
					console.log("parameter",i,"missing");
					$missParam =  true;
					break;
				}

				switch ($function['paramType'+i]){
					case DATA_TYPE_STRING:
						$request += pack('CC', DATA_TYPE_STRING, myrequest['paramValue'+i].length) + myrequest['paramValue'+i];
						break;
					case DATA_TYPE_INTEGER:
						var $integerData = myrequest['paramValue'+i];
						$request += pack('CC', DATA_TYPE_INTEGER, $integerData.toString().length) + $integerData;
						break;
					case DATA_TYPE_FLOAT:
						var $floatData = myrequest['paramValue'+i];
						$request += pack('CC', DATA_TYPE_FLOAT, $floatData.toString().length) + $floatData;
						break;
				}
			};
			if (!$missParam) {
				sendRequest($request, myrequest.callback);
			}			
		}
	} else console.log("request maleformed");	
}



//attach
UUGearRequest({
	func : "attachUUGearDevice",
	paramValue1 : "UUGear-Arduino-1325-7161",
	callback: function(data) {
		console.log("attachUUGearDevice result:",data); 
	}
});


/*
  arduino.pinMode(2, ArduinoFirmata.INPUT);
  arduino.pinMode(3, ArduinoFirmata.INPUT);
  arduino.pinMode(5, ArduinoFirmata.INPUT);
*/
UUGearRequest({
	func : "setPinModeAsInput",
	paramValue1 : "UUGear-Arduino-1325-7161",
	paramValue2 : 2
});
UUGearRequest({
	func : "setPinModeAsInput",
	paramValue1 : "UUGear-Arduino-1325-7161",
	paramValue2 : 3
});
UUGearRequest({
	func : "setPinModeAsInput",
	paramValue1 : "UUGear-Arduino-1325-7161",
	paramValue2 : 5
});

/*
  arduino.pinMode(6, ArduinoFirmata.OUTPUT);
  arduino.pinMode(7, ArduinoFirmata.OUTPUT);
  arduino.pinMode(8, ArduinoFirmata.OUTPUT);
*/
UUGearRequest({
	func : "setPinModeAsOutput",
	paramValue1 : "UUGear-Arduino-1325-7161",
	paramValue2 : 6
});
UUGearRequest({
	func : "setPinModeAsOutput",
	paramValue1 : "UUGear-Arduino-1325-7161",
	paramValue2 : 7
});
UUGearRequest({
	func : "setPinModeAsOutput",
	paramValue1 : "UUGear-Arduino-1325-7161",
	paramValue2 : 8
});

/*
  arduino.digitalWrite(2, true);
  arduino.digitalWrite(3, true);
  arduino.digitalWrite(5, true);

  arduino.digitalWrite(6, true);
  arduino.digitalWrite(7, true);
  arduino.digitalWrite(8, true);
*/
UUGearRequest({
	func : "setPinHigh",
	paramValue1 : "UUGear-Arduino-1325-7161",
	paramValue2 : 2
});
UUGearRequest({
	func : "setPinHigh",
	paramValue1 : "UUGear-Arduino-1325-7161",
	paramValue2 : 3
});
UUGearRequest({
	func : "setPinHigh",
	paramValue1 : "UUGear-Arduino-1325-7161",
	paramValue2 : 5
});	

UUGearRequest({
	func : "setPinHigh",
	paramValue1 : "UUGear-Arduino-1325-7161",
	paramValue2 : 6
});
UUGearRequest({
	func : "setPinHigh",
	paramValue1 : "UUGear-Arduino-1325-7161",
	paramValue2 : 7
});
UUGearRequest({
	func : "setPinHigh",
	paramValue1 : "UUGear-Arduino-1325-7161",
	paramValue2 : 8
});	


var pin2 = false;
var pin2time = new Date().getTime();


function tor(mode)
{
	if (pin2time+200 < new Date().getTime()){
		//nur ändern wenn lang enug her
		pin2time = new Date().getTime();	
			
		if (mode){
			console.log("Tor aus");
			UUGearRequest({
				func : "setPinHigh",
				paramValue1 : "UUGear-Arduino-1325-7161",
				paramValue2 : 6
			});	
		} else {
			console.log("Tor an");
			UUGearRequest({
				func : "setPinLow",
				paramValue1 : "UUGear-Arduino-1325-7161",
				paramValue2 : 6
			});	
			
		}
	}
}

setInterval(function()
{
	UUGearRequest({
		func : "getPinStatus",
		paramValue1 : "UUGear-Arduino-1325-7161",
		paramValue2 : 2,
		callback : function(pinmode){
			//console.log("pinmode",pinmode);
			if (pinmode == 0){
				pin2 = !pin2;
				//console.log("pin2",pin2);
				tor(pin2);
			}
		}
	});


	// UUGearRequest({
	// 	func : "getPinStatus",
	// 	paramValue1 : "UUGear-Arduino-1325-7161",
	// 	paramValue2 : 3,
	// 	callback : function(pinmode){
	// 		console.log("Pin3:",pinmode);
	// 	}
	// });	
	// UUGearRequest({
	// 	func : "getPinStatus",
	// 	paramValue1 : "UUGear-Arduino-1325-7161",
	// 	paramValue2 : 5,
	// 	callback : function(pinmode){
	// 		console.log("Pin5:",pinmode);
	// 	}
	// });	

},50);