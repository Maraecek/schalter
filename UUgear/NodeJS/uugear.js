var net = require('net');
var pack = require('hipack').pack;
//var Promise = require('promise');

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
	'getPinStatus'		 : { 'request' : 14,	'return' : DATA_TYPE_INTEGER,	'paramCount' : 2, 'paramType1' : DATA_TYPE_STRING, 'paramType2' : DATA_TYPE_INTEGER }
	// 'analogWrite'		 : { 'request' : 15,	'return' : DATA_TYPE_VOID,		'paramCount' : 3, 'paramType1' : DATA_TYPE_STRING, 'paramType2' : DATA_TYPE_INTEGER, 'paramType3' : DATA_TYPE_INTEGER },
	// 'analogRead'		 : { 'request' : 16,	'return' : DATA_TYPE_INTEGER,	'paramCount' : 2, 'paramType1' : DATA_TYPE_STRING, 'paramType2' : DATA_TYPE_INTEGER },
	// 'analogReference'	 : { 'request' : 17,	'return' : DATA_TYPE_VOID,		'paramCount' : 2, 'paramType1' : DATA_TYPE_STRING, 'paramType2' : DATA_TYPE_INTEGER }
}

function UUGearRequest(myrequest)
{
	function sendRequest(req, respNeeded, done) {
	    var resp = '';
	    var timeout = 10*1000;
	    var done = done || function(){};
	    var donesent = false;

		var socketclient = net.connect({ path: "/tmp/uugear_socket_broker.sock"}, function() {
		  		//console.log('client connected');
		  		socketclient.write(req,function(){
		  			//console.log('client data written');
		  			if(!donesent){
		  				done({err:false, msg:"write"});
		  				donesent=true;
		  			}
		  		});
		  	});

		    socketclient.setTimeout(timeout, function(){
		    	//console.log('socket timeout');
		    	socketclient.end();
	  			if(!donesent){
	  				done({err:true, msg:"timeout"});
	  				donesent=true;
	  			}
		    });
		    socketclient.on("error",function(err){
		    	//console.log('socket error',err);    	
	  			if(!donesent){
	  				done({err:true, msg:"socket error"});
	  				donesent=true;
	  			}
		    })
			socketclient.on('end', function() {
			  	//console.log('client disconnected');
	  			if(!donesent){
	  				done({err:false, msg:"end"});
	  				donesent=true;
	  			}			  
			});    

			socketclient.on('data', function(data) {
		    	//console.log('socket data',data.toString());    	
				//socketclient.end();
				if (typeof respNeeded == "function") {
			    	//console.log('socket data callback');    	
				    respNeeded(data.toString());
				}
	  			if(!donesent){
	  				done({err:false, msg:"data"});
	  				donesent=true;
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
				sendRequest($request, myrequest.callback, myrequest.done);
			}			
		}
	} else console.log("request maleformed");	
}


function UUGearDevice(_deviceID){
	//setup dependend services: killall UUGearDaemon; ./UUGearDaemon; ./SocketBroker
	var deviceID = _deviceID;
	var connected = false;

	return {

		//seems useless TODO killall UUGearDaemon; ./UUGearDaemon; ./SocketBroker
		reset : function(done){
			UUGearRequest({
				func : "resetUUGearDevice",
				paramValue1 : deviceID,
				done: done
			});	
		},

		getPinStatus : function(pin, callback, done){
			UUGearRequest({
				func : "getPinStatus",
				paramValue1 : deviceID,
				paramValue2 : pin,
				callback: callback,				
				done: done
			});		
		},

		setPinLow : function(pin, done){
			UUGearRequest({
				func : "setPinLow",
				paramValue1 : deviceID,
				paramValue2 : pin,
				done: done
			});		
		},

		setPinHigh : function(pin, done){
			UUGearRequest({
				func : "setPinHigh",
				paramValue1 : deviceID,
				paramValue2 : pin,
				done: done
			});		
		},

		setPinModeAsOutput : function(pin, done){
			UUGearRequest({
				func : "setPinModeAsOutput",
				paramValue1 : deviceID,
				paramValue2 : pin,
				done: done
			});		
		},

		setPinModeAsInput : function(pin, done){
			UUGearRequest({
				func : "setPinModeAsInput",
				paramValue1 : deviceID,
				paramValue2 : pin,
				done: done
			});		
		},

		connect: function(callback, done){
			UUGearRequest({
				func : "attachUUGearDevice",
				paramValue1 : deviceID,
				callback: function(data) {
					connected = (data=="2" || data=="1");
					console.log("attachUUGearDevice result:",connected);
					//parameter = err
					callback(!connected);
				},
				done: done
			});			
		},

		close : function(done){
			UUGearRequest({
				func : "detachUUGearDevice",
				paramValue1 : deviceID,
				done: done
			});			
		}
	}

}

module.exports.UUGearDevice = UUGearDevice;